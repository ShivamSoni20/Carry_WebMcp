import { z } from "zod";
import { TABLE_SUPPORTED_PREFERENCES } from "../table/preferences";
import type { TablePreferenceStore } from "../table/store";

const emptyInput = z.object({}).strict();
const dietaryInput = z.object({ mode: z.enum(["all", "vegetarian"]) }).strict();
const peanutInput = z.object({ mode: z.enum(["standard", "highlight"]) }).strict();
const marketingInput = z.object({ enabled: z.boolean() }).strict();
const historyInput = z.object({ retention: z.enum(["remember", "none"]) }).strict();
const schema = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });
const encode = (value: unknown) => JSON.stringify(value);

export const createTableTools = (store: TablePreferenceStore): WebMCPTool[] => [
  {
    name: "get_supported_preferences", title: "Get supported Table preferences",
    description: "List only the food-presentation and session preferences supported by Table.",
    inputSchema: schema({}), annotations: { readOnlyHint: true },
    execute: async (input) => { emptyInput.parse(input); return encode({ supported: TABLE_SUPPORTED_PREFERENCES }); },
  },
  {
    name: "get_current_preferences", title: "Get current Table preferences",
    description: "Read only Table's current dietary, peanut-warning, marketing, and history settings.",
    inputSchema: schema({}), annotations: { readOnlyHint: true },
    execute: async (input) => { emptyInput.parse(input); const state = store.getSnapshot(); return encode({ dietaryMode: state.dietaryMode, peanutWarning: state.peanutWarning, marketing: state.marketing ? "enabled" : "disabled", historyRetention: state.historyRetention }); },
  },
  {
    name: "set_dietary_mode", title: "Set dietary menu mode",
    description: "Show all Table dishes or only dishes deterministically marked vegetarian.",
    inputSchema: schema({ mode: { type: "string", enum: ["all", "vegetarian"] } }, ["mode"]),
    execute: async (input) => encode(store.setDietaryMode(dietaryInput.parse(input).mode)),
  },
  {
    name: "set_peanut_warning", title: "Set peanut warning display",
    description: "Use standard labels or highlight known peanut information. Unknown ingredient data remains unknown.",
    inputSchema: schema({ mode: { type: "string", enum: ["standard", "highlight"] } }, ["mode"]),
    execute: async (input) => encode(store.setPeanutWarning(peanutInput.parse(input).mode)),
  },
  {
    name: "set_marketing", title: "Set Table marketing preference",
    description: "Enable or disable simulated promotional suggestions on Table.",
    inputSchema: schema({ enabled: { type: "boolean" } }, ["enabled"]),
    execute: async (input) => encode(store.setMarketing(marketingInput.parse(input).enabled)),
  },
  {
    name: "set_history_retention", title: "Set Table search history retention",
    description: "Remember demo food searches for this session or clear and stop retaining them.",
    inputSchema: schema({ retention: { type: "string", enum: ["remember", "none"] } }, ["retention"]),
    execute: async (input) => encode(store.setHistoryRetention(historyInput.parse(input).retention)),
  },
];

export async function registerTableTools(doc: Document, store: TablePreferenceStore, signal: AbortSignal) {
  const context = doc.modelContext;
  if (!context || typeof context.registerTool !== "function") return { supported: false as const, registered: 0 };
  const results = await Promise.allSettled(createTableTools(store).map((tool) => context.registerTool(tool, { signal })));
  const errors = results.filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => result.reason instanceof Error ? result.reason : new Error(String(result.reason)));
  return { supported: true as const, registered: results.length - errors.length, errors };
}

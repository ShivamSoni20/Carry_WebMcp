import { z } from "zod";
import { SUPPORTED_PREFERENCES } from "../luma/preferences";
import type { LumaPreferenceStore } from "../luma/store";

const emptyInput = z.object({}).strict();
const motionInput = z.object({ mode: z.enum(["full", "reduced"]) }).strict();
const autoplayInput = z.object({ enabled: z.boolean() }).strict();
const densityInput = z.object({ density: z.enum(["compact", "comfortable"]) }).strict();
const targetInput = z.object({ size: z.enum(["standard", "large"]) }).strict();

const objectSchema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});

const encode = (value: unknown) => JSON.stringify(value);

export const createLumaTools = (store: LumaPreferenceStore): WebMCPTool[] => [
  {
    name: "get_supported_preferences",
    title: "Get supported Luma preferences",
    description: "List only the reading preferences supported by the current Luma page.",
    inputSchema: objectSchema({}),
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      emptyInput.parse(input);
      return encode({ supported: SUPPORTED_PREFERENCES });
    },
  },
  {
    name: "get_current_preferences",
    title: "Get current Luma preferences",
    description: "Read the preference values currently visible in Luma.",
    inputSchema: objectSchema({}),
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      emptyInput.parse(input);
      const state = store.getSnapshot();
      return encode({
        preferences: {
          motion_mode: state.motionMode,
          autoplay: state.autoplay ? "on" : "off",
          reading_density: state.readingDensity,
          target_size: state.targetSize,
        },
      });
    },
  },
  {
    name: "set_motion_mode",
    title: "Set motion mode",
    description: "Set Luma's non-essential interface motion to full or reduced.",
    inputSchema: objectSchema({ mode: { type: "string", enum: ["full", "reduced"] } }, ["mode"]),
    execute: async (input) => encode(store.setMotionMode(motionInput.parse(input).mode)),
  },
  {
    name: "set_autoplay",
    title: "Set media autoplay",
    description: "Enable or disable automatic playback for Luma media.",
    inputSchema: objectSchema({ enabled: { type: "boolean" } }, ["enabled"]),
    execute: async (input) => encode(store.setAutoplay(autoplayInput.parse(input).enabled)),
  },
  {
    name: "set_reading_density",
    title: "Set reading density",
    description: "Set Luma's reading layout to compact or comfortable.",
    inputSchema: objectSchema({ density: { type: "string", enum: ["compact", "comfortable"] } }, ["density"]),
    execute: async (input) => encode(store.setReadingDensity(densityInput.parse(input).density)),
  },
  {
    name: "set_target_size",
    title: "Set interaction target size",
    description: "Set Luma's buttons and controls to standard or large targets.",
    inputSchema: objectSchema({ size: { type: "string", enum: ["standard", "large"] } }, ["size"]),
    execute: async (input) => encode(store.setTargetSize(targetInput.parse(input).size)),
  },
];

export type RegistrationResult =
  | { supported: false; registered: 0 }
  | { supported: true; registered: number; errors: Error[] };

export async function registerLumaTools(
  doc: Document,
  store: LumaPreferenceStore,
  signal: AbortSignal,
): Promise<RegistrationResult> {
  const context = doc.modelContext;
  if (!context || typeof context.registerTool !== "function") {
    return { supported: false, registered: 0 };
  }

  const results = await Promise.allSettled(
    createLumaTools(store).map((tool) => context.registerTool(tool, { signal })),
  );
  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => result.reason instanceof Error ? result.reason : new Error(String(result.reason)));

  return { supported: true, registered: results.length - errors.length, errors };
}

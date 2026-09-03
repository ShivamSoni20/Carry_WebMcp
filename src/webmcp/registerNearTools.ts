import { z } from "zod";
import { NEAR_SUPPORTED_PREFERENCES, SEEDED_CITIES } from "../near/preferences";
import type { NearPreferenceStore } from "../near/store";

const emptyInput = z.object({}).strict();
const locationInput = z.object({ precision: z.enum(["precise", "city", "manual"]) }).strict();
const cityInput = z.object({ city: z.enum(SEEDED_CITIES) }).strict();
const priceInput = z.object({ display: z.enum(["base", "all_in"]) }).strict();
const marketingInput = z.object({ enabled: z.boolean() }).strict();
const historyInput = z.object({ retention: z.enum(["remember", "none"]) }).strict();
const schema = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });
const encode = (value: unknown) => JSON.stringify(value);

export const createNearBaseTools = (store: NearPreferenceStore): WebMCPTool[] => [
  {
    name: "get_supported_preferences", title: "Get supported Near preferences",
    description: "List only the preference capabilities supported by Near events discovery.",
    inputSchema: schema({}), annotations: { readOnlyHint: true },
    execute: async (input) => { emptyInput.parse(input); return encode({ supported: NEAR_SUPPORTED_PREFERENCES }); },
  },
  {
    name: "get_current_preferences", title: "Get current Near preferences",
    description: "Read only the current Near-specific location, pricing, marketing, and history state.",
    inputSchema: schema({}), annotations: { readOnlyHint: true },
    execute: async (input) => { emptyInput.parse(input); const state = store.getSnapshot(); return encode({ locationPrecision: state.locationPrecision, city: state.city, priceDisplay: state.priceDisplay, marketing: state.marketing ? "enabled" : "disabled", historyRetention: state.historyRetention }); },
  },
  {
    name: "set_location_precision", title: "Set location precision",
    description: "Set Near's simulated location precision. City or manual mode may require a separate city choice.",
    inputSchema: schema({ precision: { type: "string", enum: ["precise", "city", "manual"] } }, ["precision"]),
    execute: async (input) => encode(store.setLocationPrecision(locationInput.parse(input).precision)),
  },
  {
    name: "set_price_display", title: "Set ticket price display",
    description: "Show event ticket prices as base prices plus fees or deterministic all-in totals.",
    inputSchema: schema({ display: { type: "string", enum: ["base", "all_in"] } }, ["display"]),
    execute: async (input) => encode(store.setPriceDisplay(priceInput.parse(input).display)),
  },
  {
    name: "set_marketing", title: "Set marketing preference",
    description: "Enable or disable simulated promotional recommendations on Near.",
    inputSchema: schema({ enabled: { type: "boolean" } }, ["enabled"]),
    execute: async (input) => encode(store.setMarketing(marketingInput.parse(input).enabled)),
  },
  {
    name: "set_history_retention", title: "Set search history retention",
    description: "Remember demo searches for this session or clear and stop retaining them.",
    inputSchema: schema({ retention: { type: "string", enum: ["remember", "none"] } }, ["retention"]),
    execute: async (input) => encode(store.setHistoryRetention(historyInput.parse(input).retention)),
  },
];

export const createSetCityTool = (store: NearPreferenceStore): WebMCPTool => ({
  name: "set_city", title: "Set Near city",
  description: "Set a supported simulated city after city-level or manual location has been selected.",
  inputSchema: schema({ city: { type: "string", enum: SEEDED_CITIES } }, ["city"]),
  execute: async (input) => encode(store.setCity(cityInput.parse(input).city)),
});

export async function registerNearBaseTools(doc: Document, store: NearPreferenceStore, signal: AbortSignal) {
  const context = doc.modelContext;
  if (!context || typeof context.registerTool !== "function") return { supported: false as const, registered: 0 };
  const results = await Promise.allSettled(createNearBaseTools(store).map((tool) => context.registerTool(tool, { signal })));
  const errors = results.filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => result.reason instanceof Error ? result.reason : new Error(String(result.reason)));
  return { supported: true as const, registered: results.length - errors.length, errors };
}

export async function registerNearCityTool(doc: Document, store: NearPreferenceStore, signal: AbortSignal) {
  const context = doc.modelContext;
  if (!context || typeof context.registerTool !== "function") return false;
  await context.registerTool(createSetCityTool(store), { signal });
  return true;
}

import { z } from "zod";
import { PORTABLE_PREFERENCES } from "../carry/portablePreferences";

const emptyInput = z.object({}).strict();

export const createCarryTool = (): WebMCPTool => ({
  name: "get_portable_preferences",
  title: "Get portable CARRY preferences",
  description: "Read the fictional user's portable preference intents. Apply only preferences relevant to each destination site's advertised capabilities.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  execute: async (input) => {
    emptyInput.parse(input);
    return JSON.stringify(PORTABLE_PREFERENCES);
  },
});

export async function registerCarryTool(doc: Document, signal: AbortSignal) {
  const context = doc.modelContext;
  if (!context || typeof context.registerTool !== "function") {
    return { supported: false as const, registered: 0 };
  }

  try {
    await context.registerTool(createCarryTool(), { signal });
    return { supported: true as const, registered: 1, errors: [] as Error[] };
  } catch (error) {
    return {
      supported: true as const,
      registered: 0,
      errors: [error instanceof Error ? error : new Error(String(error))],
    };
  }
}


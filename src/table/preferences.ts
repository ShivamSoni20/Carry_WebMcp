import { z } from "zod";

export const dietaryModeSchema = z.enum(["all", "vegetarian"]);
export const peanutWarningSchema = z.enum(["standard", "highlight"]);
export const historyRetentionSchema = z.enum(["remember", "none"]);

export type DietaryMode = z.infer<typeof dietaryModeSchema>;
export type PeanutWarning = z.infer<typeof peanutWarningSchema>;
export type TableHistoryRetention = z.infer<typeof historyRetentionSchema>;

export type TablePreferences = {
  dietaryMode: DietaryMode;
  peanutWarning: PeanutWarning;
  marketing: boolean;
  historyRetention: TableHistoryRetention;
  recentSearches: string[];
};

export const DEFAULT_TABLE_PREFERENCES: TablePreferences = {
  dietaryMode: "all",
  peanutWarning: "standard",
  marketing: true,
  historyRetention: "remember",
  recentSearches: ["Dinner under ₹800", "Quick vegetarian lunch"],
};

export const TABLE_SUPPORTED_PREFERENCES = [
  { key: "dietary_mode", values: ["all", "vegetarian"], description: "Controls whether the menu shows all dishes or vegetarian dishes only." },
  { key: "peanut_warning", values: ["standard", "highlight"], description: "Controls how known peanut information is emphasized." },
  { key: "marketing", values: ["enabled", "disabled"], description: "Controls simulated promotional suggestions on Table." },
  { key: "history_retention", values: ["remember", "none"], description: "Controls whether demo searches remain in this session." },
] as const;

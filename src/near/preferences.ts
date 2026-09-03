import { z } from "zod";

export const locationPrecisionSchema = z.enum(["precise", "city", "manual"]);
export const priceDisplaySchema = z.enum(["base", "all_in"]);
export const historyRetentionSchema = z.enum(["remember", "none"]);
export const citySchema = z.enum(["Sagar", "Indore", "Bhopal"]);

export type LocationPrecision = z.infer<typeof locationPrecisionSchema>;
export type PriceDisplay = z.infer<typeof priceDisplaySchema>;
export type HistoryRetention = z.infer<typeof historyRetentionSchema>;
export type NearCity = z.infer<typeof citySchema>;

export type NearPreferences = {
  locationPrecision: LocationPrecision;
  city: NearCity | null;
  priceDisplay: PriceDisplay;
  marketing: boolean;
  historyRetention: HistoryRetention;
  recentSearches: string[];
};

export const DEFAULT_NEAR_PREFERENCES: NearPreferences = {
  locationPrecision: "precise",
  city: null,
  priceDisplay: "base",
  marketing: true,
  historyRetention: "remember",
  recentSearches: ["Design workshops", "Live music this weekend"],
};

export const NEAR_SUPPORTED_PREFERENCES = [
  { key: "location_precision", values: ["precise", "city", "manual"], description: "Controls how specifically Near uses simulated location." },
  { key: "price_display", values: ["base", "all_in"], description: "Controls whether booking fees are included in displayed prices." },
  { key: "marketing", values: ["enabled", "disabled"], description: "Controls promotional recommendations on this page." },
  { key: "history_retention", values: ["remember", "none"], description: "Controls whether demo searches remain in this session." },
] as const;

export const SEEDED_CITIES = citySchema.options;

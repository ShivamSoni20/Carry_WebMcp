import { z } from "zod";

export const motionModeSchema = z.enum(["full", "reduced"]);
export const autoplaySchema = z.boolean();
export const readingDensitySchema = z.enum(["compact", "comfortable"]);
export const targetSizeSchema = z.enum(["standard", "large"]);

export const lumaPreferencesSchema = z.object({
  motionMode: motionModeSchema,
  autoplay: autoplaySchema,
  readingDensity: readingDensitySchema,
  targetSize: targetSizeSchema,
}).strict();

export type LumaPreferences = z.infer<typeof lumaPreferencesSchema>;
export type MotionMode = z.infer<typeof motionModeSchema>;
export type ReadingDensity = z.infer<typeof readingDensitySchema>;
export type TargetSize = z.infer<typeof targetSizeSchema>;

export const DEFAULT_PREFERENCES: LumaPreferences = {
  motionMode: "full",
  autoplay: true,
  readingDensity: "comfortable",
  targetSize: "standard",
};

export const SUPPORTED_PREFERENCES = [
  { key: "motion_mode", values: ["full", "reduced"], description: "Controls non-essential interface animation." },
  { key: "autoplay", values: ["on", "off"], description: "Controls automatic media playback." },
  { key: "reading_density", values: ["compact", "comfortable"], description: "Controls spacing and article measure." },
  { key: "target_size", values: ["standard", "large"], description: "Controls the size of interactive controls." },
] as const;

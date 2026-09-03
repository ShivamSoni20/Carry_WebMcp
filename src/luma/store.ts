import {
  autoplaySchema,
  DEFAULT_PREFERENCES,
  type LumaPreferences,
  motionModeSchema,
  readingDensitySchema,
  targetSizeSchema,
} from "./preferences";

type Listener = () => void;
export type PreferenceKey = "motion_mode" | "autoplay" | "reading_density" | "target_size";

export class LumaPreferenceStore {
  private state: LumaPreferences;
  private listeners = new Set<Listener>();

  constructor(initial: LumaPreferences = DEFAULT_PREFERENCES) {
    this.state = { ...initial };
  }

  getSnapshot = (): LumaPreferences => this.state;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update<K extends keyof LumaPreferences>(key: K, value: LumaPreferences[K]) {
    if (Object.is(this.state[key], value)) return false;
    this.state = { ...this.state, [key]: value };
    this.listeners.forEach((listener) => listener());
    return true;
  }

  setMotionMode(value: unknown) {
    const mode = motionModeSchema.parse(value);
    return this.result("motion_mode", mode, this.update("motionMode", mode));
  }

  setAutoplay(value: unknown) {
    const enabled = autoplaySchema.parse(value);
    return this.result("autoplay", enabled ? "on" : "off", this.update("autoplay", enabled));
  }

  setReadingDensity(value: unknown) {
    const density = readingDensitySchema.parse(value);
    return this.result("reading_density", density, this.update("readingDensity", density));
  }

  setTargetSize(value: unknown) {
    const size = targetSizeSchema.parse(value);
    return this.result("target_size", size, this.update("targetSize", size));
  }

  private result(preference: PreferenceKey, value: string, updated: boolean) {
    return { ok: true as const, updated, preference, value };
  }
}

export const lumaPreferenceStore = new LumaPreferenceStore();

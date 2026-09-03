import { z } from "zod";
import {
  citySchema,
  DEFAULT_NEAR_PREFERENCES,
  historyRetentionSchema,
  locationPrecisionSchema,
  type NearPreferences,
  priceDisplaySchema,
} from "./preferences";

type Listener = () => void;

export class NearPreferenceStore {
  private state: NearPreferences;
  private listeners = new Set<Listener>();

  constructor(initial: NearPreferences = DEFAULT_NEAR_PREFERENCES) {
    this.state = { ...initial, recentSearches: [...initial.recentSearches] };
  }

  getSnapshot = (): NearPreferences => this.state;
  subscribe = (listener: Listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };

  private replace(next: NearPreferences) {
    this.state = next;
    this.listeners.forEach((listener) => listener());
  }

  setLocationPrecision(value: unknown) {
    const precision = locationPrecisionSchema.parse(value);
    const city = precision === "precise" ? null : this.state.city;
    const updated = precision !== this.state.locationPrecision || city !== this.state.city;
    if (updated) this.replace({ ...this.state, locationPrecision: precision, city });
    if (precision !== "precise" && city === null) {
      return { ok: false as const, code: "CITY_REQUIRED", preference: "location_precision", value: precision, requiresUserInput: true, message: "A city is required for city-level location.", retryable: false };
    }
    return { ok: true as const, updated, preference: "location_precision", value: precision };
  }

  setCity(value: unknown) {
    const city = citySchema.parse(value);
    if (this.state.locationPrecision === "precise") {
      return { ok: false as const, code: "NOT_AVAILABLE_IN_STATE", message: "Choose city-level or manual location before setting a city.", retryable: false };
    }
    const updated = city !== this.state.city;
    if (updated) this.replace({ ...this.state, city });
    return { ok: true as const, updated, preference: "city", value: city };
  }

  setPriceDisplay(value: unknown) {
    const display = priceDisplaySchema.parse(value);
    const updated = display !== this.state.priceDisplay;
    if (updated) this.replace({ ...this.state, priceDisplay: display });
    return { ok: true as const, updated, preference: "price_display", value: display };
  }

  setMarketing(value: unknown) {
    const enabled = z.boolean().parse(value);
    const updated = enabled !== this.state.marketing;
    if (updated) this.replace({ ...this.state, marketing: enabled });
    return { ok: true as const, updated, preference: "marketing", value: enabled ? "enabled" : "disabled" };
  }

  setHistoryRetention(value: unknown) {
    const retention = historyRetentionSchema.parse(value);
    const searches = retention === "none" ? [] : this.state.recentSearches;
    const updated = retention !== this.state.historyRetention || searches.length !== this.state.recentSearches.length;
    if (updated) this.replace({ ...this.state, historyRetention: retention, recentSearches: searches });
    return { ok: true as const, updated, preference: "history_retention", value: retention };
  }
}

export const nearPreferenceStore = new NearPreferenceStore();

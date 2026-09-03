import { z } from "zod";
import { TABLE_MENU_COUNTS } from "./menu";
import { DEFAULT_TABLE_PREFERENCES, dietaryModeSchema, historyRetentionSchema, peanutWarningSchema, type TablePreferences } from "./preferences";

type Listener = () => void;

export class TablePreferenceStore {
  private state: TablePreferences;
  private listeners = new Set<Listener>();

  constructor(initial: TablePreferences = DEFAULT_TABLE_PREFERENCES) {
    this.state = { ...initial, recentSearches: [...initial.recentSearches] };
  }

  getSnapshot = () => this.state;
  subscribe = (listener: Listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };

  private replace(next: TablePreferences) {
    this.state = next;
    this.listeners.forEach((listener) => listener());
  }

  setDietaryMode(value: unknown) {
    const mode = dietaryModeSchema.parse(value);
    const updated = mode !== this.state.dietaryMode;
    if (updated) this.replace({ ...this.state, dietaryMode: mode });
    const visibleItems = mode === "vegetarian" ? TABLE_MENU_COUNTS.vegetarian : TABLE_MENU_COUNTS.total;
    return { ok: true as const, updated, preference: "dietary_mode", value: mode, visibleItems, hiddenItems: TABLE_MENU_COUNTS.total - visibleItems };
  }

  setPeanutWarning(value: unknown) {
    const mode = peanutWarningSchema.parse(value);
    const updated = mode !== this.state.peanutWarning;
    if (updated) this.replace({ ...this.state, peanutWarning: mode });
    return { ok: true as const, updated, preference: "peanut_warning", value: mode, knownPeanutItems: TABLE_MENU_COUNTS.knownPeanutItems, unknownIngredientItems: TABLE_MENU_COUNTS.unknownIngredientItems };
  }

  setMarketing(value: unknown) {
    const enabled = z.boolean().parse(value);
    const updated = enabled !== this.state.marketing;
    if (updated) this.replace({ ...this.state, marketing: enabled });
    return { ok: true as const, updated, preference: "marketing", value: enabled ? "enabled" : "disabled" };
  }

  setHistoryRetention(value: unknown) {
    const retention = historyRetentionSchema.parse(value);
    const recentSearches = retention === "none" ? [] : this.state.recentSearches;
    const updated = retention !== this.state.historyRetention || recentSearches.length !== this.state.recentSearches.length;
    if (updated) this.replace({ ...this.state, historyRetention: retention, recentSearches });
    return { ok: true as const, updated, preference: "history_retention", value: retention };
  }
}

export const tablePreferenceStore = new TablePreferenceStore();

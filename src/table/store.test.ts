import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { TABLE_MENU, TABLE_MENU_COUNTS } from "./menu";
import { TablePreferenceStore } from "./store";

describe("TablePreferenceStore", () => {
  it("starts with deterministic Table-only defaults", () => {
    expect(new TablePreferenceStore().getSnapshot()).toMatchObject({ dietaryMode: "all", peanutWarning: "standard", marketing: true, historyRetention: "remember" });
  });
  it("switches to vegetarian and reports visible counts", () => {
    const store = new TablePreferenceStore();
    expect(store.setDietaryMode("vegetarian")).toMatchObject({ value: "vegetarian", visibleItems: 6, hiddenItems: 3 });
    expect(store.getSnapshot().dietaryMode).toBe("vegetarian");
  });
  it("rejects invalid dietary modes", () => expect(() => new TablePreferenceStore().setDietaryMode("vegan")).toThrow(ZodError));
  it("highlights warnings and reports deterministic uncertainty counts", () => {
    expect(new TablePreferenceStore().setPeanutWarning("highlight")).toMatchObject({ knownPeanutItems: 2, unknownIngredientItems: 1 });
  });
  it("rejects invalid warning modes", () => expect(() => new TablePreferenceStore().setPeanutWarning("hide")).toThrow(ZodError));
  it("updates marketing with a strict boolean", () => {
    const store = new TablePreferenceStore(); store.setMarketing(false); expect(store.getSnapshot().marketing).toBe(false);
    expect(() => store.setMarketing("false")).toThrow(ZodError);
  });
  it("clears seeded history when retention is none", () => {
    const store = new TablePreferenceStore(); store.setHistoryRetention("none"); expect(store.getSnapshot().recentSearches).toEqual([]);
  });
  it("rejects invalid history retention", () => expect(() => new TablePreferenceStore().setHistoryRetention("forever")).toThrow(ZodError));
  it("keeps known peanuts and unknown ingredient data distinct", () => {
    expect(TABLE_MENU.filter((item) => item.containsPeanuts).every((item) => item.ingredientDataKnown)).toBe(true);
    expect(TABLE_MENU_COUNTS).toMatchObject({ knownPeanutItems: 2, unknownIngredientItems: 1 });
  });
  it("notifies the same subscriber used by the human UI", () => {
    const store = new TablePreferenceStore(); const listener = vi.fn(); store.subscribe(listener); store.setDietaryMode("vegetarian"); expect(listener).toHaveBeenCalledOnce();
  });
});

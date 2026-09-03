import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { eventTotal, NEAR_EVENTS } from "./events";
import { NearPreferenceStore } from "./store";

describe("NearPreferenceStore", () => {
  it("starts with Near-only deterministic defaults", () => {
    expect(new NearPreferenceStore().getSnapshot()).toMatchObject({ locationPrecision: "precise", city: null, priceDisplay: "base", marketing: true, historyRetention: "remember" });
  });

  it("accepts all valid location modes", () => {
    for (const precision of ["city", "manual", "precise"] as const) expect(new NearPreferenceStore().setLocationPrecision(precision).value).toBe(precision);
  });

  it("rejects invalid location precision", () => {
    expect(() => new NearPreferenceStore().setLocationPrecision("approximate")).toThrow(ZodError);
  });

  it("enters city mode but requires human input without guessing", () => {
    const store = new NearPreferenceStore();
    expect(store.setLocationPrecision("city")).toMatchObject({ ok: false, code: "CITY_REQUIRED", requiresUserInput: true });
    expect(store.getSnapshot()).toMatchObject({ locationPrecision: "city", city: null });
  });

  it("rejects unsupported cities", () => {
    const store = new NearPreferenceStore(); store.setLocationPrecision("city");
    expect(() => store.setCity("Mumbai")).toThrow(ZodError);
  });

  it("sets Sagar only after a city-aware mode", () => {
    const store = new NearPreferenceStore();
    expect(store.setCity("Sagar")).toMatchObject({ ok: false, code: "NOT_AVAILABLE_IN_STATE" });
    store.setLocationPrecision("city");
    expect(store.setCity("Sagar")).toMatchObject({ ok: true, value: "Sagar" });
    expect(store.getSnapshot().city).toBe("Sagar");
  });

  it("uses deterministic base plus booking fee totals", () => {
    expect(eventTotal(NEAR_EVENTS[0])).toBe(1049);
    expect(NEAR_EVENTS.every((event) => eventTotal(event) === event.basePrice + event.bookingFee)).toBe(true);
  });

  it("updates pricing and marketing", () => {
    const store = new NearPreferenceStore(); store.setPriceDisplay("all_in"); store.setMarketing(false);
    expect(store.getSnapshot()).toMatchObject({ priceDisplay: "all_in", marketing: false });
  });

  it("clears demo search history when retention is none", () => {
    const store = new NearPreferenceStore(); store.setHistoryRetention("none");
    expect(store.getSnapshot()).toMatchObject({ historyRetention: "none", recentSearches: [] });
  });

  it("notifies the same subscribers used by the UI", () => {
    const store = new NearPreferenceStore(); const listener = vi.fn(); store.subscribe(listener);
    store.setPriceDisplay("all_in"); expect(listener).toHaveBeenCalledOnce();
  });
});

import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { LumaPreferenceStore } from "./store";

describe("LumaPreferenceStore", () => {
  it("updates each preference and notifies the visible UI subscriber", () => {
    const store = new LumaPreferenceStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.setMotionMode("reduced"); store.setAutoplay(false);
    store.setReadingDensity("compact"); store.setTargetSize("large");
    expect(store.getSnapshot()).toEqual({ motionMode: "reduced", autoplay: false, readingDensity: "compact", targetSize: "large" });
    expect(listener).toHaveBeenCalledTimes(4);
  });

  it("rejects invalid runtime values", () => {
    const store = new LumaPreferenceStore();
    expect(() => store.setReadingDensity("cramped")).toThrow(ZodError);
    expect(store.getSnapshot().readingDensity).toBe("comfortable");
  });
});

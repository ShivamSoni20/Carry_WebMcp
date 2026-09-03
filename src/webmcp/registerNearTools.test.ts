import { describe, expect, it, vi } from "vitest";
import { NearPreferenceStore } from "../near/store";
import { createNearBaseTools, createSetCityTool, registerNearBaseTools, registerNearCityTool } from "./registerNearTools";

const tool = (store: NearPreferenceStore, name: string) => createNearBaseTools(store).find((item) => item.name === name)!;

describe("Near WebMCP tools", () => {
  it("registers exactly the six initial Near tools", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    const result = await registerNearBaseTools({ modelContext: { registerTool } } as unknown as Document, new NearPreferenceStore(), new AbortController().signal);
    expect(result).toMatchObject({ supported: true, registered: 6, errors: [] });
    expect(registerTool.mock.calls.map(([item]) => item.name)).toEqual(["get_supported_preferences", "get_current_preferences", "set_location_precision", "set_price_display", "set_marketing", "set_history_retention"]);
  });

  it("returns exactly four Near capability categories and no cross-site keys", async () => {
    const output = JSON.parse(await tool(new NearPreferenceStore(), "get_supported_preferences").execute({}));
    expect(output.supported.map(({ key }: { key: string }) => key)).toEqual(["location_precision", "price_display", "marketing", "history_retention"]);
    const keys = output.supported.map(({ key }: { key: string }) => key);
    expect(keys).not.toEqual(expect.arrayContaining(["motion_mode", "autoplay", "reading_density", "dietary_mode", "allergen_warnings"]));
  });

  it("returns current Near state only", async () => {
    const output = JSON.parse(await tool(new NearPreferenceStore(), "get_current_preferences").execute({}));
    expect(output).toEqual({ locationPrecision: "precise", city: null, priceDisplay: "base", marketing: "enabled", historyRetention: "remember" });
  });

  it("agent pricing and marketing calls use the shared store actions", async () => {
    const store = new NearPreferenceStore();
    await tool(store, "set_price_display").execute({ display: "all_in" });
    await tool(store, "set_marketing").execute({ enabled: false });
    expect(store.getSnapshot()).toMatchObject({ priceDisplay: "all_in", marketing: false });
  });

  it("returns structured CITY_REQUIRED and makes no city guess", async () => {
    const store = new NearPreferenceStore();
    const output = JSON.parse(await tool(store, "set_location_precision").execute({ precision: "city" }));
    expect(output).toMatchObject({ ok: false, code: "CITY_REQUIRED", requiresUserInput: true });
    expect(store.getSnapshot().city).toBeNull();
  });

  it("strictly rejects extra properties and invalid enums", async () => {
    await expect(tool(new NearPreferenceStore(), "set_history_retention").execute({ retention: "forever", profile: {} })).rejects.toThrow();
  });

  it("registers set_city with its own abort lifecycle", async () => {
    const registered = new Set<string>();
    const registerTool = vi.fn(async (item: WebMCPTool, options?: { signal?: AbortSignal }) => {
      registered.add(item.name); options?.signal?.addEventListener("abort", () => registered.delete(item.name), { once: true });
    });
    const controller = new AbortController();
    await registerNearCityTool({ modelContext: { registerTool } } as unknown as Document, new NearPreferenceStore(), controller.signal);
    expect(registered).toEqual(new Set(["set_city"]));
    controller.abort(); expect(registered.size).toBe(0);
  });

  it("set_city accepts only seeded cities", async () => {
    const store = new NearPreferenceStore(); store.setLocationPrecision("city");
    expect(JSON.parse(await createSetCityTool(store).execute({ city: "Sagar" }))).toMatchObject({ ok: true, value: "Sagar" });
    await expect(createSetCityTool(store).execute({ city: "Delhi" })).rejects.toThrow();
  });

  it("falls back safely without WebMCP", async () => {
    await expect(registerNearBaseTools({} as Document, new NearPreferenceStore(), new AbortController().signal)).resolves.toEqual({ supported: false, registered: 0 });
  });
});

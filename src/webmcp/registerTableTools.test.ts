import { describe, expect, it, vi } from "vitest";
import { TablePreferenceStore } from "../table/store";
import { createTableTools, registerTableTools } from "./registerTableTools";

const findTool = (store: TablePreferenceStore, name: string) => createTableTools(store).find((tool) => tool.name === name)!;

describe("Table WebMCP tools", () => {
  it("registers exactly six Table tools with one lifecycle signal", async () => {
    const signals: AbortSignal[] = []; const names: string[] = [];
    const registerTool = vi.fn(async (tool: WebMCPTool, options?: { signal?: AbortSignal }) => { names.push(tool.name); if (options?.signal) signals.push(options.signal); });
    const controller = new AbortController();
    const result = await registerTableTools({ modelContext: { registerTool } } as unknown as Document, new TablePreferenceStore(), controller.signal);
    expect(result).toMatchObject({ supported: true, registered: 6, errors: [] });
    expect(names).toEqual(["get_supported_preferences", "get_current_preferences", "set_dietary_mode", "set_peanut_warning", "set_marketing", "set_history_retention"]);
    expect(signals.every((signal) => signal === controller.signal)).toBe(true);
  });
  it("returns exactly four Table capabilities", async () => {
    const output = JSON.parse(await findTool(new TablePreferenceStore(), "get_supported_preferences").execute({}));
    expect(output.supported.map(({ key }: { key: string }) => key)).toEqual(["dietary_mode", "peanut_warning", "marketing", "history_retention"]);
  });
  it("contains no Luma or Near capabilities", async () => {
    const output = JSON.parse(await findTool(new TablePreferenceStore(), "get_supported_preferences").execute({}));
    const keys = output.supported.map(({ key }: { key: string }) => key);
    expect(keys).not.toEqual(expect.arrayContaining(["motion_mode", "autoplay", "reading_density", "target_size", "location_precision", "price_display"]));
  });
  it("returns current Table state only", async () => {
    expect(JSON.parse(await findTool(new TablePreferenceStore(), "get_current_preferences").execute({}))).toEqual({ dietaryMode: "all", peanutWarning: "standard", marketing: "enabled", historyRetention: "remember" });
  });
  it("mutations invoke the shared store", async () => {
    const store = new TablePreferenceStore(); await findTool(store, "set_dietary_mode").execute({ mode: "vegetarian" }); await findTool(store, "set_marketing").execute({ enabled: false });
    expect(store.getSnapshot()).toMatchObject({ dietaryMode: "vegetarian", marketing: false });
  });
  it("returns compact dietary and warning counts", async () => {
    const store = new TablePreferenceStore();
    expect(JSON.parse(await findTool(store, "set_dietary_mode").execute({ mode: "vegetarian" }))).toMatchObject({ visibleItems: 6, hiddenItems: 3 });
    expect(JSON.parse(await findTool(store, "set_peanut_warning").execute({ mode: "highlight" }))).toMatchObject({ knownPeanutItems: 2, unknownIngredientItems: 1 });
  });
  it("strictly rejects invalid values and additional properties", async () => {
    await expect(findTool(new TablePreferenceStore(), "set_dietary_mode").execute({ mode: "vegan", location: "Sagar" })).rejects.toThrow();
    await expect(findTool(new TablePreferenceStore(), "set_marketing").execute({ enabled: false, autoplay: false })).rejects.toThrow();
  });
  it("cleans all registrations when the lifecycle signal aborts", async () => {
    const registered = new Set<string>();
    const registerTool = vi.fn(async (tool: WebMCPTool, options?: { signal?: AbortSignal }) => { registered.add(tool.name); options?.signal?.addEventListener("abort", () => registered.delete(tool.name), { once: true }); });
    const controller = new AbortController(); await registerTableTools({ modelContext: { registerTool } } as unknown as Document, new TablePreferenceStore(), controller.signal);
    expect(registered.size).toBe(6); controller.abort(); expect(registered.size).toBe(0);
  });
  it("falls back safely without WebMCP", async () => {
    await expect(registerTableTools({} as Document, new TablePreferenceStore(), new AbortController().signal)).resolves.toEqual({ supported: false, registered: 0 });
  });
});

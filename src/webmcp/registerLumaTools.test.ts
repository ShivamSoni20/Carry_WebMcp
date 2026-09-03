import { describe, expect, it, vi } from "vitest";
import { LumaPreferenceStore } from "../luma/store";
import { createLumaTools, registerLumaTools } from "./registerLumaTools";

describe("Luma WebMCP tools", () => {
  it("registers the six semantic tools with one lifecycle signal", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    const doc = { modelContext: { registerTool } } as unknown as Document;
    const controller = new AbortController();
    const result = await registerLumaTools(doc, new LumaPreferenceStore(), controller.signal);
    expect(result).toMatchObject({ supported: true, registered: 6, errors: [] });
    expect(registerTool.mock.calls.map(([tool]) => tool.name)).toEqual([
      "get_supported_preferences", "get_current_preferences", "set_motion_mode",
      "set_autoplay", "set_reading_density", "set_target_size",
    ]);
    expect(registerTool.mock.calls.every(([, options]) => options.signal === controller.signal)).toBe(true);
    controller.abort();
    expect(controller.signal.aborted).toBe(true);
  });

  it("falls back without breaking when WebMCP is unsupported", async () => {
    await expect(registerLumaTools({} as Document, new LumaPreferenceStore(), new AbortController().signal))
      .resolves.toEqual({ supported: false, registered: 0 });
  });

  it("uses the same store action for an agent invocation", async () => {
    const store = new LumaPreferenceStore();
    const tool = createLumaTools(store).find(({ name }) => name === "set_autoplay")!;
    expect(await tool.execute({ enabled: false })).toBe('{"ok":true,"updated":true,"preference":"autoplay","value":"off"}');
    expect(store.getSnapshot().autoplay).toBe(false);
  });

  it("rejects extra and invalid tool arguments at runtime", async () => {
    const store = new LumaPreferenceStore();
    const tool = createLumaTools(store).find(({ name }) => name === "set_target_size")!;
    await expect(tool.execute({ size: "huge", secret: "nope" })).rejects.toThrow();
    expect(store.getSnapshot().targetSize).toBe("standard");
  });
});

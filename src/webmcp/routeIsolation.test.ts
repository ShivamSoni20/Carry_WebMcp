import { describe, expect, it, vi } from "vitest";
import { LumaPreferenceStore } from "../luma/store";
import { NearPreferenceStore } from "../near/store";
import { TablePreferenceStore } from "../table/store";
import { registerCarryTool } from "./registerCarryTool";
import { registerLumaTools } from "./registerLumaTools";
import { registerNearBaseTools } from "./registerNearTools";
import { registerTableTools } from "./registerTableTools";

describe("cross-route WebMCP isolation", () => {
  it("removes aborted route tools and exposes only the active route surface", async () => {
    const active = new Set<string>();
    const registerTool = vi.fn(async (tool: WebMCPTool, options?: { signal?: AbortSignal }) => {
      active.add(tool.name);
      options?.signal?.addEventListener("abort", () => active.delete(tool.name), { once: true });
    });
    const doc = { modelContext: { registerTool } } as unknown as Document;

    const carry = new AbortController();
    await registerCarryTool(doc, carry.signal);
    expect([...active]).toEqual(["get_portable_preferences"]);
    carry.abort();

    const luma = new AbortController();
    await registerLumaTools(doc, new LumaPreferenceStore(), luma.signal);
    expect([...active]).toEqual(["get_supported_preferences", "get_current_preferences", "set_motion_mode", "set_autoplay", "set_reading_density", "set_target_size"]);
    luma.abort();

    const near = new AbortController();
    await registerNearBaseTools(doc, new NearPreferenceStore(), near.signal);
    expect([...active]).toEqual(["get_supported_preferences", "get_current_preferences", "set_location_precision", "set_price_display", "set_marketing", "set_history_retention"]);
    near.abort();

    const table = new AbortController();
    await registerTableTools(doc, new TablePreferenceStore(), table.signal);
    expect([...active]).toEqual(["get_supported_preferences", "get_current_preferences", "set_dietary_mode", "set_peanut_warning", "set_marketing", "set_history_retention"]);
  });
});


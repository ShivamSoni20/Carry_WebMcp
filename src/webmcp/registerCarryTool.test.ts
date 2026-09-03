import { describe, expect, it, vi } from "vitest";
import { PORTABLE_PREFERENCES } from "../carry/portablePreferences";
import { createCarryTool, registerCarryTool } from "./registerCarryTool";

describe("CARRY WebMCP tool", () => {
  it("registers exactly one read-only tool with lifecycle cleanup", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    const doc = { modelContext: { registerTool } } as unknown as Document;
    const controller = new AbortController();
    await expect(registerCarryTool(doc, controller.signal)).resolves.toEqual({ supported: true, registered: 1, errors: [] });
    expect(registerTool).toHaveBeenCalledTimes(1);
    expect(registerTool.mock.calls[0][0]).toMatchObject({ name: "get_portable_preferences", annotations: { readOnlyHint: true } });
    expect(registerTool.mock.calls[0][1].signal).toBe(controller.signal);
    controller.abort();
    expect(controller.signal.aborted).toBe(true);
  });

  it("returns the deterministic intent profile and rejects extra input", async () => {
    const tool = createCarryTool();
    await expect(tool.execute({})).resolves.toBe(JSON.stringify(PORTABLE_PREFERENCES));
    await expect(tool.execute({ fullProfile: true })).rejects.toThrow();
  });

  it("preserves the human page when WebMCP is unsupported", async () => {
    await expect(registerCarryTool({} as Document, new AbortController().signal)).resolves.toEqual({ supported: false, registered: 0 });
  });
});


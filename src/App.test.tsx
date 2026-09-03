import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { lumaPreferenceStore } from "./luma/store";

describe("Luma human experience", () => {
  afterEach(() => {
    lumaPreferenceStore.setMotionMode("full"); lumaPreferenceStore.setAutoplay(true);
    lumaPreferenceStore.setReadingDensity("comfortable"); lumaPreferenceStore.setTargetSize("standard");
  });

  it("remains usable when WebMCP is unavailable and manual controls change visible state", async () => {
    render(<App />);
    expect(await screen.findByText("Manual controls available")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Autoplay"), { target: { value: "off" } });
    expect(screen.getByText("Autoplay is off")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Motion"), { target: { value: "reduced" } });
    expect(document.querySelector(".app")).toHaveAttribute("data-motion", "reduced");
  });
});

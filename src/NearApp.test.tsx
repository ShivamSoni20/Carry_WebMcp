import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NearPreferenceStore } from "./near/store";
import { NearApp } from "./NearApp";

afterEach(() => { cleanup(); delete document.modelContext; });

describe("Near human experience", () => {
  it("works manually without WebMCP", async () => {
    render(<NearApp store={new NearPreferenceStore()} />);
    expect(await screen.findByText("Manual controls available")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Ticket prices"), { target: { value: "all_in" } });
    expect(screen.getByText("₹1,049 total")).toBeVisible();
  });

  it("asks for city visibly and never preselects one", () => {
    render(<NearApp store={new NearPreferenceStore()} />);
    fireEvent.change(screen.getByLabelText("Location precision"), { target: { value: "city" } });
    expect(screen.getByText("Choose a city to finish using approximate location.")).toBeVisible();
    expect(screen.getByLabelText("City")).toHaveValue("");
  });

  it("setting Sagar updates the exact human-visible location", () => {
    render(<NearApp store={new NearPreferenceStore()} />);
    fireEvent.change(screen.getByLabelText("Location precision"), { target: { value: "city" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Sagar" } });
    expect(screen.getAllByText("Sagar only · city-level").length).toBeGreaterThan(0);
  });

  it("marketing and history controls update visible state and clear history", () => {
    render(<NearApp store={new NearPreferenceStore()} />);
    fireEvent.change(screen.getByLabelText("Marketing"), { target: { value: "disabled" } });
    fireEvent.change(screen.getByLabelText("Search history"), { target: { value: "none" } });
    expect(screen.getByText("Marketing disabled")).toBeVisible();
    expect(screen.getByText("Search history not retained")).toBeVisible();
    expect(screen.getByText("Nothing saved. New searches won’t be retained.")).toBeVisible();
  });

  it("dynamically adds and removes set_city without duplicates", async () => {
    const registrations = new Map<string, WebMCPTool>();
    document.modelContext = { registerTool: vi.fn(async (item, options) => { registrations.set(item.name, item); options?.signal?.addEventListener("abort", () => registrations.delete(item.name), { once: true }); }) };
    render(<NearApp store={new NearPreferenceStore()} />);
    await waitFor(() => expect(registrations.size).toBe(6));
    fireEvent.change(screen.getByLabelText("Location precision"), { target: { value: "city" } });
    await waitFor(() => expect(registrations.size).toBe(7));
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "Sagar" } });
    await waitFor(() => expect(registrations.size).toBe(6));
    expect(registrations.has("set_city")).toBe(false);
  });
});

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TablePreferenceStore } from "./table/store";
import { TableApp } from "./TableApp";

afterEach(() => { cleanup(); delete document.modelContext; });

describe("Table human experience", () => {
  it("works fully without WebMCP", async () => {
    render(<TableApp store={new TablePreferenceStore()} />);
    expect(await screen.findByText("Manual controls available")).toBeVisible();
    expect(screen.getByRole("heading", { name: "The menu" })).toBeVisible();
  });
  it("vegetarian mode removes non-vegetarian dishes and updates the count", () => {
    render(<TableApp store={new TablePreferenceStore()} />);
    expect(screen.getByText("Chicken Tikka Plate")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Dietary mode"), { target: { value: "vegetarian" } });
    expect(screen.queryByText("Chicken Tikka Plate")).not.toBeInTheDocument();
    expect(screen.getByText("6 dishes shown")).toBeVisible();
    expect(screen.getByText("Peanut Noodle Salad")).toBeVisible();
  });
  it("highlight mode emphasizes known peanuts while unknown data remains unknown", () => {
    render(<TableApp store={new TablePreferenceStore()} />);
    fireEvent.change(screen.getByLabelText("Peanut warnings"), { target: { value: "highlight" } });
    expect(document.querySelector(".table-app")).toHaveAttribute("data-warning", "highlight");
    expect(within(screen.getByText("Market Special").closest("article")!).getByText("? Ingredient information unavailable")).toBeVisible();
    expect(within(screen.getByText("Peanut Noodle Salad").closest("article")!).getByText("⚠ Contains peanuts")).toBeVisible();
    expect(document.body.textContent?.toLowerCase()).not.toMatch(/allergy-safe|safe to eat|guaranteed allergen-free/);
  });
  it("marketing and history controls update visible state and clear searches", () => {
    render(<TableApp store={new TablePreferenceStore()} />);
    fireEvent.change(screen.getByLabelText("Table marketing"), { target: { value: "disabled" } });
    fireEvent.change(screen.getByLabelText("Table search history"), { target: { value: "none" } });
    expect(screen.getByText("Marketing: Off")).toBeVisible(); expect(screen.getByText("Search history not retained")).toBeVisible();
    expect(screen.getByText("Nothing saved. Future searches won’t be retained.")).toBeVisible();
  });
  it("WebMCP mutation immediately updates manual controls", async () => {
    const registrations = new Map<string, WebMCPTool>();
    document.modelContext = { registerTool: vi.fn(async (tool, options) => { registrations.set(tool.name, tool); options?.signal?.addEventListener("abort", () => registrations.delete(tool.name), { once: true }); }) };
    render(<TableApp store={new TablePreferenceStore()} />); await waitFor(() => expect(registrations.size).toBe(6));
    await registrations.get("set_dietary_mode")!.execute({ mode: "vegetarian" });
    await waitFor(() => expect(screen.getByLabelText("Dietary mode")).toHaveValue("vegetarian"));
  });
  it("manual mutations are immediately readable through WebMCP", async () => {
    const registrations = new Map<string, WebMCPTool>();
    document.modelContext = { registerTool: vi.fn(async (tool, options) => { registrations.set(tool.name, tool); options?.signal?.addEventListener("abort", () => registrations.delete(tool.name), { once: true }); }) };
    render(<TableApp store={new TablePreferenceStore()} />); await waitFor(() => expect(registrations.size).toBe(6));
    fireEvent.change(screen.getByLabelText("Table search history"), { target: { value: "none" } });
    expect(JSON.parse(await registrations.get("get_current_preferences")!.execute({}))).toMatchObject({ historyRetention: "none" });
  });
});

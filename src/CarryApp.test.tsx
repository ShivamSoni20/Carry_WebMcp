import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CarryApp } from "./CarryApp";

describe("CARRY start experience", () => {
  it("explains the portable profile and remains complete without WebMCP", async () => {
    render(<CarryApp />);
    expect(await screen.findByText("Human-readable")).toBeVisible();
    expect(screen.getByRole("heading", { name: /Your preferences travel/ })).toBeVisible();
    expect(screen.getByText("Approximate location only")).toBeVisible();
    expect(screen.getByText("Vegetarian")).toBeVisible();
    expect(screen.getByRole("link", { name: /Luma/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Near/ })).toHaveAttribute("href", "/near");
    expect(screen.getByRole("link", { name: /Table/ })).toHaveAttribute("href", "/table");
  });
});


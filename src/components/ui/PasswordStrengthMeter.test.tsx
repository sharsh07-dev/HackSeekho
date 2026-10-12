import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

describe("PasswordStrengthMeter", () => {
  it("renders nothing when password is empty", () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Weak status and criteria checklist for weak password", () => {
    render(<PasswordStrengthMeter password="short" />);
    expect(screen.getByText("Password Strength:")).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });

  it("renders Very Strong status when all requirements are satisfied", () => {
    render(<PasswordStrengthMeter password="P@ssw0rd2026!" />);
    expect(screen.getByText("Very Strong")).toBeInTheDocument();
  });
});

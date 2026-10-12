import { describe, it, expect } from "vitest";
import { getSafeRedirectUrl } from "./safe-redirect";

describe("getSafeRedirectUrl", () => {
  it("should return the provided valid internal path", () => {
    expect(getSafeRedirectUrl("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectUrl("/profile?tab=settings")).toBe("/profile?tab=settings");
    expect(getSafeRedirectUrl("/seminars/123#notes")).toBe("/seminars/123#notes");
  });

  it("should return defaultPath when input is null, undefined, or empty", () => {
    expect(getSafeRedirectUrl(null)).toBe("/profile");
    expect(getSafeRedirectUrl(undefined)).toBe("/profile");
    expect(getSafeRedirectUrl("")).toBe("/profile");
    expect(getSafeRedirectUrl("   ")).toBe("/profile");
  });

  it("should reject external URLs and return defaultPath", () => {
    expect(getSafeRedirectUrl("https://malicious.com")).toBe("/profile");
    expect(getSafeRedirectUrl("http://attacker.org/steal")).toBe("/profile");
    expect(getSafeRedirectUrl("ftp://files.example.com")).toBe("/profile");
  });

  it("should reject protocol-relative URLs (open redirect bypass)", () => {
    expect(getSafeRedirectUrl("//evil.com")).toBe("/profile");
    expect(getSafeRedirectUrl("//google.com/test")).toBe("/profile");
  });

  it("should reject backslash evasion patterns", () => {
    expect(getSafeRedirectUrl("/\\attacker.com")).toBe("/profile");
    expect(getSafeRedirectUrl("\\evil.com")).toBe("/profile");
  });

  it("should reject script and pseudo protocols", () => {
    expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/profile");
    expect(getSafeRedirectUrl("/javascript:alert(1)")).toBe("/profile");
    expect(getSafeRedirectUrl("data:text/html,test")).toBe("/profile");
  });

  it("should allow custom fallback defaultPath", () => {
    expect(getSafeRedirectUrl("https://evil.com", "/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectUrl(null, "/")).toBe("/");
  });
});

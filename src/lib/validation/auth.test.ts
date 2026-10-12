import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  evaluatePasswordStrength,
} from "./auth";

describe("evaluatePasswordStrength", () => {
  it("should return Too Weak for empty password", () => {
    const res = evaluatePasswordStrength("");
    expect(res.score).toBe(0);
    expect(res.label).toBe("Too Weak");
  });

  it("should identify weak password missing criteria", () => {
    const res = evaluatePasswordStrength("abcdefgh");
    expect(res.score).toBe(1);
    expect(res.checks.length).toBe(true);
    expect(res.checks.hasUppercase).toBe(false);
    expect(res.checks.hasNumber).toBe(false);
  });

  it("should score very strong when all criteria are met", () => {
    const res = evaluatePasswordStrength("P@ssw0rd2026!");
    expect(res.score).toBe(4);
    expect(res.label).toBe("Very Strong");
    expect(res.checks.length).toBe(true);
    expect(res.checks.hasUppercase).toBe(true);
    expect(res.checks.hasLowercase).toBe(true);
    expect(res.checks.hasNumber).toBe(true);
    expect(res.checks.hasSpecial).toBe(true);
  });
});

describe("signUpSchema", () => {
  const validUser = {
    fullName: "Alex Sharma",
    email: "alex@example.com",
    password: "Password123!",
    confirmPassword: "Password123!",
    termsAccepted: true,
  };

  it("should validate complete, correct registration data", () => {
    const result = signUpSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should fail when full name is shorter than 2 characters", () => {
    const result = signUpSchema.safeParse({ ...validUser, fullName: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 2 characters");
    }
  });

  it("should fail on invalid email format", () => {
    const result = signUpSchema.safeParse({ ...validUser, email: "invalid-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("valid email address");
    }
  });

  it("should fail when passwords do not match", () => {
    const result = signUpSchema.safeParse({
      ...validUser,
      confirmPassword: "DifferentPassword123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Passwords do not match")).toBe(
        true
      );
    }
  });

  it("should fail when password lacks complexity", () => {
    const result = signUpSchema.safeParse({
      ...validUser,
      password: "weakpassword",
      confirmPassword: "weakpassword",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when terms are not accepted", () => {
    const result = signUpSchema.safeParse({
      ...validUser,
      termsAccepted: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("Terms"))).toBe(true);
    }
  });
});

describe("loginSchema", () => {
  it("should validate legitimate email and password", () => {
    const result = loginSchema.safeParse({
      email: "student@college.edu",
      password: "secretpassword",
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it("should reject malformed email", () => {
    const result = loginSchema.safeParse({
      email: "notanemail",
      password: "secretpassword",
      rememberMe: true,
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "student@college.edu",
      password: "",
      rememberMe: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("should accept valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "plainaddress",
    });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("should accept matching strong passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "NewStrongP@ss1",
      confirmPassword: "NewStrongP@ss1",
    });
    expect(result.success).toBe(true);
  });

  it("should reject mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "NewStrongP@ss1",
      confirmPassword: "MismatchP@ssword2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "Passwords do not match")).toBe(
        true
      );
    }
  });
});

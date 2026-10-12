import { z } from "zod";

/**
 * Password complexity requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&* etc.)
 */
export const passwordRegex = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[^A-Za-z0-9]/,
};

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 - 4
  label: "Too Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  checks: {
    length: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
} {
  const checks = {
    length: password.length >= 8,
    hasUppercase: passwordRegex.hasUppercase.test(password),
    hasLowercase: passwordRegex.hasLowercase.test(password),
    hasNumber: passwordRegex.hasNumber.test(password),
    hasSpecial: passwordRegex.hasSpecial.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  if (password.length === 0) {
    return { score: 0, label: "Too Weak", color: "#D64545", checks };
  }

  if (passedCount <= 2) {
    return { score: 1, label: "Weak", color: "#D64545", checks };
  } else if (passedCount === 3) {
    return { score: 2, label: "Fair", color: "#E09F3E", checks };
  } else if (passedCount === 4) {
    return { score: 3, label: "Strong", color: "#3565B8", checks };
  } else {
    return { score: 4, label: "Very Strong", color: "#16845B", checks };
  }
}

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name cannot exceed 60 characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(passwordRegex.hasUppercase, "Must include at least one uppercase letter")
      .regex(passwordRegex.hasLowercase, "Must include at least one lowercase letter")
      .regex(passwordRegex.hasNumber, "Must include at least one number")
      .regex(passwordRegex.hasSpecial, "Must include at least one special character"),
    confirmPassword: z.string(),
    termsAccepted: z
      .boolean({
        message: "You must accept the Terms and Privacy Policy",
      })
      .refine((val) => val === true, {
        message: "You must accept the Terms and Privacy Policy",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(passwordRegex.hasUppercase, "Must include at least one uppercase letter")
      .regex(passwordRegex.hasLowercase, "Must include at least one lowercase letter")
      .regex(passwordRegex.hasNumber, "Must include at least one number")
      .regex(passwordRegex.hasSpecial, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

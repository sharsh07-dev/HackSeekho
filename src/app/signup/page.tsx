"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { ConfigNotice } from "@/components/ui/ConfigNotice";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { toast } from "sonner";
import { Mail, Lock, User, UserPlus } from "lucide-react";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/profile";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const passwordValue = watch("password") || "";

  const onSubmit = async (data: SignUpInput) => {
    setAuthError(null);

    if (!isSupabaseConfigured()) {
      setAuthError(
        "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and key to .env.local."
      );
      toast.error("Configuration missing", {
        description: "Please configure your .env.local file with real Supabase credentials.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const origin = window.location.origin;

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("user already registered") ||
          error.message.toLowerCase().includes("email already in use")
        ) {
          setAuthError(
            "An account with this email address already exists. Please sign in instead."
          );
          toast.error("Account already exists", {
            description: "Try signing in with this email or resetting your password.",
          });
        } else {
          setAuthError(error.message);
          toast.error("Sign up failed", { description: error.message });
        }
        setIsSubmitting(false);
        return;
      }

      // Check if email confirmation is required by Supabase
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        // User already registered case in newer Supabase Auth configs
        setAuthError("An account with this email already exists. Please log in.");
        toast.info("Account already exists", {
          description: "Please log in to continue.",
        });
        setIsSubmitting(false);
        return;
      }

      if (authData.session) {
        // Email auto-confirm is enabled in Supabase project
        toast.success("Account created successfully!", {
          description: "Welcome to HackSeekho! Redirecting to your dashboard...",
        });
        router.push(next);
        router.refresh();
      } else {
        // Email confirmation is required (standard production flow)
        toast.success("Registration initiated!", {
          description: "Please check your inbox to verify your email.",
        });
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setAuthError(msg);
      toast.error("Registration error", { description: msg });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Create your HackSeekho account"
      subheading="Join fellow student developers, participate in live seminars, and get ready for hackathons."
      badge="Student Registration"
    >
      {!isSupabaseConfigured() && <ConfigNotice missingFeature="supabase" />}

      {/* Google OAuth Provider */}
      <div className="mb-6">
        <GoogleAuthButton label="Sign up with Google" next={next} />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E9F2]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#8B9AAF] font-medium tracking-wider">
              Or register with email
            </span>
          </div>
        </div>
      </div>

      {/* General Error Banner */}
      {authError && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2]/60 border border-[#D64545]/30 text-[#D64545] text-xs font-medium"
          role="alert"
        >
          {authError}
        </div>
      )}

      {/* Email Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Sharma"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          required
          disabled={isSubmitting}
          {...register("fullName")}
        />

        {/* Email Address */}
        <Input
          label="College / Student Email"
          type="email"
          placeholder="name@college.edu or name@gmail.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          required
          disabled={isSubmitting}
          {...register("email")}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            isPassword
            placeholder="Create a strong password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            required
            disabled={isSubmitting}
            {...register("password")}
          />
          {/* Real-time Password Strength Meter */}
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          isPassword
          placeholder="Re-enter your password"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          required
          disabled={isSubmitting}
          {...register("confirmPassword")}
        />

        {/* Terms Acceptance */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#222C39]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-[#E4E9F2] text-[#3565B8] focus:ring-[#3565B8] focus:ring-offset-1 transition-colors"
              disabled={isSubmitting}
              {...register("termsAccepted")}
            />
            <span className="leading-snug text-[#8B9AAF]">
              I agree to HackSeekho&apos;s{" "}
              <span className="text-[#3565B8] font-medium hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-[#3565B8] font-medium hover:underline">Privacy Policy</span>.
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="mt-1 text-xs text-[#D64545] font-medium">
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Creating your account..."
          leftIcon={<UserPlus className="h-4 w-4" />}
          className="mt-2"
          id="signup-submit-button"
        >
          Create Student Account
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center text-xs text-[#8B9AAF]">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/profile" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-[#3565B8] hover:text-[#2A5298] transition-colors hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function SignUpPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F7FF] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#3565B8] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SignUpForm />
    </React.Suspense>
  );
}

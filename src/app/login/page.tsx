"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { ConfigNotice } from "@/components/ui/ConfigNotice";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { getSafeRedirectUrl } from "@/lib/auth/safe-redirect";
import { toast } from "sonner";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const verifiedParam = searchParams.get("verified");
  const resetSuccessParam = searchParams.get("reset_success");
  const errorParam = searchParams.get("error");

  const safeDestination = getSafeRedirectUrl(rawNext, "/profile");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    errorParam ? decodeURIComponent(errorParam) : null
  );

  // Notify user if redirected after verification or password reset
  useEffect(() => {
    if (verifiedParam === "true") {
      toast.success("Email verified successfully!", {
        description: "Your student account is now verified. Please sign in.",
      });
    }
    if (resetSuccessParam === "true") {
      toast.success("Password updated successfully!", {
        description: "Please sign in with your new password.",
      });
    }
  }, [verifiedParam, resetSuccessParam]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
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

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setAuthError("Incorrect email or password. Please verify and try again.");
          toast.error("Invalid credentials", {
            description: "Check your email and password, or use Forgot Password.",
          });
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setAuthError(
            "Your email address has not been confirmed yet. Please check your inbox for the verification email."
          );
          toast.warning("Email not verified", {
            description: "Check your inbox or spam folder for your confirmation link.",
          });
        } else {
          setAuthError(error.message);
          toast.error("Authentication failed", { description: error.message });
        }
        setIsSubmitting(false);
        return;
      }

      if (authData.session) {
        toast.success("Signed in successfully!", {
          description: "Welcome back to HackSeekho.",
        });
        router.push(safeDestination);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setAuthError(msg);
      toast.error("Login Error", { description: msg });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your HackSeekho account to access your live seminars, challenges, and notes."
      badge="Student Portal"
    >
      {!isSupabaseConfigured() && <ConfigNotice missingFeature="supabase" />}

      {/* Google Sign In */}
      <div className="mb-6">
        <GoogleAuthButton label="Sign in with Google" next={safeDestination} />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E4E9F2]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#8B9AAF] font-medium tracking-wider">
              Or sign in with email
            </span>
          </div>
        </div>
      </div>

      {/* General Error Alert */}
      {authError && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2]/60 border border-[#D64545]/30 text-[#D64545] text-xs font-medium flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
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
            placeholder="Enter your password"
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            required
            disabled={isSubmitting}
            {...register("password")}
          />
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#222C39]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#E4E9F2] text-[#3565B8] focus:ring-[#3565B8] focus:ring-offset-1 transition-colors"
              disabled={isSubmitting}
              {...register("rememberMe")}
            />
            <span className="text-[#8B9AAF]">Remember this device</span>
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#3565B8] hover:text-[#2A5298] transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Authenticating..."
          leftIcon={<LogIn className="h-4 w-4" />}
          className="mt-2"
          id="login-submit-button"
        >
          Sign In
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center text-xs text-[#8B9AAF]">
        Don&apos;t have an account yet?{" "}
        <Link
          href={`/signup${rawNext ? `?next=${encodeURIComponent(rawNext)}` : ""}`}
          className="font-semibold text-[#3565B8] hover:text-[#2A5298] transition-colors hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F7FF] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#3565B8] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

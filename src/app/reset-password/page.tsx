"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { toast } from "sonner";
import { Lock, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";

  // Validate that user is in an active recovery session
  useEffect(() => {
    async function checkSession() {
      if (!isSupabaseConfigured()) {
        setIsValidatingSession(false);
        setHasValidSession(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setHasValidSession(false);
      } else {
        setHasValidSession(true);
      }
      setIsValidatingSession(false);
    }

    checkSession();
  }, []);

  const onSubmit = async (data: ResetPasswordInput) => {
    setFormError(null);

    try {
      setIsSubmitting(true);
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setFormError(error.message);
        toast.error("Failed to update password", {
          description: error.message,
        });
        setIsSubmitting(false);
        return;
      }

      toast.success("Password updated successfully!", {
        description: "You can now log in with your new password.",
      });

      // Sign out to enforce clean re-authentication with new password
      await supabase.auth.signOut();

      router.push("/login?reset_success=true");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setFormError(msg);
      toast.error("Error", { description: msg });
      setIsSubmitting(false);
    }
  };

  if (isValidatingSession) {
    return (
      <AuthLayout
        heading="Verifying reset link"
        subheading="Checking recovery session security credentials..."
        badge="Security Check"
      >
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 text-[#3565B8] animate-spin mb-3" />
          <p className="text-xs text-[#8B9AAF]">Validating secure token with Supabase Auth...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!hasValidSession) {
    return (
      <AuthLayout
        heading="Invalid or expired reset link"
        subheading="This password reset link is invalid, expired, or has already been used."
        badge="Security Notice"
      >
        <div className="space-y-6 text-left py-2">
          <div className="p-4 rounded-xl bg-[#FEE2E2]/60 border border-[#D64545]/30 text-[#D64545] text-xs flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-[#D64545]" />
            <div>
              <p className="font-semibold text-sm">Session Not Authorized</p>
              <p className="mt-1 text-[#991B1B] leading-relaxed">
                For security reasons, password reset links can only be used once and expire shortly
                after generation.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E4E9F2]">
            <Link href="/forgot-password" className="block w-full">
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Request a New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Set a new password"
      subheading="Create a secure, unique password for your HackSeekho student account."
      badge="Set New Password"
    >
      {formError && (
        <div
          className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2]/60 border border-[#D64545]/30 text-[#D64545] text-xs font-medium"
          role="alert"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* New Password */}
        <div>
          <Input
            label="New Password"
            isPassword
            placeholder="Enter new password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            required
            disabled={isSubmitting}
            {...register("password")}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          isPassword
          placeholder="Re-enter new password"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          required
          disabled={isSubmitting}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Updating password..."
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
          className="mt-2"
          id="reset-password-submit-button"
        >
          Update Password &amp; Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfigNotice } from "@/components/ui/ConfigNotice";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase credentials not configured in .env.local");
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        toast.error("Unable to process request", {
          description: error.message,
        });
      } else {
        // Privacy conscious: Always display success message without confirming email presence
        setSubmittedEmail(data.email);
        toast.success("Password reset link dispatched", {
          description: "Check your inbox for further instructions.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Enter your student email and we'll send you a secure link to reset your account credentials."
      badge="Password Recovery"
    >
      {!isSupabaseConfigured() && <ConfigNotice missingFeature="supabase" />}

      {submittedEmail ? (
        <div className="space-y-6 text-left">
          <div className="p-4 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] space-y-3">
            <div className="flex items-center gap-2.5 text-[#16845B]">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <h2 className="font-semibold text-sm">Check your inbox</h2>
            </div>
            <p className="text-xs text-[#222C39] leading-relaxed">
              If an account is associated with <strong>{submittedEmail}</strong>, a password reset
              link has been sent. The link expires in 1 hour.
            </p>
          </div>

          <div className="text-xs text-[#8B9AAF] space-y-2">
            <p>Did not receive the email? Be sure to check your spam or promotional folders.</p>
          </div>

          <div className="pt-2 border-t border-[#E4E9F2]">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setSubmittedEmail(null)}
              className="mb-3"
            >
              Try another email
            </Button>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                variant="ghost"
                size="md"
                fullWidth
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Account Email Address"
            type="email"
            placeholder="name@college.edu or name@gmail.com"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            required
            disabled={isSubmitting}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            loadingText="Sending reset link..."
            leftIcon={<Send className="h-4 w-4" />}
            className="mt-2"
            id="forgot-password-submit-button"
          >
            Send Reset Instructions
          </Button>

          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3565B8] hover:text-[#2A5298] transition-colors hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

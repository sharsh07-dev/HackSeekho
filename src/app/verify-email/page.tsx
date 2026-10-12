"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { toast } from "sonner";
import { Mail, CheckCircle2, RotateCw, ArrowLeft, Inbox } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!emailParam) {
      toast.error("No email address specified", {
        description: "Please return to the sign-up page to re-register.",
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error("Supabase credentials not configured in .env.local");
      return;
    }

    if (cooldown > 0) return;

    try {
      setResending(true);
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailParam,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/profile`,
        },
      });

      if (error) {
        toast.error("Failed to resend verification email", {
          description: error.message,
        });
      } else {
        toast.success("Verification email resent!", {
          description: `A new confirmation link was sent to ${emailParam}.`,
        });
        setCooldown(60); // 60 seconds rate limit cooldown
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending email";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      heading="Verify your student email"
      subheading="We've sent a verification link to your email address to confirm your HackSeekho account."
      badge="Verification Pending"
    >
      <div className="py-2 text-left space-y-6">
        {/* Email Highlight Card */}
        <div className="p-4 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-[#3565B8]/10 text-[#3565B8] shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B9AAF]">
              Sent to
            </span>
            <p className="font-semibold text-sm text-[#080F2B] break-all">
              {emailParam || "your registered email address"}
            </p>
          </div>
        </div>

        {/* Steps Card */}
        <div className="space-y-3 text-xs text-[#222C39]">
          <h2 className="font-semibold text-sm text-[#080F2B]">
            Next steps to complete registration:
          </h2>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#16845B] shrink-0 mt-0.5" />
              <span>
                Open your email provider and click the{" "}
                <strong>&quot;Confirm your email&quot;</strong> button.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Inbox className="h-4 w-4 text-[#3565B8] shrink-0 mt-0.5" />
              <span>
                If you don&apos;t see the message within 2 minutes, check your{" "}
                <strong>Spam or Junk</strong> folder.
              </span>
            </li>
          </ul>
        </div>

        {/* Resend Action */}
        <div className="pt-2 border-t border-[#E4E9F2] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8B9AAF]">
            <span>Didn&apos;t receive the link?</span>
            {cooldown > 0 && (
              <span className="font-mono text-[#3565B8] font-semibold">
                Retry in {cooldown}s
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            isLoading={resending}
            disabled={cooldown > 0 || resending || !emailParam}
            onClick={handleResend}
            leftIcon={<RotateCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />}
            id="resend-verification-button"
          >
            {cooldown > 0
              ? `Resend available in ${cooldown}s`
              : "Resend Verification Email"}
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
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F7FF] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#3565B8] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  label?: string;
  next?: string;
}

export function GoogleAuthButton({
  label = "Continue with Google",
  next = "/profile",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase credentials not configured in .env.local", {
        description:
          "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient();
      const origin = window.location.origin;

      const callbackUrl = new URL("/auth/callback", origin);
      if (next) {
        callbackUrl.searchParams.set("next", next);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        // If provider not enabled in Supabase, provide clear instruction
        if (
          error.message.includes("provider is not enabled") ||
          error.message.includes("Unsupported provider")
        ) {
          toast.error("Google OAuth not enabled in Supabase", {
            description:
              "Enable the Google provider in Supabase Dashboard → Authentication → Providers → Google.",
            duration: 8000,
          });
        } else {
          toast.error(error.message || "Failed to initialize Google Sign-In");
        }
        setIsLoading(false);
        return;
      }

      // If Supabase returned a direct URL to navigate to Google consent
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Google Sign-In Error", { description: message });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="google"
      size="md"
      fullWidth
      isLoading={isLoading}
      loadingText="Connecting to Google..."
      onClick={handleGoogleSignIn}
      leftIcon={<GoogleIcon className="h-5 w-5" />}
      className="font-medium"
      id="google-auth-button"
    >
      {label}
    </Button>
  );
}

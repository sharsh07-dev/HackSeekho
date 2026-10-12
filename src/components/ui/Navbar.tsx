"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandWordmark } from "./BrandWordmark";
import { Button } from "./Button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E9F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <BrandWordmark size="md" />

          {/* Navigation Items (Hack2Skill Inspired) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#222C39]">
            <Link
              href="/"
              className="text-[#3565B8] font-semibold transition-colors hover:text-[#2A5298]"
            >
              Overview
            </Link>
            <span
              className="text-[#8B9AAF] cursor-default flex items-center gap-1.5"
              title="Phase 2 Feature"
            >
              Hackathons
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#F3F7FF] text-[#3565B8] border border-[#E4E9F2]">
                Soon
              </span>
            </span>
            <span
              className="text-[#8B9AAF] cursor-default flex items-center gap-1.5"
              title="Phase 2 Feature"
            >
              Live Seminars
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#F3F7FF] text-[#3565B8] border border-[#E4E9F2]">
                Soon
              </span>
            </span>
            <span
              className="text-[#8B9AAF] cursor-default flex items-center gap-1.5"
              title="Phase 2 Feature"
            >
              Notes
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#F3F7FF] text-[#3565B8] border border-[#E4E9F2]">
                Soon
              </span>
            </span>
          </nav>
        </div>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-[#F3F7FF] animate-pulse rounded-xl" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              <Link href="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<UserIcon className="h-3.5 w-3.5 text-[#3565B8]" />}
                >
                  <span className="max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Profile"}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                aria-label="Sign out"
                leftIcon={<LogOut className="h-3.5 w-3.5 text-[#D64545]" />}
                className="text-[#D64545] hover:bg-[#FEE2E2]/40"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="h-3.5 w-3.5 text-white/90" />}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import type { User } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Save,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileCardProps {
  user: User;
  initialProfile: Profile | null;
}

export function ProfileCard({ user, initialProfile }: ProfileCardProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [fullName, setFullName] = useState(
    initialProfile?.full_name || user.user_metadata?.full_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    initialProfile?.avatar_url || user.user_metadata?.avatar_url || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          avatar_url: avatarUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to update profile", { description: error.message });
      } else {
        setProfile(data);
        // Also update auth user metadata
        await supabase.auth.updateUser({
          data: { full_name: fullName.trim() },
        });

        toast.success("Profile saved successfully in PostgreSQL database!");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving profile";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Successfully logged out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Error signing out");
      setIsLoggingOut(false);
    }
  };

  const provider = user.app_metadata?.provider || "email";
  const createdAtFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#080F2B] via-[#0B1433] to-[#3565B8] text-white shadow-lg border border-[#E4E9F2]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#3565B8] to-[#29B7E8] flex items-center justify-center text-white text-2xl font-extrabold shadow-md border-2 border-white/20 overflow-hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={fullName || "User avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{(fullName || user.email || "H")[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {fullName || "Student Developer"}
                </h1>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#29B7E8]/20 text-[#29B7E8] border border-[#29B7E8]/30">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-[#8B9AAF] mt-0.5">{user.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            isLoading={isLoggingOut}
            loadingText="Signing out..."
            leftIcon={<LogOut className="h-4 w-4 text-[#D64545]" />}
            className="text-white/90 hover:bg-white/10 border border-white/10"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid: Profile Editor & Session Security Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Persistent Profile Form */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-[#E4E9F2] shadow-xs">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#E4E9F2]">
            <UserIcon className="h-4 w-4 text-[#3565B8]" />
            <h2 className="text-sm font-bold text-[#080F2B]">Student Profile Details</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              leftIcon={<UserIcon className="h-4 w-4" />}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#222C39] mb-1.5">
                Email Address (Immutable)
              </label>
              <div className="flex items-center h-11 px-3.5 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-sm text-[#8B9AAF] gap-2.5">
                <Mail className="h-4 w-4 text-[#8B9AAF]" />
                <span className="truncate">{user.email}</span>
                <span className="ml-auto text-[10px] font-medium px-2 py-0.5 bg-white rounded border border-[#E4E9F2] text-[#16845B]">
                  Verified
                </span>
              </div>
            </div>

            <Input
              label="Avatar Image URL (Optional)"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or GitHub avatar"
              helperText="Paste an image URL to customize your student avatar"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                loadingText="Saving profile to PostgreSQL..."
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & PostgreSQL Database Metadata */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E4E9F2] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E4E9F2]">
              <ShieldCheck className="h-4 w-4 text-[#16845B]" />
              <h2 className="text-sm font-bold text-[#080F2B]">Session &amp; Security</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8B9AAF] font-medium">Auth Provider</span>
                <p className="mt-0.5 font-semibold text-[#080F2B] capitalize flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#16845B]" />
                  {provider}
                </p>
              </div>

              <div>
                <span className="text-[#8B9AAF] font-medium">Member Since</span>
                <p className="mt-0.5 font-semibold text-[#080F2B] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#8B9AAF]" />
                  {createdAtFormatted}
                </p>
              </div>

              <div>
                <span className="text-[#8B9AAF] font-medium">Supabase User UUID</span>
                <p className="mt-0.5 font-mono text-[11px] text-[#222C39] bg-[#F3F7FF] p-2 rounded-lg border border-[#E4E9F2] break-all select-all">
                  {user.id}
                </p>
              </div>

              <div>
                <span className="text-[#8B9AAF] font-medium">PostgreSQL Row RLS</span>
                <p className="mt-0.5 text-[11px] text-[#16845B] font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Protected by PostgreSQL RLS (auth.uid() = id)
                </p>
                {profile?.id && (
                  <p className="mt-1 text-[10px] text-[#8B9AAF]">
                    Database Profile: Linked
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* HackSeekho Platform Roadmap Info */}
          <div className="p-4 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-xs text-[#222C39] space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#3565B8]">
              <Sparkles className="h-4 w-4" />
              Phase 1 Milestone Complete
            </div>
            <p className="text-[#8B9AAF] leading-relaxed">
              Your authentication session is active and verified across server cookies and PostgreSQL.
              Stay tuned for live seminars, learning notes, and hackathon registrations!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

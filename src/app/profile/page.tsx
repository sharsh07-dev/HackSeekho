import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/ui/Navbar";
import { ProfileCard } from "@/components/profile/ProfileCard";
import type { Profile } from "@/lib/types/database";

export const metadata = {
  title: "Student Profile",
  description: "View and manage your HackSeekho student profile and active session.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // Validate server-side user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/profile");
  }

  // Fetch persistent user profile from public.profiles table in PostgreSQL
  let initialProfile: Profile | null = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileData) {
    initialProfile = profileData;
  } else {
    // If profile row doesn't exist yet, insert a default one for this authenticated user
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Student";
    const avatarUrl =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;

    const { data: insertedProfile } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (insertedProfile) {
      initialProfile = insertedProfile;
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F7FF] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProfileCard user={user} initialProfile={initialProfile} />
      </main>
      <footer className="border-t border-[#E4E9F2] bg-white py-6 text-center text-xs text-[#8B9AAF]">
        <p>&copy; 2026 HackSeekho. Phase 1 Production Authentication.</p>
      </footer>
    </div>
  );
}

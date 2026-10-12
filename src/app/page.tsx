import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import {
  Trophy,
  Video,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Users,
} from "lucide-react";

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section (Hack2Skill Inspired) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F7FF] via-white to-white py-16 sm:py-24 border-b border-[#E4E9F2]">
        {/* Subtle Decorative Background Element */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#3565B8]/10 via-[#29B7E8]/15 to-transparent blur-3xl pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F7FF] border border-[#E4E9F2] text-xs font-semibold text-[#3565B8] mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#29B7E8]" />
            <span>India&apos;s Student Hackathon &amp; Learning Hub</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#080F2B] max-w-4xl mx-auto leading-[1.15]">
            Empowering Students to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3565B8] via-[#2A5298] to-[#29B7E8]">
              Learn, Build &amp; Compete
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#8B9AAF] max-w-2xl mx-auto leading-relaxed">
            HackSeekho brings together student builders, live masterclasses, curated notes, and
            everything you need to turn college hackathon ideas into real projects.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {user ? (
              <Link href="/profile">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Go to Student Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign in with Email or Google
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-[#E4E9F2]/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-[#3565B8]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#080F2B]">Enterprise Security</p>
                <p className="text-[11px] text-[#8B9AAF]">Supabase Auth &amp; RLS</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-[#29B7E8]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#080F2B]">OAuth 2.0 &amp; Email</p>
                <p className="text-[11px] text-[#8B9AAF]">Google One-Click Sign-in</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-[#16845B]">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#080F2B]">PostgreSQL Stored</p>
                <p className="text-[11px] text-[#8B9AAF]">Persistent User Profiles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080F2B]">
              Designed for the Next Generation of Builders
            </h2>
            <p className="mt-2 text-sm text-[#8B9AAF]">
              Everything you need to level up your hackathon journey under one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#F3F7FF] border border-[#E4E9F2] hover:border-[#3565B8]/30 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-[#3565B8] text-white flex items-center justify-center mb-5 shadow-xs">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#080F2B] mb-2">
                Hackathon Readiness
              </h3>
              <p className="text-xs text-[#8B9AAF] leading-relaxed">
                Structured guides on brainstorming problem statements, building MVPs within 36 hours,
                and pitching to tech judges.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E4E9F2] flex items-center justify-between text-xs font-semibold text-[#3565B8]">
                <span>Coming in Phase 2</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E4E9F2]">Roadmap</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#F3F7FF] border border-[#E4E9F2] hover:border-[#3565B8]/30 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-[#29B7E8] text-white flex items-center justify-center mb-5 shadow-xs">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#080F2B] mb-2">
                Live Web Seminars
              </h3>
              <p className="text-xs text-[#8B9AAF] leading-relaxed">
                Interactive sessions and masterclasses hosted by experienced engineers and hackathon
                winners across India.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E4E9F2] flex items-center justify-between text-xs font-semibold text-[#3565B8]">
                <span>Coming in Phase 2</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E4E9F2]">Roadmap</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#F3F7FF] border border-[#E4E9F2] hover:border-[#3565B8]/30 transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-[#080F2B] text-white flex items-center justify-center mb-5 shadow-xs">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#080F2B] mb-2">
                High-Yield Study Notes
              </h3>
              <p className="text-xs text-[#8B9AAF] leading-relaxed">
                Concise cheat-sheets, system design templates, boilerplate repositories, and API
                guides for rapid hacking.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E4E9F2] flex items-center justify-between text-xs font-semibold text-[#3565B8]">
                <span>Coming in Phase 2</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#E4E9F2]">Roadmap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E4E9F2] bg-[#F8FAFC] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B9AAF]">
          <p>&copy; 2026 HackSeekho. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-[#222C39]">Sign In</Link>
            <Link href="/signup" className="hover:text-[#222C39]">Sign Up</Link>
            <Link href="/forgot-password" className="hover:text-[#222C39]">Forgot Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

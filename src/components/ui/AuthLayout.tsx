import React from "react";
import { BrandWordmark } from "./BrandWordmark";
import { Sparkles, Trophy, BookOpen, Video, Code2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
  badge?: string;
}

export function AuthLayout({
  children,
  heading,
  subheading,
  badge = "Student Tech Ecosystem",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F3F7FF] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Outer Card Container */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl shadow-[#080F2B]/5 border border-[#E4E9F2] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Branded Welcome Showcase (Hack2Skill Inspired) */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-br from-[#080F2B] via-[#0B1433] to-[#1E3A8A] text-white overflow-hidden">
            {/* Abstract Decorative Tech Graphics & Glow */}
            <div
              className="absolute -top-24 -left-24 w-64 h-64 bg-[#29B7E8]/20 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#3565B8]/30 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#29B7E8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
              aria-hidden="true"
            />

            {/* Header in Left Panel */}
            <div className="relative z-10">
              <BrandWordmark size="md" inverted />

              <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#29B7E8]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight leading-snug text-white">
                Your next hackathon starts here.
              </h2>
              <p className="mt-3 text-sm text-[#8B9AAF] leading-relaxed">
                Create your account and start building skills that turn ideas into real projects.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-8 space-y-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-lg bg-[#3565B8]/30 text-[#29B7E8]">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Hackathon Preparedness</h3>
                  <p className="text-[11px] text-[#8B9AAF]">Problem statements, teaming & submissions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-lg bg-[#29B7E8]/20 text-[#29B7E8]">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Live Web Seminars</h3>
                  <p className="text-[11px] text-[#8B9AAF]">Interactive masterclasses with mentors</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="p-2 rounded-lg bg-[#3565B8]/30 text-[#29B7E8]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Structured Study Notes</h3>
                  <p className="text-[11px] text-[#8B9AAF]">High-yield developer roadmaps & cheat sheets</p>
                </div>
              </div>
            </div>

            {/* Bottom Slogan */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#8B9AAF]">
              <span className="font-semibold tracking-wider uppercase text-white/90">
                Learn. Build. Compete.
              </span>
              <div className="flex items-center gap-1.5 text-[#29B7E8]">
                <Code2 className="h-4 w-4" />
                <span className="font-mono text-[11px]">Phase 1</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Authentication Form Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {/* Mobile Brand Wordmark Header */}
            <div className="lg:hidden flex items-center justify-between pb-6 mb-6 border-b border-[#E4E9F2]">
              <BrandWordmark size="sm" />
              <span className="text-[11px] font-semibold text-[#3565B8] bg-[#F3F7FF] px-2.5 py-1 rounded-full border border-[#E4E9F2]">
                Student Auth
              </span>
            </div>

            {/* Form Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#080F2B]">
                {heading}
              </h1>
              {subheading && (
                <p className="mt-1.5 text-sm text-[#8B9AAF] leading-relaxed">
                  {subheading}
                </p>
              )}
            </div>

            {/* Form Body */}
            <div>{children}</div>
          </div>
        </div>
      </div>

      {/* Simple Footer Links */}
      <footer className="mt-8 text-center text-xs text-[#8B9AAF]">
        <p>
          &copy; 2026 HackSeekho. Designed for student developers &amp; hackathons.
        </p>
      </footer>
    </div>
  );
}

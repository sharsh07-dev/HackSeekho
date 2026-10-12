"use client";

import React, { useState } from "react";
import { AlertTriangle, Key, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface ConfigNoticeProps {
  missingFeature?: "supabase" | "google_oauth";
}

export function ConfigNotice({ missingFeature = "supabase" }: ConfigNoticeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6 p-4 rounded-xl border border-[#E09F3E]/40 bg-[#FFFBEB] text-[#92400E] text-xs shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#92400E]">
              {missingFeature === "google_oauth"
                ? "Google OAuth Setup Required"
                : "Supabase Credentials Required in .env.local"}
            </h4>
            <p className="mt-1 text-[#78350F] leading-relaxed">
              {missingFeature === "google_oauth"
                ? "To enable real Google Sign-In, configure the Google Provider in your Supabase Dashboard under Authentication → Providers → Google."
                : "Real Supabase authentication is wired up! To test sign-up, email verification, or login, please configure your Supabase URL & Anon Key in .env.local."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-[#FEF3C7] rounded text-[#B45309] transition-colors shrink-0"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse setup instructions" : "Expand setup instructions"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#FCD34D]/60 space-y-2 text-[#78350F]">
          <div className="font-semibold flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5" />
            Quick Setup Checklist:
          </div>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-normal">
            <li>
              Copy <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">.env.example</code> to{" "}
              <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">.env.local</code>.
            </li>
            <li>
              Obtain your Project URL and Anon/Publishable API Key from your{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium hover:text-[#B45309] inline-flex items-center gap-0.5"
              >
                Supabase Dashboard
                <ExternalLink className="h-3 w-3 inline" />
              </a>
              .
            </li>
            <li>
              Run the SQL script from{" "}
              <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">
                supabase/schema.sql
              </code>{" "}
              in the Supabase SQL Editor.
            </li>
            {missingFeature === "google_oauth" && (
              <li>
                In Supabase, go to <strong>Authentication → Providers → Google</strong>, enable it,
                and paste your Google Client ID & Secret from Google Cloud Console. Set Redirect URI to:{" "}
                <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">
                  https://&lt;your-project&gt;.supabase.co/auth/v1/callback
                </code>
              </li>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Check, X } from "lucide-react";
import { evaluatePasswordStrength } from "@/lib/validation/auth";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { score, label, color, checks } = evaluatePasswordStrength(password);

  const requirementItems = [
    { label: "At least 8 characters", met: checks.length },
    { label: "Uppercase letter (A-Z)", met: checks.hasUppercase },
    { label: "Lowercase letter (a-z)", met: checks.hasLowercase },
    { label: "Number (0-9)", met: checks.hasNumber },
    { label: "Special symbol (!@#$...)", met: checks.hasSpecial },
  ];

  return (
    <div className="w-full mt-2.5 p-3 rounded-xl bg-[#F3F7FF] border border-[#E4E9F2] text-xs">
      <div className="flex items-center justify-between mb-1.5 font-medium">
        <span className="text-[#8B9AAF]">Password Strength:</span>
        <span className="font-semibold" style={{ color }}>
          {label}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              score >= step ? "" : "bg-[#E4E9F2]"
            }`}
            style={{
              backgroundColor: score >= step ? color : undefined,
            }}
          />
        ))}
      </div>

      {/* Checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#222C39]">
        {requirementItems.map((req, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              req.met ? "text-[#16845B] font-medium" : "text-[#8B9AAF]"
            }`}
          >
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-[#16845B] shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-[#8B9AAF] shrink-0" aria-hidden="true" />
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";
import Link from "next/link";

interface BrandWordmarkProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  className?: string;
}

export function BrandWordmark({
  size = "md",
  inverted = false,
  className = "",
}: BrandWordmarkProps) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 32 : 26;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none focus:outline-none focus:ring-2 focus:ring-[#3565B8] focus:ring-offset-2 rounded-lg ${className}`}
      aria-label="HackSeekho Home"
    >
      <div
        className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#080F2B] via-[#3565B8] to-[#29B7E8] text-white shadow-sm transition-transform hover:scale-105"
        style={{ width: iconSize + 10, height: iconSize + 10 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Stylized code brackets with upward graduation/growth arrow */}
          <path
            d="M7.5 7L3.5 12L7.5 17"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 7L20.5 12L16.5 17"
            stroke="#29B7E8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 5L10.5 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span
        className={`${textSize} font-extrabold tracking-tight ${
          inverted ? "text-white" : "text-[#080F2B]"
        }`}
      >
        Hack<span className="text-[#3565B8]">Seekho</span>
      </span>
    </Link>
  );
}

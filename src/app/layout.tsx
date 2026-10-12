import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HackSeekho — Empowering Students to Build, Hack, and Learn",
    template: "%s | HackSeekho",
  },
  description:
    "Production-grade student platform for hackathons, live seminars, masterclasses, and project-based skill building.",
  keywords: ["hackathons", "student developers", "coding", "web seminars", "tech workshops"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#222C39] antialiased">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

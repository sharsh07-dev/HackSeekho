import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .refine(
      (url) => !url.includes("your-project"),
      "Please set a real Supabase URL in .env.local"
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10, "Supabase key is required")
    .refine(
      (key) => !key.includes("your-supabase"),
      "Please set a real Supabase anon/publishable key in .env.local"
    ),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Returns raw environment variables resolving aliases
 */
export function getRawEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: key,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  };
}

/**
 * Validates whether environment variables are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  const raw = getRawEnv();
  const parsed = envSchema.safeParse(raw);
  return parsed.success;
}

/**
 * Gets validated environment configuration or throws an informative error
 */
export function getEnv(): EnvConfig {
  const raw = getRawEnv();
  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(
      `[HackSeekho Env Error] Missing or invalid Supabase credentials: ${errorDetails}. Please configure .env.local.`
    );
  }

  return result.data;
}

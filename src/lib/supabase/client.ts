import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { getRawEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or reuses a singleton Supabase browser client for Client Components.
 * Uses @supabase/ssr cookie storage automatically in browser contexts.
 */
export function createClient() {
  if (typeof window === "undefined") {
    // In SSR execution of client component, create a fresh instance
    const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getRawEnv();
    const url = NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
    const key = NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key-placeholder";
    return createBrowserClient<Database>(url, key);
  }

  if (!browserClient) {
    const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getRawEnv();
    const url = NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
    const key = NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key-placeholder";
    browserClient = createBrowserClient<Database>(url, key);
  }

  return browserClient;
}

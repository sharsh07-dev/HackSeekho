import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";
import { getRawEnv } from "@/lib/env";

/**
 * Creates a Supabase Server Client for Server Components, Server Actions,
 * and Route Handlers with secure cookie persistence.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getRawEnv();

  const url = NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key-placeholder";

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when called from Server Components where response cookies cannot be set directly.
            // Session refreshing is handled by the Proxy (proxy.ts).
          }
        },
      },
    }
  );
}

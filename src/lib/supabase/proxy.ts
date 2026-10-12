import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";
import { getRawEnv } from "@/lib/env";
import { getSafeRedirectUrl } from "@/lib/auth/safe-redirect";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getRawEnv();

  // If Supabase credentials are missing or default, allow through without breaking
  if (
    !NEXT_PUBLIC_SUPABASE_URL ||
    !NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use supabase.auth.getSession() here.
  // getUser() validates the token against the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  // 1. If user is logged in and visits auth pages (login/signup), redirect to intended destination or profile
  if (user && isAuthRoute) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const targetUrl = getSafeRedirectUrl(nextParam, "/profile");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = targetUrl;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  // 2. If unauthenticated user attempts to access protected routes, redirect to login with return path
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

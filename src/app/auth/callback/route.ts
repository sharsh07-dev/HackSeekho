import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectUrl } from "@/lib/auth/safe-redirect";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const error = requestUrl.searchParams.get("error");

  const safeTarget = getSafeRedirectUrl(next, "/profile");

  // Handle provider error callback (e.g., user clicked cancel on Google consent)
  if (error || errorDescription) {
    const errorMsg = errorDescription || error || "Authentication cancelled by user";
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", errorMsg);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", exchangeError.message);
        return NextResponse.redirect(loginUrl);
      }

      // If user session established, ensure public.profiles record is synced
      if (data?.user) {
        const user = data.user;
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          null;
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null;

        // Ensure user profile in database
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        );
      }

      // Check if this was an email verification flow
      const type = requestUrl.searchParams.get("type");
      if (type === "signup" || type === "email_change") {
        const verifiedUrl = new URL("/login", request.url);
        verifiedUrl.searchParams.set("verified", "true");
        return NextResponse.redirect(verifiedUrl);
      }

      // Safe redirect to intended destination
      const redirectDestination = new URL(safeTarget, request.url);
      return NextResponse.redirect(redirectDestination);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to verify authentication token";
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", message);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If no authorization code was present
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "No authorization code provided");
  return NextResponse.redirect(loginUrl);
}

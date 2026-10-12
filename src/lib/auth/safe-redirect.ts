/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Ensures the destination is strictly an internal, relative path.
 *
 * @param url The candidate redirect path
 * @param defaultPath The fallback path if url is invalid (defaults to '/profile')
 * @returns A safe relative path
 */
export function getSafeRedirectUrl(
  url: string | null | undefined,
  defaultPath = "/profile"
): string {
  if (!url || typeof url !== "string") {
    return defaultPath;
  }

  const trimmed = url.trim();

  // Reject empty or purely whitespace
  if (!trimmed) {
    return defaultPath;
  }

  // Must begin with a single forward slash
  if (!trimmed.startsWith("/")) {
    return defaultPath;
  }

  // Reject protocol-relative URLs like "//attacker.com"
  if (trimmed.startsWith("//")) {
    return defaultPath;
  }

  // Reject backslashes which can be abused for URL evasion (e.g. "/\attacker.com")
  if (trimmed.includes("\\")) {
    return defaultPath;
  }

  // Reject URLs containing control characters or whitespace
  if (/[\r\n\t]/.test(trimmed)) {
    return defaultPath;
  }

  // Reject pseudo-protocols embedded in path
  if (/^(https?:|javascript:|data:|vbscript:)/i.test(trimmed.slice(1))) {
    return defaultPath;
  }

  // Verify URL parsing doesn't produce an external origin
  try {
    const dummyBase = "http://localhost:3000";
    const parsed = new URL(trimmed, dummyBase);
    if (parsed.origin !== dummyBase) {
      return defaultPath;
    }
    // Return the pathname + search + hash
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return defaultPath;
  }
}

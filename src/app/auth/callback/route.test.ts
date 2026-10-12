import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { createClient } from "@/lib/supabase/server";

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Auth Callback Route Handler (/auth/callback)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login with error message when provider returns error", async () => {
    const request = new NextRequest(
      "http://localhost:3000/auth/callback?error=access_denied&error_description=User%20cancelled"
    );

    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("error=User+cancelled");
  });

  it("redirects to login when code parameter is missing", async () => {
    const request = new NextRequest("http://localhost:3000/auth/callback");

    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("error=No+authorization+code+provided");
  });

  it("prevents open redirect when malicious next parameter is passed", async () => {
    const mockedClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "test-user-id",
              user_metadata: { full_name: "Test User" },
            },
          },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockedClient as never);

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?code=valid-auth-code&next=https://malicious.com"
    );

    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    // Must fall back to safe default /profile instead of external malicious site
    expect(location).toBe("http://localhost:3000/profile");
  });

  it("exchanges code and redirects to safe internal destination", async () => {
    const mockedClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "test-user-id",
              user_metadata: { full_name: "Test Student" },
            },
          },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockedClient as never);

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?code=valid-auth-code&next=/profile"
    );

    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toBe("http://localhost:3000/profile");
  });
});

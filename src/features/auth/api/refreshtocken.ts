import { setToken } from "@/src/lib/api";

type RefreshResponse = { accessToken: string };

const getBaseUrl = () =>
  (
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001")
  ).trim();

/**
 * Calls POST /auth/refresh with credentials (sends refreshToken cookie).
 * Backend validates cookie, rotates refresh token, returns new accessToken.
 * Uses raw fetch to avoid circular dependency with api.ts.
 * @returns New access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RefreshResponse;
    const token = data?.accessToken ?? null;
    if (token) setToken(token);
    return token;
  } catch {
    return null;
  }
}
import { api, setToken } from "@/src/lib/api";

type RefreshResponse = { accessToken: string };

/**
 * Calls POST /auth/refresh with credentials (sends refreshToken cookie).
 * Backend validates cookie, rotates refresh token, returns new accessToken.
 * @returns New access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const data = await api<RefreshResponse>("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Refresh failure should be handled silently by caller (no forced redirect here)
      disableRedirect: true,
    });
    const token = data?.accessToken ?? null;
    if (token) setToken(token);
    return token;
  } catch {
    return null;
  }
}
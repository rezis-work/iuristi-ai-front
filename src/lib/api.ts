const COOKIE_NAME = "token";
const STORAGE_KEY = "accessToken";

//cookie-ტოკენის წაკიტხვის helper function
function getCookieToken() {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");

  //cookie-ტოკენებს გადაუვლის და ნახავს token თუ ემთხვევა COOKIE_NAME და დააბრუნებს value-ს
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name === COOKIE_NAME) {
      const value = valueParts.join("=");
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem(STORAGE_KEY) as string | null;
  if (!token) {
    token = localStorage.getItem("accsessToken") as string | null;
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.removeItem("accsessToken");
    }
  }
  if (!token) {
    const cookieToken = getCookieToken();
    if (cookieToken) {
      localStorage.setItem(STORAGE_KEY, cookieToken);
      return cookieToken;
    }
  }
  return token;
}

//cookie-დამატება localStorage-დან
export function setToken(token: string, options?: { expiresInDays?: number }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, token);
  setAuthCookie(token, options?.expiresInDays);
}
//cookie-დამატება
export function setAuthCookie(token: string, expiresInDays = 7) {
  if (typeof window === "undefined") return;

  //პროტოკოპის დამატება https-ის შემთხვევაში
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  const expiresDate = new Date();
  expiresDate.setTime(expiresDate.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expiresStr = expiresDate.toUTCString();

  document.cookie = `${COOKIE_NAME}=${token}; Path=/; Expires=${expiresStr}; SameSite=Lax${secure}`;
}

// ამოშლა localStorage-დან და cookie-დან
export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("accsessToken");
  ClearAuthCookie();
}

// cookie-დან ამოშლა
export function ClearAuthCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Path=/; Expires=0; SameSite=Lax `;
}

// BASE_URL env-იდან, თუ არაა – dev-ში default localhost, production-ში relative path
// In production, use relative /api path (nginx will proxy it)
// In development, use localhost:3001
// NEXT_PUBLIC_API_URL should be set at build time via Docker build args

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "/api"
).trim();

/** ტოკენის ვადის შემოწმება – JWT exp claim (წამები). ვადა ამოწურვამდე 5 წუთში refresh. */
function getJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** ტოკენი ვადაგასულა ან 5 წუთში ამოიწურება? */
function tokenExpiresWithinMinutes(token: string, minutes = 5): boolean {
  const exp = getJwtExp(token);
  // If token is not a JWT or exp is unavailable, skip proactive refresh.
  // 401 handler below will still attempt refresh when backend rejects the token.
  if (exp == null) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp <= nowSec + minutes * 60;
}

/** Refresh in-flight – ერთი refresh ერთდროულად. */
let refreshPromise: Promise<string | null> | null = null;

/** ტოკენის პროფილაქტიკური განახლება ვადის ამოწურვამდე. */
async function ensureValidToken(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  if (!tokenExpiresWithinMinutes(token, 5)) return token;

  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const { refreshAccessToken } = await import("@/src/features/auth/api/refreshtocken");
      const newToken = await refreshAccessToken();
      return newToken;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function api<T>(
  path: string,
  options: RequestInit & {
    auth?: boolean;
    disableRedirect?: boolean;
    _skipRefresh?: boolean;
  } = {},
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth) {
    let token = getToken();
    if (!token) {
      // If disableRedirect is set, return a more graceful error that can be handled
      if (options.disableRedirect) {
        throw new Error("Not authenticated");
      }
      if (typeof window !== "undefined") {
        const pathname = window.location?.pathname || "/";
        const isAlreadyOnLogin = pathname.includes("/login");
        if (!isAlreadyOnLogin) {
          const nextPath = pathname + (window.location?.search || "");
          const nextParam = encodeURIComponent(nextPath);
          window.location.replace(`/login?next=${nextParam}`);
        }
      }
      throw new Error("Authentication required. Please log in.");
    }
    if (!options._skipRefresh && typeof window !== "undefined") {
      const freshToken = await ensureValidToken();
      if (freshToken) token = freshToken;
    }
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    //json parse ვცდილობთ და ვიღებთ error message-ს
    const contentType = res.headers.get("content-type");
    let errorMessage: string = "";
    let errorCode: string = "";
    type ApiError = {
      error?: { code?: string } | string;
      code?: string;
      message?: string;
    };
    let errorData: ApiError | null = null;

    if (contentType && contentType.includes("application/json")) {
      try {
        errorData = (await res.json()) as ApiError;
        const err = errorData?.error;
        errorCode =
          (typeof err === "object" && err?.code) ||
          (typeof err === "string" ? err : "") ||
          errorData?.code ||
          "";
        const message =
          errorData?.message ??
          (typeof err === "string" ? err : undefined);
        errorMessage =
          typeof message === "string"
            ? message
            : JSON.stringify(errorData ?? {});
      } catch {
        const text = await res.text();
        errorMessage = text || "";
      }
    } else {
      // თუ JSON parse-მა ვერ მოახერხა, text-ად ვკითხულობთ
      const text = await res.text();
      errorMessage = text || "";
    }
    // თუ HTML-ს გვიბრუნებს (Next-ის 404 გვერდი და ა.შ.), უფრო გასაგები მესიჯი
    if (
      errorMessage &&
      (errorMessage.includes("<!DOCTYPE html>") ||
        errorMessage.includes("<html>"))
    ) {
      throw new Error(
        `API request failed: ${res.status} ${res.statusText}. URL: ${BASE_URL}${path}. Check that your backend is running and the endpoint exists.`,
      );
    }
    if (
      typeof window !== "undefined" &&
      (res as Response).status === 401 &&
      !options.disableRedirect
    ) {
      try {
        // Try refresh token first if this was an auth request and we haven't retried
        if (options.auth && !options._skipRefresh) {
          const { refreshAccessToken } = await import(
            "@/src/features/auth/api/refreshtocken"
          );
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Retry the original request with new token (skip refresh to avoid loop)
            return api<T>(path, {
              ...options,
              _skipRefresh: true,
            });
          }
        }
        // Refresh failed or not applicable: redirect to login if there was a token
        const hadToken = getToken();
        removeToken();
        const pathname = window.location?.pathname || "/";
        const isAlreadyOnLogin = pathname.includes("/login");
        if (hadToken && !isAlreadyOnLogin) {
          const nextPath = pathname + (window.location?.search || "");
          const nextParam = encodeURIComponent(nextPath);
          window.location.replace(`/login?next=${nextParam}`);
        }
      } catch {}
    }

    const error = new Error(
      errorMessage || `Request failed: ${res.status} ${res.statusText}`,
    ) as Error & { code?: string };
    error.code = errorCode;
    throw error;
  }
  // Return empty as any if no body
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as unknown as T;
}

// Form/multipart-friendly API helper (does not set Content-Type)
export async function apiForm<T>(
  path: string,
  options: RequestInit & {
    auth?: boolean;
    disableRedirect?: boolean;
    _skipRefresh?: boolean;
  } = {},
): Promise<T> {
  // Do NOT set Content-Type so the browser can set proper multipart boundary
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (options.auth) {
    let token = getToken();
    if (token && !options._skipRefresh && typeof window !== "undefined") {
      const freshToken = await ensureValidToken();
      if (freshToken) token = freshToken;
    }
    if (token)
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    const message = text || "";

    // Try refresh on 401, then redirect if refresh fails
    if (
      typeof window !== "undefined" &&
      (res as Response).status === 401 &&
      !options.disableRedirect
    ) {
      try {
        if (options.auth && !options._skipRefresh) {
          const { refreshAccessToken } = await import(
            "@/src/features/auth/api/refreshtocken"
          );
          const newToken = await refreshAccessToken();
          if (newToken) {
            return apiForm<T>(path, { ...options, _skipRefresh: true });
          }
        }
        const hadToken = getToken();
        removeToken();
        const pathname = window.location?.pathname || "/";
        const isAlreadyOnLogin = pathname.includes("/login");
        if (hadToken && !isAlreadyOnLogin) {
          const nextPath = pathname + (window.location?.search || "");
          const nextParam = encodeURIComponent(nextPath);
          window.location.replace(`/login?next=${nextParam}`);
        }
      } catch {}
    }

    if (
      message &&
      (message.includes("<!DOCTYPE html>") || message.includes("<html>"))
    ) {
      throw new Error(
        `API request failed: ${res.status} ${res.statusText}. URL: ${BASE_URL}${path}. Check that your backend is running and the endpoint exists.`,
      );
    }
    throw new Error(
      message || `Request failed: ${res.status} ${res.statusText}`,
    );
  }

  // Try JSON; otherwise return undefined
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as unknown as T;
}

// Blob-ის მისაღებად API helper (PDF, images, etc.)
export async function apiBlob(
  path: string,
  options: RequestInit & { auth?: boolean; _skipRefresh?: boolean } = {},
): Promise<Blob | null> {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (options.auth) {
    let token = getToken();
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }
    if (!options._skipRefresh && typeof window !== "undefined") {
      const freshToken = await ensureValidToken();
      if (freshToken) token = freshToken;
    }
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    if (typeof window !== "undefined" && res.status === 401) {
      try {
        if (options.auth && !options._skipRefresh) {
          const { refreshAccessToken } = await import(
            "@/src/features/auth/api/refreshtocken"
          );
          const newToken = await refreshAccessToken();
          if (newToken) {
            return apiBlob(path, { ...options, _skipRefresh: true });
          }
        }
        const hadToken = getToken();
        removeToken();
        const pathname = window.location?.pathname || "/";
        const isAlreadyOnLogin = pathname.includes("/login");
        if (hadToken && !isAlreadyOnLogin) {
          const nextPath = pathname + (window.location?.search || "");
          const nextParam = encodeURIComponent(nextPath);
          window.location.replace(`/login?next=${nextParam}`);
        }
      } catch {}
    }
    const text = await res.text();
    const message = text || "";
    if (
      message &&
      (message.includes("<!DOCTYPE html>") || message.includes("<html>"))
    ) {
      throw new Error(
        `API request failed: ${res.status} ${res.statusText}. URL: ${BASE_URL}${path}. Check that your backend is running and the endpoint exists.`,
      );
    }
    throw new Error(
      message || `Request failed: ${res.status} ${res.statusText}`,
    );
  }

  return await res.blob();
}

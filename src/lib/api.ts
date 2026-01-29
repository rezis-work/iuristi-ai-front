
const COOKIE_NAME ="token"

//cookie-ტოკენის წაკიტხვის helper function
function getCookieToken(){
   if(typeof window === "undefined") return null;
   const cookies = document.cookie.split(";")

   //cookie-ტოკენებს გადაუვლის და ნახავს token თუ ემთხვევა COOKIE_NAME და დააბრუნებს value-ს
   for(const cookie of cookies){
    const [name, value] = cookie.trim().split("=")
    if(name === COOKIE_NAME){
        return decodeURIComponent(value);
    }
   } 
   return null
}

export function getToken(): string | null{
 if(typeof window === "undefined") return null;

 //ჯერ ვიღებთ localStorage-დან token-ს "ვცდილობთ"
 const token = localStorage.getItem("accsessToken") as string | null;

 //თუ ვერ მივიღებთ ვიღებთ cookie-დან token-ს

 if(!token){
    const cookieToken = getCookieToken()
    if(cookieToken){
          // Cookie-დან token-ს localStorage-ში ვწერთ სინქრონიზაციისთვის
        localStorage.setItem("accsessToken", cookieToken);
        return cookieToken
    }
 }
 return token
}

//cookie-დამატება localStorage-დან
export function setToken(token:string){
    if(typeof window === "undefined") return;
    localStorage.setItem("accsessToken", token);
    setAuthCookie(token);

}
//cookie-დამატება
export function setAuthCookie(token:string){
if(typeof window === "undefined") return;

//პროტოკოპის დამატება https-ის შემთხვევაში
const secure = window.location.protocol === "https:" ? "; Secure" : "";

const expires = 7 * 24 * 60 * 60  //7 days in second

document.cookie = `${COOKIE_NAME}=${token}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;

}

// ამოშლა localStorage-დან და cookie-დან
export function removeToken(){
    if(typeof window === "undefined") return;
    localStorage.removeItem("accsessToken");
    ClearAuthCookie();
}

// cookie-დან ამოშლა
export function ClearAuthCookie(){
    if(typeof window === "undefined") return;
    document.cookie = `${COOKIE_NAME}=; Path=/; Expires=0; SameSite=Lax `
}


// BASE_URL env-იდან, თუ არაა – dev-ში default 4000 პორტზე


const BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
  ).trim();
  

  export async function api<T>(
    path:string,
    options: RequestInit & {auth?: boolean; disableRedirect?:boolean} = {}
  ){
const headers:HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
};

if (options.auth) {
    const token = getToken();
    if (!token) {
      // If disableRedirect is set, return a more graceful error that can be handled
      // This is useful for queries that should fail silently when not authenticated
      if (options.disableRedirect) {
        throw new Error("Not authenticated");
      }
      throw new Error("Authentication required. Please log in.");
    }
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  //Ensure path starts with /

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });
  if(!res.ok){
    //json parse ვცდილობთ და ვიღებთ error message-ს
    const contentType = res.headers.get("content-type");
    let errorMessage: string = "";
    
    if(contentType && contentType.includes("application/json")){
        try {
            const errorDate = await res.json()
              // NestJS error format: { message, error, statusCode }
            const message = errorDate?.message || errorDate?.error;
            errorMessage = typeof message === "string" 
              ? message 
              : JSON.stringify(errorDate || {});
        } catch {
            const text = await res.text();
            errorMessage = text || "";
        }
    }
    else{
           // თუ JSON parse-მა ვერ მოახერხა, text-ად ვკითხულობთ
        const text = await res.text();
        errorMessage = text || "";
    }
        // თუ HTML-ს გვიბრუნებს (Next-ის 404 გვერდი და ა.შ.), უფრო გასაგები მესიჯი
    if (errorMessage && (errorMessage.includes("<!DOCTYPE html>") || errorMessage.includes("<html>"))) {
        throw new Error(
          `API request failed: ${res.status} ${res.statusText}. URL: ${BASE_URL}${path}. Check that your backend is running and the endpoint exists.`,
        );
      }
      if (typeof window !== "undefined" && (res as Response).status === 401 && !options.disableRedirect) {
        try {
          // Only force a redirect to login if there WAS a token (session expired).
          // During explicit logout, the token is already cleared, so skip hard reload.
          const hadToken = getToken();
          removeToken();
          const pathname = window.location?.pathname || "/";
          const segments = pathname.split("/").filter(Boolean);
          const localeFromPath = segments[0] || "en";
          const isAlreadyOnLogin =
            segments[1] === "login" || pathname.includes("/login");
          if (hadToken && !isAlreadyOnLogin) {
            const nextParam = encodeURIComponent(pathname);
            window.location.replace(`/${localeFromPath}/login?next=${nextParam}`);
          }
        } catch {}
      }
      
      throw new Error(
        errorMessage || `Request failed: ${res.status} ${res.statusText}`,
      );
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
  options: RequestInit & { auth?: boolean; disableRedirect?: boolean } = {},
): Promise<T> {
  // Do NOT set Content-Type so the browser can set proper multipart boundary
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = getToken();
    if (token)
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    const message = text || "";
    
    // Only redirect on 401 if disableRedirect is not set and there was a token (session expired)
    if (typeof window !== "undefined" && (res as Response).status === 401 && !options.disableRedirect) {
      try {
        const hadToken = getToken();
        removeToken();
        const pathname = window.location?.pathname || "/";
        const segments = pathname.split("/").filter(Boolean);
        const localeFromPath = segments[0] || "en";
        const isAlreadyOnLogin =
          segments[1] === "login" || pathname.includes("/login");
        if (hadToken && !isAlreadyOnLogin) {
          const nextParam = encodeURIComponent(pathname);
          window.location.replace(`/${localeFromPath}/login?next=${nextParam}`);
        }
      } catch {}
    }
    
    if (message && (message.includes("<!DOCTYPE html>") || message.includes("<html>"))) {
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
  options: RequestInit & { auth?: boolean } = {},
): Promise<Blob | null> {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (typeof window !== "undefined" && res.status === 401) {
      try {
        const hadToken = getToken();
        removeToken();
        const pathname = window.location?.pathname || "/";
        const segments = pathname.split("/").filter(Boolean);
        const localeFromPath = segments[0] || "en";
        const isAlreadyOnLogin =
          segments[1] === "login" || pathname.includes("/login");
        if (hadToken && !isAlreadyOnLogin) {
          const nextParam = encodeURIComponent(pathname);
          window.location.replace(`/${localeFromPath}/login?next=${nextParam}`);
        }
      } catch {}
    }
    const text = await res.text();
    const message = text || "";
    if (message && (message.includes("<!DOCTYPE html>") || message.includes("<html>"))) {
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

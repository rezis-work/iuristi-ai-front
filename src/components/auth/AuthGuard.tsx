"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGetMe } from "@/src/features/user-account/profile/hooks/profile-api";

/** Redirects to login when user is not authenticated. Use for protected routes like /me/* */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profileMe, isLoading } = useGetMe();

  useEffect(() => {
    if (isLoading) return;
    if (!profileMe) {
      const nextPath = pathname + (typeof window !== "undefined" ? window.location.search : "");
      const nextParam = encodeURIComponent(nextPath);
      window.location.replace(`/login?next=${nextParam}`);
    }
  }, [profileMe, isLoading, pathname]);

  if (isLoading)
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff9D4D]/50 border-t-[#ff9D4D]" />
      </div>
    );

  if (!profileMe) return null;

  return <>{children}</>;
}

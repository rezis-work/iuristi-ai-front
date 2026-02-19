import { useGetMe } from "@/src/features/user-account/profile/hooks/profile-api";

/** Re-export useGetMe - same cache for profile/avatar across the app (LoginCard, sidebar, profile page) */
export function useMe() {
  return useGetMe();
}

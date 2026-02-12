import { useQuery } from "@tanstack/react-query";
import { GetMe } from "../api/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await GetMe();
        return response;
      } catch (error) {
        console.log("failed to fetch me", error);
        return null;
      }
    },
    staleTime: 0, // Always stale, refetch on invalidation
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
  });
}

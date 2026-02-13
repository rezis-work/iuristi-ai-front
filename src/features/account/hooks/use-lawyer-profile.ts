import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getLawyerProfile,
  upsertLawyerProfile,
  type UpsertLawyerProfileResponse,
} from "../api/lawyer-profile";
import type { UpsertLawyerProfileInput } from "../schemas/lawyer-profile.schema";

/**
 * Hook for getting lawyer profile
 */
export function useLawyerProfile(orgId: string | null) {
  return useQuery({
    queryKey: ["lawyerProfile", orgId],
    queryFn: () => {
      if (!orgId) {
        throw new Error("Organization ID required");
      }
      return getLawyerProfile(orgId);
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook for upserting lawyer profile
 */
export function useUpsertLawyerProfile(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertLawyerProfileInput) => {
      if (!orgId) throw new Error("Organization ID required");
      return upsertLawyerProfile(orgId, data);
    },
    onSuccess: (data) => {
      toast.success("Lawyer profile updated successfully");
      if (orgId) {
        // Invalidate and refetch lawyer profile
        queryClient.invalidateQueries({ queryKey: ["lawyerProfile", orgId] });
        queryClient.refetchQueries({ queryKey: ["lawyerProfile", orgId] });
      }
    },
    onError: (error: Error) => {
      const err = error as Error & { code?: string };
      let errorMessage = error.message || "Failed to update lawyer profile";

      toast.error(errorMessage);
    },
  });
}

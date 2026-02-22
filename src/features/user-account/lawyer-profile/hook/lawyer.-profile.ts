import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileMe, updateLawyer } from "../api/layer-profile";
import type { UpsertProfileInput } from "../schemas/lawyer-schema";
import { useGetOrgs } from "@/src/features/user-account/orgs/hooks/orgs";

export function useLawyerProfile() {
  const { data: orgs, isLoading: isOrgsLoading } = useGetOrgs();
  const orgId = orgs?.[0]?.id ?? null;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["lawyer-profile", orgId],
    queryFn: () => profileMe(orgId!),
    staleTime: 5 * 60 * 1000,
    enabled: !!orgId,
  });

  // Normalize null to undefined for components expecting LawyerProfileResponce | undefined
  const lawyerProfile = data ?? undefined;

  return { lawyerProfile, isLoading, isFetching, isError, error, orgId, isOrgsLoading };
}


export function useUpdateLawyerProfile(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-lawyer", orgId],
    mutationFn: (data: UpsertProfileInput) => updateLawyer(orgId!, data),
    onSuccess: (data) => {
      if (orgId) {
        queryClient.setQueryData(["lawyer-profile", orgId], data);
      }
      queryClient.invalidateQueries({ queryKey: ["lawyer-profile", orgId] });
      toast.success("Lawyer profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lawyer profile");
    },
  });
}
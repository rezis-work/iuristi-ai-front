import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserOrgs,
  createOrg,
  updateOrg,
  deleteLogo,
  type UserOrgResponse,
  type CreateOrgRequest,
  type PatchOrgRequest,
  type OrgWithMembership,
  type OrgResponse,
} from "../api/orgs";

/**
 * Hook for fetching user's organizations
 */
export function useMyOrgs() {
  return useQuery({
    queryKey: ["organizations", "me"],
    queryFn: () => getUserOrgs(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a new organization
 */
export function useCreateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrgRequest) => createOrg(data),
    onSuccess: () => {
      // Invalidate and refetch organizations list
      queryClient.invalidateQueries({ queryKey: ["organizations", "me"] });
      toast.success("Organization created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create organization");
    },
  });
}

/**
 * Hook for updating an organization
 */
export function useUpdateOrg(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchOrgRequest) => {
      if (!orgId) {
        throw new Error("Organization ID is required");
      }
      return updateOrg(orgId, data);
    },
    onSuccess: () => {
      // Invalidate organizations list to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["organizations", "me"] });
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ["organizations", orgId] });
      }
      toast.success("Organization updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update organization");
    },
  });
}

/**
 * Hook for deleting organization logo
 */
export function useDeleteLogo(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!orgId) {
        throw new Error("Organization ID is required");
      }
      return deleteLogo(orgId);
    },
    onSuccess: () => {
      // Invalidate organizations list to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["organizations", "me"] });
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ["organizations", orgId] });
      }
      toast.success("Logo deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete logo");
    },
  });
}

export type { UserOrgResponse, OrgWithMembership, OrgResponse };


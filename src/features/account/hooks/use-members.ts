import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listMembers,
  updateMemberRole,
  removeMember,
  type MemberResponse,
} from "../api/members";
import type { UpdateMemberRoleInput } from "../schemas/members.schema";

/**
 * Hook for listing members of an organization
 */
export function useListMembers(orgId: string | null) {
  return useQuery({
    queryKey: ["members", orgId],
    queryFn: () => {
      if (!orgId) {
        throw new Error("Organization ID required");
      }
      return listMembers(orgId);
    },
    enabled: !!orgId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating a member's role
 */
export function useUpdateMemberRole(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateMemberRoleInput;
    }) => {
      if (!orgId) throw new Error("Organization ID required");
      return updateMemberRole(orgId, userId, data);
    },
    onSuccess: (data) => {
      toast.success(`Member role updated to ${data.role}`);
      if (orgId) {
        // Invalidate and refetch members list
        queryClient.invalidateQueries({ queryKey: ["members", orgId] });
        queryClient.refetchQueries({ queryKey: ["members", orgId] });
      }
    },
    onError: (error: Error) => {
      const err = error as Error & { code?: string };
      let errorMessage = error.message || "Failed to update member role";

      if (err.code === "LAST_OWNER_PROTECTION") {
        errorMessage =
          "Cannot change role of the last owner. The organization must have at least one owner.";
      }

      toast.error(errorMessage);
    },
  });
}

/**
 * Hook for removing a member from an organization
 */
export function useRemoveMember(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!orgId) throw new Error("Organization ID required");
      return removeMember(orgId, userId);
    },
    onSuccess: () => {
      toast.success("Member removed successfully");
      if (orgId) {
        // Invalidate and refetch members list
        queryClient.invalidateQueries({ queryKey: ["members", orgId] });
        queryClient.refetchQueries({ queryKey: ["members", orgId] });
      }
    },
    onError: (error: Error) => {
      const err = error as Error & { code?: string };
      let errorMessage = error.message || "Failed to remove member";

      if (err.code === "LAST_OWNER_PROTECTION") {
        errorMessage =
          "Cannot remove the last owner. The organization must have at least one owner.";
      }

      toast.error(errorMessage);
    },
  });
}

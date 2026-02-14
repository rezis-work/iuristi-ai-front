import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createInvite,
  acceptInvite,
  listInvites,
  revokeInvite,
  createInviteLink,
  previewInvite,
  type CreateInviteRequest,
  type InviteListItem,
  type InviteLinkResponse,
  type InvitePreviewResponse,
} from "../api/invites";

/**
 * Hook for listing invites for an organization
 */
export function useListInvites(orgId: string | null) {
  return useQuery({
    queryKey: ["invites", orgId],
    queryFn: () => {
      if (!orgId) {
        throw new Error("Organization ID required");
      }
      return listInvites(orgId);
    },
    enabled: !!orgId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating an invite
 */
export function useCreateInvite(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInviteRequest) => {
      if (!orgId) throw new Error("Organization ID required");
      return createInvite(orgId, data);
    },
    onSuccess: (data) => {
      toast.success(`Invite sent to ${data.email}`);
      if (orgId) {
        // Invalidate and refetch invites list
        queryClient.invalidateQueries({ queryKey: ["invites", orgId] });
        queryClient.refetchQueries({ queryKey: ["invites", orgId] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create invite");
    },
  });
}

/**
 * Hook for accepting an invite
 */
export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onSuccess: (data) => {
      toast.success(`Successfully joined ${data.org.name}`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["membership"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept invite");
    },
  });
}

/**
 * Hook for revoking an invite
 */
export function useRevokeInvite(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => {
      if (!orgId) throw new Error("Organization ID required");
      return revokeInvite(orgId, inviteId);
    },
    onSuccess: () => {
      toast.success("Invite revoked successfully");
      if (orgId) {
        // Invalidate and refetch invites list
        queryClient.invalidateQueries({ queryKey: ["invites", orgId] });
        queryClient.refetchQueries({ queryKey: ["invites", orgId] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to revoke invite");
    },
  });
}

/**
 * Hook for creating an invite link
 */
export function useCreateInviteLink(orgId: string | null) {
  return useMutation({
    mutationFn: (data: CreateInviteRequest) => {
      if (!orgId) throw new Error("Organization ID required");
      return createInviteLink(orgId, data);
    },
    onSuccess: (data) => {
      toast.success("Invite link created successfully");
      // Copy to clipboard
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(data.inviteUrl);
        toast.success("Link copied to clipboard");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create invite link");
    },
  });
}

/**
 * Hook for previewing invite details
 */
export function usePreviewInvite(token: string | null) {
  return useQuery({
    queryKey: ["invite-preview", token],
    queryFn: () => {
      if (!token) {
        throw new Error("Invite token required");
      }
      return previewInvite(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

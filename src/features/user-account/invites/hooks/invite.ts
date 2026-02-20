import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getInvites,
  acceptInvite,
  inviteList,
  getInvitePreview,
  getInviteList,
  deleteInvite,
} from "../api/invite";
import type { CreateInviteInput } from "../schemas/invite-schema";
import type { AcceptInviteInput, CreateInviteLinkInput } from "../../members/schemas/memebers-schema";

export const INVITES_QUERY_KEY = ["invites"] as const;

export function useGetInviteList(orgId: string) {
  return useQuery({
    queryKey: [...INVITES_QUERY_KEY, orgId],
    enabled: !!orgId,
    queryFn: () => getInviteList(orgId),
  });
}

export function useGetInvitePreview(token: string) {
  return useQuery({
    queryKey: [...INVITES_QUERY_KEY, "preview", token],
    enabled: !!token?.trim(),
    queryFn: () => getInvitePreview(token),
  });
}

export function useCreateInvite(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInviteInput) => getInvites(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INVITES_QUERY_KEY, orgId] });
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
      toast.success("Invite created. Copy and share the link below with the invited person.");
    },
    onError: (error: Error) => {
      const msg = error?.message?.trim();
      toast.error(msg && msg.length < 120 ? msg : "Failed to create invite");
    },
  });
}

export function useCreateInviteLink(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInviteLinkInput) => inviteList(data, orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INVITES_QUERY_KEY, orgId] });
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
      toast.success("Invite link created");
    },
    onError: () => {
      toast.error("Failed to create invite link");
    },
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AcceptInviteInput) => acceptInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-orgs"] });
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
      toast.success("Invite accepted");
    },
    onError: () => {
      toast.error("Failed to accept invite");
    },
  });
}

export function useDeleteInvite(orgId: string, inviteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteInvite(orgId, inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...INVITES_QUERY_KEY, orgId] });
      queryClient.invalidateQueries({ queryKey: ["members", orgId] });
      toast.success("Invite revoked");
    },
    onError: () => {
      toast.error("Failed to revoke invite");
    },
  });
}

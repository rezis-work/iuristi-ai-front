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
      toast.success("მოწვევა შეიქმნა. დააკოპირე ქვემოთ მოცემული ბმული და გაუზიარე მოწვეულ პირს.");
    },
    onError: (error: Error) => {
      const msg = error?.message?.trim();
      toast.error(msg && msg.length < 120 ? msg : "მოწვევის შექმნა ვერ მოხერხდა");
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
      toast.success("მოწვევის ბმული შეიქმნა");
    },
    onError: () => {
      toast.error("მოწვევის ბმულის შექმნა ვერ მოხერხდა");
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
      toast.success("მოწვევა მიღებულია");
    },
    onError: () => {
      toast.error("მოწვევის მიღება ვერ მოხერხდა");
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
      toast.success("მოწვევა გაუქმდა");
    },
    onError: () => {
      toast.error("მოწვევის გაუქმება ვერ მოხერხდა");
    },
  });
}

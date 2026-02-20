import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMembers, removeMember, updateMemberRole } from "../api/memebers";
import { UpdateMemberRoleInput } from "../schemas/memebers-schema";
import { toast } from "sonner";


export function useGetMembers(orgId: string) {
    return useQuery({
        queryKey: ['members', orgId],
        enabled: !!orgId,
        queryFn: async () => {
            try {
                const members = await getMembers(orgId);
                return members;
            } catch (error) {
                console.log("Failed to get members", error);
                throw error;
            }
        },
    });
}


export function useUpdateMemberRole(orgId: string, userId:string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateMemberRoleInput) => {
            try {
                const response = await updateMemberRole(orgId, userId, data);
                return response;
            } catch (error) {
                console.log("Failed to update member role", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', orgId] });
            toast.success("Member role updated successfully");
        },
        onError: (error) => {
            console.log("Failed to update member role", error);
            toast.error("Failed to update member role");
        },
    });
}


export function useRemoveMember(orgId: string, userId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            try {
                await removeMember(orgId, userId);
            } catch (error) {
                console.log("Failed to remove member", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', orgId] });
            toast.success("Member removed successfully");
        },
        onError: (error) => {
            console.log("Failed to remove member", error);
            toast.error("Failed to remove member");
        },
    });
}
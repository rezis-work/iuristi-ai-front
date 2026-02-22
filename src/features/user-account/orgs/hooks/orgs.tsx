import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrgs, getOrg, orgsCreate, updateOrgs } from "../api/orgs";
import type { UserOrgItem } from "../api/orgs";
import type { CreateOrgSchema } from "../schemas/orgs-schema";
import { toast } from "sonner";

export function useCreateOrgs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-org"],
    mutationFn: (data: CreateOrgSchema) => orgsCreate(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-orgs"] });
      toast.success("your organisation created successully");
    },
    onError:() => {
        toast.error("failed to create organisation")
    }
  });
}


export function useGetOrgs() {
  return useQuery({
    queryKey: ["get-orgs"],
    queryFn: getOrg,
  });
}


export function useUpdateOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-orgs"],
    mutationFn: async ({ id, data }: { id: string; data: CreateOrgSchema }) =>
      updateOrgs(id, data),
    onSuccess: (_updatedOrg, { id, data }) => {
      queryClient.setQueryData<UserOrgItem[]>(["get-orgs"], (old) => {
        if (!old) return old;
        return old.map((org) =>
          org.id === id ? { ...org, name: data.name, type: data.type } : org
        );
      });
      toast.success("your organisation updated successully");
    },
    onError: () => {
      toast.error("failed to update organisation");
    },
  });
}

export function useDeleteOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-orgs"],
    mutationFn: async (id: string) => deleteOrgs(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-orgs"] });
      toast.success("your organisation deleted successfully");
    },
    onError: (error: unknown) => {
      const msg = (error as Error)?.message ?? "";
      if (msg.includes("404")) {
        toast.error(
          "Delete organisation unavailable. Backend needs DELETE /orgs/:id endpoint."
        );
      } else {
        toast.error("failed to delete organisation");
      }
    },
  });
}
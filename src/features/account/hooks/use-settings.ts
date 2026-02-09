import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../api/settings";
import { toast } from "sonner";
import type { UpdateSettingsSchema } from "../schemas/settings-schema";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const response = await getSettings();
        return response;
      } catch (error) {
        console.log("Failed to fetch settings", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsSchema) => updateSettings(data),
    onSuccess: (updatedData) => {
      // Update cache with new data
      queryClient.setQueryData(["settings"], updatedData);
      toast.success("Settings updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}

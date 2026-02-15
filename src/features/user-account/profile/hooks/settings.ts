import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSettings } from "../api/settings";
import type { UpdateSettingsSchema } from "../schemas/settings-schema";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

type UseUpdateSettingsOptions = {
  messages?: {
    success?: string;
    error?: string;
  };
};

export function useUpdateSettings(options?: UseUpdateSettingsOptions) {
  const queryClient = useQueryClient();
  const successMsg = options?.messages?.success ?? "Settings updated successfully";
  const errorMsg = options?.messages?.error ?? "Failed to save settings";

  return useMutation({
    mutationKey: ["update-settings"],
    mutationFn: (data: UpdateSettingsSchema) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success(successMsg);
    },
    onError: () => {
      toast.error(errorMsg);
    },
  });
}

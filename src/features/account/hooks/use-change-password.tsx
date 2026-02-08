import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangePasswordSchema } from "../schemas/change-password-schema";
import { changePassword } from "../api/change-password";

export function useChangePassword() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ChangePasswordSchema) => {
      return await changePassword(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Password changed successfully");
      router.push("/me/profile");
    },
    onError: (error: Error | unknown) => {
      const message = error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    },
  });
}

import { passwordSchema } from "@/src/features/auth/schemas/password-reset-schemas";
import { z } from "zod";


export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  })
  .refine(
    (data) => data.newPassword !== data.currentPassword,
    {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }
  );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;


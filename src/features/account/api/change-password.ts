import { api } from "@/src/lib/api";
import { ChangePasswordSchema } from "../schemas/change-password-schema";

export async function changePassword(data: ChangePasswordSchema) {
  try {
    const { confirmPassword, ...payload } = data; // confirmPassword backend-ს არ სჭირდება
    const response = await api<{ changed: boolean }>("/auth/password/change", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true, // უნდა გააგზავნო auth:true, რომ token დაერთოს
    });
    return response;
  } catch (error) {
    console.log("Failed to change password", error);
    throw error;
  }
}

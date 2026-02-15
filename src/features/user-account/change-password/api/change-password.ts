import { api } from "@/src/lib/api";
import { ChangePasswordInput } from "../schemas/passwordChnage-schema";


export async function changePassword(data: ChangePasswordInput) {
  try {
    const response = await api<ChangePasswordInput>("/auth/password/change", {
        method: 'POST',
        body: JSON.stringify(data),
        auth:true
    })
    return response

 } catch (error) {
    console.error("Failed to change password", error);
    throw error;
  }
}   
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordInput } from "../schemas/passwordChnage-schema";
import { changePassword } from "../api/change-password";
import { toast } from "sonner";


export function usePasswordChange(){
    
    return useMutation({
      mutationKey: ["password-change"],
      mutationFn: async(data:ChangePasswordInput) => {
        const responce = await changePassword(data)
        return responce
      },
      onSuccess:()=> {
        toast.success("password changed successfully")
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to change password");
      },
    })
}
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
        toast.success("პაროლი წარმატებით შეიცვალა")
      },
      onError: (error) => {
        toast.error(error?.message || "პაროლის შეცვლა ვერ მოხერხდა");
      },
    })
}
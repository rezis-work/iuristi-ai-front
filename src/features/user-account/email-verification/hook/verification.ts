import { toast } from 'sonner';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmVerificationInput, RequestVerificationInput } from "../schemas/verification-schema";
import { confirmVerification, requestVerification } from "../api/verification";

export function useRequestVerification() {
    return useMutation({
        mutationKey: ["request-verification"],
        mutationFn: async (input: RequestVerificationInput) => {
            return requestVerification(input);
        },
        onSuccess: () => {
            toast.success("დადასტურების ელფოსტა წარმატებით გაიგზავნა");
        },
        onError: () => {
            toast.error("დადასტურების ელფოსტის გაგზავნა ვერ მოხერხდა");
        },
    });
}

export function useVerifyEmail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["verify-email"],
        mutationFn: async (input: ConfirmVerificationInput) => {
            return confirmVerification(input);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
            toast.success("ელფოსტა წარმატებით დადასტურდა");
        },
        onError: () => {
            toast.error("ელფოსტის დადასტურება ვერ მოხერხდა");
        },
    });
}
import { api } from "@/src/lib/api";
import { ConfirmVerificationInput, RequestVerificationInput } from "../schemas/verification-schema";


export async function requestVerification(input: RequestVerificationInput) {
    const response = await api<RequestVerificationInput>("/auth/verify-email/request", {
        method: "POST",
        body: JSON.stringify(input),
        auth: true,
    });
    return response;
}



export async function confirmVerification(input: ConfirmVerificationInput) {
    const response = await api<ConfirmVerificationInput>("/auth/verify-email/confirm", {
        method: "POST",
        body: JSON.stringify(input),
        auth: true,
    });
    return response;
}
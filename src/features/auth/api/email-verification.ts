import { api } from "@/src/lib/api";

// Email Verification Request Response
export interface EmailVerificationRequestResponse {
  sent: boolean;
}

// Email Verification Confirm Response
export interface EmailVerificationConfirmResponse {
  verified: boolean;
}

// Confirm Email Verification Data
export interface ConfirmEmailVerificationData {
  token: string;
}

/**
 * Request email verification - sends verification email to authenticated user
 * @returns Promise with sent status
 */
export async function requestEmailVerification() {
  try {
    const response = await api<EmailVerificationRequestResponse>(
      "/auth/verify-email/request",
      {
        method: "POST",
        body: JSON.stringify({}),
        auth: true, // Requires authentication
      },
    );

    // Log success
    if (response?.sent) {
      console.log("✅ Email verification sent");
    }

    return response;
  } catch (error) {
    console.log("Failed to request email verification", error);
    throw error;
  }
}

/**
 * Confirm email verification with token
 * @param data - Object containing verification token
 * @returns Promise with verified status
 */
export async function confirmEmailVerification(
  data: ConfirmEmailVerificationData,
) {
  try {
    const response = await api<EmailVerificationConfirmResponse>(
      "/auth/verify-email/confirm",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // Log success
    if (response?.verified) {
      console.log("✅ Email verified successfully");
    }

    return response;
  } catch (error) {
    console.log("Failed to confirm email verification", error);
    throw error;
  }
}

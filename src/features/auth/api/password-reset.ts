import { api } from "@/src/lib/api";

// Password Reset Request Response
export interface PasswordResetRequestResponse {
  sent: boolean;
}

// Password Reset Confirm Response
export interface PasswordResetConfirmResponse {
  reset: boolean;
}

// Request Password Reset Schema
export interface RequestPasswordResetData {
  email: string;
}

// Confirm Password Reset Schema
export interface ConfirmPasswordResetData {
  token: string;
  newPassword: string;
}

/**
 * Request password reset - sends reset email to user
 * @param data - Object containing user email
 * @returns Promise with sent status
 */
export async function requestPasswordReset(data: RequestPasswordResetData) {
  try {
    const response = await api<PasswordResetRequestResponse>(
      "/auth/password-reset/request",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // Log success
    if (response?.sent) {
      console.log("✅ Password reset email sent to:", data.email);
    }

    return response;
  } catch (error) {
    console.log("Failed to request password reset", error);
    throw error;
  }
}

/**
 * Confirm password reset with token and new password
 * @param data - Object containing reset token and new password
 * @returns Promise with reset status
 */
export async function confirmPasswordReset(data: ConfirmPasswordResetData) {
  try {
    const response = await api<PasswordResetConfirmResponse>(
      "/auth/password-reset/confirm",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // Log success
    if (response?.reset) {
      console.log("✅ Password reset successful");
    }

    return response;
  } catch (error) {
    console.log("Failed to confirm password reset", error);
    throw error;
  }
}

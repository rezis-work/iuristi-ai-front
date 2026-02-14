import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  requestPasswordReset,
  confirmPasswordReset,
} from "../api/password-reset";
import {
  RequestPasswordResetSchema,
  ConfirmPasswordResetSchema,
} from "../schemas/password-reset-schemas";

/**
 * Hook for requesting password reset
 * Sends password reset email to user
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (data: RequestPasswordResetSchema) => {
      const response = await requestPasswordReset(data);
      return response;
    },
    onSuccess: (data, variables) => {
      if (data?.sent) {
        toast.success("Password reset email sent!", {
          description: `We've sent a reset link to ${variables.email}. Please check your inbox and spam folder.`,
        });
      }
    },
    onError: (error: Error | unknown) => {
      // Error is already parsed by the api() function
      // It has the format: new Error(message) with error.code property
      const apiError = error as Error & { code?: string };
      const errorCode = apiError?.code;
      const errorMessage = apiError?.message;

      // Log only unexpected errors (not handled error codes)
      const isHandledError =
        errorCode === "RATE_LIMITED" ||
        errorCode === "PASSWORD_RESET_COOLDOWN" ||
        errorCode === "PASSWORD_RESET_DAILY_LIMIT" ||
        errorMessage?.includes("user doesn't exist") ||
        errorMessage?.includes("not found");

      if (!isHandledError) {
        console.error("Unexpected password reset request error:", error);
      }

      // Handle specific error codes from the backend
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "PASSWORD_RESET_COOLDOWN") {
        toast.error("Please wait", {
          description: errorMessage || "Before requesting another reset email.",
        });
      } else if (errorCode === "PASSWORD_RESET_DAILY_LIMIT") {
        toast.error("Daily limit reached", {
          description: errorMessage || "Please try again tomorrow.",
        });
      } else if (
        errorMessage?.includes("user doesn't exist") ||
        errorMessage?.includes("not found")
      ) {
        // Security: Don't reveal if email exists or not
        toast.error("Email not found", {
          description:
            "If this email is registered, you'll receive a reset link shortly.",
        });
      } else {
        toast.error("Failed to send reset email", {
          description: errorMessage || "Please try again later.",
        });
      }
    },
  });
}

/**
 * Hook for confirming password reset
 * Updates password using reset token
 */
export function useConfirmPasswordReset() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ConfirmPasswordResetSchema) => {
      // Remove confirmPassword field before sending to API
      // The backend only expects token and newPassword
      const { confirmPassword, ...resetData } = data;
      const response = await confirmPasswordReset(resetData as any);
      return response;
    },
    onSuccess: () => {
      toast.success("Password reset successful!", {
        description: "You can now log in with your new password.",
      });

      // Redirect to login after a short delay to let user see the success message
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
    onError: (error: Error | unknown) => {
      // Error is already parsed by the api() function
      // It has the format: new Error(message) with error.code property
      const apiError = error as Error & { code?: string };
      const errorCode = apiError?.code;
      const errorMessage = apiError?.message;

      // Log only unexpected errors (not handled error codes)
      const isHandledError =
        errorCode === "RATE_LIMITED" ||
        errorCode === "INVALID_TOKEN" ||
        errorMessage?.includes("password") ||
        errorMessage?.includes("ValidationError");

      if (!isHandledError) {
        console.error("Unexpected password reset confirmation error:", error);
      }

      // Handle specific error codes from the backend
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "INVALID_TOKEN") {
        toast.error("Invalid or expired reset link", {
          description: "Please request a new password reset.",
        });
      } else if (
        errorMessage?.includes("password") &&
        errorMessage?.includes("match")
      ) {
        toast.error("Passwords don't match", {
          description: "Please ensure both password fields match.",
        });
      } else if (errorMessage?.includes("ValidationError")) {
        toast.error("Invalid password", {
          description:
            "Password must be at least 8 characters with a letter and number.",
        });
      } else {
        toast.error("Failed to reset password", {
          description:
            errorMessage || "Please try again or request a new reset link.",
        });
      }
    },
  });
}

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
        toast.success("✉️ Email sent!", {
          description: `Check your inbox at ${variables.email} for the reset link. It expires in 30 minutes.`,
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
        toast.error("🔒 Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "PASSWORD_RESET_COOLDOWN") {
        toast.error("⏳ Please wait", {
          description: "You can request another reset email in a moment.",
        });
      } else if (errorCode === "PASSWORD_RESET_DAILY_LIMIT") {
        toast.error("📅 Daily limit reached", {
          description: "You've reached the limit for today. Please try again tomorrow.",
        });
      } else if (
        errorMessage?.includes("user doesn't exist") ||
        errorMessage?.includes("not found")
      ) {
        // Security: Don't reveal if email exists or not
        toast.success("✓ Check your email", {
          description:
            "If this email is registered, you'll receive a reset link shortly.",
        });
      } else {
        toast.error("❌ Couldn't send reset email", {
          description: "Please check your email and try again later.",
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
      toast.success("🎉 Password reset successfully!", {
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
        toast.error("🔒 Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "INVALID_TOKEN") {
        toast.error("🔗 Invalid reset link", {
          description: "This link has expired. Please request a new password reset.",
        });
      } else if (
        errorMessage?.includes("password") &&
        errorMessage?.includes("match")
      ) {
        toast.error("🔐 Passwords don't match", {
          description: "Please make sure both passwords are identical.",
        });
      } else if (errorMessage?.includes("ValidationError")) {
        toast.error("⚠️ Invalid password", {
          description:
            "Password must be 8+ characters with at least one letter and number.",
        });
      } else {
        toast.error("❌ Couldn't reset password", {
          description:
            "Something went wrong. Please try again or request a new reset link.",
        });
      }
    },
  });
}

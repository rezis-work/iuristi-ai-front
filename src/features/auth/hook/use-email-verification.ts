import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  requestEmailVerification,
  confirmEmailVerification,
} from "../api/email-verification";
import {
  RequestEmailVerificationSchema,
  ConfirmEmailVerificationSchema,
} from "../schemas/email-verification-schemas";

/**
 * Hook for requesting email verification
 * Sends verification email to authenticated user
 */
export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: async (data: RequestEmailVerificationSchema) => {
      try {
        const response = await requestEmailVerification();
        return response;
      } catch (error) {
        console.error("Failed in request email verification hook", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data?.sent) {
        toast.success("Verification email sent!", {
          description:
            "Please check your inbox and click the verification link.",
        });
      }
    },
    onError: (error: Error | unknown) => {
      console.error("Email verification request error:", error);

      // Error is already parsed by the api() function
      // It has the format: new Error(message) with error.code property
      const apiError = error as Error & { code?: string };
      const errorCode = apiError?.code;
      const errorMessage = apiError?.message;

      // Handle specific error codes from the backend
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "VERIFICATION_COOLDOWN") {
        toast.error("Please wait", {
          description:
            errorMessage || "Before requesting another verification email.",
        });
      } else if (errorCode === "VERIFICATION_DAILY_LIMIT") {
        toast.error("Daily limit reached", {
          description: errorMessage || "Please try again tomorrow.",
        });
      } else {
        toast.error("Failed to send verification email", {
          description: errorMessage || "Please try again later.",
        });
      }
    },
  });
}

/**
 * Hook for confirming email verification
 * Verifies email address using token from email link
 */
export function useConfirmEmailVerification() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: ConfirmEmailVerificationSchema) => {
      try {
        const response = await confirmEmailVerification(data);
        return response;
      } catch (error) {
        console.error("Failed in confirm email verification hook", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Email verified successfully!", {
        description: "Your email has been confirmed.",
      });

      // Invalidate user query to update emailVerifiedAt
      qc.invalidateQueries({ queryKey: ["me"] });

      // Redirect to dashboard after a short delay to let user see the success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    },
    onError: (error: Error | unknown) => {
      console.error("Email verification confirmation error:", error);

      // Error is already parsed by the api() function
      // It has the format: new Error(message) with error.code property
      const apiError = error as Error & { code?: string };
      const errorCode = apiError?.code;
      const errorMessage = apiError?.message;

      // Handle specific error codes from the backend
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests", {
          description: "Please wait a few moments and try again.",
        });
      } else if (errorCode === "INVALID_TOKEN") {
        toast.error("Invalid or expired verification link", {
          description: "Please request a new verification email.",
        });
      } else {
        toast.error("Failed to verify email", {
          description:
            errorMessage ||
            "Please try again or request a new verification link.",
        });
      }
    },
  });
}

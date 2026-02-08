// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   requestPasswordReset,
//   confirmPasswordReset,
// } from "../api/password-reset";
// import {
//   RequestPasswordResetSchema,
//   ConfirmPasswordResetSchema,
// } from "../schemas/password-reset-schemas";

// /**
//  * Hook for requesting password reset
//  * Sends password reset email to user
//  */
// export function useRequestPasswordReset() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (data: RequestPasswordResetSchema) => {
//       try {
//         const response = await requestPasswordReset(data);
//         return response;
//       } catch (error) {
//         console.log("Failed in request password reset hook", error);
//         throw error;
//       }
//     },
//     onSuccess: (data, variables) => {
//       if (data?.sent) {
//         toast.success("Password reset email sent! Please check your inbox.", {
//           description: `We've sent a reset link to ${variables.email}`,
//         });
//         // Optional: redirect to login or a confirmation page
//         // router.push("/login");
//       }
//     },
//     onError: (error: any) => {
//       // Check for specific error codes
//       if (error?.code === "PASSWORD_RESET_COOLDOWN") {
//         toast.error("Please wait before requesting another reset email", {
//           description: error.message || "Try again in a few moments",
//         });
//       } else if (error?.code === "PASSWORD_RESET_DAILY_LIMIT") {
//         toast.error("Daily limit reached", {
//           description: error.message || "Please try again tomorrow",
//         });
//       } else {
//         toast.error("Failed to send reset email", {
//           description: "Please try again later",
//         });
//       }
//     },
//   });
// }

// /**
//  * Hook for confirming password reset
//  * Updates password using reset token
//  */
// export function useConfirmPasswordReset() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (data: ConfirmPasswordResetSchema) => {
//       try {
//         // Remove confirmPassword before sending to backend
//         const { confirmPassword, ...resetData } = data;
//         const response = await confirmPasswordReset(resetData);
//         return response;
//       } catch (error) {
//         console.log("Failed in confirm password reset hook", error);
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       if (data?.reset) {
//         toast.success("Password reset successful!", {
//           description: "You can now log in with your new password",
//         });
//         // Redirect to login page
//         setTimeout(() => {
//           router.push("/login");
//         }, 1000);
//       }
//     },
//     onError: (error: any) => {
//       // Check for specific error codes
//       if (error?.code === "INVALID_TOKEN") {
//         toast.error("Invalid or expired reset link", {
//           description: "Please request a new password reset",
//         });
//       } else {
//         toast.error("Failed to reset password", {
//           description: "Please try again or request a new reset link",
//         });
//       }
//     },
//   });
// }
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
      try {
        const response = await requestPasswordReset(data);
        return response;
      } catch (error) {
        console.log("Failed in request password reset hook", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      if (data?.sent) {
        toast.success("Password reset email sent! Please check your inbox.");
        console.log("✅ Password reset email sent to:", variables.email);
      }
    },
    onError: (error: Error | unknown) => {
      console.log("Error object:", error);

      // Parse error if it's a string
      let errorData: { error?: { code?: string; message?: string }; code?: string; message?: string } = { error: { code: "UNKNOWN" } };
      if (error instanceof Error) {
        try {
          errorData = JSON.parse(error.message);
        } catch {
          errorData = { error: { code: "UNKNOWN", message: error.message } };
        }
      } else if (typeof error === "string") {
        try {
          errorData = JSON.parse(error);
        } catch {
          errorData = { error: { code: "UNKNOWN" } };
        }
      }

      const errorCode = errorData?.error?.code || errorData?.code;
      const errorMessage = errorData?.error?.message || errorData?.message;

      // Check for specific error codes
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else if (errorCode === "PASSWORD_RESET_COOLDOWN") {
        toast.error("Please wait before requesting another reset email");
      } else if (errorCode === "PASSWORD_RESET_DAILY_LIMIT") {
        toast.error("Daily limit reached. Please try again tomorrow.");
      } else {
        toast.error(errorMessage || "Failed to send reset email");
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
      try {
        const response = await confirmPasswordReset(data);
        return response;
      } catch (error) {
        console.log("Failed in confirm password reset hook", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password reset successful");
      router.push("/login");
    },
    onError: (error: Error | unknown) => {
      console.log("Error object:", error);

      // Parse error if it's a string
      let errorData: { error?: { code?: string; message?: string }; code?: string; message?: string } = { error: { code: "UNKNOWN" } };
      if (error instanceof Error) {
        try {
          errorData = JSON.parse(error.message);
        } catch {
          errorData = { error: { code: "UNKNOWN", message: error.message } };
        }
      } else if (typeof error === "string") {
        try {
          errorData = JSON.parse(error);
        } catch {
          errorData = { error: { code: "UNKNOWN" } };
        }
      }

      const errorCode = errorData?.error?.code || errorData?.code;
      const errorMessage = errorData?.error?.message || errorData?.message;

      // Check for specific error codes
      if (errorCode === "RATE_LIMITED") {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else if (errorCode === "INVALID_TOKEN") {
        toast.error("Invalid or expired reset link");
      } else {
        toast.error(errorMessage || "Failed to reset password");
      }
    },
  });
}

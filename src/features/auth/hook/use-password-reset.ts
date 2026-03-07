import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  requestPasswordReset,
  confirmPasswordReset,
  type ConfirmPasswordResetData,
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
        toast.success("✉️ ელფოსტა გაიგზავნა!", {
          description: `პაროლის აღდგენის ბმული გამოგეგზავნა მისამართზე ${variables.email}. ბმული 30 წუთში იწურება.`,
        });
      }
    },
    onError: (error: Error | unknown) => {
      // Error is already parsed by the api() function
      // It has the format: new Error(message) with error.code property
      const apiError = error as Error & { code?: string };
      const errorCode = apiError?.code;

      // Log only unexpected errors (not handled error codes)
      const isHandledError =
        errorCode === "RATE_LIMITED" ||
        errorCode === "PASSWORD_RESET_COOLDOWN" ||
        errorCode === "PASSWORD_RESET_DAILY_LIMIT";

      if (!isHandledError) {
        console.error("Unexpected password reset request error:", error);
      }

      // Handle specific error codes from the backend
      if (errorCode === "RATE_LIMITED") {
        toast.error("🔒 ზედმეტად ბევრი მოთხოვნა", {
          description: "გთხოვ, ცოტა ხანს დაელოდე და ხელახლა სცადე.",
        });
      } else if (errorCode === "PASSWORD_RESET_COOLDOWN") {
        toast.error("⏳ გთხოვ, დაელოდე", {
          description: "ცოტა ხანში კვლავ შეძლებ აღდგენის ელფოსტის მოთხოვნას.",
        });
      } else if (errorCode === "PASSWORD_RESET_DAILY_LIMIT") {
        toast.error("📅 დღიური ლიმიტი ამოიწურა", {
          description:
            "დღევანდელი ლიმიტი ამოწურულია. გთხოვ, ხვალ სცადე.",
        });
      } else {
        toast.error("❌ აღდგენის ელფოსტის გაგზავნა ვერ მოხერხდა", {
          description: "გთხოვ, გადაამოწმე ელფოსტა და მოგვიანებით სცადე.",
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
      const resetData: ConfirmPasswordResetData = {
        token: data.token,
        newPassword: data.newPassword,
      };
      const response = await confirmPasswordReset(resetData);
      return response;
    },
    onSuccess: () => {
      toast.success("🎉 პაროლი წარმატებით განახლდა!", {
        description: "ახლა შეგიძლია ახალი პაროლით შეხვიდე.",
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
        toast.error("🔒 ზედმეტად ბევრი მოთხოვნა", {
          description: "გთხოვ, ცოტა ხანს დაელოდე და ხელახლა სცადე.",
        });
      } else if (errorCode === "INVALID_TOKEN") {
        toast.error("🔗 პაროლის აღდგენის ბმული არასწორია", {
          description:
            "ეს ბმული ვადაგასულია. გთხოვ, მოითხოვე ახალი აღდგენის ბმული.",
        });
      } else if (
        errorMessage?.includes("password") &&
        errorMessage?.includes("match")
      ) {
        toast.error("🔐 პაროლები არ ემთხვევა", {
          description: "გთხოვ, დარწმუნდი რომ ორივე პაროლი იდენტურია.",
        });
      } else if (errorMessage?.includes("ValidationError")) {
        toast.error("⚠️ არასწორი პაროლი", {
          description:
            "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო და შეიცავდეს მინიმუმ ერთ ასოსა და ერთ ციფრს.",
        });
      } else {
        toast.error("❌ პაროლის განახლება ვერ მოხერხდა", {
          description:
            "რაღაც შეცდა. გთხოვ, სცადე ხელახლა ან მოითხოვე ახალი აღდგენის ბმული.",
        });
      }
    },
  });
}

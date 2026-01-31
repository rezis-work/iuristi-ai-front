import { toast } from "sonner";
import { login, LogOut, Register } from "../api/auth";
import { LoginSchema, RegisterSchema } from "./../schemas/auth-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { removeToken } from "@/src/lib/api";

type UseLoginOptions = {
  disableAutoRedirect?: boolean;
};

export function useLogin(options?: UseLoginOptions) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      try {
        const response = await login(data);

        return response;
      } catch (error) {
        console.log("failed in login hook", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate the "me" query to refetch user data
      qc.invalidateQueries({ queryKey: ["me"] });

      // Log user information if available
      if (data?.user) {
        console.log("✅ Login successful - User logged in:");
        console.log("   Name:", data.user.name);
        console.log("   Email:", data.user.email);
      }

      toast.success("login successful");
      if (!options?.disableAutoRedirect) {
        // Use window.location instead of router.push to ensure cookie is set before navigation
        // This gives the cookie time to be available for middleware on the next request
        setTimeout(() => {
          window.location.href = `/`;
        }, 100);
      }
    },
    onError: () => {
      toast.error("login failed");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterSchema) => {
      try {
        const response = await Register(data);
        return response;
      } catch (error) {
        console.log("failed in register hook", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the "me" query to refetch user data
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("register successful");
      router.push("/me");
    },
    onError: () => {
      toast.error("register failed");
      console.log("registaracia");
    },
  });
}

export function useLogOut() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await LogOut();
        return response;
      } catch (error) {
        console.log("failed in logout hook", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Remove token from storage
      removeToken();
      // Clear all queries and invalidate "me" query
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.clear();
      toast.success("logout successful");
      router.push("/login");
    },
    onError: () => {
      toast.error("logout failed");
    },
  });
}

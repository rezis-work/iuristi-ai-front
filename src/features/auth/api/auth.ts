import { RegisterSchema } from "./../schemas/auth-schemas";
import { api, setToken } from "@/src/lib/api";
import { LoginSchema } from "../schemas/auth-schemas";
import { Account } from "./get-account";
import { ChangePasswordSchema } from "../schemas/auth-schemas";

export async function login(data: LoginSchema) {
  try {
    const response = await api<{ accessToken?: string; user?: Account }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    // Save token if received
    if (response?.accessToken) {
      setToken(response.accessToken);
    }

    // Log user information when login is successful
    if (response?.user) {
      console.log("✅ Login successful - User logged in:");
      console.log("   Name:", response.user.name);
      console.log("   Email:", response.user.email);
    }

    return response;
  } catch (error) {
    console.log("Failed to login", error);
    throw error;
  }
}

export async function Register(data: RegisterSchema) {
  try {
    // Remove confirmPassword before sending to backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...registerData } = data;
    const response = await api<{ accessToken?: string; user?: Account }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(registerData),
      },
    );

    // Save token if received
    if (response?.accessToken) {
      setToken(response.accessToken);
    }

    // Log user information when registration is successful
    if (response?.user) {
      console.log("✅ Registration successful - User registered:");
      console.log("   Name:", response.user.name);
      console.log("   Email:", response.user.email);
    }

    return response;
  } catch (error) {
    console.log("Failed to register", error);
    throw error;
  }
}

export async function LogOut() {
  try {
    const response = await api("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to logout", error);
    throw error;
  }
}

export async function GetMe() {
  try {
    const response = await api<Account>("/me/profile", {
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("failed to fetch me", error);
    throw error;
  }
}

export async function changePassword(data: ChangePasswordSchema) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...payload } = data; // confirmPassword backend-ს არ სჭირდება
    const response = await api<{ changed: boolean }>("/auth/password/change", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true, // უნდა გააგზავნო auth:true, რომ token დაერთოს
    });
    return response;
  } catch (error) {
    console.log("Failed to change password", error);
    throw error;
  }
}

import { api } from "@/src/lib/api";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified?: boolean;
  timezone: string;
  accountType: "person" | "lawyer" | "business_owner";
  createdAt: string;
};

export type UpdateProfileData = {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  avatarKey?: string;
  timezone?: string;
  accountType?: "person" | "lawyer" | "business_owner";
};

export async function getProfile(options?: {
  disableRedirect?: boolean;
}): Promise<Profile> {
  try {
    const response = await api<Profile>("/me/profile", {
      auth: true,
      disableRedirect: options?.disableRedirect,
    });
    return response;
  } catch (error) {
    console.log("Failed to fetch profile", error);
    throw error;
  }
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  try {
    const response = await api<Profile>("/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to update profile", error);
    throw error;
  }
}

export async function deleteAvatar(): Promise<Profile> {
  try {
    const response = await api<Profile>("/me/avatar", {
      method: "DELETE",
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to delete avatar", error);
    throw error;
  }
}

import { api } from "@/src/lib/api";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  language: "ka" | "en" | "ru";
  timezone: string;
  accountType: "person" | "lawyer" | "business_owner";
  createdAt: string;
};

export type UpdateProfileData = {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  avatarKey?: string;
  language?: "ka" | "en" | "ru";
  timezone?: string;
  accountType?: "person" | "lawyer" | "business_owner";
};

export async function getProfile(): Promise<Profile> {
  try {
    const response = await api<Profile>("/me/profile", {
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to fetch profile", error);
    throw error;
  }
}

export async function updateProfile(
  data: UpdateProfileData,
): Promise<Profile> {
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


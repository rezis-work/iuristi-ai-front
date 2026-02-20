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

type ProfileAccountType = Profile["accountType"];

/** Normalize accountType from API (handles "Person", snake_case, etc.) */
function normalizeAccountType(val: unknown): ProfileAccountType {
  if (!val || typeof val !== "string") return "person";
  const v = String(val).toLowerCase().replace(/\s+/g, "_");
  if (v === "lawyer") return "lawyer";
  if (v === "business_owner" || v === "businessowner") return "business_owner";
  return "person";
}

/** Backend may return account_type (snake_case); ensure Profile has accountType (camelCase) */
function normalizeProfileResponse(raw: Record<string, unknown>): Profile {
  const accountType = normalizeAccountType(
    raw.accountType ?? raw.account_type
  );
  return {
    ...raw,
    accountType,
  } as Profile;
}

export async function getProfile(options?: {
  disableRedirect?: boolean;
}): Promise<Profile> {
  try {
    const response = await api<Record<string, unknown>>("/me/profile", {
      auth: true,
      disableRedirect: options?.disableRedirect,
    });
    return normalizeProfileResponse(response);
  } catch (error) {
    console.log("Failed to fetch profile", error);
    throw error;
  }
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  try {
    const body: Record<string, unknown> = { ...data };
    if (data.accountType !== undefined) {
      body.account_type = data.accountType;
    }
    const response = await api<Record<string, unknown>>("/me/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
      auth: true,
    });
    return normalizeProfileResponse(response);
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

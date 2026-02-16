import type { UpsertProfileInput } from '../schemas/lawyer-schema';
import { api } from "@/src/lib/api";
import { withOrgContext } from "@/src/lib/org";


export type LawyerProfileResponce = {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    fields: string[];
    isActive: boolean;
}

/** Backend wraps profile in { lawyerProfile: T } */
type LawyerProfileApiResponse = {
    lawyerProfile: LawyerProfileResponce | null;
};

export async function profileMe(orgId: string): Promise<LawyerProfileResponce | null> {
    try {
        const response = await api<LawyerProfileApiResponse>(
            "/lawyer-profile/me",
            withOrgContext(orgId, { auth: true })
        );
        return response?.lawyerProfile ?? null;
    } catch (error) {
        const err = error as Error & { code?: string };
        // 404 / NOT_FOUND = route missing or no lawyer profile yet (treat as empty)
        if (err.code === "NOT_FOUND") {
            return null;
        }
        console.error("Failed to get lawyer profile", error);
        throw error;
    }
}


export async function updateLawyer(
  orgId: string,
  data: UpsertProfileInput
): Promise<LawyerProfileResponce> {
  try {
    const response = await api<LawyerProfileApiResponse>(
      "/lawyer-profile/me",
      withOrgContext(orgId, {
        method: "PUT",
        body: JSON.stringify(data),
        auth: true,
      })
    );
    const profile = response?.lawyerProfile;
    if (!profile) throw new Error("Unexpected response: lawyerProfile is null");
    return profile;
  } catch (error) {
    console.error("Failed to update lawyer profile", error);
    throw error;
  }
}

import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";
import type { UpsertLawyerProfileInput } from "../schemas/lawyer-profile.schema";
import { lawyerProfileResponseSchema } from "../schemas/lawyer-profile.schema";

export type UpsertLawyerProfileResponse = {
  lawyerProfile: any;
};

export type GetLawyerProfileResponse = {
  lawyerProfile: any | null;
};

/**
 * Get lawyer profile for the authenticated user
 */
export async function getLawyerProfile(orgId: string): Promise<any | null> {
  try {
    assertValidOrgId(orgId);
    const response = await api<GetLawyerProfileResponse>(
      `/lawyer-profile/me`,
      withOrgContext(orgId, {
        method: "GET",
        auth: true,
      }),
    );
    return response.lawyerProfile;
  } catch (error) {
    console.error("Failed to get lawyer profile", error);
    throw error;
  }
}

/**
 * Create or update lawyer profile for the authenticated user
 */
export async function upsertLawyerProfile(
  orgId: string,
  data: UpsertLawyerProfileInput,
): Promise<any> {
  try {
    assertValidOrgId(orgId);
    const response = await api<UpsertLawyerProfileResponse>(
      `/lawyer-profile/me`,
      withOrgContext(orgId, {
        method: "PUT",
        body: JSON.stringify(data),
        auth: true,
      }),
    );
    return response.lawyerProfile;
  } catch (error) {
    console.error("Failed to upsert lawyer profile", error);
    throw error;
  }
}

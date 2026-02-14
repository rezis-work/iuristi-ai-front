import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";

export type OrgType = "law_firm" | "business" | "individual";

export type CreateOrgRequest = {
  name: string;
  type: OrgType;
};

export type PatchOrgRequest = {
  name?: string;
  logoUrl?: string;
  logoKey?: string;
};

export type OrgResponse = {
  id: string;
  name: string;
  type: string;
  logoUrl: string | null;
  logoKey: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MembershipResponse = {
  id: string;
  userId: string;
  orgId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type OrgWithMembership = {
  org: OrgResponse;
  membership: MembershipResponse;
};

export type UserOrgResponse = {
  id: string;
  name: string;
  type: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Create a new organization
 */
export async function createOrg(
  data: CreateOrgRequest
): Promise<OrgWithMembership> {
  try {
    const response = await api<OrgWithMembership>("/orgs", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    });
    return response;
  } catch (error) {
    console.error("Failed to create organization", error);
    throw error;
  }
}

/**
 * Get all organizations the authenticated user is a member of
 */
export async function getUserOrgs(): Promise<UserOrgResponse[]> {
  try {
    const response = await api<UserOrgResponse[]>("/orgs/me", {
      method: "GET",
      auth: true,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch user organizations", error);
    throw error;
  }
}

/**
 * Update an organization
 */
export async function updateOrg(
  orgId: string,
  data: PatchOrgRequest
): Promise<OrgResponse> {
  try {
    assertValidOrgId(orgId);
    const response = await api<OrgResponse>(
      `/orgs/${orgId}`,
      withOrgContext(orgId, {
        method: "PATCH",
        body: JSON.stringify(data),
        auth: true,
      })
    );
    return response;
  } catch (error) {
    console.error("Failed to update organization", error);
    throw error;
  }
}

/**
 * Delete organization logo
 */
export async function deleteLogo(orgId: string): Promise<OrgResponse> {
  try {
    assertValidOrgId(orgId);
    const response = await api<OrgResponse>(
      `/orgs/${orgId}/logo`,
      withOrgContext(orgId, {
        method: "DELETE",
        auth: true,
      })
    );
    return response;
  } catch (error) {
    console.error("Failed to delete organization logo", error);
    throw error;
  }
}
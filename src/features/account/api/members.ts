import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";
import type { UpdateMemberRoleInput } from "../schemas/members.schema";

export type MemberResponse = {
  userId: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type ListMembersResponse = {
  members: MemberResponse[];
};

export type UpdateMemberRoleResponse = {
  member: MemberResponse;
};

export type RemoveMemberResponse = {
  message: string;
};

/**
 * List all members of an organization
 * Requires: Owner role
 */
export async function listMembers(orgId: string): Promise<MemberResponse[]> {
  try {
    assertValidOrgId(orgId);
    const response = await api<ListMembersResponse>(
      `/orgs/${orgId}/members`,
      withOrgContext(orgId, {
        method: "GET",
        auth: true,
      }),
    );
    return response.members;
  } catch (error) {
    console.error("Failed to list members", error);
    throw error;
  }
}

/**
 * Update a member's role in an organization
 * Requires: Owner role
 */
export async function updateMemberRole(
  orgId: string,
  userId: string,
  data: UpdateMemberRoleInput,
): Promise<MemberResponse> {
  try {
    assertValidOrgId(orgId);
    const response = await api<UpdateMemberRoleResponse>(
      `/orgs/${orgId}/members/${userId}`,
      withOrgContext(orgId, {
        method: "PATCH",
        body: JSON.stringify(data),
        auth: true,
      }),
    );
    return response.member;
  } catch (error) {
    console.error("Failed to update member role", error);
    throw error;
  }
}

/**
 * Remove a member from an organization
 * Requires: Owner role
 */
export async function removeMember(
  orgId: string,
  userId: string,
): Promise<void> {
  try {
    assertValidOrgId(orgId);
    await api<RemoveMemberResponse>(
      `/orgs/${orgId}/members/${userId}`,
      withOrgContext(orgId, {
        method: "DELETE",
        auth: true,
      }),
    );
  } catch (error) {
    console.error("Failed to remove member", error);
    throw error;
  }
}

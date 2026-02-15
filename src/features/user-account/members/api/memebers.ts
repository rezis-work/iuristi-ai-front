import { UpdateMemberRoleInput,  } from './../schemas/memebers-schema';
import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";

export type Member = {
  id: string;
  userId: string;
  orgId: string;
  role: string;
  email?: string;
  name?: string;
  // დაამატე სხვა ველები რაც ბექენდი აბრუნებს
};

export type ListMembersResponse = {
  members: Member[];
};

export async function getMembers(orgId: string): Promise<Member[]> {
  try {
    assertValidOrgId(orgId);
  const response = await api<ListMembersResponse>(
    `/orgs/${orgId}/members`,
    withOrgContext(orgId, { auth: true })
    );
    return response?.members ?? [];
  } catch (error) {
    console.log("Failed to get members", error);
    throw error;
  }
}



export async function updateMemberRole(orgId: string, userId: string, data:UpdateMemberRoleInput ){
 try {
    const response = await api<Member>(`/members/${orgId}/members/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        auth: true,
    });
    return response;
 } catch (error) {
    console.log("Failed to update member role", error);
    throw error;
 }
}



export async function removeMember(orgId: string, userId: string): Promise<void> {
  try {
    await api<void>(`/members/${orgId}/members/${userId}`, {
      method: 'DELETE',
      auth: true,
    });
  } catch (error) {
    console.log("Failed to remove member", error);
    throw error;
  }
}
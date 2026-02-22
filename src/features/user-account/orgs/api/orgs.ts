import { api } from "@/src/lib/api";

import { assertValidOrgId, withOrgContext } from "@/src/lib/org";
import type { CreateOrgSchema } from "../schemas/orgs-schema";

export type OrgWithMembership = {
  org: { id: string; name: string; type: string };
  membership: { id: string; userId: string; orgId: string; role: string };
};

export type PatchOrgRequest = {
  name?: string;
  logoUrl?: string;
  logoKey?: string;
}
export type OrgResponse = {
  id: string;
  name: string;
  type: string;
  logoUrl: string | null;
  logoKey: string | null;
  createdAt: string;
  updatedAt: string;
};


export async function orgsCreate(data: CreateOrgSchema): Promise<OrgWithMembership> {
  const response = await api<OrgWithMembership>("/orgs", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
  return response;
}



/** Backend returns orgs array directly (res.json(orgs)) */
export type UserOrgItem = {
  id: string;
  name: string;
  type: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export async function getOrg(): Promise<UserOrgItem[]> {
  const response = await api<UserOrgItem[]>("/orgs/me", { auth: true });
  return response ?? [];
}


export async function updateOrgs(
  id: string,
  data: CreateOrgSchema
): Promise<OrgResponse> {
  assertValidOrgId(id);
  const response = await api<OrgResponse>(
    `/orgs/${id}`,
    withOrgContext(id, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: true,
    })
  );
  return response;
}



export async function deleteOrgs(id: string): Promise<void> {
  assertValidOrgId(id);
  await api(`/orgs/logo/${id}`, withOrgContext(id, { method: "DELETE", auth: true }));
}
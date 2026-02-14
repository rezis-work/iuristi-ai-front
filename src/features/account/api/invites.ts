import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";

// Match server memberRoleEnum order
export type InviteRole = "owner" | "lawyer" | "paralegal" | "staff" | "client";

export type CreateInviteRequest = {
  email: string;
  role?: InviteRole;
  expiresInDays?: number;
};

export type CreateInviteResponse = {
  inviteId: string;
  email: string;
  role: string;
  expiresAt: string;
  inviteToken: string;
};

export type AcceptInviteRequest = {
  token: string;
};

export type AcceptInviteResponse = {
  org: {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  membership: {
    id: string;
    userId: string;
    orgId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

export type InviteListItem = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  status: InviteStatus;
};

export type InviteLinkResponse = {
  inviteUrl: string;
  expiresAt: string;
};

export type InvitePreviewResponse = {
  valid: boolean;
  org?: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
  role?: string;
  expiresAt?: string;
};

/**
 * Create an invite for a user to join organization
 */
export async function createInvite(
  orgId: string,
  data: CreateInviteRequest
): Promise<CreateInviteResponse> {
  try {
    assertValidOrgId(orgId);
    const response = await api<CreateInviteResponse>(
      `/orgs/${orgId}/invites`,
      withOrgContext(orgId, {
        method: "POST",
        body: JSON.stringify(data),
        auth: true,
      })
    );
    return response;
  } catch (error) {
    console.error("Failed to create invite", error);
    throw error;
  }
}

/**
 * Accept an invite using token
 */
export async function acceptInvite(
  token: string
): Promise<AcceptInviteResponse> {
  try {
    const response = await api<AcceptInviteResponse>("/orgs/invites/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
      auth: true,
    });
    return response;
  } catch (error) {
    console.error("Failed to accept invite", error);
    throw error;
  }
}

/**
 * List all invites for an organization
 */
export async function listInvites(orgId: string): Promise<InviteListItem[]> {
  try {
    assertValidOrgId(orgId);
    const response = await api<{ invites: InviteListItem[] }>(
      `/orgs/${orgId}/invites`,
      withOrgContext(orgId, {
        method: "GET",
        auth: true,
      })
    );
    return response.invites;
  } catch (error) {
    console.error("Failed to list invites", error);
    throw error;
  }
}

/**
 * Revoke an invite
 */
export async function revokeInvite(
  orgId: string,
  inviteId: string
): Promise<{ message: string }> {
  try {
    assertValidOrgId(orgId);
    const response = await api<{ message: string }>(
      `/orgs/${orgId}/invites/${inviteId}`,
      withOrgContext(orgId, {
        method: "DELETE",
        auth: true,
      })
    );
    return response;
  } catch (error) {
    console.error("Failed to revoke invite", error);
    throw error;
  }
}

/**
 * Create an invite link (QR-friendly)
 */
export async function createInviteLink(
  orgId: string,
  data: CreateInviteRequest
): Promise<InviteLinkResponse> {
  try {
    assertValidOrgId(orgId);
    const response = await api<InviteLinkResponse>(
      `/orgs/${orgId}/invites/link`,
      withOrgContext(orgId, {
        method: "POST",
        body: JSON.stringify(data),
        auth: true,
      })
    );
    return response;
  } catch (error) {
    console.error("Failed to create invite link", error);
    throw error;
  }
}

/**
 * Preview invite details without authenticating
 */
export async function previewInvite(
  token: string
): Promise<InvitePreviewResponse> {
  try {
    const response = await api<InvitePreviewResponse>(
      `/orgs/invites/preview?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        auth: false,
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to preview invite", error);
    throw error;
  }
}

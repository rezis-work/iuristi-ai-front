import { api } from "@/src/lib/api";
import { assertValidOrgId, withOrgContext } from "@/src/lib/org";
import { CreateInviteInput } from "../schemas/invite-schema";
import { AcceptInviteInput, CreateInviteLinkInput } from "../../members/schemas/memebers-schema";

export type InviteListItem = {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
    acceptedAt: string | null;
    revokedAt: string | null;
    createdAt: string;
    status: "pending" | "accepted" | "revoked" | "expired";
};

export type InviteListResponse = {
    invites: InviteListItem[];
};


export async function getInvites(orgId: string, data: CreateInviteInput) {
    try {
        assertValidOrgId(orgId);
        const response = await api<CreateInviteInput>(
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


export async function acceptInvite(data: AcceptInviteInput) {
    try {
        const response = await api<AcceptInviteInput>(`/orgs/invites/accept`, {
            method: "POST",
            body: JSON.stringify(data),
            auth: true,
        });
        return response;
    } catch (error) {
        console.error("Failed to accept invite", error);
        throw error;
    }
}


export async function inviteList(data: CreateInviteLinkInput, orgId: string) {
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



export type InviteLinkResponse = {
    inviteUrl: string;
    expiresAt: string;
};

export type InvitePreviewResponse = {
    valid: boolean;
    org?: { id: string; name: string; logoUrl: string | null } | null;
    role?: string | null;
    expiresAt?: string | null;
};

export async function getInvitePreview(token: string): Promise<InvitePreviewResponse> {
    try {
        const encodedToken = encodeURIComponent(token);
        const response = await api<InvitePreviewResponse>(
            `/orgs/invites/preview?token=${encodedToken}`
        );
        return response;
    } catch (error) {
        console.error("Failed to get invite preview", error);
        throw error;
    }
}



export async function getInviteList(orgId: string): Promise<InviteListItem[]> {
    try {
        assertValidOrgId(orgId);
        const response = await api<InviteListResponse>(
            `/orgs/${orgId}/invites`,
            withOrgContext(orgId, { auth: true })
        );
        return response?.invites ?? [];
    } catch (error) {
        console.error("Failed to get invite list", error);
        throw error;
    }
}




export async function deleteInvite(orgId: string, inviteId: string) {
    try {
        assertValidOrgId(orgId);
        await api<void>(`/orgs/${orgId}/invites/${inviteId}`, {
            ...withOrgContext(orgId, { auth: true }),
            method: "DELETE",
        });
    } catch (error) {
        console.error("Failed to revoke invite", error);
        throw error;
    }
}
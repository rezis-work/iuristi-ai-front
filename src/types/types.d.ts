interface Submenu {
  href: string;
  label: string;
}

interface DropdownItem {
  href: string;
  label: string;
  submenu?: Submenu[];
}

export interface NavLink {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
}

export interface Award {
  id: string;
  title: string;
  type: string;
  client: string;
  year: string;
}

// Invite Types
export interface Invite {
  id: string;
  email: string;
  role: "lawyer" | "admin";
  status: "pending" | "accepted" | "revoked" | "expired";
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface InvitePreview {
  valid: boolean;
  org?: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
  role?: string;
  expiresAt?: string;
}

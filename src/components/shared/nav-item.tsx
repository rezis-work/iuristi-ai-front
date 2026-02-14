import { Scale, User, Settings, Lock, Mail, Briefcase, Building } from "lucide-react";

type MenuItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

export const menuItems: MenuItem[] = [
  { path: "/me/profile", label: "Profile", icon: User },
  { path: "/me/lawyer-profile", label: "Lawyer Profile", icon: Briefcase },
  { path: "/me/invites", label: "Invites", icon: Mail },
  { path: "/me/organization", label: "Organization", icon: Building },
  { path: "/me/members", label: "Members", icon: Scale },
  { path: "/me/settings", label: "Settings", icon: Settings },
  { path: "/me/change-password", label: "Change password", icon: Lock },
];

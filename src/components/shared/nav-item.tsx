import { Scale, User, Mail, Briefcase, Building, Settings } from "lucide-react";

type MenuItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

export const menuItems: MenuItem[] = [
  { path: "/me/profile", label: "პროფილი", icon: User },
  { path: "/me/lawyer-profile", label: "იურისტის პროფილი", icon: Briefcase },
  { path: "/me/settings", label: "პარამეტრები", icon: Settings },
  { path: "/me/invites", label: "მოწვევები", icon: Mail },
  { path: "/me/organization", label: "ორგანიზაცია", icon: Building },
  { path: "/me/members", label: "წევრები", icon: Scale },
];

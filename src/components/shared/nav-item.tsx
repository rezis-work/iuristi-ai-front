import {
  Gauge,
  ShoppingBag,
  Scale,
  User as UserIcon,
  User,
  Settings,
  Lock,
  Mail,
} from "lucide-react";

type MenuItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

export const menuItems: MenuItem[] = [
  { path: "/me/userdashboard", label: "Dashboard", icon: Gauge },
  { path: "/me/orders", label: "Orders", icon: ShoppingBag },
  { path: "/me/compare", label: "Compare", icon: Scale },
  { path: "/me/profile", label: "Profile", icon: User },
  { path: "/me/invites", label: "Invites", icon: Mail },
  { path: "/me/settings", label: "Settings", icon: Settings },
  { path: "/me/change-password", label: "Change password", icon: Lock },
];

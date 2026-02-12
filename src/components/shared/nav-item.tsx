import {
  Gauge,
  ShoppingBag,
  Scale,
  MapPin,
  User as UserIcon,
  User,
  Settings,
  Lock,
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
  { path: "/me/address", label: "Address", icon: MapPin },
  { path: "/me/profile", label: "Profile", icon: User },
  { path: "/me/settings", label: "Settings", icon: Settings },
  { path: "/me/change-password", label: "Change password", icon: Lock },
];

import {
  Package,
  Shield,
  AlertCircle,
  Zap,
  Megaphone,
} from "lucide-react";

export const NOTIFICATION_OPTIONS = [
  {
    name: "productUpdates" as const,
    label: "Product updates",
    description: "Notifications about new features and changes",
    icon: Package,
  },
  {
    name: "security" as const,
    label: "Security notifications",
    description: "Important security notifications (recommended)",
    icon: Shield,
  },
  {
    name: "caseReminders" as const,
    label: "Case reminders",
    description: "Reminders about ongoing cases",
    icon: AlertCircle,
  },
  {
    name: "agentResults" as const,
    label: "AI agent results",
    description: "When AI agent completes a task",
    icon: Zap,
  },
  {
    name: "marketing" as const,
    label: "Marketing and promotions",
    description: "News, tips and special offers",
    icon: Megaphone,
  },
] as const;

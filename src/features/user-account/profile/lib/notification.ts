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
    label: "პროდუქტის განახლებები",
    description: "შეტყობინებები ახალ ფუნქციებსა და ცვლილებებზე",
    icon: Package,
  },
  {
    name: "security" as const,
    label: "უსაფრთხოების შეტყობინებები",
    description: "მნიშვნელოვანი უსაფრთხოების შეტყობინებები (რეკომენდებულია)",
    icon: Shield,
  },
  {
    name: "caseReminders" as const,
    label: "საქმის შეხსენებები",
    description: "შეხსენებები მიმდინარე საქმეებზე",
    icon: AlertCircle,
  },
  {
    name: "agentResults" as const,
    label: "AI აგენტის შედეგები",
    description: "როცა AI აგენტი დაასრულებს დავალებას",
    icon: Zap,
  },
  {
    name: "marketing" as const,
    label: "მარკეტინგი და აქციები",
    description: "სიახლეები, რჩევები და სპეციალური შეთავაზებები",
    icon: Megaphone,
  },
] as const;

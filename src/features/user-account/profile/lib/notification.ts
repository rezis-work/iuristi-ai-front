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
    description: "ახალი ფუნქციებისა და ცვლილებების შესახებ შეტყობინებები",
    icon: Package,
  },
  {
    name: "security" as const,
    label: "უსაფრთხოების შეტყობინებები",
    description: "მნიშვნელოვანი უსაფრთხოების შეტყობინებები (რეკომენდებული)",
    icon: Shield,
  },
  {
    name: "caseReminders" as const,
    label: "საქმის შეხსენებები",
    description: "მიმდინარე საქმეების შესახებ შეხსენებები",
    icon: AlertCircle,
  },
  {
    name: "agentResults" as const,
    label: "AI აგენტის შედეგები",
    description: "როცა AI აგენტი ამთავრებს დავალებას",
    icon: Zap,
  },
  {
    name: "marketing" as const,
    label: "მარკეტინგი და აქციები",
    description: "სიახლეები, რჩევები და სპეციალური შემოთავაზებები",
    icon: Megaphone,
  },
] as const;

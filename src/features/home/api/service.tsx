import { MessageCircle, Scale, Gavel, Building2 } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  delay: number;
}

export const services: ServiceCard[] = [
  {
    id: "legal-consultation",
    title: "იურიდიული კონსულტაცია",
    icon: <MessageCircle className="w-16 h-16" strokeWidth={1.5} />,
    delay: 0,
  },
  {
    id: "international-law",
    title: "სამოქალაქო სამართალი",
    icon: <Scale className="w-16 h-16" strokeWidth={1.5} />,
    delay: 100,
  },
  {
    id: "criminal-law",
    title: "სისხლის სამართალი",
    icon: <Gavel className="w-16 h-16" strokeWidth={1.5} />,
    delay: 200,
  },
  {
    id: "real-estate-law",
    title: "უძრავი ქონები",
    icon: <Building2 className="w-16 h-16" strokeWidth={1.5} />,
    delay: 300,
  },
];

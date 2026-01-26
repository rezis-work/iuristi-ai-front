// components/header/constants.ts
"use client";

import { Instagram, Facebook, Ticket, MessageCircle } from "lucide-react";

export const socials = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    Icon: Instagram,
    color: "from-pink-500 via-red-500 to-yellow-500",
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    Icon: Facebook,
    color: "from-blue-500 to-blue-600",
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    Icon: Ticket,
    color: "from-slate-100 to-slate-300",
  },
  {
    href: "https://wa.me/123456789",
    label: "WhatsApp",
    Icon: MessageCircle,
    color: "from-emerald-400 to-emerald-500",
  },
];

export const rightColumnBlocks = [
  {
    eyebrow: "Have a Project?",
    title: "info@website.com",
    underline: true,
    showArrow: false,
  },
  {
    eyebrow: "Where to Find Us?",
    title: "Look Here",
    underline: false,
    showArrow: true,
  },
  {
    eyebrow: "Want an Appointment?",
    title: "Make One",
    underline: false,
    showArrow: true,
  },
];

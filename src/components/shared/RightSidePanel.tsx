"use client";

import React from "react";
import { ShoppingCart, MessageSquare, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface PanelButton {
  id: string;
  icon: React.ReactNode;
  href: string;
  label: string;
}

const panelButtons: PanelButton[] = [
  {
    id: "cart",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/shop",
    label: "Shopping Cart",
  },
  {
    id: "message",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/contacts",
    label: "Contact Us",
  },
  {
    id: "calendar",
    icon: <Calendar className="w-5 h-5" />,
    href: "/contacts",
    label: "Schedule",
  },
];

export default function RightSidePanel() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <motion.div
        className="flex flex-col gap-0"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {panelButtons.map((button, index) => (
          <motion.div
            key={button.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <Link
              href={button.href}
              className="group relative block"
              aria-label={button.label}
            >
              <div className="relative w-14 h-14 bg-[#ff9D4D] hover:bg-[#ea9753] transition-colors border-b border-black/20 flex items-center justify-center">
                <div className="text-black group-hover:scale-110 transition-transform">
                  {button.icon}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import { Briefcase, MessageSquare, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

interface PanelButton {
  id: string;
  icon: React.ReactNode;
  href: string;
  label: string;
}

const panelButtons: PanelButton[] = [
  {
    id: "services",
    icon: <Briefcase className="w-5 h-5" />,
    href: "/",
    label: "სერვისები",
  },
  {
    id: "message",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/contacts",
    label: "კონტაქტი",
  },
  {
    id: "calendar",
    icon: <Calendar className="w-5 h-5" />,
    href: "/contacts",
    label: "შეხვედრა",
  },
];

export default function RightSidePanel() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <motion.div
        className="flex flex-col overflow-hidden rounded-l-2xl border border-r-0 border-zinc-700/50 bg-zinc-900/80 shadow-2xl shadow-black/30 backdrop-blur-sm"
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
            className={index < panelButtons.length - 1 ? "border-b border-zinc-700/30" : ""}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={button.href}
                  className="group relative block cursor-pointer"
                  aria-label={button.label}
                >
                  <div className="relative w-16 h-16 bg-linear-to-br from-[#ff9D4D] to-[#ff8D3D] hover:from-[#ffaD5D] hover:to-[#ff9D4D] transition-all duration-200 flex items-center justify-center">
                    <div className="text-black group-hover:scale-110 transition-transform duration-200">
                      {button.icon}
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={12} className="bg-zinc-800 text-white border border-zinc-700">
                {button.label}
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

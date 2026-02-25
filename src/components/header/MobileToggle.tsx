"use client";

import { Menu, X } from "lucide-react";

interface MobileToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileToggle({ isOpen, onToggle }: MobileToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="text-zinc-400 hover:text-white transition-colors pr-4 lg:hidden flex items-center gap-3 ml-auto"
      aria-label="მენიუს გადართვა"
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}

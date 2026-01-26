"use client";

import { Menu, X, Search, Phone } from "lucide-react";

interface MobileActionsProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onToggleSearch: () => void;
  onPhoneClick?: () => void;
}

export function MobileActions({
  isMenuOpen,
  onToggleMenu,
  onToggleSearch,
  onPhoneClick,
}: MobileActionsProps) {
  return (
    <div className="lg:hidden flex items-center gap-3 sm:gap-5 ml-auto">
      <button
        onClick={onToggleSearch}
        className="text-zinc-400 hover:text-white transition-colors"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        onClick={onPhoneClick}
        className="text-zinc-400 hover:text-white transition-colors"
        aria-label="Call"
      >
        <Phone className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleMenu}
        className="text-zinc-400 hover:text-white transition-colors pr-4"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}

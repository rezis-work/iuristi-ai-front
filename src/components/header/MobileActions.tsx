"use client";

import { Menu, X, Search } from "lucide-react";

interface MobileActionsProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onToggleSearch: () => void;
}

export function MobileActions({
  isMenuOpen,
  onToggleMenu,
  onToggleSearch,
}: MobileActionsProps) {
  return (
    <div className="lg:hidden flex items-center gap-3 sm:gap-2 ml-auto">
      <button
        onClick={onToggleSearch}
        className="text-zinc-400 hover:text-white transition-colors pl-3 absolute right-23"
        aria-label="ძიების გახსნა"
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleMenu}
        className="text-zinc-400 hover:text-white transition-colors"
        aria-label="მენიუს გადართვა"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6 ml-2 mr-4" />
        )}
      </button>
    </div>
  );
}

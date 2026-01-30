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
        className="text-zinc-400 hover:text-white transition-colors pl-3"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleMenu}
        className="text-zinc-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6 mr-4" />
        )}
      </button>
    </div>
  );
}

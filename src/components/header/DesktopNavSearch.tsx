"use client";

import { Search } from "lucide-react";

interface DesktopNavSearchProps {
  onClick: () => void;
}

export function DesktopNavSearch({ onClick }: DesktopNavSearchProps) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex items-center mt-1 text-zinc-400 hover:text-white transition-colors py-2 pb-3 cursor-pointer"
      aria-label="ძიების გახსნა"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}

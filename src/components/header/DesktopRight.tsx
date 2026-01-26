"use client";

import { Phone } from "lucide-react";

export function DesktopRight() {
  return (
    <div className="hidden lg:flex items-center gap-6 ml-auto">
      <div className="flex items-center gap-2 text-white">
        <Phone className="w-5 h-5" />
        <span className="text-lg font-medium">1 800 444 56 57</span>
      </div>
      <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded transition-colors uppercase text-sm">
        Let&apos;s Talk
      </button>
    </div>
  );
}

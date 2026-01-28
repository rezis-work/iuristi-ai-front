"use client";

import { User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

interface DesktopRightProps {
  user?: {
    name?: string;
    image?: string;
  };
}

export function DesktopRight({ user }: DesktopRightProps) {
  return (
    <div className="hidden lg:flex items-center gap-6 ml-auto select-none">
      <div className="flex items-center gap-2 text-zinc-200">
        {user ? (
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={user.image}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-700 text-zinc-200">
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="ring-1 ring-zinc-500 p-2 rounded-full">
            <User className="w-5 h-5" />
          </div>
        )}
        {user?.name && <span className="text-sm font-medium">{user.name}</span>}
      </div>
      <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded transition-colors uppercase text-sm">
        Let&apos;s Talk  
      </button>
    </div>
  );
}

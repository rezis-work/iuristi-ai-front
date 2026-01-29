"use client";

import { User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import SheardButton from "@/src/components/shared/SheardButton";

interface DesktopRightProps {
  user?: {
    name?: string;
    image?: string;
  };
  className?: string;
}

export function UserAvatar({ user, className }: DesktopRightProps) {
  return (
    <div className={`items-center gap-6 ml-auto select-none ${className}`}>
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
        {user?.name && (
          <span className="text-sm font-medium hidden lg:flex">
            {user.name}
          </span>
        )}
      </div>
      <SheardButton className="uppercase text-black hidden text-xs lg:flex px-7 py-5.5">
        Let&apos;s Talk
      </SheardButton>
    </div>
  );
}

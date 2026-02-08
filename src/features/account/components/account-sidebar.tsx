"use client";

import { useMemo } from "react";
import { useMe } from "@/src/features/auth/hook/use-getme";
import { useLogOut } from "@/src/features/auth/hook/auth";
import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { MONTHS_EN } from "@/src/features/account/constants/months";
import { Account } from "@/src/features/auth/api/get-account";

function formatEnglishDate(dateString?: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  const day = d.getDate();
  const monthName = MONTHS_EN[d.getMonth()] ?? "";
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function AccountSidebar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogOut();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const createdAtFormatted = useMemo(
    () => formatEnglishDate((user as Account & { createdAt?: string })?.createdAt),
    [user],
  );

  const moviesWatched = 12;

  return (
    <aside className="w-full rounded-sm bg-[#1A1A1A] px-5 pt-8 pb-0 flex flex-col items-center sm:max-w-auto md:mx-auto lg:mx-0 md:w-62 lg:w-72">
      <div className="relative mb-5 h-36 w-36 rounded-full select-none border-[3px] border-[#ff9D4D] bg-[#2B2925] flex items-center justify-center overflow-hidden sm:h-40 sm:w-40">
        <Avatar className="h-28 w-28 border border-black/40 bg-black/40 sm:h-32 sm:w-32">
          <AvatarImage
            // src={user?.imageUrl || undefined}
            alt={user?.name || "User avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#2B2925] text-2xl sm:text-3xl font-semibold text-neutral-100">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <h1 className="mb-6 text-center text-[20px] sm:text-[22px] font-semibold tracking-wide text-neutral-100">
        {user?.name || "Notarius"}
      </h1>
      <div className="mb-6 w-full py-3 flex flex-col gap-3 text-xs text-neutral-300">
        <div className="flex items-center justify-between gap-2">
          <span className="text-neutral-400">Registered at</span>
          <span className="font-medium text-neutral-200 text-right">
            {createdAtFormatted}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-neutral-400">Movies watched</span>
          <span className="font-medium text-neutral-200 text-right">
            {moviesWatched}
          </span>
        </div>
      </div>
      <div className="mt-auto w-full">
        <div className="w-[calc(100%+40px)] -mx-5 bg-[#151515] rounded-b-sm">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-4 text-[13px] sm:text-[14px] font-medium text-neutral-300 hover:bg-[#202020] rounded-b-sm hover:text-neutral-50 transition-colors duration-150 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

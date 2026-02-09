"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ParkingSquare,
  Settings,
  User as UserIcon,
} from "lucide-react";

import { useLogOut } from "@/src/features/auth/hook/auth";
import { useMe } from "@/src/features/auth/hook/use-getme";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";

interface UserMenuProps {
  className?: string;
}

export function LoginCard({ className }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: user } = useMe();
  const { mutate: logout } = useLogOut();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !dropdownRef.current.querySelector("button")?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside, true);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/login");
  };

  const handleProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/me/profile");
    setIsOpen(false);
  };

  const handleSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/me/settings");
    setIsOpen(false);
  };

  const handleChangePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/me/change-password");
    setIsOpen(false);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    setIsOpen(false);
  };

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  if (!user) {
    return (
      <div className={`flex items-center ml-auto select-none ${className}`}>
        <button
          type="button"
          onClick={handleLogin}
          className="p-1.5 sm:p-2 md:p-2.5 rounded-full border border-[#ff9D4D] text-[#ff9D4D] hover:bg-[#ff9D4D] hover:text-black transition-colors duration-200 cursor-pointer"
          aria-label="Sign in"
        >
          <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </button>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className={`relative flex items-center gap-1.5 sm:gap-3 md:gap-4 ml-auto select-none ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center gap-1 sm:gap-1.5 md:gap-2 py-0.5 sm:py-1 md:py-1.5 bg-black/60 text-white hover:bg-black cursor-pointer transition-colors duration-200 px-1 sm:px-1.5 md:px-0"
        aria-label="Open user menu"
      >
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 border border-[#ff9D4D]/70 bg-[#ff9D4D] text-black shrink-0">
          <AvatarImage
            alt={user.name || "User avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#ff9D4D] text-black text-[10px] sm:text-[11px] md:text-xs font-semibold leading-none">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute -right-8 md:right-0 top-21 md:top-23 min-w-55 sm:min-w-60 md:min-w-55 rounded-tl-[34px] sm:rounded-tl-[34px] md:rounded-tl-[41px] rounded-bl-[35px] rounded-br-[37px] bg-black z-50">
          {/* Header */}
          <div className="px-2.5 sm:px-3 md:pl-2 md:pr-4 py-2.5 sm:py-2.5 md:py-2 flex flex-row-reverse md:flex-row gap-2 sm:gap-2.5 md:gap-3 mb-3 sm:mb-3.5 md:mb-5 bg-zinc-900 rounded-tl-[34px] sm:rounded-tl-[34px] md:rounded-tl-[38px] md:rounded-bl-[37px] rounded-br-[30px] sm:rounded-br-[24px] md:rounded-br-[38px]">
            <Avatar className="w-9 h-9 sm:w-11 sm:h-11 md:w-15 md:h-15 ring-2 rounded-tr-2xl md:rounded-full ring-zinc-700 bg-[#ff9D4D] text-black shrink-0">
              <AvatarImage
                alt={user.name || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#ff9D4D] text-black text-xs sm:text-sm md:text-lg font-semibold leading-none">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start text-center sm:text-left min-w-0 flex-1">
              <span className="text-sm sm:text-sm md:text-lg font-medium truncate">
                {user.name}
              </span>
              <span className="text-[11px] sm:text-xs md:text-[15px] text-gray-400 line-clamp-1 sm:line-clamp-1 md:line-clamp-2 mt-0.5">
                {user.email}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="text-[11px] sm:text-xs md:text-sm text-gray-200">
            <div className="mx-2.5 rounded-tl-lg sm:rounded-tl-xl md:rounded-tl-2xl rounded-br-lg sm:rounded-br-xl md:rounded-br-2xl mb-2 sm:mb-3 md:mb-5 space-y-1 sm:space-y-1 md:space-y-0">
              <button
                type="button"
                onClick={handleProfile}
                className="w-full flex items-center cursor-pointer bg-zinc-900/90 hover:bg-zinc-900 rounded-tl-3xl rounded-tr-3xl md:rounded-tr-none md:rounded-tl-4xl mb-1 sm:mb-1.5 md:mb-4 md:rounded-br-4xl gap-1.5 sm:gap-2 md:gap-3 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-4 transition-colors text-left border border-transparent hover:border-neutral-700"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <span className="truncate">Profile</span>
              </button>

              <button
                type="button"
                onClick={handleSettings}
                className="w-full flex items-center cursor-pointer bg-zinc-900/90 hover:bg-zinc-900 md:rounded-bl-4xl mb-1 sm:mb-1.5 md:mb-4 md:rounded-tr-4xl gap-1.5 sm:gap-2 md:gap-3 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-4 transition-colors text-left border border-transparent hover:border-neutral-700 rounded-none"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <span className="truncate">Settings</span>
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full flex items-center cursor-pointer bg-zinc-900/90 hover:bg-zinc-900 rounded-bl-3xl md:rounded-bl-none md:rounded-tl-4xl rounded-br-3xl md:rounded-br-4xl gap-1.5 sm:gap-2 md:gap-3 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-4 transition-colors text-left border border-transparent hover:border-neutral-700 rounded-none md:rounded-tr-none"
              >
                <ParkingSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
                <span className="truncate">Change password</span>
              </button>
            </div>

            <div className="bg-[#ff9D4D]/95 hover:bg-[#ff9D4D] rounded-bl-[35px] rounded-br-[35px] cursor-pointer transition-colors border border-[#ff9D4D]/30 hover:border-[#ff9D4D]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-1.5 md:gap-2 cursor-pointer  sm:px-3 py-3 sm:py-4 md:py-5 transition-colors text-left text-white font-medium text-[11px] sm:text-xs md:text-sm"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

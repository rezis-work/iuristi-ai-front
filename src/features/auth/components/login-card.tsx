"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useLogOut } from "@/src/features/auth/hook/auth";
import { useMe } from "@/src/features/auth/hook/use-getme";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { menuItems } from "@/src/components/shared/nav-item";

interface UserMenuProps {
  className?: string;
}

const baseItemClasses =
  "w-full flex items-center cursor-pointer bg-zinc-900/90 hover:bg-zinc-900 mb-3 gap-2 px-3 py-2.5 md:py-4 transition-colors text-left border border-transparent hover:border-neutral-700";

const SCROLL_STEP = 80;

const getInitials = (name?: string | null) =>
  name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

const getDynamicRounded = (index: number, lastIndex: number) => {
  const isFirst = index === 0;
  const isLast = index === lastIndex;
  const isOnly = lastIndex === 0;
  const isEven = index % 2 === 0;

  if (isOnly) {
    return "rounded-3xl md:rounded-4xl";
  }
  if (isFirst) {
    return "rounded-tl-3xl rounded-tr-3xl md:rounded-tr-none md:rounded-tl-4xl md:rounded-br-4xl";
  }
  if (isLast) {
    return "rounded-b-3xl md:rounded-bl-4xl md:rounded-br-4xl";
  }
  if (isEven) {
    return "md:rounded-tl-4xl md:rounded-br-4xl";
  }
  return "md:rounded-bl-4xl md:rounded-tr-4xl";
};

export function LoginCard({ className }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsScrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const { data: user, refetch } = useMe();
  const { mutate: logout } = useLogOut();

  const initials = getInitials(user?.name);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    const nextParam = pathname ? encodeURIComponent(pathname) : "";
    router.push(nextParam ? `/login?next=${nextParam}` : "/login");
  };

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    stop(e);
    router.push(path);
    setIsOpen(false);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    logout();
    setIsOpen(false);
  };

  const scrollItems = useCallback(() => {
    const el = itemsScrollRef.current;
    if (!el) return;

    const direction = scrollDirection === "down" ? 1 : -1;

    el.scrollBy({
      top: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  }, [scrollDirection]);

  // refetch + outside click
  useEffect(() => {
    if (!isOpen) return;

    refetch();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !dropdownRef.current.querySelector("button")?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isOpen, refetch]);

  // scroll direction arrow
  useEffect(() => {
    const el = itemsScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

      if (atBottom) setScrollDirection("up");
      else if (atTop) setScrollDirection("down");
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  if (!user) {
    return (
      <div
        className={`flex items-center ml-auto select-none ${className || ""}`}
      >
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

  const avatarNode = user.avatarUrl ? (
    <Avatar className="w-9 h-9 sm:w-11 sm:h-11 border-2 border-[#ff9D4D]/70 bg-[#ff9D4D] text-black shrink-0">
      <AvatarImage
        src={user.avatarUrl}
        alt={user?.name || "User avatar"}
        className="object-cover"
      />
      <AvatarFallback className="bg-[#ff9D4D] text-black text-xs font-semibold leading-none">
        {initials}
      </AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-9 h-9 sm:w-11 sm:h-11 ring-4 rounded-full ring-[#ff9D4D] bg-[#ff9D4D] text-black shrink-0 flex items-center justify-center">
      <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-black" />
    </div>
  );

  const headerAvatarNode = user.avatarUrl ? (
    <Avatar className="w-9 h-9 sm:w-11 sm:h-11 md:w-15 md:h-15 ring-2 rounded-full ring-[#ff9D4D] bg-[#ff9D4D] text-black shrink-0">
      <AvatarImage
        src={user.avatarUrl}
        alt={user?.name || "User avatar"}
        className="object-cover"
      />
      <AvatarFallback className="bg-[#ff9D4D] text-black text-sm md:text-lg font-semibold leading-none">
        {initials}
      </AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-15 md:h-15 ring-4 rounded-full ring-[#ff9D4D] bg-[#ff9D4D] text-black shrink-0 flex items-center justify-center">
      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
    </div>
  );

  return (
    <div
      ref={dropdownRef}
      className={`relative flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto select-none ${className || ""}`}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center gap-2 py-1 bg-black/60 text-white hover:bg-black cursor-pointer transition-colors duration-200 px-1.5 md:px-0"
        aria-label="Open user menu"
      >
        {avatarNode}
      </button>

      {isOpen && (
        <div className="absolute -right-8 md:right-0 top-22 sm:top-23 md:top-24 min-w-56 sm:min-w-60 rounded-tl-[45px] rounded-bl-[35px] rounded-br-[38px] bg-black z-50">
          {/* Header */}
          <div className="px-3 md:px-4 py-2.5 m-2.5 flex flex-row-reverse md:flex-row gap-3 mb-4 bg-zinc-900 rounded-tl-[38px] md:rounded-bl-[37px] rounded-br-[38px]">
            {headerAvatarNode}
            <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-0 flex-1">
              <span className="text-sm md:text-lg font-medium truncate">
                {user?.name}
              </span>
              <span className="text-xs md:text-sm text-gray-400 line-clamp-2 mt-0.5">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Scrollable menu */}
          <div className="text-xs md:text-sm text-gray-200">
            <div className="mx-2.5 mb-5 bg-transparent max-h-64 overflow-hidden flex flex-col">
              <div
                ref={itemsScrollRef}
                className="space-y-1 overflow-y-auto pr-1 no-scrollbar h-36 sm:h-40 md:h-52"
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  const roundedClasses = getDynamicRounded(
                    index,
                    menuItems.length - 1,
                  );

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={handleNavigate(item.path)}
                      className={`${baseItemClasses} ${roundedClasses}`}
                    >
                      <Icon
                        className={`w-4 h-4 md:w-5 md:h-5 shrink-0 transition-colors ${
                          isActive ? "text-[#ff9D4D]" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`truncate transition-colors ${
                          isActive ? "text-[#ff9D4D]" : "text-gray-200"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Arrow + Logout */}
            <div className="bg-[#ff9D4D]/95 relative hover:bg-[#ff9D4D] rounded-bl-[35px] rounded-br-[35px] cursor-pointer transition-colors border border-[#ff9D4D]/30 hover:border-[#ff9D4D]">
              <div className="absolute -top-3 right-1 bg-black rounded-b-full px-2">
                <button
                  type="button"
                  onClick={scrollItems}
                  className="text-gray-300 cursor-pointer"
                >
                  {scrollDirection === "down" ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronUp className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center cursor-pointer gap-2 sm:px-3 py-3 sm:py-4 md:py-5 text-left text-white font-medium text-xs md:text-sm"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

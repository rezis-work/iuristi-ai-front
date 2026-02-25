"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLogOut } from "@/src/features/auth/hook/auth";
import { useMe } from "@/src/features/auth/hook/use-getme";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { LoginForm } from "@/src/features/auth/components/login-form";
import { menuItems } from "@/src/components/shared/nav-item";

interface UserMenuProps {
  className?: string;
}

const getInitials = (name?: string | null) =>
  name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "მ";

export function LoginCard({ className }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = useMe();
  const { mutate: logout } = useLogOut();

  const initials = getInitials(user?.name);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    stop(e);
    setLoginOpen(true);
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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
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
  }, [isOpen]);

  if (!user) {
    return (
      <>
        <div
          className={`flex items-center ml-auto select-none ${className || ""}`}
        >
          <button
            type="button"
            onClick={handleLogin}
            className="p-1.5 sm:p-2 md:p-2.5 rounded-full border border-[#ff9D4D] text-[#ff9D4D] hover:bg-[#ff9D4D] hover:text-black transition-colors duration-200 cursor-pointer"
            aria-label="შესვლა"
          >
            <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </button>
        </div>
        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden [&>button]:text-zinc-400 [&>button]:hover:text-white">
            <DialogTitle className="sr-only">შესვლა</DialogTitle>
            <LoginForm
              onClose={() => setLoginOpen(false)}
              next={pathname || undefined}
              compact
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const avatarNode = user.avatarUrl ? (
    <Avatar className="w-9 h-9 sm:w-11 sm:h-11 ring-2 ring-[#ff9D4D]/60 ring-offset-2 ring-offset-black bg-zinc-800 text-white shrink-0 transition-all duration-300 hover:ring-[#ff9D4D] hover:scale-105 cursor-pointer">
      <AvatarImage
        src={user.avatarUrl ?? undefined}
        alt={user?.name || "მომხმარებლის ავატარი"}
        className="object-cover"
      />
      <AvatarFallback className="bg-linear-to-br from-[#ff9D4D] to-[#ff7D2D] text-white text-xs font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-[#ff9D4D]/60 ring-offset-2 ring-offset-black bg-linear-to-br from-[#ff9D4D] to-[#ff7D2D] text-white shrink-0 flex items-center justify-center transition-all duration-300 hover:ring-[#ff9D4D] hover:scale-105 cursor-pointer">
      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
  );

  return (
    <div
      ref={dropdownRef}
      className={`relative flex items-center ml-auto select-none ${className || ""}`}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9D4D] focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="მომხმარებლის მენიუს გახსნა"
      >
        {avatarNode}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute right-0 top-full mt-3 w-[320px] min-w-[320px] z-50 origin-top-right"
          >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
              {/* User info section */}
              <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-[#ff9D4D]/40 ring-offset-2 ring-offset-zinc-900 shrink-0">
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user?.name || "მომხმარებელი"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-linear-to-br from-[#ff9D4D] to-[#ff7D2D] text-white text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-white truncate">
                      {user?.name || "მომხმარებელი"}
                    </p>
                    <p className="text-[13px] text-zinc-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      type="button"
                      onClick={handleNavigate(item.path)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#ff9D4D]/15 text-[#ff9D4D]"
                          : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? "text-[#ff9D4D]" : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />
                      <span className="text-[14px] font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/30">
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-linear-to-r from-[#ff9D4D] to-[#ff8D3D] text-white font-semibold text-[15px] shadow-lg shadow-[#ff9D4D]/20 hover:shadow-[#ff9D4D]/30 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  გასვლა
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

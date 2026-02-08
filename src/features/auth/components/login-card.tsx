// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { User } from "lucide-react";

// interface DesktopRightProps {
//   className?: string;
// }

// export function LoginCard({ className }: DesktopRightProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const handleRegister = () => {
//     router.push("/register");
//   };

//   return (
//     <div className={`flex items-center gap-6 ml-auto select-none ${className}`}>
//       <button
//         onClick={handleRegister}
//         className="p-2 rounded-full border border-[#ff9D4D] text-[#ff9D4D] hover:bg-[#ff9D4D] hover:text-black transition-colors duration-200 cursor-pointer"
//         aria-label="Register"
//       >
//         <User className="w-5 h-5" />
//       </button>
//     </div>
//   );
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

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
        !dropdownRef.current.querySelector('button')?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Use click event with a small delay to allow button click to complete first
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
          className="p-2 rounded-full border border-[#ff9D4D] text-[#ff9D4D] hover:bg-[#ff9D4D] hover:text-black transition-colors duration-200 cursor-pointer"
          aria-label="Sign in"
        >
          <UserIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ✅ ავტორიზებული → ავატარი + dropdown
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className={`relative flex items-center gap-6 ml-auto select-none ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        className="flex items-center gap-2 py-1.5 bg-black/60 text-white hover:bg-black cursor-pointer transition-colors duration-200"
        aria-label="Open user menu"
      >
        <Avatar className="w-9 h-9 border border-[#ff9D4D]/70 bg-[#ff9D4D] text-black">
          <AvatarImage
            // src={user.imageUrl || undefined}
            alt={user.name || "User avatar"}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#ff9D4D] text-black text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-22 min-w-55 rounded-tl-[37px] rounded-br-[30px] bg-black z-[70] shadow-2xl">
          <div className="pl-3 pr-4 py-3 border-b border-neutral-800 flex items-center gap-3 mb-5 bg-zinc-900 rounded-l-[36px] rounded-br-[37px]">
            <Avatar className="w-12 h-12 border border-[#ff9D4D]/70 bg-[#ff9D4D] text-black">
              <AvatarImage
                // src={user.imageUrl || undefined}
                alt={user.name || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#ff9D4D] text-black text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium">{user.name}</span>
              <span className="text-[11px] text-gray-400 line-clamp-1">
                {user.email}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-200">
            <div className="bg-zinc-900 mx-2 rounded-tl-2xl rounded-br-2xl mb-5">
              <button
                type="button"
                onClick={handleProfile}
                className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 transition-colors text-left"
              >
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>Profile</span>
              </button>
            </div>
            <div className="bg-[#ff9D4D] rounded-br-[30px] cursor-pointer">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-5 transition-colors text-left text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

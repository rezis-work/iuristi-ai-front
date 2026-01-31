"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

interface DesktopRightProps {
  className?: string;
}

export function LoginCard({ className }: DesktopRightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className={`hidden lg:flex items-center gap-6 ml-auto select-none ${className}`}>
      <button
        onClick={handleRegister}
        className="p-2 rounded-lg border border-[#ff9D4D] text-[#ff9D4D] hover:bg-[#ff9D4D] hover:text-black transition-colors duration-200"
        aria-label="Register"
      >
        <UserPlus className="w-5 h-5" />
      </button>
    </div>
  );
}

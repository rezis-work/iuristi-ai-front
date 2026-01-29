"use client";

import { User2 } from "lucide-react";


import { useState, useRef, useEffect } from "react";
import { LoginForm } from "@/src/features/auth/components/login-form";
import { LogoutCard } from "@/src/features/auth/components/logout-card";
import { useMe } from "../hook/use-getme";

interface DesktopRightProps {
  className?: string;
}

export function LoginCard({ className }: DesktopRightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: user } = useMe();
  const isLoggedIn = !!user;

  // Outside click detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`items-center gap-6 ml-auto select-none ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-9 h-9 rounded-full bg-red-900 flex items-center justify-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <User2 className="w-5 h-5" />
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-[500px] z-50">
            {isLoggedIn ? (
              <LogoutCard onClose={() => setIsOpen(false)} />
            ) : (
              <LoginForm onClose={() => setIsOpen(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

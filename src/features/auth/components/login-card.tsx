"use client";

import { User2 } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const toggleRouter = () => {
    router.push("/login");
  };

  return (
    <div className={`items-center gap-6 ml-auto select-none ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-9 h-9 rounded-full bg-red-900 flex items-center justify-center cursor-pointer"
          onClick={toggleRouter}
        >
          <User2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

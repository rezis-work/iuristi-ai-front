"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export function Logo({ onClick, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center relative">
        <div className="absolute inset-0 m-1" />
        <span className="text-2xl font-serif font-bold text-white z-10">
          <Image
            src={"/images/download.webp"}
            alt="logo"
            priority
            width={180}
            height={50}
          />
        </span>
      </div>
    </Link>
  );
}

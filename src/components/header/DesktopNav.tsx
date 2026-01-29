"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "@/src/constants/navlinks";
import { DesktopNavItem } from "@/src/components/header/DesktopNavItem";
import { DesktopNavSearch } from "@/src/components/header/DesktopNavSearch";
import { NavLink } from "@/src/types/types";

interface DesktopNavProps {
  hoveredLink: number | null;
  onHover: (index: number | null) => void;
  onSearchClick: () => void;
}

export function DesktopNav({
  hoveredLink,
  onHover,
  onSearchClick,
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-8 select-none">
      {navLinks.map((link, index) => (
        <DesktopNavItem
          key={link.href}
          link={link as NavLink}
          index={index}
          isHovered={hoveredLink === index}
          pathname={pathname}
          onHover={onHover}
        />
      ))}
      <DesktopNavSearch onClick={onSearchClick} />
    </nav>
  );
}

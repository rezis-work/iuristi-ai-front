"use client";

import { useEffect, useState } from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { Logo } from "@/src/components/header/Logo";
import { DesktopNav } from "@/src/components/header/DesktopNav";
import { MobileOverlay } from "@/src/components/header/MobileOverlay";
import { MobileActions } from "@/src/components/header/MobileActions";
import { MobileSearchOverlay } from "@/src/components/header/MobileSearchOverlay";
import { DesktopSearchOverlay } from "@/src/components/header/DesktopSearchOverlay";
import { UserAvatar } from "@/src/components/header/UserAvatar";

export default function Header() {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen, isMobileSearchOpen]);

  const toggleDesktopSearch = () => setIsDesktopSearchOpen((prev) => !prev);

  return (
    <header className="bg-black text-white relative z-40">
      <Wrapper className="mx-auto pl-4 lg:px-4">
        <div className="flex items-center h-25">
          <div className="flex items-center lg:gap-20 xl:gap-40 flex-1">
            <Logo />
            <DesktopNav
              hoveredLink={hoveredLink}
              onHover={setHoveredLink}
              onSearchClick={toggleDesktopSearch}
            />
          </div>
          <UserAvatar
            user={{ name: "John Doe", image: "https://github.com/shadcn.png" }}
            className="hidden lg:flex"
          />
          <MobileActions
            isMenuOpen={isMobileMenuOpen}
            onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
            onToggleSearch={() => setIsMobileSearchOpen((prev) => !prev)}
          />
        </div>
      </Wrapper>

      {/* Mobile menu */}
      <MobileOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile modern search */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      {/* Desktop modern search */}
      <DesktopSearchOverlay
        isOpen={isDesktopSearchOpen}
        onClose={() => setIsDesktopSearchOpen(false)}
      />
    </header>
  );
}

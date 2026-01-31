"use client";

import { useEffect, useState } from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { Logo } from "@/src/components/header/Logo";
import { DesktopNav } from "@/src/components/header/DesktopNav";
import { MobileOverlay } from "@/src/components/header/MobileOverlay";
import { MobileActions } from "@/src/components/header/MobileActions";
import { LoginCard } from "@/src/features/auth/components/login-card";
import { Search } from "@/src/components/header/Search";

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
        <div className="flex items-center h-30">
          <div className="flex items-center lg:gap-20 xl:gap-40 flex-1">
            <Logo />
            <DesktopNav
              hoveredLink={hoveredLink}
              onHover={setHoveredLink}
              onSearchClick={toggleDesktopSearch}
            />
          </div>
          <LoginCard />
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

      {/*Desktop modern search ||  Mobile modern search */}
      <Search
        isOpen={isDesktopSearchOpen || isMobileSearchOpen}
        onClose={() => {
          setIsDesktopSearchOpen(false);
          setIsMobileSearchOpen(false);
        }}
        className=""
      />
    </header>
  );
}

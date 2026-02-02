"use client";

import React, { useEffect, useState, useRef } from "react";
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

  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 620;
    const threshold = headerHeight * 2;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 1200) {
        setIsFixed(false);
        setIsVisible(false);
        return;
      }

      if (currentScrollY > threshold) {
        if (!isFixed) {
          setIsFixed(true);
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      } else {
        setIsFixed(false);
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed]);

  const toggleDesktopSearch = () => setIsDesktopSearchOpen((prev) => !prev);

  return (
    <React.Fragment>
      {isFixed && (
        <div style={{ height: headerRef.current?.offsetHeight || 120 }} />
      )}
      <header
        ref={headerRef}
        className={`bg-black text-white z-60 transition-transform duration-300 ease-out ${
          isFixed
            ? `fixed top-0 left-0 right-0 ${isVisible ? "translate-y-0" : "-translate-y-full"}`
            : "relative"
        }`}
      >
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
        <MobileOverlay
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <Search
          isOpen={isDesktopSearchOpen || isMobileSearchOpen}
          onClose={() => {
            setIsDesktopSearchOpen(false);
            setIsMobileSearchOpen(false);
          }}
          className=""
        />
      </header>
    </React.Fragment>
  );
}

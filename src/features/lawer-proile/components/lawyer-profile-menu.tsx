"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { menuItems } from "@/src/components/shared/nav-item";

export function LawyerProfileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;

    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft >= maxScrollLeft - 1);
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  return (
    <header>
      <aside className="w-full mb-4 py-4 px-2 rounded-sm bg-zinc-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={atStart}
            className={`shrink-0 2xl:hidden transition-all duration-200 ${
              atStart
                ? "text-zinc-600 cursor-default opacity-90"
                : "text-zinc-400 hover:text-white hover:scale-110"
            }`}
            onClick={() => {
              const scroller = scrollRef.current;
              if (scroller)
                scroller.scrollBy({ left: -150, behavior: "smooth" });
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            id="header-menu-scroll"
            ref={scrollRef}
            onScroll={updateScrollState}
            className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scroll-smooth snap-x snap-mandatory touch-pan-x select-none"
          >
            {menuItems.map(({ path, label, icon: Icon }) => (
              <div key={path} className="shrink-0 snap-center px-1">
                <button
                  onClick={() => router.push(path)}
                  className={`min-w-33.75 sm:min-w-28.75 py-3 px-2 flex flex-col cursor-pointer sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs font-medium transition-all duration-200 hover:scale-[1.02] group whitespace-nowrap touch-manipulation ${
                    pathname === path
                      ? "text-[#ff9D4D]"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-4 sm:h-4 shrink-0 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="truncate text-center leading-tight font-semibold">
                    {label}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={atEnd}
            className={`shrink-0 2xl:hidden transition-all duration-200 ${
              atEnd
                ? "text-zinc-600 cursor-default opacity-90"
                : "text-zinc-400 hover:text-white hover:scale-110"
            }`}
            onClick={() => {
              const scroller = scrollRef.current;
              if (scroller)
                scroller.scrollBy({ left: 150, behavior: "smooth" });
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </header>
  );
}



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
            className={`shrink-0 lg:hidden transition-all duration-200 ${
              atStart
                ? "text-zinc-600 cursor-default opacity-90"
                : "text-zinc-400 hover:text-white hover:scale-110 cursor-pointer"
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
            className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1 scroll-smooth snap-x snap-mandatory touch-pan-x select-none"
          >
            {menuItems.map(({ path, label, icon: Icon }) => (
              <div key={path} className="shrink-0 snap-center px-0.5">
                <button
                  onClick={() => router.push(path)}
                  className={`min-w-[128px] sm:min-w-[138px] py-2.5 px-2 flex flex-col cursor-pointer items-center justify-center gap-1 text-xs font-medium transition-all duration-200 hover:scale-[1.02] group whitespace-normal text-center touch-manipulation rounded-md border ${
                    pathname === path
                      ? "text-[#ff9D4D] bg-[#ff9D4D]/12 border-[#ff9D4D]/35"
                      : "text-zinc-200 border-transparent hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-4 sm:h-4 shrink-0 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="text-center leading-tight font-semibold max-w-[112px] wrap-break-word">
                    {label}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={atEnd}
            className={`shrink-0 lg:hidden transition-all duration-200 ${
              atEnd
                ? "text-zinc-600 cursor-default opacity-90"
                : "text-zinc-400 hover:text-white hover:scale-110 cursor-pointer"
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



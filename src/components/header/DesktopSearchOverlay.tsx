"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";
import Wrapper from "@/src/components/shared/wrapper";

interface DesktopSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopSearchOverlay({
  isOpen,
  onClose,
}: DesktopSearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="desktop-search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-full left-0 w-full"
        >
          <div className="backdrop-blur-xl bg-black border-b border-zinc-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
            <Wrapper className="mx-auto">
              <motion.div
                initial={{ y: -10, opacity: 0, scale: 0.98 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.28,
                    ease: [0.22, 0.61, 0.36, 1],
                  },
                }}
                exit={{
                  y: -8,
                  opacity: 0,
                  scale: 0.99,
                  transition: {
                    duration: 0.18,
                    ease: [0.4, 0.0, 0.2, 1],
                  },
                }}
                className="py-5 flex items-center gap-5"
              >
                <div className="flex-1 relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-zinc-50/5 via-zinc-50/0 to-zinc-50/5 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search across pages, services, and resources..."
                    className="relative w-full border-b py-3 pl-11 pr-4 text-[17px] outline-none lg:text-[18px] text-white placeholder:text-zinc-500 transition-colors"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 p-2 rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </Wrapper>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, Search } from "lucide-react";
import Wrapper from "@/src/components/shared/wrapper";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-full left-0 w-full bg-black overflow-hidden z-40"
        >
          <Wrapper className="mx-auto">
            <div className="py-8 flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-zinc-400 outline-none text-white text-xl lg:text-2xl py-4 placeholder:text-zinc-600 transition-colors"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600" />
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </Wrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

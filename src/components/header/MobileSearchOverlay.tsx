"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({
  isOpen,
  onClose,
}: MobileSearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.25,
                ease: [0.22, 0.61, 0.36, 1],
              },
            }}
            exit={{
              y: -60,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1],
              },
            }}
            className="relative z-10 px-4 pt-5 pb-4 bg-zinc-900 border-b border-zinc-800 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Search
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.25 },
              }}
              className="relative"
            >
              <input
                autoFocus
                type="text"
                placeholder="What are you looking for?"
                className="w-full bg-zinc-900 border-b py-3 pl-11 pr-4 text-[16px] text-white placeholder:text-zinc-500 outline-none transition-colors"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

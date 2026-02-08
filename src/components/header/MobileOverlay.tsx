"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import {
  overlayVariants,
  itemVariants,
} from "@/src/components/header/lib/variants";
import { Logo } from "@/src/components/header/Logo";
import { MobileNavAccordion } from "@/src/components/header/MobileNavAccordion";
import { SocialIcons } from "@/src/components/header/SocialIcons";
import { RightColumnBlocks } from "@/src/components/header/RightColumnBlocks";
import Wrapper from "@/src/components/shared/wrapper";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="menu-open"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-zinc-900 md:bg-black backdrop-blur-md lg:hidden overflow-y-auto mobile-menu-overlay"
        >
          <div className="flex flex-col min-h-full">
            <Wrapper className="px-0">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between px-4 pt-5 pb-3"
              >
                <Logo onClick={onClose} />
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            </Wrapper>
            <div className="flex-1 md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:h-full">
              <div className="bg-zinc-900 h-full md:h-full md:overflow-y-auto md:flex md:flex-col md:justify-center md:items-start">
                <div className="px-4 pt-5 pb-6 md:pt-0 md:pb-0 md:w-full">
                  <MobileNavAccordion onLinkClick={onClose} />
                  <SocialIcons />
                </div>
              </div>
              <RightColumnBlocks />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

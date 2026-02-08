"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { rightColumnBlocks } from "@/src/components/header/constants";
import { rightColumnContainer, rightColumnItem } from "@/src/components/header/lib/variants";

export function RightColumnBlocks() {
  return (
    <div className="hidden md:flex bg-zinc-800 h-full min-h-full">
      <motion.div
        className="flex flex-1 flex-col items-start justify-center px-10 gap-10"
        variants={rightColumnContainer}
        initial="hidden"
        animate="visible"
      >
        {rightColumnBlocks.map((block) => (
          <motion.button
            key={block.eyebrow}
            variants={rightColumnItem}
            whileHover={{
              x: 8,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.97 }}
            className="space-y-2 text-left focus:outline-none"
          >
            <p className="text-sm uppercase tracking-[0.08em] text-zinc-400">
              {block.eyebrow}
            </p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                {block.title}
              </p>
              {block.showArrow && (
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="inline-flex"
                >
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                </motion.span>
              )}
            </div>
            {block.underline && (
              <motion.div
                className="mt-1 h-px w-full max-w-xs bg-zinc-500 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

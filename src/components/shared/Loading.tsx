"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[120px]">
      <div className="relative size-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-neutral-700 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent border-b-primary/60"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <motion.p
        className="text-sm text-muted-foreground font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}

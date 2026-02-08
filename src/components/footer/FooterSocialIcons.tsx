"use client";

import { motion } from "motion/react";
import { socials } from "@/src/constants/socials";

export function FooterSocialIcons() {
  return (
    <motion.div
      key="socials"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <div className="flex items-center gap-3">
        {socials.map((item, idx) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={{
              hidden: { opacity: 0, x: -40, y: 8 },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  duration: 0.32,
                  ease: [0.23, 1, 0.32, 1],
                  delay: 0.05 * idx,
                },
              },
            }}
            whileHover={{
              scale: 1.15,
              y: -4,
              rotate: -4,
            }}
            whileTap={{ scale: 0.9, rotate: 0, y: 0 }}
            className="group relative"
          >
            <div className="flex items-center justify-center overflow-hidden bg-zinc-900 p-2.5 rounded-full">
              <motion.div
                className={`absolute inset-0`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="absolute inset-1"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <item.Icon
                className={`
                  relative z-10 w-5 h-5 transition-colors duration-200
                  ${item.iconClass}
                `}
              />
            </div>
            <span className="sr-only">{item.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

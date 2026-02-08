"use client";

import { motion } from "motion/react";
import { socials } from "@/src/constants/socials";

export function SocialIcons() {
  return (
    <motion.div
      key="socials"
      className="pt-4"
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
      <motion.div
        className="h-px bg-zinc-800 origin-left"
        variants={{
          hidden: { scaleX: 0, x: -40 },
          visible: {
            scaleX: 1,
            x: 0,
            transition: {
              duration: 0.5,
              ease: [0.22, 0.61, 0.36, 1],
            },
          },
        }}
      />

      <div className="mt-4 flex items-center gap-3">
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
              boxShadow: "0 0 18px rgba(255,255,255,0.20)",
            }}
            whileTap={{ scale: 0.9, rotate: 0, y: 0 }}
            className="group relative"
          >
            <div className="flex items-center justify-center overflow-hidden">
              <motion.div
                className={`absolute inset-0 bg-linear-to-br ${item.iconClass}`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="absolute inset-1 rounded-full border border-white/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <item.Icon className="relative z-10 w-5 h-5 text-zinc-200 group-hover:text-white transition-colors duration-200" />
            </div>
            <span className="sr-only">{item.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { Variants } from "framer-motion";

export const overlayVariants: Variants = {
  hidden: { opacity: 0, y: "-110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      type: "tween",
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.14,
    },
  },
  exit: {
    opacity: 0,
    y: "-110%",
    transition: {
      type: "tween",
      duration: 0.45,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.98,
    transition: {
      duration: 0.22,
      ease: [0.4, 0.0, 1, 1],
    },
  },
};

export const rightColumnContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

export const rightColumnItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

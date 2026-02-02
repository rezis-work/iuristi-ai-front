import { Variants } from "motion/react";

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
    scaleY: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const borderVariants: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
};

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export function ContingencyVictoryHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/videoImage/videoimage.jpg"
          alt="Lawyer signing documents"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45 md:bg-black/40" />
      </div>
      <div className="relative flex h-full min-h-[80vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.button
          type="button"
          onClick={() => setIsVideoOpen(true)}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="mb-10 flex h-19 w-19 items-center justify-center rounded-full border-2 border-white/70 bg-black backdrop-blur hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        >
          <span className="ml-0.5 inline-block translate-x-px border-l-11 border-l-white border-y-[7px] border-y-transparent" />
        </motion.button>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="mb-6 text-xs tracking-[0.32em] font-bold uppercase text-zinc-200"
        >
          Tell us about your case
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-5xl"
        >
          We work on contingency: you don&apos;t owe anything until we win!
        </motion.h1>
      </div>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          >
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative z-10 w-full max-w-4xl aspect-video overflow-hidden rounded-sm bg-black shadow-sm"
            >
              <iframe
                src="https://player.vimeo.com/video/319033437?autoplay=1&title=0&byline=0&portrait=0"
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

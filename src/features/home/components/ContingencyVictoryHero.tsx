"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export function ContingencyVictoryHero() {
  const [isVideoOpen, setIsVideoOpen] = useQueryState("videoOpen", {
    defaultValue: false,
    history: "replace",
    parse: (value) => value === "true",
    serialize: (value) => value.toString(),
  });
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

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
        <div className="absolute inset-0 bg-black/15" />
      </div>
      <div className="relative flex h-full min-h-[80vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.button
          type="button"
          onClick={() => setIsVideoOpen(true)}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          initial={{ scale: 0.7, opacity: 0, y: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: isButtonHovered ? 10 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.6,
          }}
          className="mb-10 flex h-19 w-19 items-center justify-center rounded-full border-2 border-white/70 bg-black transition-colors duration-200 cursor-pointer group"
        >
          <motion.span
            className="ml-0.5 inline-block translate-x-px border-l-11 border-l-white border-y-[7px] border-y-transparent transition-transform duration-200"
            animate={{ x: isButtonHovered ? 2 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
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
          className="max-w-5xl text-balance text-3xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <button
              type="button"
              onClick={closeVideo}
              className="absolute inset-0 h-full w-full cursor-default"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative z-10 w-[90%] lg:max-w-7xl aspect-video rounded-xs bg-black"
            >
              <button
                type="button"
                onClick={closeVideo}
                className="absolute -top-5 -right-5  sm:-top-8 sm:-right-8 z-50 cursor-pointer hover:rotate-45 hover:scale-110 transition-all duration-100 ease-in-out"
              >
                <X className="h-5 w-5 sm:w-8 sm:h-8 text-zinc-400 hover:text-white transition-all duration-100 ease-in-out" />
              </button>
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

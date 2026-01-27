"use client";

import { motion } from "motion/react";
import Wrapper from "@/src/components/shared/wrapper";
import { Button } from "@/src/components/ui/button";
import Counter from "@/src/features/home/components/Counter";
import NewsPartners from "./NewsPartners";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/bg-2.jpg')",
            }}
          />
        </div>
        <div className="relative z-10 flex min-h-screen items-center py-20 md:py-0">
          <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-24">
            <div className=" max-w-lg lg:max-w-4xl">
              <motion.h1
                className="mb-4 text-4xl font-extrabold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Protecting Your
                <br />
                <span className="bg-linear-to-r from-orange-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Personal Rights
                </span>
              </motion.h1>
              <motion.p
                className="mb-6 text-base text-neutral-300 sm:mb-8 sm:text-lg md:text-xl lg:max-w-2xl"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden select-none bg-orange-400 rounded-xs px-4 py-5 text-sm font-semibold text-white transition-all hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/30 lg:px-8 lg:py-7 lg:text-base"
                >
                  <span className="relative z-10">FIND OUT MORE</span>
                </Button>
              </motion.div>
              <motion.div
                className="mt-12 sm:mt-16 lg:mt-20"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:gap-20 select-none">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:text-sm">
                      Years of experience
                    </p>
                    <div className="text-5xl font-black text-white sm:text-6xl lg:text-7xl">
                      <Counter targetValue={14} fontSize={56} color="white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:text-sm">
                      Successful legal cases
                    </p>
                    <div className="text-5xl font-black text-white sm:text-6xl lg:text-7xl">
                      <Counter targetValue={783} fontSize={56} color="white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Wrapper>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full bg-linear-to-l from-orange-500/5 via-transparent to-transparent opacity-50 md:w-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/4 w-full bg-linear-to-t from-black/60 to-transparent md:h-1/3" />
      </section>
      <div>
        <NewsPartners />
      </div>
    </>
  );
}

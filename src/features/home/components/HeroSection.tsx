"use client";

import { motion } from "motion/react";
import Wrapper from "@/src/components/shared/wrapper";
import Counter from "@/src/features/home/components/Counter";
import NewsPartners from "@/src/features/home/components/NewsPartners";
import SheardButton from "@/src/components/shared/SheardButton";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden select-none">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/bg-2.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center py-20 md:py-0">
          <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
            <div className=" max-w-lg lg:max-w-3xl">
              <motion.h1
                className="mb-4 text-4xl font-bold leading-tight text-zinc-200 sm:mb-6 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Protecting Your
                <br />
                <span>Personal Rights</span>
              </motion.h1>
              <motion.p
                className="mb-6 text-base text-zinc-200 sm:mb-8 sm:text-lg md:text-xl lg:max-w-2xl"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Nemo enim ipsam voluptatem quia voluptas sit.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7">
                  Find out more
                </SheardButton>
              </motion.div>
              <motion.div
                className="mt-12 sm:mt-16 lg:mt-20"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:gap-20 text-zinc-200 select-none max-w-lg">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
                      Years of experience
                    </p>
                    <div className="text-5xl font-black text-white sm:text-6xl lg:text-6xl">
                      <Counter targetValue={14} fontSize={56} color="white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
                      Successful legal cases
                    </p>
                    <div className="text-5xl font-black text-white sm:text-6xl lg:text-6xl">
                      <Counter
                        targetValue={783}
                        fontSize={56}
                        color="#e7e3e3"
                      />
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

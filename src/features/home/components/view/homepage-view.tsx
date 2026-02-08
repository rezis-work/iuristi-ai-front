"use client";

import React, { Suspense } from "react";
import { motion } from "motion/react";
import HeroSection from "@/src/features/home/components/HeroSection";
import TopServices from "@/src/features/home/components/TopServices";
import LegalAdvisoryHero from "@/src/features/home/components/LegalAdvisoryHero";
import TestimonialsSection from "@/src/features/home/components/TestimonialsSection";

import { ContingencyVictoryHero } from "@/src/features/home/components/ContingencyVictoryHero";
import AwardsShowcase from "@/src/features/home/components/AwardsShowcase";
import RecentBlogSection from "@/src/features/home/components/RecentBlogSection";
import ContactMapSection from "@/src/components/shared/ContactMapSection";
import { Spinner } from "@/src/components/ui/spinner";

export function HomepageView() {
  return (
    <React.Fragment>
      <section className="space-y-15">
        <HeroSection />
        <TopServices />
        <LegalAdvisoryHero />
        <TestimonialsSection />
        <Suspense
          fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative min-h-[80vh] w-full overflow-hidden flex items-center justify-center"
            >
              <Spinner className="size-8 text-[#FF9D4D]" />
            </motion.div>
          }
        >
          <ContingencyVictoryHero />
        </Suspense>
        <AwardsShowcase />
        <RecentBlogSection />
        <ContactMapSection />
      </section>
    </React.Fragment>
  );
}

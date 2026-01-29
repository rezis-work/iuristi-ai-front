import React from "react";
import HeroSection from "@/src/features/home/components/HeroSection";
import TopServices from "@/src/features/home/components/TopServices";
import LegalAdvisoryHero from "@/src/features/home/components/LegalAdvisoryHero";

export function HomepageView() {
  return (
    <React.Fragment>
      <section className="space-y-5">
        <HeroSection />
        <TopServices />
        {/* <div className="py-10"> */}
        <LegalAdvisoryHero />
        {/* </div> */}
      </section>
    </React.Fragment>
  );
}

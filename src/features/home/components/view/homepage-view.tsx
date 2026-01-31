import React from "react";
import HeroSection from "@/src/features/home/components/HeroSection";
import TopServices from "@/src/features/home/components/TopServices";
import LegalAdvisoryHero from "@/src/features/home/components/LegalAdvisoryHero";
import TestimonialsSection from "@/src/features/home/components/TestimonialsSection";
import { LoginForm } from "@/src/features/auth/components/login-form";
import { ContingencyVictoryHero } from "@/src/features/home/components/ContingencyVictoryHero";
import AwardsShowcase from "@/src/features/home/components/AwardsShowcase";
import RecentBlogSection from "@/src/features/home/components/RecentBlogSection";
import ContactMapSection from "@/src/features/home/components/ContactMapSection";

export function HomepageView() {
  return (
    <React.Fragment>
      <section className="space-y-15">
        <HeroSection />
        <TopServices />
        <LegalAdvisoryHero />
        <TestimonialsSection />
        <ContingencyVictoryHero />
        <AwardsShowcase />
        <RecentBlogSection />
        <ContactMapSection />
      </section>
    </React.Fragment>
  );
}

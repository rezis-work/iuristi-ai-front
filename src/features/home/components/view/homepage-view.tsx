import React from "react";
import HeroSection from "@/src/features/home/components/HeroSection";
import TopServices from "@/src/features/home/components/TopServices";
import LegalAdvisoryHero from "@/src/features/home/components/LegalAdvisoryHero";
import { LoginForm } from "@/src/features/auth/components/login-form";

export function HomepageView() {
  return (
    <React.Fragment>
      <section className="space-y-5">
        <HeroSection />
        <TopServices />
        <LegalAdvisoryHero />
      </section>
    </React.Fragment>
  );
}

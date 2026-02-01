import React from "react";
import AboutUsPage from "@/src/features/about/components/AboutUsPage";
import LegalSafetyHeroSection from "../LegalSafetyHeroSection";

function AboutPageView() {
  return (
    <React.Fragment>
      <section className="space-y-15">
        <AboutUsPage />
        <LegalSafetyHeroSection />
      </section>
    </React.Fragment>
  );
}

export default AboutPageView;

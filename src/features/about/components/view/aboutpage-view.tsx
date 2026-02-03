import React from "react";
import AboutUsPage from "@/src/features/about/components/AboutUsPage";
import LegalSafetyHeroSection from "../LegalSafetyHeroSection";
import Wrapper from "@/src/components/shared/wrapper";

function AboutPageView() {
  return (
    <React.Fragment>
      <section className="space-y-15">
        <Wrapper className="mx-auto px-4 md:px-6 lg:px-28">
          <LegalSafetyHeroSection />
        </Wrapper>
        <AboutUsPage />
      </section>
    </React.Fragment>
  );
}

export default AboutPageView;

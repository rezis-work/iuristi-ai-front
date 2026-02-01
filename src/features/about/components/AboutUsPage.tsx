import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";

export default function AboutUsPage() {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                About Us
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              We are dedicated to protecting your legal rights
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300 mb-8">
              With over 20 years of experience in the legal industry, we've
              helped thousands of clients navigate complex legal matters with
              expertise and compassion.
            </p>
          </div>
        </Wrapper>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-neutral-900/50 border-y border-neutral-800">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-neutral-300 mb-4">
                To provide exceptional legal services that empower our clients
                and protect their rights. We believe in transparent
                communication, strategic thinking, and delivering results that
                exceed expectations.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-300">
                Our commitment is to be your trusted legal partner through every
                challenge.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Vision
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-neutral-300 mb-4">
                To be recognized as the leading law firm that combines legal
                excellence with innovative solutions. We strive to set new
                standards in legal practice and client satisfaction.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-300">
                We envision a future where justice is accessible to all.
              </p>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Values */}
      <section className="py-20">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Integrity",
                description:
                  "We conduct ourselves with the highest ethical standards.",
              },
              {
                title: "Excellence",
                description:
                  "We pursue perfection in every case and client interaction.",
              },
              {
                title: "Compassion",
                description:
                  "We understand the human side of legal challenges.",
              },
              {
                title: "Innovation",
                description:
                  "We embrace new approaches to solve complex problems.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50"
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-400">{value.description}</p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900/50 border-t border-neutral-800">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to work with us?
          </h2>
          <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you navigate your legal matter.
          </p>
          <a href="/contacts">
            <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7">
              Get in Touch
            </SheardButton>
          </a>
        </Wrapper>
      </section>
    </main>
  );
}

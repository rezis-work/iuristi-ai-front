import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";

export default function PracticeAreasPage() {
  const practices = [
    {
      title: "Family Law",
      description: "Divorce, custody, adoption, and other family matters.",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      title: "Criminal Defense",
      description: "Comprehensive defense for criminal charges.",
      icon: "⚖️",
    },
    {
      title: "Personal Injury",
      description: "Representation for accident and injury cases.",
      icon: "🤕",
    },
    {
      title: "Business Law",
      description: "Corporate matters, contracts, and compliance.",
      icon: "💼",
    },
    {
      title: "Estate Planning",
      description: "Wills, trusts, and estate administration.",
      icon: "📋",
    },
    {
      title: "Real Estate",
      description: "Property transactions and real estate disputes.",
      icon: "🏠",
    },
    {
      title: "Intellectual Property",
      description: "Patents, trademarks, and copyright protection.",
      icon: "💡",
    },
    {
      title: "Employment Law",
      description: "Workplace disputes and employment contracts.",
      icon: "👔",
    },
  ];

  return (
    <main className="bg-black text-white">
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                Practice Areas
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Comprehensive legal services across multiple practice areas
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300">
              Our experienced attorneys specialize in a wide range of legal
              matters to serve our diverse clientele.
            </p>
          </div>
        </Wrapper>
      </section>

      {/* Practice Grid */}
      <section className="py-20">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practices.map((practice, index) => (
              <div
                key={index}
                className="group p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50 cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {practice.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors duration-300">
                  {practice.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {practice.description}
                </p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900/50 border-t border-neutral-800">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need legal assistance?
          </h2>
          <p className="text-base md:text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your legal matter with one of our experienced
            attorneys.
          </p>
          <a href="/contacts">
            <SheardButton className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7">
              Schedule Consultation
            </SheardButton>
          </a>
        </Wrapper>
      </section>
    </main>
  );
}

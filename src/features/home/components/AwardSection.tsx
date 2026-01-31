"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import SheardButton from "@/src/components/shared/SheardButton";

export default function AwardSection() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                HUGE HONOR
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Our awards from the legal community
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300">
              Adipiscing elit, sed do euismod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">Best Legal Firm 2024</h3>
              <p className="text-neutral-400">Recognized by National Legal Association</p>
            </div>
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">Top 10 Attorneys</h3>
              <p className="text-neutral-400">Distinguished achievement in legal excellence</p>
            </div>
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">Client Choice Award</h3>
              <p className="text-neutral-400">Voted by satisfied clients for outstanding service</p>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

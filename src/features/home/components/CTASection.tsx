"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import Link from "next/link";

export default function CTASection() {
  return (
    <section 
      className="bg-black text-white py-32 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium tracking-widest uppercase text-orange-400">
                Tell us about your case
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            We work on contingency: you don't owe anything until we win!
          </h2>

          <div className="mt-12 flex justify-center">
            <button className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white text-white hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300">
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

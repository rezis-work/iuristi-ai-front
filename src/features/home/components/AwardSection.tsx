"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";

export default function AwardSection() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                დიდი აღიარება
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              ჩვენი ჯილდოები იურიდიული სფეროდან
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-300">
              ჩვენი გუნდი მრავალჯერ დაჯილდოვდა პროფესიონალიზმისა და მაღალი ხარისხის მომსახურებისთვის. ეს აღიარება ასახავს ნდობას, რომელსაც კლიენტები და პარტნიორები ყოველდღიურად გვიცხადებენ.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">საუკეთესო იურიდიული ფირმა 2024</h3>
              <p className="text-neutral-400">აღიარებული ეროვნული იურიდიული ასოციაციის მიერ</p>
            </div>
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">ტოპ 10 ადვოკატი</h3>
              <p className="text-neutral-400">გამორჩეული მიღწევა იურიდიულ პროფესიონალიზმში</p>
            </div>
            <div className="p-8 border border-neutral-800 rounded-lg hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white mb-3">კლიენტების არჩევანის ჯილდო</h3>
              <p className="text-neutral-400">კლიენტების მიერ არჩეული გამორჩეული მომსახურებისთვის</p>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

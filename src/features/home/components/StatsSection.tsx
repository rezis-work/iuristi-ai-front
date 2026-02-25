"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { Award, Briefcase } from "lucide-react";

const stats = [
  {
    id: "lawyers",
    icon: Briefcase,
    label: "იურისტი",
    value: "12+",
    description: "პროფესიონალი იურისტები თქვენს მხარდაჭერად.",
  },
  {
    id: "years",
    icon: Award,
    label: "წელი",
    value: "20+",
    description: "მრავალწლიანი პრაქტიკული გამოცდილება.",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-12 bg-yellow-500"></div>
            <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
              რატომ ჩვენ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            ჩვენ გთავაზობთ საუკეთესო იურიდიულ მომსახურებას
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group p-8 rounded-lg border border-neutral-800 hover:border-yellow-500/50 transition-all duration-300 hover:bg-neutral-900/50 cursor-pointer"
              >
                <div className="mb-4 text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="mb-4">
                  <p className="text-4xl md:text-5xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mt-2">
                    {stat.label}
                  </p>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </Wrapper>
    </section>
  );
}

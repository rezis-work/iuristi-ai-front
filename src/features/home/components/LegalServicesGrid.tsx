"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/src/features/home/api/service";

const LegalServicesGrid: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 select-none">
        {services.map((service, index) => (
          <Link
            key={service.id}
            href={`/service#${service.id}`}
            className={`relative group cursor-pointer overflow-hidden transition-all duration-600 ease-out
              border-l border-zinc-700 lg:border-l-0
              ${index < services.length - 1 ? "lg:border-r lg:border-zinc-700" : ""}
              opacity-100 translate-y-0`}
            style={{ transitionDelay: `${service.delay}ms` }}
          >
            <div className="relative py-8 px-4 lg:px-0 h-full min-h-70 flex flex-col justify-between">
              <div className="mb-8">
                <div className="text-white transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                  {service.icon}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold w-50 tracking-wide text-zinc-200 leading-tight">
                  {service.title}
                </h3>
                <div className="flex items-center">
                  <span className="text-sm font-light whitespace-nowrap overflow-hidden transition-all duration-500 ease-out max-w-0 group-hover:max-w-25">
                    დეტალურად
                  </span>
                  <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                    <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LegalServicesGrid;

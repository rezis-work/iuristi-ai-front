import React from "react";
import Image from "next/image";
import { partners } from "@/src/constants/partners";

const NewsPartners = () => {
  return (
    <div className="w-full bg-black">
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:hidden">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center border-b border-zinc-800 border-r hover:border-zinc-700 transition-all duration-300 p-8"
            >
              <div className="relative w-32 h-16">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  priority
                  unoptimized
                  className="object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden xl:flex xl:items-center xl:justify-between">
          {partners.map((partner, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center justify-center px-6">
                <div className="relative w-40 h-16">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    priority
                    unoptimized
                    className="object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
                  />
                </div>
              </div>
              {index < partners.length - 1 && (
                <div className="w-px h-36 bg-zinc-800" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-zinc-800" />
    </div>
  );
};

export default NewsPartners;

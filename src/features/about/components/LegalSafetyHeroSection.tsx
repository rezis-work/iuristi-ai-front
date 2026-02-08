"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import SheardButton from "@/src/components/shared/SheardButton";
import FeaturedIn from "./FeaturedIn";

interface LegalSafetyHeroSectionProps {
  officeImageUrl?: string;
  professionalImageUrl?: string;
  className?: string;
}

export default function LegalSafetyHeroSection({
  officeImageUrl = "/assets/about/image1.jpg",
  professionalImageUrl = "/assets/about/image2.jpg",
  className = "",
}: LegalSafetyHeroSectionProps) {
  const router = useRouter();
  return (
    <section className={`w-full pt-30 pb-5 md:pb-14 ${className}`}>
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-full min-h-100 sm:min-h-125 lg:min-h-150">
            <div className="absolute left-0 -top-5 w-[65%] md:w-[68%] h-[90%] sm:mt-0 sm:h-125 overflow-hidden rounded-xs">
              <Image
                src={officeImageUrl}
                alt="Modern law office workspace"
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute right-0 bottom-0 sm:-bottom-10 md:-bottom-5 w-[65%] h-[75%] md:w-[68%] overflow-hidden rounded-xs z-10">
              <Image
                src={professionalImageUrl}
                alt="Professional legal consultant"
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-block">
              <span className="text-sm font-semibold tracking-[0.2em] text-gray-600 uppercase">
                About Us
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Your legal safety is our top priority
            </h1>
            <p className="text-lg md:text-xl text-gray-900 font-normal">
              Qadipiscing elit, sed do eiusmod tempor.
            </p>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed">
              To come up with a logo that becomes a globally recognizable symbol
              is the goal that every designer should set for themselves. We did
              it last year.
            </p>
            <div className="pt-4">
              <SheardButton
                onClick={() => router.push("/about-us")}
                className="uppercase text-black text-xs lg:text-sm px-4 py-5 sm:px-12 sm:py-7"
              >
                Find out more
              </SheardButton>
            </div>
          </div>
        </div>
      </div>
      <div>
        <FeaturedIn />
      </div>
    </section>
  );
}

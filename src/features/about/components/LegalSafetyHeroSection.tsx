import React from "react";
import Image from "next/image";

interface LegalSafetyHeroSectionProps {
  officeImageUrl?: string;
  professionalImageUrl?: string;
  className?: string;
}

export default function LegalSafetyHeroSection({
  officeImageUrl = "/images/office-space.jpg",
  professionalImageUrl = "/images/professional-lawyer.jpg",
  className = "",
}: LegalSafetyHeroSectionProps) {
  return (
    <section
      className={`w-full bg-white py-16 px-6 md:px-12 lg:px-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Images */}
          <div className="relative w-full h-full min-h-125 lg:min-h-150">
            {/* Office Background Image */}
            <div className="absolute left-0 top-0 w-[60%] h-[70%] overflow-hidden rounded-sm shadow-lg">
              <Image
                src={officeImageUrl}
                alt="Modern law office workspace"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Professional Image - Overlapping */}
            <div className="absolute right-0 bottom-0 w-[70%] h-[75%] overflow-hidden rounded-sm shadow-xl z-10">
              <Image
                src={professionalImageUrl}
                alt="Professional legal consultant"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Section Label */}
            <div className="inline-block">
              <span className="text-sm font-semibold tracking-[0.2em] text-gray-600 uppercase">
                About Us
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your legal safety is our top priority
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-900 font-normal">
              Qadipiscing elit, sed do eiusmod tempor.
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-500 leading-relaxed">
              To come up with a logo that becomes a globally recognizable symbol
              is the goal that every designer should set for themselves. We did
              it last year.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="px-8 py-4 bg-[#E8A566] hover:bg-[#D89555] text-gray-900 font-semibold text-sm tracking-wider uppercase transition-colors duration-300 rounded-sm shadow-md hover:shadow-lg">
                Our Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

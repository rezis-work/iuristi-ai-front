"use client";

import React, { useState, useEffect } from "react";
import Wrapper from "@/src/components/shared/wrapper";
import Image from "next/image";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  teamImage: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Kylie Rogers",
    role: "Social worker",
    image:
      "https://notarius.ancorathemes.com/wp-content/uploads/2022/09/ttmn7-copyright-120x120.jpg",
    teamImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80",
    quote:
      "Ignissimos ducimos qui blandiitis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi, sint occaecatii gnissimos ducimus qui blandiitis.",
  },
  {
    id: "2",
    name: "Jason Bright",
    role: "General manager",
    image:
      "https://notarius.ancorathemes.com/wp-content/uploads/2022/09/ttmn8-copyright-120x120.jpg",
    teamImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80",
    quote:
      "Ignissimos ducimos qui blandiitis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi, sint occaecatii gnissimos ducimus qui blandiitis.",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const currentTestimonial = testimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  return (
    <section className="bg-black text-white py-20">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Testimonial Content */}
          <div className="flex flex-col">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-12 bg-orange-500"></div>
                <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                  Testimonials
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white">
                Hear what our clients have to say
              </h2>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-neutral-400 mb-12">
              Adipiscing elit, sed do euismod tempor incidunt ut labore et
              dolore magna aliqua.
            </p>

            {/* Testimonial Quote Box */}
            <div className="mb-12 bg-neutral-900 rounded-lg p-8 border border-neutral-800 flex-1">
              <Quote className="w-12 h-12 text-orange-500 mb-4" />
              <p className="text-base md:text-lg leading-relaxed text-neutral-300">
                {currentTestimonial.quote}
              </p>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-4 mb-12">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  {currentTestimonial.name}
                </h4>
                <p className="text-sm text-neutral-400">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full border border-neutral-600 text-white hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="ml-auto flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoPlay(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-orange-500 w-8"
                        : "bg-neutral-600 w-2"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Team Image and Stats */}
          <div className="flex flex-col gap-8">
            {/* Large Team Image */}
            <div className="relative h-80 md:h-96 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src={currentTestimonial.teamImage}
                alt="Team"
                fill
                className="object-cover"
              />
            </div>

            {/* Stats Section */}
            <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                We provide the best service for clients
              </h3>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    100
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">
                    Lawyers
                  </p>
                  <p className="text-xs text-neutral-400">
                    Adipiscing, sed do eiusm.
                  </p>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    12
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">Years</p>
                  <p className="text-xs text-neutral-400">
                    Sed do euismod tempor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { Send } from "lucide-react";

export default function ContactUsSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-black text-white py-20 md:py-28">
      <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-1">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-12 bg-yellow-500"></div>
              <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                დაგვიკავშირდით
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 mt-6">
            გაქვს კითხვები?
            <br />
            <span className="text-white">მოგვწერე ახლავე!</span>
          </h2>

          {sent ? (
            <div className="text-green-400 text-center py-8">
              მადლობა — შენი შეტყობინება წარმატებით გაიგზავნა.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setTimeout(() => setSent(false), 4000);
              }}
              className="space-y-6"
            >
              {/* First Row: Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="სახელი"
                    required
                    className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="გვარი"
                    required
                    className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              {/* Second Row: Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ელფოსტა"
                    required
                    className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="ტელეფონი"
                    className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              {/* Third Row: Message (Full Width) */}
              <div className="relative">
                <textarea
                  placeholder="შეტყობინება"
                  required
                  rows={4}
                  className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group flex items-center gap-3 bg-[#ff9D4D] hover:bg-[#ea9753] text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-colors"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>დაგვიკავშირდი</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </Wrapper>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import Map from "@/src/components/shared/Map";

export default function ContactsPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-black text-white">
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full">
        {/* Map Section - Left (60%) */}
        <div
          className="w-full lg:w-[60%] bg-zinc-900 flex-shrink-0 h-96 lg:h-full"
          style={{ position: "relative" }}
        >
          <Map lat={40.70582497139078} lng={-74.01437792445523} zoom={14} />
        </div>

        {/* Contact Form Section - Right (40%) */}
        <div className="bg-black px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 overflow-y-auto flex-1">
          <div className="max-w-lg mx-auto">
            <div className="mb-1">
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-yellow-500"></div>
                <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                  Contact Us
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 mt-6">
              Have questions?
              <br />
              <span className="text-white">Get in touch!</span>
            </h2>

            {sent ? (
              <div className="text-green-400 py-8">
                Thanks — your message was sent.
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
                      placeholder="Name"
                      required
                      className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Last Name"
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
                      placeholder="Email"
                      required
                      className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="w-full bg-transparent border-0 border-b border-neutral-600 px-0 py-3 text-base text-neutral-300 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Third Row: Message (Full Width) */}
                <div className="relative">
                  <textarea
                    placeholder="Message"
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
                    <span>GET IN TOUCH</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

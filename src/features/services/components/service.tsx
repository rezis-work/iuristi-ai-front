"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Wrapper from "@/src/components/shared/wrapper";
import { servicesDetail } from "@/src/features/services/api/services-detail";
import { Check } from "lucide-react";

export function Services() {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  const serviceBanner = "/images/banners/service-banner.jpg"

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-zinc-900/80 via-black to-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${serviceBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Wrapper className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 w-12 bg-[#FF9D4D]" />
              <span className="text-sm font-medium tracking-wider text-zinc-400 uppercase">
                ჩვენი სერვისები
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-zinc-100">
              იურიდიული
              <br />
              <span className="text-[#FF9D4D]">მომსახურება</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              პროფესიონალური იურიდიული დახმარება ყველა სფეროში — კონსულტაციიდან სასამართლო წარმომადგენლობამდე.
            </p>
          </motion.div>
        </Wrapper>
      </section>

      {/* Services List */}
      <section className="py-12 sm:py-16 lg:py-24">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="space-y-20 lg:space-y-32">
            {servicesDetail.map((service, index) => (
              <motion.article
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="scroll-mt-24"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image - alternates left/right */}
                  <div
                    className={`relative aspect-4/3 lg:aspect-16/10 rounded-xl overflow-hidden bg-zinc-800 ${
                      index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                      <div className="flex items-center justify-center w-12 h-12 shrink-0 bg-[#FF9D4D]/90 rounded-lg">
                        <span className="[&>svg]:w-6! [&>svg]:h-6!">{service.icon}</span>
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        {service.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-8 bg-[#FF9D4D]" />
                      <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                        სერვისი {index + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-100 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-zinc-400 text-base lg:text-lg leading-relaxed">
                      {service.longDescription}
                    </p>
                    <ul className="space-y-3 pt-4">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-zinc-300"
                        >
                          <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#FF9D4D]/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-[#FF9D4D]" strokeWidth={2.5} />
                          </span>
                          <span className="text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 lg:py-28 border-t border-zinc-800">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-zinc-800/80 to-zinc-900/80 p-8 sm:p-12 lg:p-16 border border-zinc-700/50"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9D4D]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 leading-tight">
                გჭირდებათ იურიდიული დახმარება?
              </h2>
              <p className="mt-4 text-zinc-400 text-base lg:text-lg">
                დაგვიკავშირდით და მიიღეთ უფასო საწყისი კონსულტაცია. ჩვენი გამოცდილი იურისტები მზად არიან დაგეხმარონ.
              </p>
              <a
                href="/contacts"
                className="inline-flex items-center gap-2 mt-8 px-6 py-4 bg-[#FF9D4D] text-black font-semibold rounded hover:bg-[#ea9753] transition-colors"
              >
                დაგვიკავშირდით
              </a>
            </div>
          </motion.div>
        </Wrapper>
      </section>
    </div>
  );
}

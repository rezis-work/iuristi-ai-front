"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Wrapper from "@/src/components/shared/wrapper";
import { socials } from "@/src/constants/socials";
import { Phone, Mail, MapPin } from "lucide-react";

import {
  CONTACT_PHONE,
  CONTACT_EMAIL,
  CONTACT_ADDRESS,
} from "@/src/constants/contacts";
import ContactMapSection from "./contact-form";

const CONTACT_IMAGE =
  "/images/banners/contactus.jpg";

export default function Contacts() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Image */}
      <section className="relative aspect-4/1 min-h-[140px] w-full overflow-hidden sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
        <Image
          src={CONTACT_IMAGE}
          alt="კონტაქტი"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center"
          >
            <div className="mb-1 flex items-center justify-center gap-2 sm:mb-2">
              <div className="h-0.5 w-8 bg-[#FF9D4D]" />
              <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase sm:text-sm">
                კონტაქტი
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
              დაგვიკავშირდით
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-300 sm:mt-3 sm:text-base">
              გაქვთ შეკითხვა? ჩვენ მზად ვართ დაგეხმაროთ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-24">
        <Wrapper className="mx-auto w-full px-4 sm:px-6 lg:px-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col p-6 sm:p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#FF9D4D]/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9D4D]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF9D4D]/15 transition-colors" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-lg bg-[#FF9D4D]/20 mb-5 group-hover:bg-[#FF9D4D]/30 transition-colors">
                <Phone className="w-7 h-7 text-[#FF9D4D]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
                ტელეფონი
              </span>
              <span className="text-lg sm:text-xl font-semibold text-zinc-100 group-hover:text-[#FF9D4D] transition-colors">
                {CONTACT_PHONE}
              </span>
              <span className="mt-2 text-sm text-zinc-400">ჩვენ დაგირეკავთ</span>
            </motion.a>

            <motion.a
              href={`mailto:${CONTACT_EMAIL}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="group relative flex flex-col p-6 sm:p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#FF9D4D]/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9D4D]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF9D4D]/15 transition-colors" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-lg bg-[#FF9D4D]/20 mb-5 group-hover:bg-[#FF9D4D]/30 transition-colors">
                <Mail className="w-7 h-7 text-[#FF9D4D]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
                ელფოსტა
              </span>
              <span className="text-base sm:text-lg font-semibold text-zinc-100 break-all group-hover:text-[#FF9D4D] transition-colors">
                {CONTACT_EMAIL}
              </span>
              <span className="mt-2 text-sm text-zinc-400">პასუხს 24 საათში მიიღებთ</span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group relative flex flex-col p-6 sm:p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9D4D]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-lg bg-[#FF9D4D]/20 mb-5">
                <MapPin className="w-7 h-7 text-[#FF9D4D]" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
                მისამართი
              </span>
              <span className="text-base sm:text-lg font-semibold text-zinc-100">
                {CONTACT_ADDRESS}
              </span>
              <span className="mt-2 text-sm text-zinc-400">შემოგვიანებით გამოვიყენებთ</span>
            </motion.div>
          </div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-16 lg:mt-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 w-8 bg-[#FF9D4D]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                მიჰყევით ჩვენ
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {socials.map((item, idx) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#FF9D4D]/50 hover:bg-zinc-800/80 transition-all duration-200"
                >
                  <item.Icon
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${item.iconClass}`}
                  />
                  <span className="sr-only">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </Wrapper>
      </section>

      {/* Contact Form + Map */}
      <ContactMapSection />
    </div>
  );
}

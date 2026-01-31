"use client";

import React from "react";
import Wrapper from "@/src/components/shared/wrapper";
import { SocialIcons } from "@/src/components/header/SocialIcons";

function Footer() {
  return (
    <footer className="bg-black text-zinc-300">
      <div className="border-b border-zinc-800">
        <Wrapper className="mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-white font-extrabold leading-tight text-5xl md:text-6xl">
                We protect your future.
                <br />
                <span className="underline underline-offset-4">Let's talk.</span>
              </h2>

              <nav className="mt-8">
                <ul className="flex items-center gap-8 text-sm text-zinc-300">
                  <li className="border-b-2 border-white/90 pb-1">Home</li>
                  <li>Blog</li>
                  <li>Shop</li>
                  <li>Contacts</li>
                </ul>
              </nav>
            </div>

            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="w-full max-w-sm">
                <SocialIcons />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>

      <div className="py-8">
        <Wrapper className="mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <div>AncoraThemes © 2026. All rights reserved.</div>
            <div className="w-full md:w-auto">
              <div className="h-px bg-zinc-800 md:hidden my-3" />
              <div className="flex items-center gap-6 opacity-80">
                <span>Home</span>
                <span>Blog</span>
                <span>Shop</span>
                <span>Contacts</span>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </footer>
  );
}

export default Footer;

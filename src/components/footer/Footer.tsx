"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Wrapper from "@/src/components/shared/wrapper";
import { FooterSocialIcons } from "@/src/components/footer/FooterSocialIcons";
import { Separator } from "@/src/components/ui/separator";

function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/shop", label: "Shop" },
    { href: "/contacts", label: "Contacts" },
  ];

  return (
    <footer className="bg-black text-zinc-300">
      <div className="border-b border-zinc-800">
        <Wrapper className="max-w-7xl mx-auto px-6 pt-10 lg:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-between mb-20">
            <div className="lg:col-span-12 w-full">
              <h2 className="text-zinc-200 font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                We protect your future.
                <br />
                <span className="underline underline-offset-4">
                  Let's talk.
                </span>
              </h2>
              <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between w-full mt-8">
                <nav>
                  <ul className="flex items-center gap-8 text-sm text-zinc-300 mb-14 sm:mb-0">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`group relative inline-block pb-1 ${
                              isActive ? "text-white" : "hover:text-white"
                            }`}
                          >
                            {item.label}
                            {isActive && (
                              <span className="absolute left-0 -bottom-px h-px w-full bg-white" />
                            )}
                            <span
                              className={`absolute left-0 -bottom-px h-px bg-white origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                                isActive ? "pointer-events-none" : "w-full"
                              }`}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <FooterSocialIcons />
              </div>
            </div>
          </div>
          <Separator className="bg-zinc-800" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-md text-zinc-500 py-7">
            <div>AncoraThemes © 2026. All rights reserved.</div>
          </div>
        </Wrapper>
      </div>
    </footer>
  );
}

export default Footer;

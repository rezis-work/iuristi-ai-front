"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { motion } from "framer-motion";
import { itemVariants } from "@/src/components/header/lib/variants";
import { navLinks } from "@/src/constants/navlinks";
import { usePathname } from "next/navigation";

interface MobileNavAccordionProps {
  onLinkClick: () => void;
}

export function MobileNavAccordion({ onLinkClick }: MobileNavAccordionProps) {
  const pathname = usePathname();
  return (
    <Accordion type="single" collapsible className="w-full">
      {navLinks.map((link) => {
        const isActive = link.dropdown
          ? link.dropdown.some(
              (item) =>
                pathname === item.href ||
                (item.submenu &&
                  item.submenu.some((sub) => pathname === sub.href)),
            )
          : pathname === link.href;
        if (!link.dropdown) {
          return (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={`flex items-center justify-between w-full py-2 text-xl tracking-tight ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                } transition-colors`}
              >
                <span>{link.label}</span>
              </Link>
            </motion.div>
          );
        }
        return (
          <motion.div key={link.href} variants={itemVariants}>
            <AccordionItem
              value={link.href}
              className="outline-none border-none"
            >
              <AccordionTrigger
                className={`flex items-center justify-between w-full py-2 text-xl tracking-tight outline-none border-none ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <Accordion type="single" collapsible className="ml-2">
                  {link.dropdown.map((item) => {
                    const isDropdownActive =
                      pathname === item.href ||
                      (item.submenu &&
                        item.submenu.some((sub) => pathname === sub.href));
                    if (!item.submenu) {
                      return (
                        <AccordionItem
                          key={item.href}
                          value={item.href}
                          className="outline-none border-none"
                        >
                          <div className="pl-3">
                            <Link
                              href={item.href}
                              onClick={onLinkClick}
                              className={`block py-1 text-lg ${
                                isDropdownActive
                                  ? "text-white"
                                  : "text-zinc-400 hover:text-white"
                              } transition-colors`}
                            >
                              {item.label}
                            </Link>
                          </div>
                        </AccordionItem>
                      );
                    }
                    return (
                      <AccordionItem
                        key={item.href}
                        value={item.href}
                        className="outline-none border-none"
                      >
                        <AccordionTrigger
                          className={`pl-3 pr-2 py-1 text-lg flex justify-between items-center outline-none border-none ${
                            isDropdownActive
                              ? "text-white"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span>{item.label}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4 pb-2">
                          <Accordion type="multiple">
                            {item.submenu?.map((subItem) => {
                              const isSubmenuActive = pathname === subItem.href;
                              return (
                                <AccordionItem
                                  key={subItem.href}
                                  value={subItem.href}
                                  className="outline-none border-none"
                                >
                                  <div className="pl-3">
                                    <Link
                                      href={subItem.href}
                                      onClick={onLinkClick}
                                      className={`block py-1 text-lg ${
                                        isSubmenuActive
                                          ? "text-white"
                                          : "text-zinc-400 hover:text-white"
                                      } transition-colors`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </div>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { navLinks } from "@/src/constants/navlinks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTitleFromPath(pathname: string): string {
  for (const item of navLinks) {
    if (item.href === pathname) return item.label;

    if (item.dropdown) {
      for (const d of item.dropdown) {
        if (d.href === pathname) return d.label;
        if (d.submenu) {
          for (const s of d.submenu) {
            if (s.href === pathname) return s.label;
          }
        }
      }
    }
  }
  return "Lawyer Website";
}

import { NavLink } from "@/src/types/types";

export const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    dropdown: [
      { href: "/", label: "Lawyer" },
      { href: "/notary-public", label: "Notary Public" },
      { href: "/attornay", label: "Attornay" },
      { href: "/law-firm", label: "Law Firm" },
      { href: "/legal-consultant", label: "Legal Consultant" },
    ],
  },
  {
    href: "/pages",
    label: "Pages",
    dropdown: [
      { href: "/about-us", label: "About Us" },
      { href: "/practice-areas", label: "Practice Areas" },
      { href: "/case-results", label: "Case Results" },
      { href: "/our-team", label: "Our Team" },
      { href: "/faqs", label: "FAQs" },
      { href: "/pricing", label: "Pricing" },
      { href: "/online-booking", label: "Online Booking" },
      { href: "/tools", label: "Tools" },
      {
        href: "/tool",
        label: "Tools",
        submenu: [
          { href: "/tool/typography", label: "Typography" },
          { href: "/tool/404-page", label: "404 Page" },
          { href: "/tool/service-plus", label: "Service Plus" },
          { href: "/tool/newsletter-popups", label: "Newsletter Popups" },
        ],
      },
    ],
  },
  {
    href: "/blog",
    label: "Blog",
    dropdown: [
      { href: "/standard", label: "Standard" },
      { href: "/list", label: "List" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/grid", label: "Grid" },
      { href: "/single-post", label: "Single Post" },
      {
        href: "/single-poste",
        label: "Single Post",
        submenu: [
          { href: "/single-poste/with-sidebar", label: "With Sidebar" },
          { href: "/single-poste/without-sidebar", label: "Without Sidebar" },
        ],
      },
    ],
  },
  { href: "/shop", label: "Shop" },
  { href: "/contacts", label: "Contacts" },
];

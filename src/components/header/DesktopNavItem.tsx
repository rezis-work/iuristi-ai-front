"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface SubmenuItem {
  href: string;
  label: string;
}

interface DropdownItem {
  href: string;
  label: string;
  submenu?: SubmenuItem[];
}

interface NavLink {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
}

interface DesktopNavItemProps {
  link: NavLink;
  index: number;
  isHovered: boolean;
  pathname: string;
  onHover: (index: number | null) => void;
}

export function DesktopNavItem({
  link,
  index,
  isHovered,
  pathname,
  onHover,
}: DesktopNavItemProps) {
  const isActive = link.dropdown
    ? link.dropdown.some(
        (item) =>
          pathname === item.href ||
          (item.submenu && item.submenu.some((sub) => pathname === sub.href)),
      )
    : pathname === link.href;

  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {link.dropdown ? (
        <span
          className={`${
            isHovered || isActive ? "text-white" : "text-zinc-400"
          } hover:text-white transition-colors flex items-center gap-1 py-2 pb-3 relative cursor-pointer`}
        >
          <span className="relative flex items-center gap-1">
            {link.label}
            <span
              className={`absolute -bottom-1 left-0 bg-white transition-all duration-300 ${
                isHovered || isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
              style={{ height: "1px" }}
            />
          </span>
        </span>
      ) : (
        <Link
          href={link.href}
          className={`${
            isActive ? "text-white" : "text-zinc-400"
          } hover:text-white transition-colors flex items-center gap-1 py-2 pb-3 relative`}
        >
          <span className="relative">
            {link.label}
            <span
              className={`absolute -bottom-1 left-0 bg-white transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
              style={{ height: "1px" }}
            />
          </span>
        </Link>
      )}

      {link.dropdown && (
        <div className="absolute top-full left-0 pt-7 opacity-0 invisible select-none group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-black backdrop-blur-sm text-white shadow-lg py-2 min-w-50">
            {link.dropdown.map((item) => {
              const isDropdownActive =
                pathname === item.href ||
                (item.submenu &&
                  item.submenu.some((sub) => pathname === sub.href));
              return (
                <motion.div
                  key={item.href}
                  initial={{ x: 0 }}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group/item px-4 py-1 pb-2"
                >
                  <Link
                    href={item.href}
                    className={`${
                      isDropdownActive ? "text-white" : "text-zinc-400"
                    } hover:text-white transition-colors inline-block relative`}
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 bg-white transition-all duration-300 ${
                          isDropdownActive
                            ? "w-full"
                            : "w-0 group-hover/item:w-full"
                        }`}
                        style={{ height: "1px" }}
                      />
                    </span>
                  </Link>
                  {item.submenu && (
                    <div className="absolute left-full top-0 ml-0.5 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200">
                      <div className="bg-black backdrop-blur-sm text-white shadow-lg py-2 min-w-50">
                        {item.submenu.map((subItem) => {
                          const isSubmenuActive = pathname === subItem.href;

                          return (
                            <motion.div
                              key={subItem.href}
                              initial={{ x: 0 }}
                              whileHover={{ x: 8 }}
                              transition={{ duration: 0.2 }}
                              className="relative group/subitem px-4 py-1 pb-2"
                            >
                              <Link
                                href={subItem.href}
                                className={`${
                                  isSubmenuActive
                                    ? "text-white"
                                    : "text-zinc-400"
                                } hover:text-white transition-colors inline-block relative`}
                              >
                                {subItem.label}
                                <span
                                  className={`absolute -bottom-1 left-0 bg-white transition-all duration-300 ${
                                    isSubmenuActive
                                      ? "w-full"
                                      : "w-0 group-hover/subitem:w-full"
                                  }`}
                                  style={{ height: "1px" }}
                                />
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import NextLink from "next/link";

/**
 * Pass-through re-export of next/link for Next.js 16 compatibility.
 * Fixes "Failed to collect page data for /_not-found" / "Unexpected token" build errors.
 * @see https://github.com/vercel/next.js/issues/85604
 */
export const Link = NextLink;

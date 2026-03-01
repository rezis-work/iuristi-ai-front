"use client";

import { AuthGuard } from "@/src/components/auth/AuthGuard";

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

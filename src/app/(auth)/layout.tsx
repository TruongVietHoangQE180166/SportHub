import React from "react";
import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRedirectGuard>{children}</AuthRedirectGuard>;
}
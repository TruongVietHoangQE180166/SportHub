"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GlobalLoading } from "./GlobalLoading";
import { rehydrateAuthState } from "@/stores/authStore";
import AIChatSideSheet from './Chat';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const firstRender = useRef(true);

  // Rehydrate auth state on mount
  useEffect(() => {
    rehydrateAuthState();
  }, []);

  useEffect(() => {
    // Không show loading ở lần render đầu tiên
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLoading(false), 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  // Define routes that should not have Header and Footer
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/carousel-test",
    "/send-otp",
    "/verify-otp",
    "/reset-password",
    "/404",
  ];
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <div
      className={
        isAuthRoute
          ? "min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50"
          : "min-h-screen bg-gray-50"
      }
    >
      {loading && <GlobalLoading />}
      {!isAuthRoute && <Header />}
      <main>{children}</main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && (
        <div>
          <AIChatSideSheet
            side="left" // hoặc "right"
            width="450px"
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </div>
  );
};
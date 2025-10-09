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
    "/login/success",
  ];
  
  // Check if current route is an auth route
  // Use a default value for pathname during SSR to prevent hydration mismatch
  const normalizedPathname = pathname || '';
  const isAuthRoute = authRoutes.includes(normalizedPathname);

  // Define background classes to prevent hydration mismatch
  const backgroundClass = isAuthRoute 
    ? "min-h-screen bg-gradient-to-br from-gray-50 to-gray-50" 
    : "min-h-screen bg-gray-50";

  return (
    <div className={backgroundClass}>
      {loading && <GlobalLoading />}
      {!isAuthRoute && <Header />}
      <main>{children}</main>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && (
        <div>
          <AIChatSideSheet
            side="left"
            width="450px"
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </div>
  );
};
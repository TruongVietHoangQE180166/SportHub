"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GlobalLoading } from "./GlobalLoading";
import { rehydrateAuthState } from "@/stores/authStore";
import { usePageContext } from "@/contexts/PageContext";
import AIChatSideSheet from './Chat';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const { isNotFoundPage } = usePageContext();
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
    "/login/success",
  ];
  
  // Check if current route is an auth route
  // Use a default value for pathname during SSR to prevent hydration mismatch
  const normalizedPathname = pathname || '';
  const isAuthRoute = authRoutes.includes(normalizedPathname);

  // Check if we're on the 404 page by looking at the data attribute on the body
  // This works in both client and server environments
  const isNotFoundByAttribute = typeof document !== 'undefined' && 
    document.body.hasAttribute('data-not-found');

  // Hide header and footer if it's an auth route, the not-found page context is set, 
  // or we detect the not-found attribute
  const shouldHideNav = isAuthRoute || isNotFoundPage || isNotFoundByAttribute;

  // Define background classes to prevent hydration mismatch
  const backgroundClass = shouldHideNav 
    ? "min-h-screen bg-gradient-to-br from-gray-50 to-gray-50" 
    : "min-h-screen bg-gray-50";

  return (
    <div className={backgroundClass}>
      {loading && <GlobalLoading />}
      {!shouldHideNav && <Header />}
      <main>{children}</main>
      {!shouldHideNav && <Footer />}
      {!shouldHideNav && (
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
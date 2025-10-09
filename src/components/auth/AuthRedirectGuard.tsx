"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface AuthRedirectGuardProps {
  children: React.ReactNode;
}

export const AuthRedirectGuard: React.FC<AuthRedirectGuardProps> = ({ 
  children 
}) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // If user is authenticated, redirect to home page immediately
      router.replace("/");
    } else {
      // If user is not authenticated, allow rendering of children
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  // While checking or if user is authenticated, don't render anything
  if (isChecking || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
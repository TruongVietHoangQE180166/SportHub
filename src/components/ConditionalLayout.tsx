"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MagicDock from "@/components/ui/magicdock";
import { Footer } from "./Footer";
import { GlobalLoading } from "./GlobalLoading";
import { rehydrateAuthState, useAuthStore } from "@/stores/authStore";
import { usePageContext } from "@/contexts/PageContext";
import AIChatSideSheet from './Chat';
import { 
  Home, 
  Calendar, 
  Users, 
  Search, 
  BookOpenTextIcon,
  MessageCircle,
  User,
  LogOut,
  ClipboardListIcon,
  Gift,
  LogIn
} from 'lucide-react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isNotFoundPage } = usePageContext();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const firstRender = useRef(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, isAuthenticated, logout, fetchUserProfile } = useAuthStore();

  // Rehydrate auth state on mount
  useEffect(() => {
    rehydrateAuthState();
  }, []);

  // Fetch full user profile when authenticated but avatar is missing
  useEffect(() => {
    const fetchFullUserProfile = async () => {
      if (isAuthenticated && user?.id) {
        try {
          // Only fetch if avatar is missing (meaning we have basic auth data but not full profile)
          if (!user.avatar) {
            await fetchUserProfile(user.id);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchFullUserProfile();
  }, [isAuthenticated, user?.id, user?.avatar, fetchUserProfile]);

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

  // Define route to dock item mapping
  const routeToDockIdMap: Record<string, number> = {
    "/": 1,
    "/booking": 2,
    "/fields": 3,
    "/matches/discover": 4,
    "/about": 5,
    "/dashboard": 7,
    "/rewards": 8,
    "/profile": 9,
    "/login": 9,
  };

  // Determine active dock item based on current path
  const getActiveDockId = () => {
    // Special handling for all match-related routes
    if (pathname.startsWith("/matches/")) {
      return 4; // "Tìm đội" dock item
    }
    
    // Special handling for profile route when authenticated
    if (pathname === "/profile" && isAuthenticated) return 9;
    // Special handling for login route when not authenticated
    if (pathname === "/login" && !isAuthenticated) return 9;
    
    // Check for exact match
    if (routeToDockIdMap[pathname]) {
      return routeToDockIdMap[pathname];
    }
    
    // Check for partial matches
    for (const [route, id] of Object.entries(routeToDockIdMap)) {
      if (pathname.startsWith(route)) {
        return id;
      }
    }
    
    return null;
  };

  const activeDockId = getActiveDockId();

  // Define dock items for MagicDock
  const getDockItems = () => {
    const baseItems = [
      {
        id: 1,
        icon: <Home size={24} className="text-white" />,
        label: "Trang chủ",
        description: "Về trang chủ",
        onClick: () => router.push("/"),
        isActive: activeDockId === 1,
      },
      {
        id: 2,
        icon: <Calendar size={24} className="text-white" />,
        label: "Đặt sân",
        description: "Đặt sân ngay",
        onClick: () => router.push("/booking"),
        isActive: activeDockId === 2,
      },
      {
        id: 3,
        icon: <Search size={24} className="text-white" />,
        label: "Khám phá",
        description: "Khám phá sân chơi",
        onClick: () => router.push("/fields"),
        isActive: activeDockId === 3,
      },
      {
        id: 4,
        icon: <Users size={24} className="text-white" />,
        label: "Tìm đội",
        description: "Tìm đội chơi cùng",
        onClick: () => router.push("/matches/discover"),
        isActive: activeDockId === 4,
      },
      {
        id: 5,
        icon: <BookOpenTextIcon size={24} className="text-white" />,
        label: "Chủ sân",
        description: "Dành cho chủ sân",
        onClick: () => router.push("/about"),
        isActive: activeDockId === 5,
      },
      {
        id: 6,
        icon: <MessageCircle size={24} className="text-white" />,
        label: "Trợ lý AI",
        description: "Trò chuyện với trợ lý AI",
        onClick: () => setIsChatOpen(true),
        // AI chat doesn't have a dedicated page, so it's never "active"
        isActive: false,
      },
      {
        id: 7,
        icon: <ClipboardListIcon size={24} className="text-white" />,
        label: "Đơn hàng",
        description: "Quản lý đơn hàng",
        onClick: () => router.push("/dashboard"),
        isActive: activeDockId === 7,
      },
      {
        id: 8,
        icon: <Gift size={24} className="text-white" />,
        label: "Phần thưởng",
        description: "Xem phần thưởng",
        onClick: () => router.push("/rewards"),
        isActive: activeDockId === 8,
      },
    ];

    // Authentication-related dock items
    const authItems = isAuthenticated
      ? [
          {
            id: 9,
            icon: user?.avatar ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover aspect-square"
                />
              </div>
            ) : (
              <User size={24} className="text-white" />
            ),
            label: "Tài khoản",
            description: user?.name || "Thông tin tài khoản",
            onClick: () => router.push("/profile"),
            isActive: activeDockId === 9,
          },
          {
            id: 10,
            icon: <LogOut size={24} className="text-white" />,
            label: "Đăng xuất",
            description: "Đăng xuất tài khoản",
            onClick: () => {
              logout();
              router.push("/");
            },
            // Logout doesn't have a dedicated page, so it's never "active"
            isActive: false,
          },
        ]
      : [
          {
            id: 9,
            icon: <LogIn size={24} className="text-white" />,
            label: "Đăng nhập",
            description: "Đăng nhập tài khoản",
            onClick: () => router.push("/login"),
            isActive: activeDockId === 9,
          },
        ];

    return [...baseItems, ...authItems];
  };

  const dockItems = getDockItems();

  return (
    <div className={backgroundClass}>
      {loading && <GlobalLoading />}
      <main>{children}</main>
      {!shouldHideNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MagicDock 
            items={dockItems} 
            distance={150}
            panelHeight={64}
            baseItemSize={50}
            magnification={70}
            variant="tooltip"
            responsive={true}
          />
        </div>
      )}
      {!shouldHideNav && <Footer />}
      {!shouldHideNav && (
        <div>
          <AIChatSideSheet
            isOpen={isChatOpen}
            onOpenChange={setIsChatOpen}
            side="left"
            width="450px"
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </div>
  );
};
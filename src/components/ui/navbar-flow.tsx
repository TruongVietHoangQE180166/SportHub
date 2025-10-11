"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { motion, useAnimation } from "framer-motion";
import {
  Menu as List,
  X as Close,
  ChevronDown as ArrowDown,
  ChevronUp as ArrowUp,
  User,
  Gift,
  LogOut,
  ClipboardListIcon,
} from "lucide-react";
import { useAuthStore, rehydrateAuthState } from '../../stores/authStore';
import { useFieldStore } from '../../stores/fieldStore';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavLink {
  text: string;
  url?: string;
  submenu?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>; // Thêm icon cho navigation link
}

interface NavbarFlowProps {
  emblem?: React.ReactNode;
  links?: NavLink[];
  extraIcons?: React.ReactNode[];
  styleName?: string;
  rightComponent?: React.ReactNode;
}

interface ListItemProps {
  setSelected: (element: string | null) => void;
  selected: string | null;
  element: string;
  children: React.ReactNode;
}

interface HoverLinkProps {
  url: string;
  children: React.ReactNode;
  onPress?: () => void;
}

interface FeatureItemProps {
  heading: string;
  url: string;
  info: string;
  onPress?: () => void;
}

const springTransition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const ListItem: React.FC<ListItemProps> = ({
  setSelected,
  selected,
  element,
  children,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => setSelected(element)}
      onMouseLeave={(e) => {
        const dropdown = e.currentTarget.querySelector('.dropdown-content');
        if (dropdown) {
          const dropdownRect = dropdown.getBoundingClientRect();
          if (e.clientY < dropdownRect.top - 20) {
            setSelected(null);
          }
        }
      }}
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-gray-800 dark:text-gray-200 font-medium text-base lg:text-xl whitespace-nowrap hover:opacity-[0.9] hover:text-gray-900 dark:hover:text-white py-1"
      >
        {element}
      </motion.p>
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springTransition}
        >
          {selected === element && (
            <div className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 z-50">
              <motion.div
                transition={springTransition}
                layoutId="selected"
                className="dropdown-content bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl"
                style={{
                  maxWidth: 'min(90vw, 400px)',
                }}
                onMouseEnter={() => setSelected(element)}
                onMouseLeave={() => setSelected(null)}
              >
                <motion.div layout className="w-max h-full p-4 min-w-48">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const HoverLink: React.FC<HoverLinkProps> = ({ url, children, onPress }) => {
  return (
    <a
      href={url}
      onClick={onPress}
      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {children}
    </a>
  );
};

export const FeatureItem: React.FC<FeatureItemProps> = ({
  heading,
  url,
  info,
  onPress,
}) => {
  return (
    <a
      href={url}
      onClick={onPress}
      className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <h4 className="font-medium text-gray-900 dark:text-white">{heading}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{info}</p>
    </a>
  );
};

const NavbarFlow: React.FC<NavbarFlowProps> = ({
  emblem,
  links = [],
  extraIcons = [],
  styleName = "",
  rightComponent,
}) => {
  const [sequenceDone, setSequenceDone] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [selectedSubmenu, setSelectedSubmenu] = useState<string | null>(null);
  const [openedSections, setOpenedSections] = useState<Record<string, boolean>>(
    {}
  );
  const [isMounted, setIsMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Auth related states
  const { user, isAuthenticated, logout, fetchUserProfile } = useAuthStore();
  const { userPoints, fetchUserPoints } = useFieldStore();
  const router = useRouter();
  const pathname = usePathname(); // Thêm usePathname để xác định trang hiện tại

  const navMotion = useAnimation();
  const emblemMotion = useAnimation();
  const switchMotion = useAnimation();
  const svgMotion = useAnimation();

  useEffect(() => {
    setIsMounted(true);
    rehydrateAuthState();
  }, []);

  useEffect(() => {
    const fetchFullUserProfile = async () => {
      if (isAuthenticated && user?.id) {
        try {
          if (!user.avatar && !user.loyaltyPoints) {
            await fetchUserProfile(user.id);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchFullUserProfile();
  }, [isAuthenticated, user?.id, user?.avatar, user?.loyaltyPoints, fetchUserProfile]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (isAuthenticated && user?.id) {
        try {
          await fetchUserPoints(user.id);
        } catch (error) {
          console.error('Failed to fetch user points:', error);
        }
      }
    };

    fetchPoints();
  }, [isAuthenticated, user?.id, fetchUserPoints]);

  useEffect(() => {
    const detectMobile = () => {
      setMobileView(window.innerWidth < 768);
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const runSequence = async () => {
      if (mobileView) {
        await Promise.all([
          emblemMotion.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }),
          navMotion.start({
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          }),
          switchMotion.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }),
        ]);
      } else {
        await navMotion.start({
          width: "auto",
          padding: "10px 10px",
          transition: { duration: 0.8, ease: "easeOut" },
        });

        await svgMotion.start({
          opacity: 1,
          transition: { duration: 0.5 },
        });

        await Promise.all([
          emblemMotion.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }),
          switchMotion.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }),
        ]);
      }

      setSequenceDone(true);
    };

    runSequence();
  }, [navMotion, emblemMotion, switchMotion, svgMotion, mobileView, isMounted]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const userMenu = document.getElementById('navbar-user-menu');
      if (userMenuOpen && userMenu && !userMenu.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const toggleSection = (text: string) => {
    setOpenedSections((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  const hideMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ClipboardListIcon },
    { name: 'Thông tin cá nhân', href: '/profile', icon: User },
    { name: 'Phần thưởng', href: '/rewards', icon: Gift },
  ];

  const renderSubmenuItems = (submenu: React.ReactNode) => {
    if (!React.isValidElement(submenu)) return null;

    const submenuProps = submenu.props as { children?: React.ReactNode };
    if (!submenuProps.children) return null;

    return React.Children.map(submenuProps.children, (child, childIdx) => (
      <div key={childIdx} onClick={hideMobileMenu}>
        {child}
      </div>
    ));
  };

  // Component cho navigation link trên desktop với hiệu ứng giống Header
  const NavigationLink = ({ item }: { item: NavLink }) => {
    const Icon = item.icon;
    // Kiểm tra nếu là trang hiện tại
    const isActive = pathname === item.url;
    
    return (
      <Link
        href={item.url || "#"}
        className={`relative flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 group mx-0.5 ${
          isActive
            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transform scale-105'
            : 'text-gray-900 hover:text-black'
        }`}
      >
        {Icon && React.createElement(Icon, { 
          className: `w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-black'
          }` 
        })}
        <span className="font-semibold tracking-wide">{item.text}</span>
        {!isActive && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-900/30 to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        )}
      </Link>
    );
  };

  // Component cho navigation link trên mobile với hiệu ứng giống Header
  const MobileNavigationLink = ({ item }: { item: NavLink }) => {
    const Icon = item.icon;
    const isActive = pathname === item.url;
    
    return (
      <Link
        href={item.url || "#"}
        className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
          isActive
            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
            : 'text-gray-900 hover:text-black hover:bg-green-100/50 hover:backdrop-blur-sm'
        }`}
        onClick={() => {
          hideMobileMenu();
        }}
      >
        {Icon && React.createElement(Icon, { 
          className: `w-5 h-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:rotate-12'}` 
        })}
        <span>{item.text}</span>
      </Link>
    );
  };

  return (
    <div className={`sticky top-0 z-50 w-full ${styleName}`}>
      <div className="hidden md:block">
        <div className="relative w-full max-w-7xl mx-auto h-24 flex items-center justify-between px-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={emblemMotion}
            className="bg-white dark:bg-black/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-1 lg:px-2 py-1 lg:py-2 rounded-full font-semibold text-lg lg:text-xl z-10 flex-shrink-0 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <Link href="/" className="transition-transform duration-300 hover:scale-105 block">
              {emblem}
            </Link>
          </motion.div>

          <motion.nav
            initial={{
              width: "120px",
              padding: "8px 5px",
            }}
            animate={navMotion}
            className="bg-white dark:bg-black/95 backdrop-blur-sm rounded-full flex items-center justify-center gap-0.5 lg:gap-1 z-10 flex-shrink-0 shadow-md border border-gray-200 dark:border-gray-700 px-1"
            onMouseLeave={() => setSelectedSubmenu(null)}
          >
            {links.map((element) => (
              <div key={element.text}>
                {element.submenu ? (
                  <ListItem
                    setSelected={setSelectedSubmenu}
                    selected={selectedSubmenu}
                    element={element.text}
                  >
                    {element.submenu}
                  </ListItem>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sequenceDone ? 1 : 0 }}
                  >
                    <NavigationLink item={element} />
                  </motion.div>
                )}
              </div>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={switchMotion}
            className="bg-white dark:bg-black/95 backdrop-blur-sm rounded-full p lg:p-3 z-10 flex-shrink-0 flex items-center gap-2 lg:gap-3 shadow-md border border-gray-200 dark:border-gray-700"
          >
            {extraIcons.map((icon, idx) => (
              <div key={idx} className="flex items-center justify-center">
                {icon}
              </div>
            ))}

            {/* Authentication section - only show one green login button when not authenticated */}
            {isAuthenticated && user ? (
              <div className="relative" id="navbar-user-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="relative group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5 shadow-lg shadow-green-400/30 group-hover:shadow-xl group-hover:shadow-green-400/40 transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                      {user.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.name} 
                          width={44}
                          height={44}
                          className="w-full h-full rounded-full object-cover aspect-square"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-3xl backdrop-saturate-150 rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-50 transform transition-all duration-300 origin-top-right animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                            {user.avatar ? (
                              <Image 
                                src={user.avatar} 
                                alt={user.name} 
                                width={44}
                                height={44}
                                className="w-full h-full rounded-full object-cover aspect-square"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Gift className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-bold">
                              {(userPoints?.currentPoints || 0)} điểm
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50/80 hover:text-green-400 transition-all duration-200 group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {Icon && React.createElement(Icon, { className: "w-4 h-4 transition-transform duration-200 group-hover:scale-110" })}
                          <span>{item.name}</span>
                        </a>
                      );
                    })}
                    
                    <div className="border-t border-gray-100/50 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50/80 transition-all duration-200 group"
                      >
                        {React.createElement(LogOut, { className: "w-4 h-4 transition-transform duration-200 group-hover:scale-110" })}
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Only one green login button when not authenticated
              <button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:scale-105 font-bold text-sm hover:from-green-500 hover:to-green-600"
              >
                Đăng nhập
              </button>
            )}

            {rightComponent && (
              <div className="flex items-center justify-center">
                {rightComponent}
              </div>
            )}
          </motion.div>

          <motion.svg
            initial={{ opacity: 0 }}
            animate={svgMotion}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            viewBox="0 0 1400 96"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="connectionBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="cyanGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="orangeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="redGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="greenGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ff00" stopOpacity="1" />
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.path
              d="M 700 48 Q 500 30, 300 40 Q 200 35, 120 48"
              stroke="url(#blueGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
            />
            <motion.path
              d="M 700 48 Q 500 30, 300 40 Q 200 35, 120 48"
              stroke="url(#blueGradient)"
              strokeWidth="3"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
            />
            <motion.path
              d="M 700 44 Q 520 60, 320 50 Q 220 55, 130 44"
              stroke="url(#cyanGradient)"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 1.7 }}
            />
            <motion.path
              d="M 700 44 Q 520 60, 320 50 Q 220 55, 130 44"
              stroke="url(#cyanGradient)"
              strokeWidth="2.5"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 1.7 }}
            />
            <motion.path
              d="M 700 52 Q 480 25, 280 45 Q 180 30, 110 52"
              stroke="url(#purpleGradient)"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.9 }}
            />
            <motion.path
              d="M 700 52 Q 480 25, 280 45 Q 180 30, 110 52"
              stroke="url(#purpleGradient)"
              strokeWidth="2.5"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.9 }}
            />
            <motion.path
              d="M 700 48 Q 900 35, 1100 45 Q 1200 40, 1280 48"
              stroke="url(#orangeGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeOut", delay: 2.1 }}
            />
            <motion.path
              d="M 700 48 Q 900 35, 1100 45 Q 1200 40, 1280 48"
              stroke="url(#orangeGradient)"
              strokeWidth="3"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 2, ease: "easeOut", delay: 2.1 }}
            />
            <motion.path
              d="M 700 44 Q 880 65, 1080 50 Q 1180 60, 1270 44"
              stroke="url(#redGradient)"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 2.3 }}
            />
            <motion.path
              d="M 700 44 Q 880 65, 1080 50 Q 1180 60, 1270 44"
              stroke="url(#redGradient)"
              strokeWidth="2.5"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 2.3 }}
            />
            <motion.path
              d="M 700 52 Q 920 25, 1120 40 Q 1220 30, 1290 52"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 2.5 }}
            />
            <motion.path
              d="M 700 52 Q 920 25, 1120 40 Q 1220 30, 1290 52"
              stroke="url(#greenGradient)"
              strokeWidth="2.5"
              fill="none"
              transform="scale(-1,1) translate(-1400,0)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 2.5 }}
            />

            <g filter="url(#connectionBlur)" opacity="0.3">
              <path
                d="M 700 48 Q 500 30, 300 40 Q 200 35, 120 48"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 700 44 Q 520 60, 320 50 Q 220 55, 130 44"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 700 52 Q 480 25, 280 45 Q 180 30, 110 52"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 700 48 Q 900 35, 1100 45 Q 1200 40, 1280 48"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 700 44 Q 880 65, 1080 50 Q 1180 60, 1270 44"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 700 52 Q 920 25, 1120 40 Q 1220 30, 1290 52"
                stroke="#00ff00"
                strokeWidth="4"
                fill="none"
              />
            </g>
          </motion.svg>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/40 bg-gray-50/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 dark:supports-[backdrop-filter]:bg-black/60 relative">
          <div className="container flex h-16 max-w-screen-2xl items-center px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={emblemMotion}
              className="mr-4 flex-shrink-0"
            >
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full font-semibold text-base shadow-md border border-gray-200 dark:border-gray-700">
                {emblem}
              </div>
            </motion.div>

            <div className="flex flex-1 items-center justify-end space-x-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={switchMotion}
                className="flex items-center space-x-2"
              >
                {extraIcons.map((icon, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    {icon}
                  </div>
                ))}

                {/* Authentication section for mobile - only show one green login button when not authenticated */}
                {isAuthenticated && user ? (
                  <div className="relative" id="navbar-user-menu-mobile">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                      }}
                      className="relative group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5 shadow-lg shadow-green-400/30 group-hover:shadow-xl group-hover:shadow-green-400/40 transition-all duration-300 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                          {user.avatar ? (
                            <Image 
                              src={user.avatar} 
                              alt={user.name} 
                              width={28}
                              height={28}
                              className="w-full h-full rounded-full object-cover aspect-square"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-3xl backdrop-saturate-150 rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-50 transform transition-all duration-300 origin-top-right animate-in slide-in-from-top-2">
                        <div className="px-3 py-2 border-b border-gray-100/50">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5 flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                                {user.avatar ? (
                                  <Image 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    width={28}
                                    height={28}
                                    className="w-full h-full rounded-full object-cover aspect-square"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{user.name}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <Gift className="w-3 h-3 text-green-400" />
                                <span className="text-xs text-green-400 font-bold">
                                  {(userPoints?.currentPoints || 0)} điểm
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-green-50/80 hover:text-green-400 transition-all duration-200 group"
                              onClick={() => {
                                setUserMenuOpen(false);
                                hideMobileMenu();
                              }}
                            >
                              {Icon && React.createElement(Icon, { className: "w-3 h-3 transition-transform duration-200 group-hover:scale-110" })}
                              <span>{item.name}</span>
                            </a>
                          );
                        })}
                        
                        <div className="border-t border-gray-100/50 mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                              hideMobileMenu();
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-all duration-200 group"
                          >
                            {React.createElement(LogOut, { className: "w-3 h-3 transition-transform duration-200 group-hover:scale-110" })}
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Only one green login button when not authenticated
                  <button
                    onClick={() => {
                      router.push('/login');
                      hideMobileMenu();
                    }}
                    className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1.5 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 font-bold text-xs hover:from-green-500 hover:to-green-600"
                  >
                    Đăng nhập
                  </button>
                )}

                {rightComponent && (
                  <div className="flex items-center justify-center">
                    {rightComponent}
                  </div>
                )}
              </motion.div>

              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-9 h-9 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {mobileMenuVisible ? (
                  <Close className="h-5 w-5" />
                ) : (
                  <List className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{
              opacity: mobileMenuVisible ? 1 : 0,
              maxHeight: mobileMenuVisible ? "80vh" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full z-40 overflow-y-auto border-t border-gray-200/40 dark:border-gray-800/40 bg-gray-50/95 dark:bg-black/95 backdrop-blur"
          >
            <div className="container py-4 px-4">
              <nav className="flex flex-col space-y-2">
                {links.map((element, idx) => (
                  <div key={element.text} className="space-y-1">
                    {element.submenu ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full text-gray-800 dark:text-gray-200 font-medium text-base py-2 px-4 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-200 dark:border-gray-800"
                          onClick={() => toggleSection(element.text)}
                        >
                          <span>{element.text}</span>
                          <span>
                            {openedSections[element.text] ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                          </span>
                        </button>

                        {openedSections[element.text] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 space-y-1 overflow-hidden"
                          >
                            {renderSubmenuItems(element.submenu)}
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <MobileNavigationLink item={element} />
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NavbarFlow;
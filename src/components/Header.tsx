'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  User, 
  Calendar, 
  Users, 
  Search, 
  X,
  Gift,
  LogOut,
  Home,
  ClipboardListIcon,
  BookOpenTextIcon
} from 'lucide-react';
import Image from 'next/image';
import { useAuthStore, rehydrateAuthState } from '../stores/authStore';
import { useFieldStore } from '../stores/fieldStore';

export const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname(); 
  const { user, isAuthenticated, logout, fetchUserProfile } = useAuthStore();
  const { userPoints, fetchUserPoints } = useFieldStore();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
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
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside both mobile menu and user menu
      const mobileMenu = document.getElementById('mobile-menu');
      const userMenu = document.getElementById('user-menu');
      
      if (mobileMenuOpen && mobileMenu && !mobileMenu.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
      
      if (userMenuOpen && userMenu && !userMenu.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (mobileMenuOpen || userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, userMenuOpen]);
  
  const navigation = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Đặt sân', href: '/booking', icon: Calendar },
    { name: 'Tìm đội', href: '/matches/discover', icon: Users },
    { name: 'Khám phá', href: '/fields', icon: Search },
    { name: 'Dành cho chủ sân', href: '/about', icon: BookOpenTextIcon },
  ];

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ClipboardListIcon },
    { name: 'Thông tin cá nhân', href: '/profile', icon: User },
    { name: 'Phần thưởng', href: '/rewards', icon: Gift },
  ];

  const NavigationLink = ({ item }: { item: typeof navigation[0] }) => {
    const Icon = item.icon;
    const isActive = mounted ? pathname === item.href : false;
    
    return (
      <Link
        href={item.href}
        className={`relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 group mx-1 ${
          isActive
            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transform scale-105'
            : 'text-gray-900 hover:text-black'
        }`}
      >
        <Icon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
          isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-black'
        }`} />
        <span className="font-semibold tracking-wide">{item.name}</span>
        {!isActive && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-900/30 to-emerald-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        )}
      </Link>
    );
  };

  const MobileNavigationLink = ({ item }: { item: typeof navigation[0] }) => {
    const Icon = item.icon;
    const isActive = mounted ? pathname === item.href : false;
    
    return (
      <Link
        href={item.href}
        className={`flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
          isActive
            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
            : 'text-gray-900 hover:text-black hover:bg-green-100/50 hover:backdrop-blur-sm'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:rotate-12'}`} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white text-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image 
                  src="/SportHub-Logo.png" 
                  alt="Logo" 
                  width={200}
                  height={80}
                  className="transition-all duration-300 drop-shadow-lg object-contain h-24 group-hover:h-28 group-hover:scale-110"
                />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1 rounded-full p-2 shadow-inner bg-gray-100/70 backdrop-blur-xl backdrop-saturate-125">
              {navigation.map((item) => (
                <NavigationLink key={item.name} item={item} />
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Move user authentication section to mobile menu */}
              <div className="hidden lg:flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <div className="relative" id="user-menu">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                      }}
                      className="relative group"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5 shadow-lg shadow-green-400/30 group-hover:shadow-xl group-hover:shadow-green-400/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                          {user.avatar ? (
                            <Image 
                              src={user.avatar} 
                              alt={user.name} 
                              width={40}
                              height={40}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-3xl backdrop-saturate-150 rounded-2xl shadow-2xl border border-gray-100/50 py-3 z-50 transform transition-all duration-300 origin-top-right animate-in slide-in-from-top-2">
                        <div className="px-5 py-4 border-b border-gray-100/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5">
                              <div className="w-full h-full rounded-full bg-white p-0.5">
                                {user.avatar ? (
                                  <Image 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    width={40}
                                    height={40}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-900">{user.name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Gift className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-green-400 font-bold">
                                  {(userPoints?.currentPoints || 0)} điểm
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-3 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50/80 hover:text-green-400 transition-all duration-200 group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                        
                        <div className="border-t border-gray-100/50 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 w-full px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50/80 transition-all duration-200 group"
                          >
                            <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => router.push('/login')}
                      className="text-black hover:text-green-400 font-bold px-5 py-2.5 rounded-full hover:bg-black/10 hover:backdrop-blur-sm transition-all duration-300 tracking-wide hover:scale-105"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => router.push('/register')}
                      className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:scale-105 font-bold tracking-wide hover:from-green-500 hover:to-green-600"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>

              {/* Only show menu button on mobile screens */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden p-2.5 rounded-full hover:bg-black/10 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-110"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-black transition-transform duration-200 hover:rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 text-black transition-transform duration-200 hover:scale-110" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xl transition-all duration-300">
          <div id="mobile-menu" className="absolute left-0 right-0 top-20 bg-white/95 backdrop-blur-3xl backdrop-saturate-150 border-b-2 border-green-400/50 shadow-2xl transition-all duration-500">
            <div className="px-4 py-6 space-y-3">
              {navigation.map((item) => (
                <MobileNavigationLink key={item.name} item={item} />
              ))}
              
              {/* Move user authentication section to mobile menu */}
              {isAuthenticated && user ? (
                <div className="pt-4 border-t-2 border-green-400/50 mt-6">
                  <div className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-green-900/80 to-green-800/80 backdrop-blur-sm rounded-xl border border-green-400/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={user.name} 
                            width={40}
                            height={40}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-white">{user.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Gift className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-300 font-bold">
                          {(userPoints?.currentPoints || 0)} điểm
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* User menu items for mobile */}
                  <div className="mt-4 space-y-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-green-50/80 hover:text-green-400 transition-all duration-200 rounded-xl"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                    
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t-2 border-green-400/50 mt-6">
                  <div className="flex flex-col space-y-3 px-4">
                    <button
                      onClick={() => {
                        router.push('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="text-black hover:text-green-400 font-bold px-5 py-3.5 rounded-full hover:bg-black/10 hover:backdrop-blur-sm transition-all duration-300 tracking-wide text-base"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        router.push('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3.5 rounded-full hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 font-bold tracking-wide hover:from-green-500 hover:to-green-600 text-base"
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
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
import { useAuthStore } from '../stores/authStore';

export const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); 
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    };

    if (mobileMenuOpen || userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, userMenuOpen]);
  
  const navigation = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Đặt sân', href: '/booking', icon: Calendar },
    { name: 'Tìm đội', href: '/teams', icon: Users },
    { name: 'Khám phá', href: '/fields', icon: Search },
    { name: 'Dành cho chủ sân', href: '/about', icon: BookOpenTextIcon },
  ];

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ClipboardListIcon },
    { name: 'Thông tin cá nhân', href: '/profile', icon: User },
  ];

  const NavigationLink = ({ item }: { item: typeof navigation[0] }) => {
    const Icon = item.icon;
    const isActive = mounted ? pathname === item.href : false;
    
    return (
      <Link
        href={item.href}
        className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 group ${
          isActive
            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transform scale-105'
            : 'text-gray-700 hover:text-green-800 hover:bg-green-200 hover:shadow-md hover:backdrop-blur-sm hover:scale-105'
        }`}
      >
        <Icon className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
          isActive ? 'text-white drop-shadow-sm' : 'text-gray-600 group-hover:text-green-600'
        }`} />
        <span className="font-semibold tracking-wide">{item.name}</span>
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
        )}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-20' : ''}`}></div>
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
            : 'text-gray-700 hover:text-green-600 hover:bg-green-50/80 hover:backdrop-blur-sm'
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
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 shadow-2xl backdrop-saturate-150' 
          : 'bg-white/95 backdrop-blur-2xl shadow-lg backdrop-saturate-125'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo - Cải thiện kích thước và hiệu ứng */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image 
                  src="/SportHub-Logo.png" 
                  alt="Logo" 
                  width={150}
                  height={80}
                  className={`transition-all duration-300 drop-shadow-lg object-contain h-24 group-hover:h-28 group-hover:scale-110`}
                />
              </div>
            </Link>

            {/* Desktop Navigation - Cải thiện blur */}
            <nav className={`hidden lg:flex items-center space-x-1 rounded-full p-2 shadow-inner transition-all duration-500 ${
              scrolled 
                ? 'bg-gray-50/50 backdrop-blur-2xl backdrop-saturate-150' 
                : 'bg-gray-50/70 backdrop-blur-xl backdrop-saturate-125'
            }`}>
              {navigation.map((item) => (
                <NavigationLink key={item.name} item={item} />
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="relative group"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-0.5 shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
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
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Online indicator with pulse */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                  </button>

                  {/* User Dropdown với blur cải thiện */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-3xl backdrop-saturate-150 rounded-2xl shadow-2xl border border-gray-100/50 py-3 z-50 transform transition-all duration-300 origin-top-right animate-in slide-in-from-top-2">
                      <div className="px-5 py-4 border-b border-gray-100/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-0.5">
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
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <div className="flex items-center space-x-2 bg-green-500 px-3 py-1.5 rounded-full">
                            <Gift className="w-4 h-4 text-white" />
                            <span className="text-sm font-bold text-white">{user.loyaltyPoints} điểm</span>
                          </div>
                        </div>
                      </div>
                      
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50/80 hover:text-green-700 transition-all duration-200 group"
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
                    className="text-gray-700 hover:text-green-600 font-bold px-5 py-2.5 rounded-full hover:bg-green-50/80 hover:backdrop-blur-sm transition-all duration-300 tracking-wide hover:scale-105"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 font-bold tracking-wide hover:from-green-600 hover:to-emerald-700"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="lg:hidden p-2.5 rounded-full hover:bg-green-50/80 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-110"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 transition-transform duration-200 hover:scale-110" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay với blur cải thiện */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xl transition-all duration-300">
          <div className={`absolute left-0 right-0 bg-white/85 backdrop-blur-3xl backdrop-saturate-150 border-b-2 border-green-100/50 shadow-2xl transition-all duration-500 ${
            scrolled ? 'top-16' : 'top-20'
          }`}>
            <div className="px-4 py-6 space-y-3">
              {navigation.map((item) => (
                <MobileNavigationLink key={item.name} item={item} />
              ))}
              
              {/* Mobile User Info */}
              {isAuthenticated && user && (
                <div className="pt-4 border-t-2 border-green-100/50 mt-6">
                  <div className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-green-200/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-0.5">
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
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900">{user.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-bold">{user.loyaltyPoints} điểm</span>
                      </div>
                    </div>
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
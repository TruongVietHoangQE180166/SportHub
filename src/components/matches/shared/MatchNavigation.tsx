'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Users, Plus } from 'lucide-react';

export const MatchNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Khám phá trận đấu',
      href: '/matches/discover',
      icon: Search,
      description: 'Tìm kiếm và tham gia các trận đấu'
    },
    {
      name: 'Trận đấu của tôi',
      href: '/matches/my-matches', 
      icon: Users,
      description: 'Quản lý trận đấu đã tham gia'
    },
    {
      name: 'Tạo trận đấu',
      href: '/matches/create',
      icon: Plus,
      description: 'Tạo trận đấu mới'
    }
  ];

  return (
    <div className="mb-8">
      <div className="bg-white rounded-3xl shadow-sm p-3 border border-gray-100">
        <nav className="hidden md:flex w-full justify-center space-x-3 min-w-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-4 px-8 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        {/* Mobile navigation */}
        <nav className="flex md:hidden w-full justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl font-medium transition-all duration-300 flex-1 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] text-center leading-tight px-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
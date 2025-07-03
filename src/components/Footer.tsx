'use client';
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div>
              <div className="mb-4">
                <Image
                  src="/SportHub-Logo.png"
                  alt="SportHub Logo"
                  width={160}
                  height={64}
                  className="w-auto h-16"
                />
              </div>
              <p className="text-gray-300 text-base leading-relaxed max-w-md">
                Hệ thống đặt sân thể thao hàng đầu tại Quy Nhơn. Kết nối cộng đồng thể thao, đặt sân dễ dàng, tìm đội nhanh chóng.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors duration-200">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors duration-200">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/booking", text: "Đặt sân" },
                { href: "/teams", text: "Tìm đội" },
                { href: "/fields", text: "Khám phá sân" },
                { href: "#", text: "Hỗ trợ" }
              ].map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="group flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span>{link.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Liên hệ
            </h3>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "Quy Nhơn, Bình Định" },
                { icon: Phone, text: "+84 123 456 789" },
                { icon: Mail, text: "support@SportHub.vn" }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 text-sm">
                      {contact.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 SportHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Điều khoản</a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Bảo mật</a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
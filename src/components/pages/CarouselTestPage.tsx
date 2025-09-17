"use client";
import React from "react";
import { Navigation, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const CarouselTestPage: React.FC = () => {
  const router = useRouter();

  // Single background image
  const backgroundImage =
    "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?_gl=1*197jvac*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODkzOTkkajQ3JGwwJGgw";

  const handleBookNow = () => {
    router.push("/booking");
  };

  const handleFindTeam = () => {
    router.push("/teams");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white overflow-hidden">
        {/* Single Background Image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Sports Background"
            fill
            className="w-full h-full object-cover opacity-30"
            style={{ objectFit: "cover" }}
            sizes="100vw"
            priority
          />

          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-slate-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-emerald-400/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-green-300/10 rounded-full animate-pulse delay-700"></div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center min-h-screen">
          <div className="text-center w-full">
            {/* Logo Section */}
            <div className="flex justify-center mb-4 animate-fade-in">
              <Image
                src="/SportHub-Logo.png"
                alt="Company Logo"
                width={500}
                height={300}
                className="object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>


            {/* Main Heading */}
            <h1 className="relative z-30 text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight py-4">
              <span className="block bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent animate-gradient drop-shadow-lg py-2">
                Đặt sân
              </span>
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent animate-gradient delay-300 drop-shadow-lg py-2">
                thể thao
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent animate-gradient delay-500 drop-shadow-lg py-2">
                dễ dàng & nhanh chóng
              </span>
            </h1>

            {/* Subtitle */}
            <div className="max-w-6xl mx-auto mb-12">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-green-100/90 leading-relaxed tracking-wide whitespace-nowrap overflow-hidden">
                <span className="animate-fade-in-up delay-700">
                  Kết nối cộng đồng thể thao
                </span>
                <span className="mx-3 text-green-400">•</span>
                <span className="animate-fade-in-up delay-1000">
                  Đặt sân trong 30 giây
                </span>
                <span className="mx-3 text-green-400">•</span>
                <span className="animate-fade-in-up delay-1300">
                  Tìm đội chơi dễ dàng
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-1500">
              <button
                onClick={handleBookNow}
                className="group relative bg-gradient-to-r from-white to-green-50 text-green-800 px-12 py-5 rounded-2xl font-bold text-xl hover:from-green-50 hover:to-white transition-all duration-500 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="relative z-10">Follow Chúng Tôi</span>
                  <Navigation className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

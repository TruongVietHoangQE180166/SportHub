"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  Trophy,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Award,
  MessageCircle,
  Search,
  ArrowRight,
  Quote,
  BarChart,
  Target,
  Compass,
  User, 
  Phone,
  Mail,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useFieldStore } from "../../stores/fieldStore";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    popularFields,
    loading,
    fetchPopularFields,
    mainSports,
    fetchMainSports,
  } = useFieldStore();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  const sportsImages = [
    "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?_gl=1*197jvac*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODkzOTkkajQ3JGwwJGgw",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center",
    "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?_gl=1*t142ag*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODk0OTMkajU1JGwwJGgw",
    "https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?_gl=1*ywlzwa*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODk1MjUkajIzJGwwJGgw",
  ];

  useEffect(() => {
    fetchPopularFields();
    fetchMainSports();
  }, [fetchPopularFields, fetchMainSports]);

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Vận động viên bóng đá",
      content:
        "Hệ thống đặt sân rất tiện lợi, sân sạch đẹp và giá cả hợp lý. Tôi đã đặt sân hơn 20 lần rồi!",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      name: "Trần Thị B",
      role: "Người chơi cầu lông",
      content:
        "Ứng dụng dễ sử dụng, tìm đội chơi rất nhanh. Cộng đồng thể thao ở đây rất thân thiện.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      name: "Lê Minh C",
      role: "Huấn luyện viên Pickle Ball",
      content:
        "Chất lượng sân tốt, hệ thống tích điểm hấp dẫn. Học trò của tôi đều thích đặt sân ở đây.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  const getVisibleFields = () => {
    if (popularFields.length === 0) return [];
    const fields = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentSlide + i) % popularFields.length;
      fields.push(popularFields[index]);
    }
    return fields;
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      router.push("/booking");
    } else {
      router.push("/login");
    }
  };

  const handleFindTeam = () => {
    router.push("/teams");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sportsImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sportsImages.length]);

  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const visibleTestimonials = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visibleTestimonials.push(testimonials[index]);
    }
    return visibleTestimonials;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {sportsImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-30" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Sports ${index + 1}`}
                fill
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                priority={index === currentSlide}
              />
            </div>
          ))}

          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % sportsImages.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + sportsImages.length) % sportsImages.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {sportsImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-400/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-emerald-400/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-green-300/10 rounded-full animate-pulse delay-700"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center min-h-screen">
          <div className="text-center w-full">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-full px-8 py-3 border border-green-400/30 shadow-lg">
                <span className="text-green-200 font-semibold text-lg tracking-wide">
                  🏆 Hệ thống đặt sân tại Quy Nhơn
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent animate-gradient">
                Đặt sân
              </span>
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent animate-gradient delay-300">
                thể thao
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent animate-gradient delay-500">
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
                  <span className="relative z-10">Đặt sân ngay</span>
                  <Navigation className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </button>

              <button
                onClick={handleFindTeam}
                className="group relative border-3 border-white/80 bg-white/5 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-green-800 transition-all duration-500 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="relative z-10">Tìm đội chơi</span>
                  <Search className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Decorative Background Elements - Enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-bl from-emerald-300/20 to-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-100/10 to-emerald-100/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-8 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Khám phá những tính năng nổi bật mang đến trải nghiệm thể thao
              đỉnh cao tại Quy Nhơn
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Features Grid - 2x2 Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: <Calendar className="w-10 h-10 text-white" />,
                title: "Đặt sân siêu tốc",
                description:
                  "Đặt sân yêu thích chỉ trong 30 giây. Xem lịch trống theo thời gian thực, thanh toán an toàn, nhanh chóng.",
                color: "from-green-500 to-emerald-600",
                stats: "< 30 giây",
              },
              {
                icon: <Users className="w-10 h-10 text-white" />,
                title: "Kết nối đội nhóm",
                description:
                  "Tìm kiếm đồng đội, tổ chức trận đấu và xây dựng cộng đồng thể thao sôi động tại Quy Nhơn.",
                color: "from-green-500 to-emerald-600",
                stats: "cộng đồng lớn mạnh",
              },
              {
                icon: <Shield className="w-10 h-10 text-white" />,
                title: "Bảo mật tuyệt đối",
                description:
                  "Dữ liệu cá nhân và giao dịch được bảo vệ tối đa với công nghệ mã hóa tiên tiến.",
                color: "from-green-500 to-emerald-600",
                stats: "99.9% an toàn",
              },
              {
                icon: <Trophy className="w-10 h-10 text-white" />,
                title: "Tích điểm thưởng",
                description:
                  "Tích lũy điểm mỗi khi đặt sân, đổi lấy ưu đãi độc quyền và phần quà giá trị.",
                color: "from-green-500 to-emerald-600",
                stats: "Ưu đãi 20%",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden"
              >
                {/* Icon and Stats Row */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                    >
                      {feature.stats}
                    </div>
                  </div>
                </div>
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-lg group-hover:text-gray-800 transition-colors duration-300">
                  {feature.description}
                </p>
                {/* Hover indicator */}
                <div className="mt-6 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-sm font-semibold mr-2">
                    Tìm hiểu thêm
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/15 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Môn thể thao{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                chủ lực
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ba môn thể thao được yêu thích nhất tại Quy Nhơn với hệ thống sân
              chất lượng cao và dịch vụ chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {loading ? (
              // Loading skeleton cho main sports
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg min-h-[500px] animate-pulse"
                  >
                    <div className="w-28 h-28 bg-gray-200 rounded-3xl mx-auto mb-8"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-8"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </div>
                ))
            ) : mainSports.length > 0 ? (
              mainSports.map((sport, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 overflow-hidden min-h-[500px]"
                  onClick={() => router.push(`/fields?sport=${sport.name}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-center mb-8">
                      <div
                        className={`w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                          {sport.icon}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-green-700 transition-colors duration-300">
                      {sport.name}
                    </h3>
                    <p className="text-gray-600 text-center mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-base">
                      {sport.description}
                    </p>

                    {/* CTA Button */}
                    <div className="text-center mt-auto">
                      <div className="inline-flex items-center gap-2 bg-black-50 hover:bg-black-100 text-black-700 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:shadow-md cursor-pointer border border-black-100">
                        <span>{sport.courts} sân khả dụng</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-100/30 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Không tìm thấy môn thể thao nào</p>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => router.push('/fields')}
            >
              <span>Khám phá tất cả sân thể thao</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* About System Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Về hệ thống của chúng tôi
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Chúng tôi là hệ thống đặt sân thể thao hàng đầu tại Quy Nhon,
                kết nối hơn 50+ sân thể thao chất lượng cao với cộng đồng người
                chơi đam mê thể thao.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Đặt sân nhanh chóng
                    </h4>
                    <p className="text-gray-600">
                      Giao diện thân thiện, đặt sân chỉ trong vài click
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Chất lượng đảm bảo
                    </h4>
                    <p className="text-gray-600">
                      Tất cả sân đều được kiểm định chất lượng nghiêm ngặt
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Cộng đồng lớn mạnh
                    </h4>
                    <p className="text-gray-600">
                      Hơn 10,000+ thành viên tích cực tham gia
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl transform rotate-3"></div>
              <Image
                src="https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Hệ thống thể thao"
                width={800}
                height={384}
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Owner Features Section - Chèn sau About System Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-green-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-green-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-56 h-56 bg-emerald-400/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-green-300/10 rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-green-800/80 to-slate-900/90"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-white/20 to-green-200/20 backdrop-blur-sm rounded-2xl mb-8 border border-white/10">
              <Shield className="w-10 h-10 text-green-200" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Dành cho{" "}
              <span className="bg-gradient-to-r from-green-300 via-emerald-200 to-green-100 bg-clip-text text-transparent">
                chủ sân
              </span>
            </h2>
            <p className="text-xl text-green-100/90 max-w-3xl mx-auto leading-relaxed">
              Quản lý sân thể thao hiệu quả với hệ thống công nghệ tiên tiến,
              tăng doanh thu và tối ưu hóa vận hành
            </p>
            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {[
                  {
                    icon: <Calendar className="w-7 h-7 text-white" />,
                    title: "Quản lý lịch đặt sân",
                    description:
                      "Theo dõi lịch đặt sân theo thời gian thực, quản lý slot trống và tối ưu hóa tỷ lệ lấp đầy sân.",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    icon: <Users className="w-7 h-7 text-white" />,
                    title: "Quản lý khách hàng",
                    description:
                      "Xây dựng cơ sở dữ liệu khách hàng, theo dõi lịch sử đặt sân và chăm sóc khách hàng VIP.",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    icon: <Trophy className="w-7 h-7 text-white" />,
                    title: "Báo cáo doanh thu",
                    description:
                      "Thống kê chi tiết doanh thu theo ngày/tháng/năm với biểu đồ trực quan và phân tích xu hướng.",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    icon: <MessageCircle className="w-7 h-7 text-white" />,
                    title: "Hỗ trợ 24/7",
                    description:
                      "Đội ngũ hỗ trợ kỹ thuật chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc và hỗ trợ vận hành.",
                    color: "from-green-500 to-green-600",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-green-100/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image & CTA */}
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

              {/* Main Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-3xl transform rotate-3"></div>
                <Image
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Quản lý sân thể thao"
                  width={800}
                  height={384}
                  className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
              </div>

              {/* Stats Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-600">
                      Chủ sân đang sử dụng
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">99%</div>
                    <div className="text-sm text-gray-600">Độ hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 pt-16 border-t border-white/10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Tại sao chủ sân chọn chúng tôi?
              </h3>
              <p className="text-green-100/80 text-lg max-w-2xl mx-auto">
                Những lợi ích vượt trội khi tham gia hệ thống quản lý sân thể
                thao của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart className="w-8 h-8 text-white" />, 
                  title: "Tăng doanh thu 40%",
                  description:
                    "Tối ưu hóa lịch đặt sân và thu hút thêm khách hàng mới",
                },
                {
                  icon: <Zap className="w-8 h-8 text-white" />, 
                  title: "Tiết kiệm thời gian",
                  description:
                    "Tự động hóa quy trình đặt sân và quản lý thanh toán",
                },
                {
                  icon: <Target className="w-8 h-8 text-white" />, 
                  title: "Marketing hiệu quả",
                  description:
                    "Tiếp cận hàng ngàn người chơi thể thao tại Quy Nhơn",
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    {benefit.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors duration-300">
                    {benefit.title}
                  </h4>
                  <p className="text-green-100/80 group-hover:text-white transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Sẵn sàng tham gia cùng chúng tôi?
              </h3>
              <p className="text-green-100/80 text-lg mb-8 max-w-2xl mx-auto">
                Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho 3 tháng đầu
                tiên
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-white to-green-50 text-green-800 px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-50 hover:to-white transition-all duration-300 shadow-xl hover:shadow-white/25 transform hover:-translate-y-1"
                  onClick={() => router.push('/about#register-form')}>
                  <span className="flex items-center justify-center gap-3">
                    <span>Đăng ký làm đối tác</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                <button className="group border-2 border-white/80 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-800 transition-all duration-300 shadow-xl hover:shadow-white/25 transform hover:-translate-y-1">
                  <span className="flex items-center justify-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <span>Tư vấn miễn phí</span>
                  </span>
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center space-x-2 text-green-200">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Bảo mật tuyệt đối</span>
                </div>
                <div className="flex items-center space-x-2 text-green-200">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center space-x-2 text-green-200">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">Triển khai nhanh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Fields Slider */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sân thể thao{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                phổ biến
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Những sân thể thao được đánh giá cao nhất và được đặt nhiều nhất tại Quy Nhơn
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Đang tải sân thể thao...</p>
            </div>
          ) : popularFields.length > 0 ? (
            <div className="relative flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto max-w-8xl">
                {getVisibleFields().map((field) => {
                  return (
                    <div
                      key={field.id}
                      className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                    >
                      <div className="relative h-50">
                        <Image
                          src={field.image}
                          alt={field.name}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 border border-green-100 shadow">
                          <Star className="w-4 h-4 text-green-500 fill-current" />
                          <span className="text-xs font-bold text-green-700">
                            {field.rating}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3 bg-white text-green-700 w-9 h-9 flex items-center justify-center rounded-full text-xl shadow">
                          {field.sport === "football"
                            ? "⚽"
                            : field.sport === "badminton"
                            ? "🏸"
                            : field.sport === "pickle"
                            ? "🎾"
                            : ""}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                          {field.name}
                        </h3>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span className="text-xs">{field.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-3 h-3 text-green-600" />
                            <span className="text-xs">
                              {field.openingHours}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-3 p-2 rounded-xl">
                          <div className="text-base font-bold text-green-700">
                            {field.price}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-green-700">
                              {field.reviews} đánh giá
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                router.push(`/booking?fieldId=${field.id}&sport=${field.sport}`);
                              } else {
                                router.push("/login");
                              }
                            }}
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-xs"
                          >
                            Đặt ngay
                          </button>
                          <button className="px-3 py-2 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors text-xs font-semibold">
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sân thể thao nào</p>
            </div>
          )}

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center items-center mt-16 space-x-4">
            <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {popularFields.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    currentSlide === index
                      ? "w-12 h-4 bg-gradient-to-r from-green-500 to-green-500"
                      : "w-4 h-4 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                  }`}
                >
                  {currentSlide === index && (
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-500 rounded-full mb-6">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
              Mọi người nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hàng ngàn khách hàng hài lòng đã tin tưởng sử dụng dịch vụ của
              chúng tôi
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-green-500 to-green-500 mx-auto rounded-full"></div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${currentTestimonialSlide}-${index}`}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 min-h-[320px] flex flex-col"
              >
                {/* Author Info - Moved to top */}
                <div className="flex items-center space-x-4 mb-6">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-green-600 text-sm font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <p className="text-gray-700 text-base leading-relaxed italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center items-center mt-16 space-x-4">
            <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialSlide(index)}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    currentTestimonialSlide === index
                      ? "w-12 h-4 bg-gradient-to-r from-green-500 to-green-500"
                      : "w-4 h-4 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                  }`}
                >
                  {currentTestimonialSlide === index && (
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

            {/* Circular CTA Section */}
            <section className="py-24 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8">
            <Compass className="w-5 h-5 text-green-300" />
            <span className="text-green-200 font-semibold">Hành trình bắt đầu</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Sẵn sàng tham gia?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Trở thành một phần của cộng đồng thể thao lớn nhất Quy Nhơn. 
            Khám phá, kết nối và trải nghiệm thể thao theo cách hoàn toàn mới.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => router.push('/register')}
              className="group bg-gradient-to-r from-white to-green-50 text-green-800 px-10 py-5 rounded-full font-bold text-xl hover:from-green-50 hover:to-white transition-all duration-500 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                <User className="w-6 h-6" />
                <span>Đăng ký ngay</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            <button
              onClick={() => router.push('/fields')}
              className="group border-2 border-white/80 bg-white/5 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-green-800 transition-all duration-500 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                <Search className="w-6 h-6" />
                <span>Khám phá sân</span>
              </span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Phone className="w-6 h-6 text-white" />,
                  title: "Hotline",
                  content: "1900 1234",
                },
                {
                  icon: <Mail className="w-6 h-6 text-white" />,
                  title: "Email",
                  content: "support@sportsbook.vn",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  title: "Địa chỉ",
                  content: "123 Nguyễn Huệ, Quy Nhơn",
                },
              ].map((contact, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    {contact.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2 group-hover:text-green-200 transition-colors duration-300">
                    {contact.title}
                  </h4>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {contact.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

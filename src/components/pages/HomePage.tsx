"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useAuthStore, rehydrateAuthState } from "../../stores/authStore";
import { useFieldStore } from "../../stores/fieldStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    popularFields,
    serverFields,
    loading,
    error,
    fetchPopularFields,
    fetchServerFields,
    mainSports,
    fetchMainSports,
  } = useFieldStore();
  const router = useRouter();

  // Rehydrate auth state on client side only
  useEffect(() => {
    rehydrateAuthState();
  }, []);

  // Separate state for each carousel
  const [heroSlide, setHeroSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [fieldSlide, setFieldSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024); // Default value for SSR

  const sportsImages = [
    "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?_gl=1*197jvac*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODkzOTkkajQ3JGwwJGgw",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center",
    "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?_gl=1*t142ag*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODk0OTMkajU1JGwwJGgw",
    "https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?_gl=1*ywlzwa*_ga*MTM4MjA3NDU0OS4xNzUxMjg5Mzg3*_ga_8JE65Q40S6*czE3NTEyODkzODYkbzEkZzEkdDE3NTEyODk1MjUkajIzJGwwJGgw",
  ];

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Đặt sân siêu tốc",
      description:
        "Đặt sân yêu thích chỉ trong 30 giây. Xem lịch trống theo thời gian thực, thanh toán an toàn, nhanh chóng.",
      stats: "< 30 giây",
      highlight: "Nhanh nhất",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Kết nối đội nhóm",
      description:
        "Tìm kiếm đồng đội, tổ chức trận đấu và xây dựng cộng đồng thể thao sôi động tại Quy Nhơn.",
      stats: "1000+ thành viên",
      highlight: "Cộng đồng lớn",
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Bảo mật tuyệt đối",
      description:
        "Dữ liệu cá nhân và giao dịch được bảo vệ tối đa với công nghệ mã hóa tiên tiến.",
      stats: "99.9% an toàn",
      highlight: "Đáng tin cậy",
    },
    {
      icon: <Trophy className="w-8 h-8 text-white" />,
      title: "Tích điểm thưởng",
      description:
        "Tích lũy điểm mỗi khi đặt sân, đổi lấy ưu đãi độc quyền và phần quà giá trị.",
      stats: "Ưu đãi 20%",
      highlight: "Tiết kiệm",
    },
  ];

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
    {
      name: "Phạm Thu D",
      role: "Sinh viên đại học",
      content:
        "Đặt sân online rất tiện, có nhiều ưu đãi cho sinh viên. Các sân đều gần trường đại học.",
      rating: 5,
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  const images = [
    {
      src: "https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Sân bóng rổ chất lượng cao",
    },
    {
      src: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Sân bóng đá cỏ nhân tạo",
    },
    {
      src: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Sân cầu lông hiện đại",
    },
    {
      src: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Sân tennis tiêu chuẩn",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);
  const stats = [
    {
      number: "50+",
      label: "Sân thể thao",
      icon: <Award className="w-5 h-5" />,
    },
    {
      number: "10K+",
      label: "Thành viên",
      icon: <Users className="w-5 h-5" />,
    },
    { number: "99%", label: "Hài lòng", icon: <Star className="w-5 h-5" /> },
  ];

  const featuresAboutUs = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Đặt sân nhanh chóng",
      description: "Giao diện thân thiện, đặt sân chỉ trong vài click",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Chất lượng đảm bảo",
      description: "Tất cả sân đều được kiểm định chất lượng nghiêm ngặt",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Cộng đồng lớn mạnh",
      description: "Hơn 10,000+ thành viên tích cực tham gia",
    },
  ];

  // Track window resize for responsive field slider
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setFieldSlide(0); // Reset field slide on resize
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    fetchPopularFields();
    fetchMainSports();
    fetchServerFields();
  }, [fetchPopularFields, fetchMainSports, fetchServerFields]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setSlideDirection("right");
      setHeroSlide((prev) => (prev + 1) % sportsImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, sportsImages.length]);

  const nextSlide = useCallback(() => {
    setSlideDirection("right");
    setHeroSlide((prev) => (prev + 1) % sportsImages.length);
  }, [sportsImages.length]);

  const prevSlide = useCallback(() => {
    setSlideDirection("left");
    setHeroSlide(
      (prev) => (prev - 1 + sportsImages.length) % sportsImages.length
    );
  }, [sportsImages.length]);

  // Touch handlers
  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isAutoPlaying]);

  // Auto-advance testimonial carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % getTotalTestimonialSlides());
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, windowWidth, testimonialSlide]); // Add testimonialSlide dependency

  // Auto-advance popular fields carousel
  useEffect(() => {
    // Only auto-advance if there are multiple slides
    if (getTotalFieldSlides() <= 1) return;

    const timer = setInterval(() => {
      setFieldSlide((prev) => (prev + 1) % getTotalFieldSlides());
    }, 5000);

    return () => clearInterval(timer);
  }, [serverFields.length, windowWidth, fieldSlide]); // Dependencies

  // Get visible fields based on current slide and screen size
  const getVisibleFields = () => {
    const fieldsToUse = serverFields.length > 0 ? serverFields : popularFields;

    if (fieldsToUse.length === 0) return [];

    // Filter out unavailable fields and transform the data
    return fieldsToUse
      .filter((serverField: any) => serverField.available !== false)
      .map((serverField: any) => ({
        id: serverField.id || "",
        name: serverField.fieldName || "Tên sân không xác định",
        location: serverField.location || "Địa điểm không xác định",
        rating: serverField.averageRating || 0, // Use actual averageRating from API
        reviews: serverField.totalBookings || 0, // Use actual totalBookings from API
        price:
          serverField.normalPricePerHour !== undefined &&
          serverField.normalPricePerHour !== null
            ? `${serverField.normalPricePerHour.toLocaleString("vi-VN")}đ/giờ`
            : "Giá không xác định",
        openingHours:
          serverField.openTime && serverField.closeTime
            ? `${serverField.openTime.substring(
                0,
                5
              )} - ${serverField.closeTime.substring(0, 5)}`
            : "Giờ mở cửa không xác định",
        image:
          (serverField.images && serverField.images[0]) ||
          "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200",
        sport:
          serverField.typeFieldName === "Bóng Đá"
            ? "football"
            : serverField.typeFieldName === "Cầu Lông"
            ? "badminton"
            : serverField.typeFieldName === "Pickle Ball"
            ? "pickle"
            : "football",
      }));
  };

  // Calculate items per slide based on screen width for fields
  const getItemsPerSlide = () => {
    if (windowWidth >= 1024) return 4; // lg
    if (windowWidth >= 768) return 2; // md
    return 1; // sm
  };

  // Calculate items per slide based on screen width for testimonials
  const getTestimonialItemsPerSlide = () => {
    if (windowWidth >= 1024) return 3; // lg - show 3 testimonials on desktop
    if (windowWidth >= 768) return 2; // md
    return 1; // sm
  };

  // Get fields for current slide
  const getFieldsForCurrentSlide = () => {
    const allFields = getVisibleFields();
    const itemsPerSlide = getItemsPerSlide();
    const startIndex = fieldSlide * itemsPerSlide;
    return allFields.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Calculate total slides needed
  const getTotalFieldSlides = () => {
    const allFields = getVisibleFields();
    const itemsPerSlide = getItemsPerSlide();
    return Math.ceil(allFields.length / itemsPerSlide);
  };

  // Get visible testimonials based on current slide and screen size
  const getVisibleTestimonials = () => {
    const itemsPerSlide = getTestimonialItemsPerSlide(); // Use separate logic for testimonials
    const visibleTestimonials = [];
    for (let i = 0; i < itemsPerSlide; i++) {
      const index = (testimonialSlide + i) % testimonials.length;
      visibleTestimonials.push(testimonials[index]);
    }
    return visibleTestimonials;
  };

  // Calculate total testimonial slides needed
  const getTotalTestimonialSlides = () => {
    const itemsPerSlide = getTestimonialItemsPerSlide(); // Use separate logic for testimonials
    return Math.ceil(testimonials.length / itemsPerSlide);
  };

  const handleBookNow = () => {
    // Directly navigate to booking page without authentication check
    router.push("/booking");
  };

  const handleFindTeam = () => {
    router.push("/teams");
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Background Carousel */}
      <section
        className="relative min-h-[300px] sm:min-h-[500px] md:min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Carousel với hiệu ứng parallax */}
        <div className="absolute inset-0">
          {sportsImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === heroSlide
                  ? "opacity-100 scale-100"
                  : index ===
                      (heroSlide - 1 + sportsImages.length) %
                        sportsImages.length && slideDirection === "right"
                  ? "opacity-0 scale-95 -translate-x-full"
                  : index === (heroSlide + 1) % sportsImages.length &&
                    slideDirection === "left"
                  ? "opacity-0 scale-95 translate-x-full"
                  : "opacity-0 scale-110"
              }`}
              style={{
                transform: `translateX(${
                  index === heroSlide
                    ? 0
                    : slideDirection === "right"
                    ? "100%"
                    : "-100%"
                }) scale(${index === heroSlide ? 1.05 : 1})`,
              }}
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${image})`,
                  transform: isHovered ? "scale(1.1)" : "scale(1.05)",
                }}
              />

              {/* Gradient overlays với hiệu ứng động */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-green-900/20 to-emerald-900/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

              {/* Animated light rays */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/20 to-transparent transform rotate-12 animate-pulse delay-1000"></div>
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-green-300/20 to-transparent transform -rotate-12 animate-pulse delay-2000"></div>
              </div>

              {/* Floating particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${(i * 13) % 100}%`,
                    top: `${(i * 7) % 100}%`,
                    animationDelay: `${(i * 0.3) % 3}s`,
                    animationDuration: `${2 + ((i * 0.2) % 2)}s`,
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={prevSlide}
            className="group relative bg-black/20 backdrop-blur-xl hover:bg-white/20 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-500 border border-white/30 shadow-2xl hover:shadow-green-500/20 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-all duration-300 text-white drop-shadow-lg group-hover:-translate-x-0.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={nextSlide}
            className="group relative bg-black/20 backdrop-blur-xl hover:bg-white/20 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-500 border border-white/30 shadow-2xl hover:shadow-green-500/20 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-all duration-300 text-white drop-shadow-lg group-hover:translate-x-0.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-black/20 backdrop-blur-xl rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border border-white/20">
            {/* Slide indicators */}
            <div className="flex gap-1.5 sm:gap-2">
              {sportsImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSlideDirection(index > heroSlide ? "right" : "left");
                    setHeroSlide(index);
                  }}
                  className={`relative group transition-all duration-500 ${
                    index === heroSlide
                      ? "w-8 sm:w-10 md:w-12 h-2.5 sm:h-2.5 md:h-3"
                      : "w-2.5 sm:w-2.5 md:w-3 h-2.5 sm:h-2.5 md:h-3 hover:scale-110"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      index === heroSlide
                        ? "bg-gradient-to-r from-white to-green-300 shadow-lg shadow-white/30"
                        : "bg-white/40 group-hover:bg-white/70"
                    }`}
                  >
                    {index === heroSlide && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {/* Progress bar for current slide */}
                  {index === heroSlide && isAutoPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full origin-left animate-progress"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Slide counter */}
            <div className="text-white/80 text-xs font-medium hidden sm:block">
              {heroSlide + 1} / {sportsImages.length}
            </div>
          </div>
        </div>

        {/* Enhanced Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-green-400/10 rounded-full animate-float"></div>
          <div className="absolute bottom-32 right-16 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-emerald-400/10 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/3 right-1/4 w-12 sm:w-20 md:w-24 h-12 sm:h-20 md:h-24 bg-white/5 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-1/4 left-1/4 w-14 sm:w-24 md:w-28 h-14 sm:h-24 md:h-28 bg-green-300/10 rounded-full animate-float-reverse"></div>

          {/* Dynamic grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
                animation: "grid-move 20s linear infinite",
              }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-24 flex items-center min-h-[300px] sm:min-h-[500px] md:min-h-screen">
          <div className="text-center w-full">
            {/* Enhanced Badge */}
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="group bg-white rounded-full px-2 sm:px-6 md:px-8 py-1 sm:py-2.5 md:py-3 border border-gray-200 shadow-2xl hover:shadow-gray-300 transition-all duration-500 hover:scale-105">
                <span className="text-gray-900 font-semibold text-[10px] sm:text-base md:text-lg tracking-wide flex items-center gap-1 sm:gap-2">
                  <span className="animate-bounce text-xs sm:text-lg md:text-xl">
                    🏆
                  </span>
                  <span className="hidden xs:inline">
                    Hệ thống đặt sân tại Quy Nhơn
                  </span>
                  <span className="xs:hidden">
                    Hệ thống đặt sân tại Quy Nhơn
                  </span>
                  <span className="w-0.5 h-0.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full animate-pulse"></span>
                </span>
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-7 md:mb-8 leading-tight tracking-tight px-2">
              <span className="block bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent animate-gradient-shift drop-shadow-2xl">
                Đặt sân
              </span>
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent animate-gradient-shift-delayed drop-shadow-2xl">
                thể thao
              </span>
              <span
                className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-5 md:mt-6 text-white font-bold leading-relaxed drop-shadow-2xl"
                style={{
                  textShadow:
                    "0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(255,255,255,0.3)",
                }}
              >
                dễ dàng & nhanh chóng
              </span>
            </h1>

            {/* Enhanced Subtitle with typing effect */}
            <div className="max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-12 px-4 hidden xs:hidden sm:block">
              <div
                className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light text-white leading-relaxed tracking-wide flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 md:gap-4"
                style={{
                  textShadow:
                    "0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.2)",
                }}
              >
                <span className="inline-block animate-fade-in-up bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
                  Kết nối cộng đồng thể thao
                </span>
                <span className="hidden sm:inline text-green-300 animate-pulse text-lg sm:text-xl md:text-2xl">
                  •
                </span>
                <span className="inline-block animate-fade-in-up delay-500 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
                  Đặt sân trong 30 giây
                </span>
                <span className="hidden sm:inline text-green-300 animate-pulse delay-1000 text-lg sm:text-xl md:text-2xl">
                  •
                </span>
                <span className="inline-block animate-fade-in-up delay-1000 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
                  Tìm đội chơi dễ dàng
                </span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-6 justify-center px-4 hidden xs:hidden sm:flex">
              <button
                onClick={handleBookNow}
                className="group relative bg-gradient-to-r from-white to-green-50 text-green-800 px-6 sm:px-10 md:px-12 py-3 sm:py-4.5 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-lg md:text-xl transition-all duration-500 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">
                  <span>Đặt sân ngay</span>
                  <Navigation className="w-4 h-4 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-green-400/30 rounded-full group-hover:animate-ping"></div>
              </button>

              <button
                onClick={handleFindTeam}
                className="group relative border-2 border-white/80 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-10 md:px-12 py-3 sm:py-4.5 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-sm sm:text-lg md:text-xl hover:bg-white hover:text-green-800 transition-all duration-500 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">
                  <span>Tìm đội chơi</span>
                  <Search className="w-4 h-4 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white/30 rounded-full group-hover:animate-ping"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Custom CSS cho animations */}
        <style>{`
          @keyframes gradient-shift {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes gradient-shift-delayed {
            0%,
            100% {
              background-position: 100% 50%;
            }
            50% {
              background-position: 0% 50%;
            }
          }

          @keyframes gradient-shift-slow {
            0%,
            100% {
              background-position: 50% 0%;
            }
            50% {
              background-position: 50% 100%;
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          @keyframes float-delayed {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-30px) rotate(-180deg);
            }
          }

          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-15px) scale(1.1);
            }
          }

          @keyframes float-reverse {
            0%,
            100% {
              transform: translateY(-10px) rotate(45deg);
            }
            50% {
              transform: translateY(10px) rotate(-45deg);
            }
          }

          @keyframes slide-up {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes progress {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }

          @keyframes grid-move {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(40px, 40px);
            }
          }

          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 3s ease-in-out infinite;
          }

          .animate-gradient-shift-delayed {
            background-size: 200% 200%;
            animation: gradient-shift-delayed 3s ease-in-out infinite;
          }

          .animate-gradient-shift-slow {
            background-size: 200% 200%;
            animation: gradient-shift-slow 4s ease-in-out infinite;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
          }

          .animate-float-reverse {
            animation: float-reverse 7s ease-in-out infinite;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
          }

          .animate-progress {
            animation: progress 4s linear;
          }

          .animate-fade-in-up {
            animation: slide-up 1s ease-out forwards;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }

          .delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </section>

      {/* why choose us Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-500/5 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 tracking-tight">
              Tại sao chọn{" "}
              <span className="relative">
                <span className="text-green-500">chúng tôi</span>
                <div className="absolute bottom-2 left-0 w-full h-3 bg-green-500/20 -z-10 rounded"></div>
              </span>
              <span className="text-black">?</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Khám phá những tính năng nổi bật mang đến trải nghiệm thể thao
              đỉnh cao tại Quy Nhơn
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Được tin tưởng bởi 5000+ khách hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Đánh giá 4.9/5 sao</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-green-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-green-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full inline-block mb-1">
                          {feature.highlight}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-green-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-black font-bold text-xs rounded-full">
                      {feature.stats}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed text-sm mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Action Link */}
                  <div className="flex items-center text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="mr-1 text-sm">Tìm hiểu thêm</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-bl from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center">
              <button className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-green-500 hover:scale-105 transition-all duration-300 shadow-xl">
                Bắt đầu ngay hôm nay
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Không cần thẻ tín dụng • Dùng thử miễn phí
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sports Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-3">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-green-500/8 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="px-4 py-2 bg-gray-100 text-black font-semibold text-sm rounded-full border">
                🏆 Top 3 môn thể thao
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight tracking-tight">
              Môn thể thao <span className="text-green-500">chủ lực</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Ba môn thể thao được yêu thích nhất tại Quy Nhơn với hệ thống sân
              chất lượng cao và dịch vụ chuyên nghiệp
            </p>

            {/* Divider */}
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10">
            {loading ? (
              // Enhanced Loading skeleton
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 min-h-[520px] animate-pulse"
                  >
                    <div className="w-24 h-24 bg-gray-200 rounded-3xl mx-auto mb-8"></div>
                    <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4 mx-auto"></div>
                    <div className="space-y-3 mb-8">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
                    </div>
                    <div className="h-12 bg-gray-200 rounded-full w-40 mx-auto"></div>
                  </div>
                ))
            ) : mainSports.length > 0 ? (
              mainSports.map((sport, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-gray-100 hover:border-green-500/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden min-h-[400px] sm:min-h-[520px] cursor-pointer"
                  onClick={() => router.push(`/fields?sport=${sport.name}`)}
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon Container */}
                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                      <div className="w-24 h-24 sm:w-24 sm:h-24 bg-gray-200 rounded-3xl flex items-center justify-center shadow-xl group-hover:bg-green-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <span className="text-4xl sm:text-4xl text-gray-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          {sport.icon}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold text-black mb-4 text-center group-hover:text-green-600 transition-colors duration-300">
                      {sport.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-base sm:text-lg flex-grow">
                      {sport.description}
                    </p>

                    {/* Enhanced CTA Button */}
                    <div className="text-center mt-auto">
                      <div className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-gray-100 hover:bg-black text-gray-700 hover:text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-semibold transition-all duration-300 border-2 border-gray-100 hover:border-black group-hover:shadow-lg">
                        <span className="text-sm sm:text-base">
                          Khám phá ngay
                        </span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏃‍♂️</span>
                </div>
                <p className="text-xl text-gray-500 font-medium">
                  Không tìm thấy môn thể thao nào
                </p>
                <p className="text-gray-400 mt-2">Vui lòng thử lại sau</p>
              </div>
            )}
          </div>

          {/* Enhanced Bottom CTA */}
          <div className="text-center mt-20">
            <div className="inline-flex flex-col items-center">
              <button
                className="group inline-flex items-center gap-4 bg-black hover:bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                onClick={() => router.push("/fields")}
              >
                <span>Khám phá tất cả sân thể thao</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>50+ sân thể thao</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Đặt sân 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Giá tốt nhất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About System Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/5 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-500/3 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch min-h-[700px]">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Header */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-500/20 rounded-full text-green-600 font-semibold text-sm shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Hệ thống đáng tin cậy</span>
                </div>

                <h2 className="text-5xl md:text-6xl font-black text-black leading-tight">
                  Về hệ thống của{" "}
                  <span className="text-green-500">chúng tôi</span>
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Chúng tôi là hệ thống đặt sân thể thao hàng đầu tại Quy Nhon,
                  kết nối hơn 50+ sân thể thao chất lượng cao với cộng đồng
                  người chơi đam mê thể thao.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                      <div className="text-green-600">{stat.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-black mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-6">
                {featuresAboutUs.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-black text-lg mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Section */}
            <div className="flex flex-col justify-center">
              {/* Image Carousel Container */}
              <div className="relative h-[500px] md:h-[600px]">
                {/* Animated Background Shapes - Gray Tones */}
                <div className="absolute -inset-4 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-[2rem] md:rounded-[3rem] transform rotate-3 opacity-15 blur-xl animate-pulse"></div>
                <div className="absolute -inset-3 bg-gradient-to-tr from-gray-500 to-gray-400 rounded-[2rem] md:rounded-[3rem] transform -rotate-2 opacity-10"></div>
                <div className="absolute -inset-2 bg-gradient-to-bl from-gray-900 via-gray-800 to-black rounded-[2rem] md:rounded-[3rem] transform rotate-1 opacity-5"></div>

                {/* Main Image Container with Glass Effect */}
                <div className="relative bg-white/95 backdrop-blur-sm p-1.5 md:p-2 rounded-[2rem] md:rounded-[3rem] shadow-2xl h-full border border-white/20">
                  <div className="relative h-full overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* Images */}
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                          index === currentImageIndex
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-110"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient for Better Text Visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    ))}

                    {/* Navigation Arrows - Hidden on Mobile */}
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                    >
                      <svg
                        className="w-6 h-6 text-gray-800 group-hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                    >
                      <svg
                        className="w-6 h-6 text-gray-800 group-hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Enhanced Image Indicators */}
                  <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentImageIndex
                            ? "w-8 md:w-10 h-2.5 bg-white shadow-lg"
                            : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75 hover:scale-110"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Image Counter - Mobile Only */}
                  <div className="md:hidden absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-sm font-medium px-3 py-1.5 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Decorative Floating Elements - Gray */}
                <div className="hidden lg:block absolute -right-8 top-20 w-20 h-20 bg-gray-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="hidden lg:block absolute -left-8 bottom-20 w-32 h-32 bg-gray-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>

          {/* Centered CTA Button */}
          <div className="pt-12 text-center">
            <button className="group inline-flex items-center gap-3 bg-black hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <span>Tìm hiểu thêm</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Owner Features Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-green-400/8 rounded-full animate-pulse delay-1000 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full animate-pulse delay-500 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-green-300/8 rounded-full animate-pulse delay-700 blur-xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Enhanced Header Section */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/30 backdrop-blur-md rounded-3xl mb-8 border border-green-400/20 shadow-2xl">
              <Shield className="w-12 h-12 text-green-400" />
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Dành cho{" "}
                <span className="bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent animate-pulse">
                  chủ sân
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Quản lý sân thể thao hiệu quả với hệ thống công nghệ tiên tiến,
                <span className="text-green-400 font-medium">
                  {" "}
                  tăng doanh thu{" "}
                </span>
                và tối ưu hóa vận hành
              </p>

              {/* Enhanced Divider */}
              <div className="flex items-center justify-center space-x-2 mt-8">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-400"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-green-400"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch mb-24">
            {/* Left Column - Enhanced Features */}
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Tính năng nổi bật
                </h3>
                <div className="w-16 h-1 bg-green-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: <Calendar className="w-6 h-6 text-white" />,
                    title: "Quản lý lịch đặt sân",
                    description:
                      "Theo dõi lịch đặt sân realtime, tối ưu slot trống",
                    gradient: "from-green-500 to-green-600",
                    stats: "+40% hiệu suất",
                  },
                  {
                    icon: <Users className="w-6 h-6 text-white" />,
                    title: "Quản lý khách hàng",
                    description: "Cơ sở dữ liệu khách hàng, chăm sóc KH VIP",
                    gradient: "from-green-600 to-green-700",
                    stats: "5000+ KH",
                  },
                  {
                    icon: <Trophy className="w-6 h-6 text-white" />,
                    title: "Báo cáo doanh thu",
                    description: "Thống kê chi tiết với biểu đồ trực quan",
                    gradient: "from-green-500 to-emerald-600",
                    stats: "Realtime",
                  },
                  {
                    icon: <MessageCircle className="w-6 h-6 text-white" />,
                    title: "Hỗ trợ 24/7",
                    description: "Đội ngũ kỹ thuật chuyên nghiệp hỗ trợ",
                    gradient: "from-emerald-500 to-green-600",
                    stats: "< 2 phút",
                  },
                ].map((feature, index) => (
                  <div key={index} className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-black/40 backdrop-blur-sm rounded-xl border border-gray-700/40 group-hover:border-green-500/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                    <div className="relative flex items-center space-x-4 p-5">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
                      >
                        {feature.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                            {feature.title}
                          </h3>
                          <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {feature.stats}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Content để cân bằng */}
              <div className="mt-8 p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                <h4 className="text-lg font-bold text-white mb-3">
                  Tại sao chọn chúng tôi?
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">
                      Triển khai nhanh chỉ trong 24h
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Đào tạo sử dụng miễn phí</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Bảo hành trọn đời hệ thống</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Enhanced Visual Section */}
            <div className="relative flex flex-col justify-between">
              {/* Background Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400/15 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-xl"></div>

              {/* Main Image Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/15 rounded-2xl transform rotate-1 blur-sm"></div>

                <img
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Quản lý sân thể thao"
                  className="relative w-full h-80 object-cover rounded-2xl shadow-xl border border-gray-700/30"
                />

                {/* Caption không bị che */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <h4 className="text-lg font-bold text-white mb-1">
                      Hệ thống quản lý thông minh
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Được tin tưởng bởi 150+ chủ sân
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards không che caption */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-black">150+</div>
                      <div className="text-xs text-gray-600">Chủ sân</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-black">
                        99.5%
                      </div>
                      <div className="text-xs text-gray-600">Hài lòng</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div className="mt-6 p-6 bg-gradient-to-br from-gray-800/60 to-black/60 backdrop-blur-sm rounded-2xl border border-gray-700/40">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm italic mb-2">
                      "Doanh thu tăng 45% chỉ sau 3 tháng sử dụng. Hệ thống rất
                      dễ dùng!"
                    </p>
                    <p className="text-green-400 text-xs font-medium">
                      Anh Minh - Chủ sân Green Park
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Benefits Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tại sao chủ sân{" "}
                <span className="text-green-400">chọn chúng tôi?</span>
              </h3>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Những lợi ích vượt trội khi tham gia hệ thống quản lý sân thể
                thao của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart className="w-10 h-10 text-white" />,
                  title: "Tăng doanh thu 45%",
                  description:
                    "Tối ưu hóa lịch đặt sân và thu hút thêm khách hàng mới thông qua hệ thống thông minh",
                  color: "from-green-500 to-green-600",
                  stats: "Trung bình 3-6 tháng",
                },
                {
                  icon: <Zap className="w-10 h-10 text-white" />,
                  title: "Tiết kiệm 80% thời gian",
                  description:
                    "Tự động hóa quy trình đặt sân, thanh toán và quản lý khách hàng một cách hiệu quả",
                  color: "from-green-600 to-emerald-600",
                  stats: "So với phương pháp truyền thống",
                },
                {
                  icon: <Target className="w-10 h-10 text-white" />,
                  title: "Marketing hiệu quả",
                  description:
                    "Tiếp cận hàng ngàn người chơi thể thao tại Quy Nhơn và các tỉnh lân cận",
                  color: "from-emerald-500 to-green-600",
                  stats: "10,000+ người dùng hoạt động",
                },
              ].map((benefit, index) => (
                <div key={index} className="group text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl blur-xl"></div>
                    <div
                      className={`relative w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 ring-4 ring-green-500/20`}
                    >
                      {benefit.icon}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                    {benefit.title}
                  </h4>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-4">
                    {benefit.description}
                  </p>

                  <div className="text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 inline-block">
                    {benefit.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-lg rounded-3xl border border-gray-700/50"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-400/10 rounded-3xl"></div>

              <div className="relative p-16">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Sẵn sàng <span className="text-green-400">tham gia</span> cùng
                  chúng tôi?
                </h3>

                <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                  Đăng ký ngay hôm nay để nhận{" "}
                  <span className="text-green-400 font-semibold">
                    ưu đãi đặc biệt
                  </span>{" "}
                  cho 3 tháng đầu tiên
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300">
                    <span className="relative flex items-center justify-center gap-2 sm:gap-3 z-10">
                      <span>Đăng ký làm đối tác</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>

                  <button className="group border-2 border-green-500/50 bg-transparent backdrop-blur-sm text-white px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-green-500 hover:border-green-500 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <MessageCircle className="w-4 h-4 sm:w-5 h-5" />
                      <span>Tư vấn miễn phí</span>
                    </span>
                  </button>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-gray-700/50">
                  {[
                    { icon: Shield, text: "Bảo mật tuyệt đối" },
                    { icon: Award, text: "Hỗ trợ 24/7" },
                    { icon: Zap, text: "Triển khai nhanh" },
                    { icon: CheckCircle, text: "Đảm bảo chất lượng" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-green-400"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
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
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight tracking-tight">
              Sân thể thao <span className="text-green-500">Phổ biến</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Những sân thể thao được đánh giá cao nhất và được đặt nhiều nhất
              tại Quy Nhơn
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="mt-4 text-gray-500">Đang tải sân thể thao...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                Không thể tải dữ liệu sân thể thao
              </p>
              <button
                onClick={() => {
                  fetchPopularFields();
                  fetchServerFields();
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
              >
                Thử lại →
              </button>
            </div>
          ) : getVisibleFields().length > 0 ? (
            <div className="relative group">
              {/* Slider Navigation Arrows */}
              {getTotalFieldSlides() > 1 && (
                <>
                  <button
                    onClick={() =>
                      setFieldSlide((prev) => Math.max(0, prev - 1))
                    }
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-4 shadow-xl transition-all duration-300 -translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                      fieldSlide === 0
                        ? "cursor-not-allowed"
                        : "hover:scale-110"
                    }`}
                    disabled={fieldSlide === 0}
                  >
                    <ChevronLeft
                      className={`w-6 h-6 ${
                        fieldSlide === 0 ? "text-gray-300" : "text-green-700"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      setFieldSlide((prev) =>
                        Math.min(getTotalFieldSlides() - 1, prev + 1)
                      )
                    }
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-4 shadow-xl transition-all duration-300 translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                      fieldSlide === getTotalFieldSlides() - 1
                        ? "cursor-not-allowed"
                        : "hover:scale-110"
                    }`}
                    disabled={fieldSlide === getTotalFieldSlides() - 1}
                  >
                    <ChevronRight
                      className={`w-6 h-6 ${
                        fieldSlide === getTotalFieldSlides() - 1
                          ? "text-gray-300"
                          : "text-green-700"
                      }`}
                    />
                  </button>
                </>
              )}

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto max-w-8xl">
                {getFieldsForCurrentSlide().map((field) => (
                  <div
                    key={field.id}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="relative h-48">
                      <Image
                        src={field.image}
                        alt={field.name}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 border border-green-400 shadow">
                        <Star className="w-4 h-4 text-green-400 fill-current" />
                        <span className="text-xs font-bold text-green-400">
                          {field.rating}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 bg-white text-green-400 w-9 h-9 flex items-center justify-center rounded-full text-xl shadow">
                        {field.sport === "football"
                          ? "⚽"
                          : field.sport === "badminton"
                          ? "🏸"
                          : field.sport === "pickle"
                          ? "🎾"
                          : "⚽"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                        {field.name}
                      </h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-3 h-3 text-green-400" />
                          <span className="text-xs line-clamp-1">
                            {field.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="w-3 h-3 text-green-400" />
                          <span className="text-xs">{field.openingHours}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3 p-2 rounded-xl">
                        <div className="text-base font-bold text-green-400">
                          {field.price}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-400">
                            {field.reviews} lượt đặt
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            router.push(
                              `/booking?fieldId=${encodeURIComponent(
                                field.id
                              )}&sport=${encodeURIComponent(field.sport)}`
                            );
                          }}
                          className="flex-1 bg-green-400 text-white py-2 px-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-xs"
                        >
                          Đặt ngay
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/field-detail/${encodeURIComponent(field.id)}`
                            )
                          }
                          className="px-3 py-2 border-2 border-green-400 text-green-400 rounded-xl hover:bg-green-50 transition-colors text-xs font-semibold"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              {getTotalFieldSlides() > 1 && (
                <div className="flex justify-center items-center mt-16">
                  <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                      {fieldSlide + 1} / {getTotalFieldSlides()}
                    </span>
                    <div className="flex space-x-2">
                      {Array.from({ length: getTotalFieldSlides() }).map(
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => setFieldSlide(index)}
                            className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                              fieldSlide === index
                                ? "w-8 h-3 bg-black"
                                : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                            }`}
                          >
                            {fieldSlide === index && (
                              <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </button>
                        )
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setFieldSlide(
                          (prev) => (prev + 1) % getTotalFieldSlides()
                        )
                      }
                      className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                    >
                      Tiếp theo →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                Không tìm thấy sân thể thao nào
              </p>
              <button
                onClick={() => router.push("/fields")}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
              >
                Khám phá tất cả sân →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-500/8 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">💬</span>
                </div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight tracking-tight">
              Mọi người nói gì về{" "}
              <span className="text-green-500">chúng tôi</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Hàng ngàn khách hàng hài lòng đã tin tưởng sử dụng dịch vụ của
              chúng tôi
            </p>

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>5000+ khách hàng tin tưởng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>4.9/5 sao đánh giá</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>99% hài lòng</span>
              </div>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative group">
            {/* Enhanced Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-6xl">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${testimonialSlide}-${index}`}
                  className="group/card relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-green-500/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 min-h-[400px] flex flex-col overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Author Info - Top */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-lg border-3 border-gray-100 group-hover/card:border-green-500/20 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-black text-lg mb-1 group-hover/card:text-green-600 transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                      {/* Rating Badge - Top Right */}
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-yellow-600">
                          {testimonial.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Content - Main Body */}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="relative">
                        {/* Large opening quote */}
                        <div className="absolute -top-6 -left-2 text-6xl text-green-500/20 font-serif leading-none">
                          "
                        </div>

                        <blockquote className="text-gray-700 text-base leading-relaxed pl-6 pr-2 relative z-10">
                          {testimonial.content}
                        </blockquote>

                        {/* Small closing quote */}
                        <div className="text-right mt-2">
                          <span className="text-2xl text-green-500/40 font-serif">
                            "
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section - Date or Additional Info */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">
                          Khách hàng xác thực
                        </span>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>

            {/* Enhanced Slide Indicators */}
            <div className="flex justify-center items-center mt-16">
              <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  {testimonialSlide + 1} / {getTotalTestimonialSlides()}
                </span>
                <div className="flex space-x-2">
                  {Array.from({ length: getTotalTestimonialSlides() }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setTestimonialSlide(index)}
                        className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                          testimonialSlide === index
                            ? "w-8 h-3 bg-black"
                            : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                        }`}
                      >
                        {testimonialSlide === index && (
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setTestimonialSlide(
                      (prev) => (prev + 1) % getTotalTestimonialSlides()
                    )
                  }
                  className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                >
                  Tiếp theo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8">
            <Compass className="w-5 h-5 text-green-300" />
            <span className="text-green-200 font-semibold">
              Hành trình bắt đầu
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Sẵn sàng tham gia?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Trở thành một phần của cộng đồng thể thao lớn nhất Quy Nhơn. Khám
            phá, kết nối và trải nghiệm thể thao theo cách hoàn toàn mới.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => router.push("/register")}
              className="group bg-gradient-to-r from-white to-green-50 text-green-800 px-10 py-5 rounded-full font-bold text-xl hover:from-green-50 hover:to-white transition-all duration-500 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                <User className="w-6 h-6" />
                <span>Đăng ký ngay</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button
              onClick={() => router.push("/fields")}
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

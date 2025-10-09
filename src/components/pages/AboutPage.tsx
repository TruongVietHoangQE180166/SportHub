"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Clock,
  Zap,
  Shield,
  BarChart,
  Target,
  CheckCircle,
  Send,
  TrendingUp,
  Smartphone,
  FileText,
  Settings,
  Sparkles,
  Rocket,
  Play,
  DollarSign,
  BarChart3,
  Handshake,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AboutPage() {
  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    phone: "",
    fieldName: "",
    location: "",
    sport: "",
    description: "",
  });
  const [ownerFormSubmitted, setOwnerFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const sportOptions = [
    { value: "football", label: "Bóng đá" },
    { value: "badminton", label: "Cầu lông" },
    { value: "pickle", label: "Pickle Ball" },
  ];
  const sportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(e.target as Node)) {
        setShowSportDropdown(false);
      }
    };
    if (showSportDropdown) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSportDropdown]);

  const handleOwnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch('/api/Owner-Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerForm),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again later.');
      }

      const data = await response.json();

      if (data.success) {
        console.log("Owner registration successful:", data);
        setOwnerFormSubmitted(true);
        // Reset form
        setOwnerForm({
          name: "",
          email: "",
          phone: "",
          fieldName: "",
          location: "",
          sport: "",
          description: "",
        });
        // Auto hide success message after 5 seconds
        setTimeout(() => setOwnerFormSubmitted(false), 5000);
      } else {
        setSubmitError(data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen">
        {/* Gradient Background with Geometric Shapes */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-green-500/10 via-transparent to-transparent"></div>
        </div>

        {/* Animated Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-green-400/15 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-gray-400/10 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-3 bg-green-500/20 backdrop-blur-lg rounded-full px-6 py-3 border border-green-400/30">
                <Rocket className="w-5 h-5 text-green-300 animate-pulse" />
                <span className="text-green-200 font-bold">Cơ hội kinh doanh</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent animate-pulse">
                  ĐỐI TÁC
                </span>
                <span className="block bg-gradient-to-r from-green-300 via-green-500 to-green-300 bg-clip-text text-transparent">
                  THÀNH CÔNG
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Tham gia hệ sinh thái thể thao thông minh, tối ưu hóa doanh thu 
                và mở rộng khách hàng cho sân thể thao của bạn.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <button 
                  onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Bắt đầu ngay
                  </span>
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">MIỄN PHÍ</div>
                    <div className="text-sm text-green-200">Đăng ký đối tác</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Benefits Card */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-black">LỢI ÍCH ĐỐI TÁC</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: DollarSign, title: "Tăng doanh thu", desc: "Tối ưu hóa lịch đặt sân", color: "bg-green-500" },
                    { icon: Users, title: "Mở rộng khách hàng", desc: "Tiếp cận người dùng mới", color: "bg-gray-700" },
                    { icon: BarChart3, title: "Quản lý thông minh", desc: "Dashboard phân tích chi tiết", color: "bg-green-600" },
                    { icon: Zap, title: "Tự động hóa", desc: "Giảm thiểu công việc thủ công", color: "bg-black" },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-300 group">
                      <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-black">{benefit.title}</div>
                        <div className="text-gray-600 text-sm">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full font-black mb-8">
              <Sparkles className="w-5 h-5" />
              TẠI SAO CHỌN CHÚNG TÔI?
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-black mb-4">
              GIẢI PHÁP TOÀN DIỆN
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống quản lý sân thể thao hiện đại với công nghệ tiên tiến
            </p>
          </div>

          {/* Enhanced Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-black rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">ỨNG DỤNG THÔNG MINH</h3>
              <p className="text-gray-300 leading-relaxed">
                Giao diện trực quan, dễ sử dụng cho mọi đối tượng. 
                Quản lý sân thể thao chưa bao giờ đơn giản đến thế.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-500 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-black mb-4">PHÂN TÍCH DỮ LIỆU</h3>
              <p className="text-green-100 leading-relaxed">
                Báo cáo chi tiết về doanh thu và xu hướng khách hàng. 
                Ra quyết định thông minh dựa trên dữ liệu thực tế.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 text-black hover:shadow-2xl hover:border-green-500 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">QUẢN LÝ THỜI GIAN</h3>
              <p className="text-gray-700 leading-relaxed">
                Tự động hóa lịch đặt sân và thông báo. 
                Tiết kiệm thời gian, tăng hiệu quả vận hành.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-gray-100 to-white rounded-3xl p-8 text-black hover:shadow-2xl transition-all duration-500 group border-2 border-gray-100">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">BẢO MẬT CAO</h3>
              <p className="text-gray-700 leading-relaxed">
                Thanh toán an toàn, bảo vệ thông tin khách hàng. 
                Hệ thống bảo mật cấp ngân hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-green-500/20 backdrop-blur-lg rounded-full px-6 py-3 border border-green-400/30 mb-8">
              <Settings className="w-5 h-5 text-green-300" />
              <span className="text-green-200 font-black">QUY TRÌNH ĐƠN GIẢN</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              3 BƯỚC ĐỂ BẮT ĐẦU
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Quy trình đăng ký đối tác nhanh chóng và đơn giản
            </p>
          </div>

          {/* Enhanced Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "ĐĂNG KÝ",
                description: "Điền thông tin sân thể thao của bạn vào form đăng ký",
                icon: <FileText className="w-8 h-8 text-white" />,
              },
              {
                step: "02",
                title: "XÁC THỰC",
                description: "Đội ngũ chuyên viên sẽ liên hệ để xác thực thông tin",
                icon: <CheckCircle className="w-8 h-8 text-white" />,
              },
              {
                step: "03",
                title: "VẬN HÀNH",
                description: "Bắt đầu nhận đặt sân và tăng doanh thu ngay lập tức",
                icon: <TrendingUp className="w-8 h-8 text-white" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 group-hover:scale-105">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-black text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-black text-black mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Registration Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-900/5 to-transparent"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side - Enhanced Info */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full font-black">
                  <Handshake className="w-5 h-5" />
                  <span>TRỞ THÀNH ĐỐI TÁC</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-black">
                  ĐĂNG KÝ NGAY HÔM NAY
                </h2>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Tham gia cùng chúng tôi để phát triển sân thể thao của bạn một cách thông minh và hiệu quả.
                </p>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { icon: DollarSign, title: "TĂNG DOANH THU", desc: "Tối ưu hóa lịch đặt sân và quản lý khách hàng", color: "bg-green-500" },
                    { icon: Users, title: "MỞ RỘNG KHÁCH HÀNG", desc: "Tiếp cận hàng nghìn người dùng trên nền tảng", color: "bg-gray-700" },
                    { icon: BarChart3, title: "QUẢN LÝ THÔNG MINH", desc: "Dashboard phân tích chi tiết và báo cáo doanh thu", color: "bg-green-600" },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
                      <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black text-black text-lg">{benefit.title}</div>
                        <div className="text-gray-600">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Enhanced Form */}
              <div id="register-form" className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 w-full">
                {ownerFormSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-4">ĐĂNG KÝ THÀNH CÔNG!</h3>
                    <p className="text-gray-600 mb-8">
                      Cảm ơn bạn đã quan tâm. Chúng tôi đã gửi email xác nhận và sẽ liên hệ trong vòng 24 giờ.
                    </p>
                    <button
                      onClick={() => setOwnerFormSubmitted(false)}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all duration-300"
                    >
                      Đăng ký thêm sân khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleOwnerSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-black text-black mb-2">FORM ĐĂNG KÝ</h3>
                      <p className="text-gray-600">Điền thông tin để trở thành đối tác</p>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="text-red-700">{submitError}</div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black font-bold mb-2">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={ownerForm.name}
                          onChange={(e) => setOwnerForm({...ownerForm, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <label className="block text-black font-bold mb-2">Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          disabled={isSubmitting}
                          value={ownerForm.phone}
                          onChange={(e) => setOwnerForm({...ownerForm, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-black font-bold mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={ownerForm.email}
                        onChange={(e) => setOwnerForm({...ownerForm, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-black font-bold mb-2">Tên sân *</label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={ownerForm.fieldName}
                          onChange={(e) => setOwnerForm({...ownerForm, fieldName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                          placeholder="VD: Sân bóng ABC"
                        />
                      </div>
                      <div>
                        <label className="block text-black font-bold mb-2">Môn thể thao *</label>
                        <div className="relative" ref={sportDropdownRef}>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-left font-medium text-black focus:outline-none focus:border-green-500 transition-all flex items-center justify-between hover:border-green-500 disabled:bg-gray-100"
                            onClick={() => !isSubmitting && setShowSportDropdown((v) => !v)}
                          >
                            <span>{sportOptions.find(opt => opt.value === ownerForm.sport)?.label || "Chọn môn thể thao"}</span>
                            <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          {showSportDropdown && !isSubmitting && (
                            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-green-500 rounded-xl shadow-xl animate-fadeIn">
                              {sportOptions.map(option => (
                                <button
                                  key={option.value}
                                  type="button"
                                  className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-all text-sm first:rounded-t-xl last:rounded-b-xl ${ownerForm.sport === option.value ? 'bg-green-100 text-green-400 font-semibold' : 'text-gray-700'}`}
                                  onClick={() => {
                                    setOwnerForm({...ownerForm, sport: option.value});
                                    setShowSportDropdown(false);
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-black font-bold mb-2">Địa chỉ sân *</label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={ownerForm.location}
                        onChange={(e) => setOwnerForm({...ownerForm, location: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 disabled:bg-gray-100"
                        placeholder="Nhập địa chỉ chi tiết"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-bold mb-2">Mô tả sân</label>
                      <textarea
                        rows={4}
                        disabled={isSubmitting}
                        value={ownerForm.description}
                        onChange={(e) => setOwnerForm({...ownerForm, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-black focus:border-green-500 focus:outline-none transition-all duration-300 resize-none disabled:bg-gray-100"
                        placeholder="Mô tả về sân, tiện ích, giá cả..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          ĐANG XỬ LÝ...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          ĐĂNG KÝ TRỞ THÀNH ĐỐI TÁC
                        </>
                      )}
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                      Bằng cách đăng ký, bạn đồng ý với các điều khoản và chính sách của chúng tôi
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
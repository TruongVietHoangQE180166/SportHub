'use client';
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Check, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search, Activity, Building, Target, CheckCircle, Home } from 'lucide-react';
import { useFieldStore } from '../../stores/fieldStore';
import { Field, SubCourt, TimeSlot } from '../../types/field';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedSubCourt, setSelectedSubCourt] = useState<SubCourt | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFieldPage, setCurrentFieldPage] = useState(1);
  const FIELDS_PER_PAGE = 3;
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleConfirmBooking = () => {
    setIsBookingSuccess(true);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const createVietnamDate = (date?: Date) => {
    const now = date || new Date();
    const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    vietnamTime.setHours(0, 0, 0, 0);
    return vietnamTime;
  };

  const [today] = useState(() => createVietnamDate());

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const todayVN = createVietnamDate();
    return new Date(todayVN.getFullYear(), todayVN.getMonth(), todayVN.getDate());
  });

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 27);

  const {
    mainSports,
    fieldsBySport,
    subCourts,
    timeSlots,
    loading,
    fetchMainSports,
    fetchFieldsBySport,
    fetchSubCourts,
    fetchTimeSlots
  } = useFieldStore();

  useEffect(() => {
    fetchMainSports();
  }, [fetchMainSports]);

  useEffect(() => {
    if (selectedSport) {
      fetchFieldsBySport(selectedSport);
    }
  }, [selectedSport, fetchFieldsBySport]);

  useEffect(() => {
    if (selectedField) {
      fetchSubCourts(selectedField.id);
    }
  }, [selectedField, fetchSubCourts]);

  useEffect(() => {
    if (selectedField && selectedSubCourt && selectedDate) {
      fetchTimeSlots(selectedField.id, selectedSubCourt.id);
    }
  }, [selectedField, selectedSubCourt, selectedDate, fetchTimeSlots]);

  useEffect(() => {
    if (selectedSubCourt && selectedField) {
      fetchTimeSlots(selectedField.id, selectedSubCourt.id);
    }
  }, [selectedSubCourt, selectedField, fetchTimeSlots]);

  const generateWeekDays = () => {
    const days = [];
    const baseDate = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate());
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const canGoNext = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    return nextWeekStart <= maxDate;
  };

  const nextWeek = () => {
    if (!canGoNext()) return;

    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);

    if (newDate < today) {
      setCurrentWeekStart(today);
    } else {
      setCurrentWeekStart(newDate);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSport !== '';
      case 2: return selectedField !== null;
      case 3: return selectedSubCourt !== null;
      case 4: return selectedTimeSlot !== null;
      case 5: return true;
      default: return false;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const resetFromStep = (step: number) => {
    if (step <= 1) {
      setSelectedSport('');
    }
    if (step <= 2) {
      setSelectedField(null);
    }
    if (step <= 3) {
      setSelectedSubCourt(null);
    }
    if (step <= 4) {
      setSelectedDate('');
      setSelectedTimeSlot(null);
    }
  };


  const filteredFields = fieldsBySport.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalFieldPages = Math.ceil(filteredFields.length / FIELDS_PER_PAGE);
  const paginatedFields = filteredFields.slice(
    (currentFieldPage - 1) * FIELDS_PER_PAGE,
    currentFieldPage * FIELDS_PER_PAGE
  );

  useEffect(() => {
    setCurrentFieldPage(1);
  }, [searchTerm, selectedSport]);

  useEffect(() => {
    // Nếu có param sport thì set luôn selectedSport
    const sportParam = searchParams.get('sport');
    if (sportParam && selectedSport !== sportParam) {
      setSelectedSport(sportParam);
    }
  }, [searchParams, selectedSport]);

  useEffect(() => {
    // Khi fieldsBySport đã load, nếu có fieldId thì set selectedField và nhảy step 2
    const fieldId = searchParams.get('fieldId');
    if (fieldId && fieldsBySport.length > 0) {
      const foundField = fieldsBySport.find(f => f.id === Number(fieldId));
      if (foundField) {
        setSelectedField(foundField);
        setCurrentStep(2);
      }
    }
  }, [searchParams, fieldsBySport]);

  const steps = [
    { step: 1, label: "Chọn môn", icon: Activity },
    { step: 2, label: "Chọn sân lớn", icon: Building },
    { step: 3, label: "Chọn sân nhỏ", icon: Target },
    { step: 4, label: "Chọn giờ", icon: Clock },
    { step: 5, label: "Xác nhận", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Đặt Sân Thể Thao</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto"></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map(({ step, label, icon: IconComponent }) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transform transition-all duration-300 ${step <= currentStep
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white scale-110 shadow-green-200"
                      : "bg-white text-gray-500 border-2 border-gray-200 hover:border-green-300 hover:shadow-md"
                      }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <IconComponent className="w-7 h-7" />
                    )}
                  </div>
                  <span
                    className={`mt-3 text-sm font-medium transition-colors duration-300 ${step <= currentStep ? "text-green-600" : "text-gray-400"
                      }`}
                  >
                    {label}
                  </span>
                </div>
                {step < 5 && (
                  <div
                    className={`w-20 h-1 mx-4 rounded-full transition-all duration-500 ${step < currentStep
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gray-200"
                      }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-40 h-40 bg-green-500 rounded-full transform -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-300 rounded-full transform translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-200 rounded-full transform -translate-x-12 -translate-y-12"></div>
          </div>

          <div className="relative z-10 p-8">
            {loading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-600 font-semibold text-lg">Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Step 1: Sport Selection */}
            {currentStep === 1 && !loading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn môn thể thao</h2>
                  <p className="text-gray-600 text-lg">Lựa chọn môn thể thao phù hợp với bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {mainSports.map((sport) => {
                    const isSelected = (selectedSport === 'football' && sport.name === 'Bóng đá') ||
                      (selectedSport === 'badminton' && sport.name === 'Cầu lông') ||
                      (selectedSport === 'pickle' && sport.name === 'Pickle Ball');

                    return (
                      <button
                        key={sport.name}
                        onClick={() => {
                          const sportKey = sport.name === 'Bóng đá' ? 'football' :
                            sport.name === 'Cầu lông' ? 'badminton' : 'pickle';
                          setSelectedSport(sportKey);
                          resetFromStep(2);
                        }}
                        className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-100'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-xl hover:shadow-gray-100'
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className={`text-6xl mb-6 transition-transform duration-300 ${isSelected ? 'transform scale-110' : 'group-hover:transform group-hover:scale-110'
                          }`}>
                          {sport.icon}
                        </div>

                        <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${isSelected ? 'text-green-700' : 'text-gray-900 group-hover:text-gray-700'
                          }`}>
                          {sport.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          {sport.description}
                        </p>

                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isSelected
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 group-hover:bg-green-100 group-hover:text-green-700'
                          }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${isSelected ? 'bg-white' : 'bg-green-500'
                            }`}></div>
                          {sport.courts} sân có sẵn
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Field Selection */}
            {currentStep === 2 && !loading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn sân thể thao</h2>
                  <p className="text-gray-600 text-lg">Tìm sân phù hợp với nhu cầu của bạn</p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 mb-6 max-w-md mx-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm tên hoặc địa điểm sân..."
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                  />
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg"
                    onClick={() => { }}
                    type="button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {paginatedFields.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sân nào</h3>
                      <p className="text-gray-600 text-base">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                  ) : (
                    paginatedFields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => {
                          setSelectedField(field);
                          resetFromStep(3);
                        }}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:scale-101 flex items-center gap-6 relative ${selectedField?.id === field.id
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-white shadow-xl shadow-green-100'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                          }`}
                      >
                        {selectedField?.id === field.id && (
                          <div className="absolute -top-4 -right-4 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-white">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="relative flex-shrink-0">
                          <Image
                            src={field.image}
                            alt={field.name}
                            width={200}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: '1rem' }}
                            className="w-[200px] h-[120px] object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-2xl font-bold truncate transition-colors ${selectedField?.id === field.id ? 'text-green-700' : 'text-gray-900'}`}>{field.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Star className="w-7 h-7 text-green-500" fill="#22c55e" stroke="#22c55e" />
                              <span className="text-lg font-bold text-green-700">{field.rating}</span>
                              <span className="text-base text-gray-400">({field.reviews})</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-gray-600 mb-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-5 h-5" />
                              <span className="text-base truncate">{field.location}</span>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold transition-all duration-200 ${selectedField?.id === field.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-green-700'}`}>
                              {field.subCourts.length} sân có sẵn
                            </div>
                          </div>
                          <div className={`text-2xl font-bold transition-colors ${selectedField?.id === field.id ? 'text-green-600' : 'text-gray-900'}`}>{field.price}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalFieldPages > 1 && (
                  <nav className="flex justify-center items-center gap-3 mt-8 mb-8" aria-label="Pagination">
                    <button
                      type="button"
                      className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Trước"
                      disabled={currentFieldPage === 1}
                      onClick={() => setCurrentFieldPage(prev => Math.max(prev - 1, 1))}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      {(() => {
                        let start = Math.max(1, currentFieldPage - 1);
                        let end = Math.min(totalFieldPages, currentFieldPage + 1);
                        if (currentFieldPage === 1) {
                          end = Math.min(totalFieldPages, 3);
                        } else if (currentFieldPage === totalFieldPages) {
                          start = Math.max(1, totalFieldPages - 2);
                        }
                        const pages = [];
                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }
                        return (
                          <>
                            {start > 1 && (
                              <span className="px-2 py-2 text-gray-400 select-none">...</span>
                            )}
                            {pages.map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentFieldPage(page)}
                                className={`w-12 h-12 text-sm font-bold rounded-xl transition-all ${currentFieldPage === page
                                    ? 'bg-black text-white border-2 border-black'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
                                  }`}
                                aria-current={currentFieldPage === page ? 'page' : undefined}
                              >
                                {page}
                              </button>
                            ))}
                            {end < totalFieldPages && (
                              <span className="px-2 py-2 text-gray-400 select-none">...</span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <button
                      type="button"
                      className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Sau"
                      disabled={currentFieldPage === totalFieldPages}
                      onClick={() => setCurrentFieldPage(prev => Math.min(prev + 1, totalFieldPages))}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                )}
              </div>
            )}

            {/* Step 3: Sub Court Selection */}
            {currentStep === 3 && !loading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn sân nhỏ</h2>
                  <p className="text-gray-600 text-lg">Lựa chọn sân phù hợp với số lượng người chơi</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subCourts.map((subCourt) => (
                    <button
                      key={subCourt.id}
                      onClick={() => {
                        setSelectedSubCourt(subCourt);
                        resetFromStep(4);
                      }}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${selectedSubCourt?.id === subCourt.id
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-100'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                        }`}
                    >
                      {selectedSubCourt?.id === subCourt.id && (
                        <div className="absolute -top-4 -right-4 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-white">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <h3 className={`text-lg font-bold transition-colors text-center w-full ${selectedSubCourt?.id === subCourt.id ? 'text-green-700' : 'text-gray-900'}`}>{subCourt.name}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Time Selection */}
            {currentStep === 4 && !loading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn thời gian đặt sân</h2>
                  <p className="text-gray-600 text-lg">Lựa chọn khung giờ phù hợp với lịch trình của bạn</p>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-4">
                  <button
                    onClick={prevWeek}
                    disabled={currentWeekStart <= today}
                    className={`p-3 rounded-xl border transition-all
                      ${currentWeekStart <= today
                        ? 'border-green-100 bg-green-100 text-green-300 cursor-not-allowed'
                        : 'border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600'
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <span className="font-bold text-lg text-gray-900">
                      {formatDateDisplay(weekDays[0])} - {formatDateDisplay(weekDays[6])}
                    </span>
                  </div>

                  <button
                    onClick={nextWeek}
                    disabled={!canGoNext()}
                    className={`p-3 rounded-xl border transition-all
                      ${!canGoNext()
                        ? 'border-green-100 bg-green-100 text-green-300 cursor-not-allowed'
                        : 'border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600'
                      }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Time Table */}
                <div className="bg-gray-50 rounded-2xl p-6 overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-900 bg-white rounded-tl-xl border-r border-gray-200">
                          Khung giờ
                        </th>
                        {weekDays.map((date, idx) => (
                          <th key={idx} className={`px-4 py-3 text-center font-bold text-gray-900 bg-white border-r border-gray-200 ${idx === weekDays.length - 1 ? 'rounded-tr-xl' : ''
                            }`}>
                            <div className="text-sm">{formatDateDisplay(date)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const startHour = hour;
                        const endHour = (hour + 1) % 24;
                        const hourStr = `${startHour.toString().padStart(2, '0')}:00`;
                        return (
                          <tr key={hour} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-semibold text-gray-900 bg-white border-r border-gray-200">
                              {`${startHour}:00 - ${endHour}:00`}
                            </td>
                            {weekDays.map((date, idx) => {
                              const dateStr = formatDate(date);
                              const slot = timeSlots.find(
                                s => s.date === dateStr && s.startTime === hourStr
                              );

                              if (!slot) {
                                return (
                                  <td key={idx} className="px-4 py-3 text-center bg-red-100 text-red-700 border-r border-gray-200 cursor-not-allowed">
                                    Ngoài giờ
                                  </td>
                                );
                              }

                              const isBooked = slot.isBooked;
                              const isSelected = selectedTimeSlot?.id === slot.id;

                              return (
                                <td
                                  key={idx}
                                  className={`px-4 py-3 text-center transition-all border-r border-gray-200
                                    ${isBooked
                                      ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                                      : isSelected
                                        ? 'bg-green-500 text-white shadow-lg cursor-pointer'
                                        : 'bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer'
                                    }`}
                                  onClick={() => {
                                    if (!isBooked && slot) {
                                      setSelectedTimeSlot(slot);
                                      setSelectedDate(slot.date);
                                    }
                                  }}
                                >
                                  {isBooked ? 'Đã đặt' : isSelected ? 'Đã chọn' : 'Trống'}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && !isBookingSuccess && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Xác nhận đặt sân</h2>
                  <p className="text-gray-600 text-lg">Kiểm tra thông tin và hoàn tất đặt sân</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Booking Summary */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Thông tin đặt sân</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Môn thể thao:</span>
                        <span className="font-bold text-green-600">
                          {selectedSport === 'football' ? 'Bóng đá' :
                            selectedSport === 'badminton' ? 'Cầu lông' : 'Pickle Ball'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Sân lớn:</span>
                        <span className="font-bold text-gray-800">{selectedField?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Sân nhỏ:</span>
                        <span className="font-bold text-gray-800">{selectedSubCourt?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Ngày:</span>
                        <span className="font-bold text-gray-800">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Giờ:</span>
                        <span className="font-bold text-gray-800">
                          {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {selectedTimeSlot && formatPrice(selectedTimeSlot.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Note input */}
                    <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <label className="flex items-center text-gray-700 font-semibold mb-3" htmlFor="booking-note">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        id="booking-note"
                        className="w-full rounded-lg border border-gray-200 p-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none min-h-[90px] bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
                        placeholder="Nhập ghi chú cho chủ sân nếu có... (ví dụ: yêu cầu đặc biệt, thời gian đến sân...)"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Chuyển khoản ngân hàng</h3>

                    {/* Bank Information */}
                    <div className="w-full mb-6 space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Ngân hàng:</span>
                        <span className="font-bold text-gray-800">MB Bank</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Số tài khoản:</span>
                        <span className="font-bold text-gray-800 font-mono">0356645624</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Chủ tài khoản:</span>
                        <span className="font-bold text-gray-800">Trương Việt Hoàng</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 font-medium">Số tiền:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {selectedTimeSlot && formatPrice(selectedTimeSlot.price)}
                        </span>
                      </div>
                    </div>

                    {/* QR code image */}
                    <div className="mb-4">
                      <Image src="/qr.jpg" alt="QR chuyển khoản" width={192} height={192} className="w-48 h-48 object-contain rounded-xl border border-gray-200 shadow-sm bg-white" />
                    </div>

                    <div className="mb-4 w-full">
                      <div className="text-gray-700 font-semibold mb-2">Nội dung chuyển khoản:</div>
                      <div className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 font-mono text-sm select-all">
                        TENSAN_{selectedField?.id}_{selectedSubCourt?.id}_{selectedDate.replace(/-/g, '')}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">* Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận.</div>
                    </div>

                    <div className="mb-4 w-full">
                      <div className="text-sm text-gray-600 font-medium bg-gray-50 border border-gray-200 rounded-lg p-3">
                        Sau khi chuyển khoản thành công, bạn hãy nhấn &quotXác nhận đặt sân&quot để hoàn tất.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Screen - Hiển thị khi isBookingSuccess = true */}
            {currentStep === 5 && isBookingSuccess && (
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
                <div className="w-full max-w-2xl relative">
                  {/* Background decorative elements */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>

                  {/* Main success card */}
                  <div className="bg-white border border-green-100 shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                    {/* Header with animated checkmark */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-10 transform skew-y-1"></div>
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg animate-bounce">
                          <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                          Đặt sân thành công!
                        </h2>
                        <p className="text-green-100 text-lg">
                          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
                        </p>
                      </div>
                    </div>

                    {/* Booking details */}
                    <div className="px-8 py-8">
                      {/* Booking information - original style */}
                      <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="text-lg md:text-xl text-gray-700">
                          <span className="font-semibold text-green-700">{selectedSport === 'football' ? 'Bóng đá' : selectedSport === 'badminton' ? 'Cầu lông' : 'Pickleball'}</span>
                          <span className="mx-2">|</span>
                          <span>{selectedDate}</span>
                          <span className="mx-2">|</span>
                          <span>{selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}</span>
                        </div>
                        <div className="text-lg md:text-xl text-gray-700">
                          <span className="font-semibold">{selectedField?.name}</span>
                          <span className="mx-2">-</span>
                          <span>{selectedSubCourt?.name}</span>
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="text-center">
                        <button
                          onClick={handleGoHome}
                          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold group"
                        >
                          <Home className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
                          Về trang chủ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Chỉ hiển thị khi không phải màn hình success */}
            {!isBookingSuccess && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 rounded-2xl hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Quay lại</span>
                </button>

                <button
                  onClick={currentStep === 5 ? handleConfirmBooking : nextStep}
                  disabled={!canProceed()}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="font-semibold">
                    {currentStep === 5 ? 'Xác nhận đặt sân' : 'Tiếp tục'}
                  </span>
                  {currentStep < 5 && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
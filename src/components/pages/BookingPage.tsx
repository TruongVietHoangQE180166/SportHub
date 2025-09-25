'use client';
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Check, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search, Activity, Building, Target, CheckCircle, Home, Calendar, QrCode } from 'lucide-react';
import { useFieldStore } from '../../stores/fieldStore';
import { Field, SubCourt, TimeSlot, Owner } from '../../types/field';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedSubCourt, setSelectedSubCourt] = useState<SubCourt | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFieldPage, setCurrentFieldPage] = useState(1);
  const FIELDS_PER_PAGE = 3;
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [pendingSlots, setPendingSlots] = useState<Set<string>>(new Set()); // New state for pending slots
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null); // New state for order ID
  const [isCheckingStatus, setIsCheckingStatus] = useState(false); // New state for status checking
  const prevStepRef = React.useRef(currentStep);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Effect for polling order status
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (showPaymentQR && orderId && !isBookingSuccess) {
      setIsCheckingStatus(true);
      
      intervalId = setInterval(async () => {
        try {
          const { fetchOrderStatus } = useFieldStore.getState();
          await fetchOrderStatus(orderId);
          
          // Check the order status from the store
          const { orderStatus } = useFieldStore.getState();
          if (orderStatus && orderStatus.data === 'COMPLETED') {
            // Stop polling
            if (intervalId) clearInterval(intervalId);
            setIsCheckingStatus(false);
            // Show success screen
            setIsBookingSuccess(true);
          }
        } catch (error) {
          console.error('Error checking order status:', error);
          // Stop polling on error
          if (intervalId) clearInterval(intervalId);
          setIsCheckingStatus(false);
        }
      }, 2000); // Check every 2 seconds
    }

    // Cleanup function to clear interval
    return () => {
      if (intervalId) clearInterval(intervalId);
      setIsCheckingStatus(false);
    };
  }, [showPaymentQR, orderId, isBookingSuccess]);

  const handleConfirmBooking = async () => {
    try {
      setStepLoading(true);
      const startTimes = selectedTimeSlots.map(slot => 
        new Date(`${slot.date}T${slot.startTime}:00.000Z`).toISOString()
      );
      
      const response = await createBooking({
        smallFieldId: selectedSubCourt?.id || '',
        startTimes: startTimes
      });
      
      // Store the booking response
      setBookingResponse(response);
      
      // Create payment for the booking
      if (response.data && response.data.length > 0) {
        // Extract all booking IDs from the response
        const bookingIds = response.data.map(booking => booking.id);
        const paymentData = {
          bookingId: bookingIds
        };
        
        const paymentRes = await createPayment(paymentData);
        setPaymentResponse(paymentRes);
        setShowPaymentQR(true);
        
        // Set the order ID for status checking
        if (paymentRes.data && paymentRes.data.ordersId) {
          setOrderId(paymentRes.data.ordersId);
        }
      }
      
      // Only show success screen if booking is successful
      // setIsBookingSuccess(true);
    } catch (error) {
      console.error('Booking failed:', error);
      // Handle booking error (you might want to show an error message to the user)
    } finally {
      setStepLoading(false);
    }
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
    serverFields,
    timeSlots,
    loading,
    fetchMainSports,
    fetchServerFields,
    fetchTimeSlots,
    fetchSmallFieldBookings,
    smallFieldBookings,
    totalBookings,
    createBooking,
    createPayment
  } = useFieldStore();

  useEffect(() => {
    fetchMainSports();
  }, [fetchMainSports]);

  useEffect(() => {
    if (selectedSport) {
      fetchServerFields();
    }
  }, [selectedSport, fetchServerFields]);

  useEffect(() => {
    if (selectedField && selectedSubCourt && selectedDate) {
      fetchTimeSlots(selectedField.id, selectedSubCourt.id);
    }
  }, [selectedField, selectedSubCourt, selectedDate, fetchTimeSlots]);

  // Effect to handle field changes and ensure proper data isolation
  useEffect(() => {
    if (selectedField) {
      // When field changes, clear all related state
      setSelectedSubCourt(null);
      setBookedSlots(new Set());
      setSelectedTimeSlots([]);
      setSelectedDate('');
    }
  }, [selectedField]);

  // Effect to re-fetch booked slots when sub court changes
  useEffect(() => {
    if (selectedSubCourt) {
      setBookedSlots(new Set()); // Clear previous booked slots
      fetchSmallFieldBookings(selectedSubCourt.id);
    }
  }, [selectedSubCourt, fetchSmallFieldBookings]);

  // Effect to update booked slots when bookings data changes
  useEffect(() => {
    const newBookedSlots = new Set<string>();
    const newPendingSlots = new Set<string>();
    // Only process bookings if we have a selected sub-court
    if (selectedSubCourt && smallFieldBookings.length > 0) {
      smallFieldBookings.forEach(booking => {
        // Format: YYYY-MM-DD-HH:00
        const start = new Date(booking.startTime);
        const dateStr = start.toISOString().split('T')[0];
        const hourStr = start.toTimeString().substring(0, 5);
        const slotKey = `${dateStr}-${hourStr}`;
        
        // Check status and add to appropriate set
        if (booking.status === 'CONFIRMED') {
          newBookedSlots.add(slotKey);
        } else if (booking.status === 'PENDING') {
          newPendingSlots.add(slotKey);
        }
      });
    }
    setBookedSlots(newBookedSlots);
    setPendingSlots(newPendingSlots);
  }, [smallFieldBookings, selectedSubCourt]);

  // Effect to handle step changes and ensure data is loaded
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      setStepLoading(true);
      
      // Clear booked slots when leaving step 4
      if (prevStepRef.current === 4) {
        setBookedSlots(new Set());
      }
      
      // Load data based on current step
      switch (currentStep) {
        case 1:
          if (mainSports.length === 0) {
            fetchMainSports();
          }
          break;
        case 2:
          if (selectedSport && serverFields.length === 0) {
            fetchServerFields();
          }
          break;
        case 3:
          // Ensure field data is available
          if (selectedField && selectedField.subCourts.length > 0) {
            // Data is already available
          }
          break;
        case 4:
          // Ensure booked slots are fetched when entering step 4
          if (selectedSubCourt) {
            fetchSmallFieldBookings(selectedSubCourt.id);
          }
          break;
        default:
          break;
      }
      
      const timeout = setTimeout(() => setStepLoading(false), 500);
      prevStepRef.current = currentStep;
      return () => clearTimeout(timeout);
    }
  }, [currentStep, selectedSport, selectedField, selectedSubCourt, fetchMainSports, fetchServerFields, fetchSmallFieldBookings, mainSports.length, serverFields.length]);

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
    if (currentStep < 5) {
      // Ensure we have the necessary data before proceeding
      switch (currentStep) {
        case 1:
          if (selectedSport !== '') {
            setCurrentStep(currentStep + 1);
          }
          break;
        case 2:
          if (selectedField !== null) {
            setCurrentStep(currentStep + 1);
          }
          break;
        case 3:
          if (selectedSubCourt !== null) {
            setCurrentStep(currentStep + 1);
          }
          break;
        case 4:
          if (selectedTimeSlots.length > 0) {
            setCurrentStep(currentStep + 1);
          }
          break;
        default:
          setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // When going back, ensure data is still available
      switch (currentStep) {
        case 2:
          // Going back to step 1, keep selected sport
          setCurrentStep(currentStep - 1);
          break;
        case 3:
          // Going back to step 2, keep selected field
          setCurrentStep(currentStep - 1);
          break;
        case 4:
          // Going back to step 3, keep selected sub court
          setCurrentStep(currentStep - 1);
          break;
        case 5:
          // Going back to step 4, keep time slots and re-fetch booked slots
          if (selectedSubCourt) {
            fetchSmallFieldBookings(selectedSubCourt.id);
          }
          setCurrentStep(currentStep - 1);
          break;
        default:
          setCurrentStep(currentStep - 1);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSport !== '';
      case 2: return selectedField !== null;
      case 3: return selectedSubCourt !== null;
      case 4: return selectedTimeSlots.length > 0;
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
      // Clear sub-court, booked slots, and time slots when changing field
      setSelectedSubCourt(null);
      setBookedSlots(new Set());
      setSelectedTimeSlots([]);
    }
    if (step <= 3) {
      setSelectedSubCourt(null);
      // Clear booked slots when changing sub court
      setBookedSlots(new Set());
      setSelectedTimeSlots([]);
    }
    if (step <= 4) {
      setSelectedDate('');
      setSelectedTimeSlots([]);
    }
  };


  // Transform server fields to match UI expectations
  const transformServerFieldToUI = (serverField: any) => ({
    id: Number(serverField.id) || 0,
    name: serverField.fieldName || 'Tên sân không xác định',
    location: serverField.location || 'Địa điểm không xác định',
    rating: serverField.averageRating || 0, // Use actual averageRating from API
    reviews: serverField.totalBookings || 0, // Use actual totalBookings from API
    price: serverField.normalPricePerHour !== undefined && serverField.normalPricePerHour !== null ? 
      `${serverField.normalPricePerHour.toLocaleString('vi-VN')}đ/giờ` : 
      'Giá không xác định',
    normalPricePerHour: serverField.normalPricePerHour || 0, // Store numeric value
    peakPricePerHour: serverField.peakPricePerHour || 0, // Store peak price
    openingHours: serverField.openTime && serverField.closeTime ? 
      `${serverField.openTime.substring(0, 5)} - ${serverField.closeTime.substring(0, 5)}` : 
      'Giờ mở cửa không xác định',
    image: (serverField.images && serverField.images[0]) || 
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sport: serverField.typeFieldName === 'Bóng Đá' ? 'football' as const : 
           serverField.typeFieldName === 'Cầu Lông' ? 'badminton' as const : 
           serverField.typeFieldName === 'Pickle Ball' ? 'pickle' as const : 'football' as const,
    subCourts: serverField.smallFieldResponses ? serverField.smallFieldResponses.map((smallField: any) => ({
      id: smallField.id || '',
      name: smallField.smallFiledName || 'Sân nhỏ', // Note: API has typo "Filed" instead of "Field"
      description: smallField.description || '', // Include description
      capacity: smallField.capacity || '', // Include capacity
      available: smallField.available !== false, // Include availability
      timeSlots: [] // Will be populated when fetchTimeSlots is called
    })) : [], // Use actual smallFieldResponses from API
    reviewsList: [],
    startHour: serverField.openTime ? parseInt(serverField.openTime.substring(0, 2)) : 0,
    endHour: serverField.closeTime ? parseInt(serverField.closeTime.substring(0, 2)) : 24,
    description: serverField.description || '',
    isPopular: serverField.totalBookings > 10, // Use actual totalBookings for popularity
    owner: {
      id: '',
      name: serverField.ownerName || '',
      phone: serverField.numberPhone || '',
    } as Owner,
  });

  const filteredFields = serverFields
    .filter(serverField => {
      // Filter out unavailable fields
      if (serverField.available === false) return false;
      
      // Filter by selected sport
      if (!selectedSport) return true;
      
      const fieldSport = serverField.typeFieldName === 'Bóng Đá' ? 'football' : 
                        serverField.typeFieldName === 'Cầu Lông' ? 'badminton' : 
                        serverField.typeFieldName === 'Pickle Ball' ? 'pickle' : 'football';
      
      return fieldSport === selectedSport;
    })
    .map(transformServerFieldToUI)
    .filter(field =>
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
    // Khi serverFields đã load, nếu có fieldId thì set selectedField và nhảy step 2
    const fieldId = searchParams.get('fieldId');
    if (fieldId && serverFields.length > 0) {
      const foundField = serverFields.find(f => f.id === fieldId);
      if (foundField) {
        setSelectedField(transformServerFieldToUI(foundField));
        setCurrentStep(2);
      }
    }
  }, [searchParams, serverFields]);

  const steps = [
    { step: 1, label: "Chọn môn", icon: Activity },
    { step: 2, label: "Chọn sân lớn", icon: Building },
    { step: 3, label: "Chọn sân nhỏ", icon: Target },
    { step: 4, label: "Chọn giờ", icon: Clock },
    { step: 5, label: "Xác nhận", icon: CheckCircle },
  ];

  // Helper function to check if a time slot is booked
  const isSlotBooked = (date: string, hourStr: string) => {
    // Only check booked slots if we have a selected sub-court
    if (!selectedSubCourt) return false;
    
    const slotKey = `${date}-${hourStr}`;
    return bookedSlots.has(slotKey);
  };

  // Helper function to check if a time slot is pending
  const isSlotPending = (date: string, hourStr: string) => {
    // Only check pending slots if we have a selected sub-court
    if (!selectedSubCourt) return false;
    
    const slotKey = `${date}-${hourStr}`;
    return pendingSlots.has(slotKey);
  };

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
            {(loading || stepLoading) && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-xl">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-600 font-semibold text-lg">Đang tải dữ liệu...</p>
              </div>
            )}

            {/* Step 1: Sport Selection */}
            {currentStep === 1 && !loading && !stepLoading && (
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
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Field Selection */}
            {currentStep === 2 && !loading && !stepLoading && (
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
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-base shadow-sm"
                  />
                  <button
                    className="w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg"
                    onClick={() => { }}
                    type="button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedFields.length === 0 ? (
                    <div className="text-center py-12 col-span-full">
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
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex flex-col ${selectedField?.id === field.id
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-100'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-lg bg-white'
                          }`}
                      >
                        {selectedField?.id === field.id && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-white">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <Image
                            src={field.image}
                            alt={field.name}
                            width={300}
                            height={180}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between h-full">
                          <div>
                            <h3 className={`text-xl font-bold mb-2 transition-colors ${selectedField?.id === field.id ? 'text-green-700' : 'text-gray-900'}`}>
                              {field.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-3">
                              <MapPin className="w-5 h-5 text-gray-500" />
                              <span className="text-base text-gray-600 truncate">{field.location}</span>
                            </div>
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-green-500" fill="#22c55e" stroke="#22c55e" />
                                <span className="font-bold text-green-700">{field.rating}</span>
                                <span className="text-sm text-gray-500">({field.reviews})</span>
                              </div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${selectedField?.id === field.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-green-700'}`}>
                                {field.subCourts.filter((sc: any) => sc.available !== false).length} sân
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-gray-600 text-sm">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {field.openingHours}
                              </div>
                              <div className={`text-lg font-bold ${selectedField?.id === field.id ? 'text-green-600' : 'text-gray-900'}`}>
                                {field.price}
                              </div>
                            </div>
                          </div>
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
            {currentStep === 3 && !loading && !stepLoading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn sân nhỏ</h2>
                  <p className="text-gray-600 text-lg">Lựa chọn sân phù hợp với số lượng người chơi</p>
                  {/* Display selected field information */}
                  {selectedField && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg inline-block">
                      <p className="text-green-700 font-medium">
                        Đang chọn: <span className="font-bold">{selectedField.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedField?.subCourts
                    .filter((subCourt: any) => subCourt.available !== false) // Hide unavailable sub courts
                    .map((subCourt) => (
                    <button
                      key={subCourt.id}
                      onClick={() => {
                        setSelectedSubCourt(subCourt);
                        resetFromStep(4);
                        // Clear existing booked slots and fetch new ones
                        setBookedSlots(new Set());
                        setSelectedTimeSlots([]);
                        // Fetch booked slots for this sub-court
                        fetchSmallFieldBookings(subCourt.id);
                      }}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center ${selectedSubCourt?.id === subCourt.id
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-100'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-lg bg-white'
                        }`}
                    >
                      {selectedSubCourt?.id === subCourt.id && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-20 border-4 border-white">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                          <Target className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold transition-colors text-center w-full ${selectedSubCourt?.id === subCourt.id ? 'text-green-700' : 'text-gray-900'}`}>
                        {subCourt.name}
                      </h3>
                      {/* Display capacity and description */}
                      <div className="mt-4 text-center w-full">
                        {subCourt.capacity && (
                          <div className="flex items-center justify-center text-gray-600 mb-2">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <span className="text-sm">
                              <span className="font-medium">Sức chứa:</span> {subCourt.capacity}
                            </span>
                          </div>
                        )}
                        {subCourt.description && (
                          <div className="flex items-start justify-center text-gray-600 mt-2">
                            <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                            </svg>
                            <span className="text-sm">
                              <span className="font-medium">Mô tả:</span> {subCourt.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Time Selection */}
            {currentStep === 4 && !loading && !stepLoading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Chọn thời gian đặt sân</h2>
                  <p className="text-gray-600 text-lg">Lựa chọn khung giờ phù hợp với lịch trình của bạn</p>
                  {/* Display selected field and sub-court information */}
                  {selectedField && selectedSubCourt && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg inline-block">
                      <p className="text-green-700 font-medium">
                        Đang chọn: <span className="font-bold">{selectedField.name}</span> - <span className="font-bold">{selectedSubCourt.name}</span>
                      </p>
                    </div>
                  )}
                  {/* Debug information */}
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500 hidden">
                    Debug: Selected sub-court ID: {selectedSubCourt?.id || 'None'} | Booked slots count: {bookedSlots.size}
                  </div>
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
                  <div className="mb-4 text-center">
                    <p className="text-gray-600">Chọn một hoặc nhiều khung giờ bằng cách click vào ô tương ứng</p>
                  </div>
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
                              // Check if this time slot is within the field's operating hours
                              const isWithinHours = selectedField && 
                                startHour >= selectedField.startHour && 
                                startHour < selectedField.endHour;
                              
                              // Check if the time slot is in the past
                              const slotDate = new Date(`${formatDate(date)}T${hourStr}:00`);
                              const isPastSlot = slotDate < new Date();
                              
                              // Check if this slot is selected (in the array)
                              const isSelected = selectedTimeSlots.some(slot => 
                                slot.date === formatDate(date) && slot.startTime === hourStr
                              );
                              
                              // Check if this slot is booked for the currently selected sub-court
                              const isBooked = selectedSubCourt ? isSlotBooked(formatDate(date), hourStr) : false;
                              
                              // Check if this slot is pending for the currently selected sub-court
                              const isPending = selectedSubCourt ? isSlotPending(formatDate(date), hourStr) : false;

                              // If outside operating hours, show "Outside hours"
                              if (!isWithinHours) {
                                return (
                                  <td key={idx} className="px-4 py-3 text-center bg-red-100 text-red-700 border-r border-gray-200 cursor-not-allowed">
                                    Ngoài giờ
                                  </td>
                                );
                              }

                              // If in the past, show "Outside hours"
                              if (isPastSlot) {
                                return (
                                  <td key={idx} className="px-4 py-3 text-center bg-red-100 text-red-700 border-r border-gray-200 cursor-not-allowed">
                                    Ngoài giờ
                                  </td>
                                );
                              }

                              // If booked (COMPLETED), show "Booked" with red background
                              if (isBooked) {
                                return (
                                  <td key={idx} className="px-4 py-3 text-center bg-red-500 text-white border-r border-gray-200 cursor-not-allowed">
                                    Đã đặt
                                  </td>
                                );
                              }

                              // If pending, show "Pending" with yellow background
                              if (isPending) {
                                return (
                                  <td key={idx} className="px-4 py-3 text-center bg-yellow-500 text-white border-r border-gray-200 cursor-not-allowed">
                                    Đang chờ
                                  </td>
                                );
                              }

                              return (
                                <td
                                  key={idx}
                                  className={`px-4 py-3 text-center transition-all border-r border-gray-200 cursor-pointer
                                    ${isSelected
                                      ? 'bg-green-500 text-white shadow-lg'
                                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                                    }`}
                                  onClick={() => {
                                    // Allow selection only for future slots within operating hours
                                    if (isWithinHours && !isPastSlot && !isBooked && !isPending) {
                                      const newTimeSlot = {
                                        id: `${formatDate(date)}-${hourStr}`,
                                        date: formatDate(date),
                                        startTime: hourStr,
                                        endTime: `${endHour.toString().padStart(2, '0')}:00`,
                                        isBooked: false,
                                        price: selectedField ? selectedField.normalPricePerHour || 0 : 0
                                      };
                                      
                                      // Toggle selection
                                      const isSelected = selectedTimeSlots.some(slot => 
                                        slot.date === newTimeSlot.date && slot.startTime === newTimeSlot.startTime
                                      );
                                      
                                      if (isSelected) {
                                        // Remove from selection
                                        setSelectedTimeSlots(prev => 
                                          prev.filter(slot => 
                                            !(slot.date === newTimeSlot.date && slot.startTime === newTimeSlot.startTime)
                                          )
                                        );
                                      } else {
                                        // Add to selection
                                        setSelectedTimeSlots(prev => [...prev, newTimeSlot]);
                                        setSelectedDate(formatDate(date)); // Set date when first slot is selected
                                      }
                                    }
                                  }}
                                >
                                  {isSelected ? 'Đã chọn' : 'Trống'}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {/* Loading indicator for booked slots */}
                  {loading && (
                    <div className="mt-4 text-center text-gray-600">
                      Đang tải lịch đặt sân...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && !isBookingSuccess && !loading && !stepLoading && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Xác nhận đặt sân</h2>
                  <p className="text-gray-600 text-lg">Kiểm tra thông tin và hoàn tất đặt sân</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
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
                      <div className="py-3 border-b border-gray-100">
                        <div className="text-gray-600 font-medium mb-2">Khung giờ đã chọn:</div>
                        <div className="space-y-3">
                          {Array.from(new Set(selectedTimeSlots.map(slot => slot.date))).map(date => {
                            const slotsForDate = selectedTimeSlots.filter(slot => slot.date === date);
                            return (
                              <div key={date} className="ml-4">
                                <div className="font-medium text-gray-700">
                                  Ngày: {new Date(date).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="ml-4 mt-1 space-y-1">
                                  {slotsForDate.map((slot, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-gray-800">
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                      <span className="text-green-600 font-bold">
                                        {formatPrice(slot.price)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(selectedTimeSlots.reduce((total, slot) => total + slot.price, 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment QR Code Section */}
                  {showPaymentQR && paymentResponse?.data && (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <QrCode className="w-6 h-6 mr-2 text-green-600" />
                        Thanh toán qua QR Code
                      </h3>
                      <div className="text-center">
                        <p className="text-gray-600 mb-6">
                          Vui lòng quét mã QR bên dưới để thanh toán
                        </p>
                        <div className="flex justify-center mb-6">
                          <div className="border-4 border-gray-200 rounded-xl p-4 inline-block">
                            <Image
                              src={paymentResponse.data.qrCode}
                              alt="Payment QR Code"
                              width={200}
                              height={200}
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Số tiền cần thanh toán:</span>
                            <span className="text-xl font-bold text-green-600">
                              {formatPrice(paymentResponse.data.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="font-mono text-gray-800">
                              {paymentResponse.data.ordersId}
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                          Sau khi thanh toán thành công, bạn sẽ nhận được xác nhận qua email.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Screen - Hiển thị khi isBookingSuccess = true */}
            {currentStep === 5 && isBookingSuccess && !loading && !stepLoading && (
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
                <div className="w-full max-w-3xl relative">
                  {/* Background decorative elements */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>

                  {/* Main success card */}
                  <div className="bg-white border border-green-100 shadow-xl rounded-3xl overflow-hidden transform transition-all duration-500">
                    {/* Header with animated checkmark */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-10 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-6"></div>
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg animate-bounce">
                          <CheckCircle className="w-14 h-14 text-green-500" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                          Đặt sân thành công!
                        </h2>
                        <p className="text-green-100 text-xl">
                          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
                        </p>
                      </div>
                    </div>

                    {/* Booking details */}
                    <div className="px-8 py-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Left column - Sport and field info */}
                        <div className="space-y-6">
                          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                              <Activity className="w-5 h-5 mr-2" />
                              Thông tin môn thể thao
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-green-100">
                                <span className="text-gray-600">Môn thể thao:</span>
                                <span className="font-bold text-gray-800">
                                  {selectedSport === 'football' ? 'Bóng đá' :
                                    selectedSport === 'badminton' ? 'Cầu lông' : 'Pickle Ball'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Sân:</span>
                                <span className="font-bold text-gray-800">{selectedField?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                              <Target className="w-5 h-5 mr-2" />
                              Thông tin sân nhỏ
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Tên sân nhỏ:</span>
                                <span className="font-bold text-gray-800">{selectedSubCourt?.name}</span>
                              </div>
                              {selectedSubCourt?.capacity && (
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-gray-600">Sức chứa:</span>
                                  <span className="font-bold text-gray-800">{selectedSubCourt.capacity} người</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right column - Time slots */}
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Khung giờ đã đặt
                          </h3>
                          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {Array.from(new Set(selectedTimeSlots.map(slot => slot.date))).map(date => {
                              const slotsForDate = selectedTimeSlots.filter(slot => slot.date === date);
                              return (
                                <div key={date} className="border-b border-green-100 pb-4 last:border-0 last:pb-0">
                                  <div className="font-bold text-gray-800 mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                                    {new Date(date).toLocaleDateString('vi-VN', {
                                      weekday: 'long',
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </div>
                                  <div className="ml-2 space-y-2">
                                    {slotsForDate.map((slot, index) => (
                                      <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                                        <span className="font-medium text-gray-700">
                                          {slot.startTime} - {slot.endTime}
                                        </span>
                                        <span className="text-green-600 font-bold">
                                          {formatPrice(slot.price)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
                              <span className="text-2xl font-bold text-green-600">
                                {formatPrice(selectedTimeSlots.reduce((total, slot) => total + slot.price, 0))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="text-center">
                        <button
                          onClick={handleGoHome}
                          className="px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl font-bold group flex items-center justify-center mx-auto"
                        >
                          <Home className="w-6 h-6 inline mr-3 group-hover:scale-110 transition-transform" />
                          Về trang chủ
                        </button>
                        
                        <p className="mt-6 text-gray-500 text-sm">
                          Bạn có thể xem chi tiết đơn hàng trong phần "Đơn hàng của tôi"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Chỉ hiển thị khi không phải màn hình success */}
            {!isBookingSuccess && !stepLoading && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 rounded-2xl hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Quay lại</span>
                </button>

                {/* Only show the confirm button if we're not showing the payment QR */}
                {!showPaymentQR && (
                  <button
                    onClick={() => {
                      if (currentStep === 5) {
                        handleConfirmBooking();
                      } else {
                        nextStep();
                      }
                    }}
                    disabled={!canProceed()}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="font-semibold">
                      {currentStep === 5 ? 'Xác nhận đặt sân' : 'Tiếp tục'}
                    </span>
                    {currentStep < 5 && <ArrowRight className="w-5 h-5" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
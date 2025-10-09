"use client";
import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Star,
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
  Building,
  Target,
  CheckCircle,
  Home,
  Calendar,
  QrCode,
  X,
  Ticket,
  Sparkles
} from "lucide-react";
import { useFieldStore } from "../../stores/fieldStore";
import {
  Field,
  SubCourt,
  TimeSlot,
  Owner,
  UserVoucher,
} from "../../types/field";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "../../stores/authStore";

export const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedSubCourt, setSelectedSubCourt] = useState<SubCourt | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucher | null>(
    null
  ); // Applied voucher
  const [tempSelectedVoucher, setTempSelectedVoucher] =
    useState<UserVoucher | null>(null); // Temporary selection
  const [availableVouchers, setAvailableVouchers] = useState<UserVoucher[]>([]); // New state for available vouchers

  // New states for payment cancellation flow
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaymentCancelled, setIsPaymentCancelled] = useState(false);

  const prevStepRef = React.useRef(currentStep);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  // Effect to fetch user vouchers when user is authenticated
  useEffect(() => {
    const fetchUserVouchers = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const { fetchUserVouchers } = useFieldStore.getState();
          await fetchUserVouchers(user.id);

          // Get the vouchers from the store
          const { userVouchers } = useFieldStore.getState();
          if (userVouchers) {
            // Filter for unused vouchers only
            const unusedVouchers = userVouchers.filter(
              (voucher) => !voucher.used
            );
            setAvailableVouchers(unusedVouchers);
          }
        } catch (error) {
          console.error("Error fetching user vouchers:", error);
        }
      }
    };

    fetchUserVouchers();
  }, [isAuthenticated, user?.id]);

  // Initialize tempSelectedVoucher when availableVouchers change and no voucher is selected yet
  useEffect(() => {
    if (
      availableVouchers.length > 0 &&
      !selectedVoucher &&
      !tempSelectedVoucher
    ) {
      // Don't auto-select any voucher, let user choose
    }
  }, [availableVouchers, selectedVoucher, tempSelectedVoucher]);

  const [voucherErrorMessage, setVoucherErrorMessage] = useState<string | null>(
    null
  );

  const applyVoucher = () => {
    // Clear any previous error message
    setVoucherErrorMessage(null);

    if (tempSelectedVoucher) {
      // Check if the total price meets the minimum order value before applying
      const totalPrice = selectedTimeSlots.reduce(
        (total, slot) => total + slot.price,
        0
      );
      if (totalPrice < tempSelectedVoucher.voucher.minOrderValue) {
        // Set error message to display in the UI
        setVoucherErrorMessage(
          `Mã giảm giá ${
            tempSelectedVoucher.voucher.code
          } yêu cầu giá trị đơn hàng tối thiểu là ${tempSelectedVoucher.voucher.minOrderValue.toLocaleString()}đ. Tổng hiện tại của bạn là ${totalPrice.toLocaleString()}đ.`
        );

        return;
      }
      setSelectedVoucher(tempSelectedVoucher);
    } else {
      // If no temporary voucher is selected, remove the current voucher
      setSelectedVoucher(null);
    }
  };

  const removeVoucher = () => {
    setSelectedVoucher(null);
    setTempSelectedVoucher(null);
  };

  // Effect for polling order status
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (showPaymentQR && orderId && !isBookingSuccess && !isPaymentCancelled) {
      setIsCheckingStatus(true);

      intervalId = setInterval(async () => {
        try {
          const { fetchOrderStatus } = useFieldStore.getState();
          await fetchOrderStatus(orderId);

          // Check the order status from the store
          const { orderStatus } = useFieldStore.getState();
          if (orderStatus && orderStatus.data === "COMPLETED") {
            // Stop polling
            if (intervalId) clearInterval(intervalId);
            setIsCheckingStatus(false);
            // Show success screen
            setIsBookingSuccess(true);
          }
        } catch (error) {
          console.error("Error checking order status:", error);
          // Stop polling on error
          if (intervalId) clearInterval(intervalId);
          setIsCheckingStatus(false);
        }
      }, 30000); // Check every 30 seconds
    }

    // Cleanup function to clear interval
    return () => {
      if (intervalId) clearInterval(intervalId);
      setIsCheckingStatus(false);
    };
  }, [showPaymentQR, orderId, isBookingSuccess, isPaymentCancelled]);

  const handleConfirmBooking = async () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      // Directly redirect to login instead of showing modal
      router.push("/login?returnUrl=/booking");
      return;
    }

    try {
      setStepLoading(true);
      const startTimes = selectedTimeSlots.map((slot) =>
        new Date(`${slot.date}T${slot.startTime}:00.000Z`).toISOString()
      );

      const response = await createBooking({
        smallFieldId: selectedSubCourt?.id || "",
        startTimes: startTimes,
      });

      // Store the booking response
      setBookingResponse(response);

      // Create payment for the booking
      if (response.data && response.data.length > 0) {
        // Extract all booking IDs from the response
        const bookingIds = response.data.map((booking) => booking.id);
        const paymentData = {
          bookingId: bookingIds,
        };

        // Add voucher code to payment data if selected
        if (selectedVoucher) {
          (paymentData as any).code = selectedVoucher.voucher.code;
        }

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
      console.error("Booking failed:", error);
      // Handle booking error (you might want to show an error message to the user)
    } finally {
      setStepLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // Add function to calculate total price with voucher discount
  const calculateTotalPrice = () => {
    const totalPrice = selectedTimeSlots.reduce(
      (total, slot) => total + slot.price,
      0
    );

    if (selectedVoucher) {
      if (selectedVoucher.voucher.percentage) {
        // Percentage discount
        const discount =
          (totalPrice * selectedVoucher.voucher.discountValue) / 100;
        console.log(
          "Calculating percentage discount:",
          discount,
          "from total:",
          totalPrice
        );
        return Math.max(0, totalPrice - discount);
      } else {
        // Fixed amount discount
        console.log(
          "Calculating fixed discount:",
          selectedVoucher.voucher.discountValue,
          "from total:",
          totalPrice
        );
        return Math.max(0, totalPrice - selectedVoucher.voucher.discountValue);
      }
    }

    console.log("No voucher applied, total price:", totalPrice);
    return totalPrice;
  };

  const createVietnamDate = (date?: Date) => {
    const now = date || new Date();
    const vietnamTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    vietnamTime.setHours(0, 0, 0, 0);
    return vietnamTime;
  };

  const [today] = useState(() => createVietnamDate());

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const todayVN = createVietnamDate();
    return new Date(
      todayVN.getFullYear(),
      todayVN.getMonth(),
      todayVN.getDate()
    );
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
    createPayment,
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
      setSelectedDate("");
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
      smallFieldBookings.forEach((booking) => {
        // Format: YYYY-MM-DD-HH:00
        const start = new Date(booking.startTime);
        const dateStr = start.toISOString().split("T")[0];
        const hourStr = start.toTimeString().substring(0, 5);
        const slotKey = `${dateStr}-${hourStr}`;

        // Check status and add to appropriate set
        if (booking.status === "CONFIRMED") {
          newBookedSlots.add(slotKey);
        } else if (booking.status === "PENDING") {
          newPendingSlots.add(slotKey);
        }
      });
    }
    setBookedSlots(newBookedSlots);
    setPendingSlots(newPendingSlots);
  }, [smallFieldBookings, selectedSubCourt]);

  // Effect to validate voucher based on minimum order value
  useEffect(() => {
    if (selectedVoucher) {
      const totalPrice = selectedTimeSlots.reduce(
        (total, slot) => total + slot.price,
        0
      );
      if (totalPrice < selectedVoucher.voucher.minOrderValue) {
        // Auto deselect voucher if total is less than minimum order value
        const voucherCode = selectedVoucher.voucher.code;
        const minOrderValue = selectedVoucher.voucher.minOrderValue;
        setSelectedVoucher(null);
        // Show a message to inform the user why the voucher was deselected
        setVoucherErrorMessage(
          `Mã giảm giá ${voucherCode} yêu cầu giá trị đơn hàng tối thiểu là ${minOrderValue.toLocaleString()}đ. Tổng hiện tại của bạn là ${totalPrice.toLocaleString()}đ.`
        );
      } else {
        // Clear error message if voucher is valid
        setVoucherErrorMessage(null);
      }
    } else {
      // Clear error message if no voucher is selected
      setVoucherErrorMessage(null);
    }
  }, [selectedTimeSlots, selectedVoucher]);

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
          if (selectedSport) {
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
  }, [
    currentStep,
    selectedSport,
    selectedField,
    selectedSubCourt,
    fetchMainSports,
    fetchServerFields,
    fetchSmallFieldBookings,
    mainSports.length,
    serverFields.length,
  ]);

  // Initialize tempSelectedVoucher when selectedVoucher changes
  useEffect(() => {
    if (selectedVoucher && !tempSelectedVoucher) {
      setTempSelectedVoucher(selectedVoucher);
    }
  }, [selectedVoucher, tempSelectedVoucher]);

  const generateWeekDays = () => {
    const days = [];
    const baseDate = new Date(
      currentWeekStart.getFullYear(),
      currentWeekStart.getMonth(),
      currentWeekStart.getDate()
    );
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const nextStep = () => {
    if (currentStep < 5) {
      // Ensure we have the necessary data before proceeding
      switch (currentStep) {
        case 1:
          if (selectedSport !== "") {
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
      case 1:
        return selectedSport !== "";
      case 2:
        return selectedField !== null;
      case 3:
        return selectedSubCourt !== null;
      case 4:
        return selectedTimeSlots.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const resetFromStep = (step: number) => {
    if (step <= 1) {
      setSelectedSport("");
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
      setSelectedDate("");
      setSelectedTimeSlots([]);
    }
  };

  // Transform server fields to match UI expectations
  const transformServerFieldToUI = (serverField: any, index: number) => ({
    id: serverField.id.toString() || index.toString(),
    name: serverField.fieldName || "Tên sân không xác định",
    location: serverField.location || "Địa điểm không xác định",
    rating: serverField.averageRating || 0, // Use actual averageRating from API
    reviews: serverField.totalBookings || 0, // Use actual totalBookings from API
    price:
      serverField.normalPricePerHour !== undefined &&
      serverField.normalPricePerHour !== null
        ? `${serverField.normalPricePerHour.toLocaleString("vi-VN")}đ/giờ`
        : "Giá không xác định",
    normalPricePerHour: serverField.normalPricePerHour || 0, // Store numeric value
    peakPricePerHour: serverField.peakPricePerHour || 0, // Store peak price
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
        ? ("football" as const)
        : serverField.typeFieldName === "Cầu Lông"
        ? ("badminton" as const)
        : serverField.typeFieldName === "Pickle Ball"
        ? ("pickle" as const)
        : ("football" as const),
    subCourts: serverField.smallFieldResponses
      ? serverField.smallFieldResponses.map((smallField: any) => ({
          id: smallField.id || "",
          name: smallField.smallFiledName || "Sân nhỏ", // Note: API has typo "Filed" instead of "Field"
          description: smallField.description || "", // Include description
          capacity: smallField.capacity || "", // Include capacity
          available: smallField.available !== false, // Include availability
          timeSlots: [], // Will be populated when fetchTimeSlots is called
        }))
      : [], // Use actual smallFieldResponses from API
    reviewsList: [],
    startHour: serverField.openTime
      ? parseInt(serverField.openTime.substring(0, 2))
      : 0,
    endHour: serverField.closeTime
      ? parseInt(serverField.closeTime.substring(0, 2))
      : 24,
    description: serverField.description || "",
    isPopular: serverField.totalBookings > 10, // Use actual totalBookings for popularity
    owner: {
      id: "",
      name: serverField.ownerName || "",
      phone: serverField.numberPhone || "",
    } as Owner,
  });

  const filteredFields = serverFields
    .filter((serverField) => {
      // Filter out unavailable fields
      if (serverField.available === false) return false;

      // Filter by selected sport
      if (!selectedSport) return true;

      const fieldSport =
        serverField.typeFieldName === "Bóng Đá"
          ? "football"
          : serverField.typeFieldName === "Cầu Lông"
          ? "badminton"
          : serverField.typeFieldName === "Pickle Ball"
          ? "pickle"
          : "football";

      return fieldSport === selectedSport;
    })
    .map((serverField, index) => transformServerFieldToUI(serverField, index))
    .filter(
      (field) =>
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
    const sportParam = searchParams.get("sport");
    if (sportParam && selectedSport !== sportParam) {
      // Decode the sport parameter to handle special characters
      const decodedSportParam = decodeURIComponent(sportParam);
      setSelectedSport(decodedSportParam);
      // Also fetch server fields when sport is set
      fetchServerFields();
    }
  }, [searchParams, selectedSport, fetchServerFields]);

  useEffect(() => {
    // Khi serverFields đã load, nếu có fieldId thì set selectedField và nhảy step 2
    const fieldId = searchParams.get("fieldId");
    const sportParam = searchParams.get("sport");

    // If we have a fieldId but no server fields, fetch them
    if (fieldId && serverFields.length === 0) {
      setStepLoading(true);
      // Make sure we have the sport set first
      if (sportParam && selectedSport !== sportParam) {
        setSelectedSport(sportParam);
      }
      fetchServerFields();
      return;
    }

    if (fieldId && serverFields.length > 0) {
      setStepLoading(true);
      // Decode the fieldId to handle special characters
      const decodedFieldId = decodeURIComponent(fieldId);
      // Convert both IDs to strings for comparison to handle type differences
      const foundField = serverFields.find(
        (f) => f.id.toString() === decodedFieldId.toString()
      );
      if (foundField) {
        const transformedField = transformServerFieldToUI(foundField, 0);
        setSelectedField(transformedField);
        // Make sure sport is set based on the field
        if (selectedSport === "") {
          setSelectedSport(transformedField.sport);
        }
        setCurrentStep(2);
        // Set stepLoading to false after a short delay to ensure UI updates
        setTimeout(() => setStepLoading(false), 100);
      } else {
        // If field not found, we might need to fetch sports first
        if (selectedSport === "") {
          fetchMainSports();
        }
        // Set stepLoading to false after a short delay
        setTimeout(() => setStepLoading(false), 100);
      }
    } else {
      // If no fieldId, make sure stepLoading is false
      setStepLoading(false);
    }
  }, [
    searchParams,
    serverFields,
    selectedSport,
    fetchMainSports,
    fetchServerFields,
  ]);

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

  // Effect to validate voucher based on minimum order value
  useEffect(() => {
    if (selectedVoucher) {
      const totalPrice = selectedTimeSlots.reduce(
        (total, slot) => total + slot.price,
        0
      );
      if (totalPrice < selectedVoucher.voucher.minOrderValue) {
        // Auto deselect voucher if total is less than minimum order value
        setSelectedVoucher(null);
      }
    }
  }, [selectedTimeSlots, selectedVoucher]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Đặt Sân Thể Thao
          </h1>
          <div className="w-16 sm:w-32 h-1 bg-gradient-to-r from-green-400 to-green-400 rounded-full mx-auto"></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map(({ step, label, icon: IconComponent }) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-lg shadow-md transform transition-all duration-300 ${
                      step <= currentStep
                        ? "bg-gradient-to-br from-green-400 to-green-400 text-white scale-105 shadow-green-400"
                        : "bg-white text-gray-500 border-2 border-gray-200 hover:border-green-400 hover:shadow-sm"
                    }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                    ) : (
                      <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[10px] sm:text-sm font-medium transition-colors duration-300 ${
                      step <= currentStep ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {step < 5 && (
                  <div
                    className={`w-4 sm:w-12 h-0.5 mx-1 sm:mx-4 rounded-full transition-all duration-500 ${
                      step < currentStep
                        ? "bg-gradient-to-r from-green-400 to-green-400"
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
            <div className="absolute top-0 left-0 w-40 h-40 bg-green-400 rounded-full transform -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full transform translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-400 rounded-full transform -translate-x-12 -translate-y-12"></div>
          </div>

          <div className="relative z-10 p-8">
            {(loading || stepLoading) && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-400 rounded-full shadow-xl">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-600 font-semibold text-lg">
                  Đang tải dữ liệu...
                </p>
              </div>
            )}

            {/* Step 1: Sport Selection */}
            {currentStep === 1 && !loading && !stepLoading && (
              <div>
                <div className="text-center mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Chọn môn thể thao
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Lựa chọn môn thể thao phù hợp với bạn
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                  {mainSports.map((sport) => {
                    const isSelected =
                      (selectedSport === "football" &&
                        sport.name === "Bóng đá") ||
                      (selectedSport === "badminton" &&
                        sport.name === "Cầu lông") ||
                      (selectedSport === "pickle" &&
                        sport.name === "Pickle Ball");

                    return (
                      <button
                        key={sport.name}
                        onClick={() => {
                          const sportKey =
                            sport.name === "Bóng đá"
                              ? "football"
                              : sport.name === "Cầu lông"
                              ? "badminton"
                              : "pickle";
                          setSelectedSport(sportKey);
                          resetFromStep(2);
                        }}
                        className={`group relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? "border-green-400 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-100"
                            : "border-gray-200 bg-white hover:border-green-400 hover:shadow-xl hover:shadow-gray-100"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div
                          className={`text-5xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-300 ${
                            isSelected
                              ? "transform scale-110"
                              : "group-hover:transform group-hover:scale-110"
                          }`}
                        >
                          {sport.icon}
                        </div>

                        <h3
                          className={`text-lg sm:text-xl font-bold mb-2 sm:mb-4 transition-colors duration-300 ${
                            isSelected
                              ? "text-green-400"
                              : "text-gray-900 group-hover:text-gray-700"
                          }`}
                        >
                          {sport.name}
                        </h3>

                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
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
                <div className="text-center mb-4 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Chọn sân thể thao
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Tìm sân phù hợp với nhu cầu của bạn
                  </p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 mb-4 max-w-md mx-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm tên hoặc địa điểm sân..."
                    className="flex-1 px-3 py-1.5 sm:py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-400 text-sm shadow-sm"
                  />
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-green-400 hover:bg-green-400 text-white rounded-lg transition-all shadow-md"
                    onClick={() => {}}
                    type="button"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {paginatedFields.length === 0 ? (
                    <div className="text-center py-6 sm:py-10 col-span-full">
                      <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Search className="w-5 sm:w-7 h-5 sm:h-7 text-gray-400" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                        Không tìm thấy sân nào
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                      </p>
                    </div>
                  ) : (
                    paginatedFields.map((field, index) => (
                      <button
                        key={`${field.id}-${index}`}
                        onClick={() => {
                          setSelectedField(field);
                          resetFromStep(3);
                        }}
                        className={`relative p-2.5 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] flex flex-col ${
                          selectedField &&
                          selectedField.id.toString() === field.id.toString()
                            ? "border-green-400 bg-gradient-to-br from-green-50 to-white shadow-lg shadow-green-100"
                            : "border-gray-200 hover:border-green-400 hover:shadow-md bg-white"
                        }`}
                      >
                        {selectedField &&
                          selectedField.id.toString() ===
                            field.id.toString() && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 sm:-top-1.5 sm:-right-1.5 sm:w-5 sm:h-5 bg-green-400 rounded-full flex items-center justify-center shadow z-20 border border-white">
                              <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                            </div>
                          )}
                        <div className="mb-1.5 sm:mb-2 rounded-md overflow-hidden">
                          <Image
                            src={field.image}
                            alt={field.name}
                            width={300}
                            height={180}
                            className="w-full h-16 sm:h-24 object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between h-full">
                          <div>
                            <h3
                              className={`text-[10px] sm:text-base font-bold mb-0.5 transition-colors truncate ${
                                selectedField &&
                                selectedField.id.toString() ===
                                  field.id.toString()
                                  ? "text-green-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {field.name}
                            </h3>
                            <div className="flex items-center space-x-1 mb-1">
                              <MapPin className="w-2.5 h-2.5 text-gray-500" />
                              <span className="text-[10px] sm:text-xs text-gray-600 truncate">
                                {field.location}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1.5 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star
                                  className="w-2.5 h-2.5 text-green-400"
                                  fill="#22c55e"
                                  stroke="#22c55e"
                                />
                                <span className="text-[10px] font-bold text-green-400">
                                  {field.rating}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  ({field.reviews})
                                </span>
                              </div>
                              <div
                                className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                  selectedField &&
                                  selectedField.id.toString() ===
                                    field.id.toString()
                                    ? "bg-green-400 text-white"
                                    : "bg-gray-100 text-green-400"
                                }`}
                              >
                                {
                                  field.subCourts.filter(
                                    (sc: any) => sc.available !== false
                                  ).length
                                }{" "}
                                sân
                              </div>
                            </div>
                            <div className="flex flex-col justify-between pt-1.5 border-t border-gray-100">
                              <div className="text-gray-600 text-[10px] mb-1">
                                <Clock className="w-2.5 h-2.5 inline mr-1" />
                                <span>{field.openingHours}</span>
                              </div>
                              <div
                                className={`text-[10px] sm:text-sm font-bold ${
                                  selectedField &&
                                  selectedField.id.toString() ===
                                    field.id.toString()
                                    ? "text-green-400"
                                    : "text-gray-900"
                                }`}
                              >
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
                  <nav
                    className="flex justify-center items-center gap-2 mt-6 mb-6"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      className="px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Trước"
                      disabled={currentFieldPage === 1}
                      onClick={() =>
                        setCurrentFieldPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        let start = Math.max(1, currentFieldPage - 1);
                        let end = Math.min(
                          totalFieldPages,
                          currentFieldPage + 1
                        );
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
                              <span className="px-1.5 py-1.5 text-gray-400 select-none">
                                ...
                              </span>
                            )}
                            {pages.map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentFieldPage(page)}
                                className={`w-7 sm:w-10 h-7 sm:h-10 text-[10px] sm:text-sm font-bold rounded-lg transition-all ${
                                  currentFieldPage === page
                                    ? "bg-black text-white border-2 border-black"
                                    : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50"
                                }`}
                                aria-current={
                                  currentFieldPage === page ? "page" : undefined
                                }
                              >
                                {page}
                              </button>
                            ))}
                            {end < totalFieldPages && (
                              <span className="px-1.5 py-1.5 text-gray-400 select-none">
                                ...
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <button
                      type="button"
                      className="px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Sau"
                      disabled={currentFieldPage === totalFieldPages}
                      onClick={() =>
                        setCurrentFieldPage((prev) =>
                          Math.min(prev + 1, totalFieldPages)
                        )
                      }
                    >
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </nav>
                )}
              </div>
            )}

            {/* Step 3: Sub Court Selection */}
            {currentStep === 3 && !loading && !stepLoading && (
              <div>
                <div className="text-center mb-6 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    Chọn sân nhỏ
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Lựa chọn sân phù hợp với số lượng người chơi
                  </p>
                  {/* Display selected field information */}
                  {selectedField && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg inline-block">
                      <p className="text-green-400 font-medium">
                        Đang chọn:{" "}
                        <span className="font-bold">{selectedField.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center ${
                          selectedSubCourt?.id === subCourt.id
                            ? "border-green-400 bg-gradient-to-br from-green-50 to-white shadow-lg sm:shadow-xl shadow-green-100"
                            : "border-gray-200 hover:border-green-400 hover:shadow-md sm:hover:shadow-lg bg-white"
                        }`}
                      >
                        {selectedSubCourt?.id === subCourt.id && (
                          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full flex items-center justify-center shadow-md sm:shadow-lg z-20 border-2 sm:border-4 border-white">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <div className="mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-400 flex items-center justify-center mx-auto">
                            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                        </div>
                        <h3
                          className={`text-[10px] sm:text-base md:text-lg font-bold transition-colors text-center w-full truncate ${
                            selectedSubCourt?.id === subCourt.id
                              ? "text-green-400"
                              : "text-gray-900"
                          }`}
                        >
                          {subCourt.name}
                        </h3>
                        {/* Display capacity and description */}
                        <div className="mt-1.5 sm:mt-3 text-center w-full">
                          {subCourt.capacity && (
                            <div className="flex items-center justify-center text-gray-600 mb-1">
                              <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 00-1 1v3a1 1 0 002 0V6a1 1 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                ></path>
                              </svg>
                              <span className="text-[10px] sm:text-xs">
                                <span className="font-medium">Sức chứa:</span>{" "}
                                {subCourt.capacity}
                              </span>
                            </div>
                          )}
                          {subCourt.description && (
                            <div className="flex items-start justify-center text-gray-600 mt-1">
                              <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 text-green-400 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                ></path>
                              </svg>
                              <span className="text-[10px] sm:text-xs">
                                <span className="font-medium">Mô tả:</span>{" "}
                                {subCourt.description}
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
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Chọn thời gian đặt sân
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    Lựa chọn khung giờ phù hợp với lịch trình của bạn
                  </p>
                  {/* Display selected field and sub-court information */}
                  {selectedField && selectedSubCourt && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg inline-block">
                      <p className="text-green-400 font-medium">
                        Đang chọn:{" "}
                        <span className="font-bold">{selectedField.name}</span>{" "}
                        -{" "}
                        <span className="font-bold">
                          {selectedSubCourt.name}
                        </span>
                      </p>
                    </div>
                  )}
                  {/* Debug information */}
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500 hidden">
                    Debug: Selected sub-court ID:{" "}
                    {selectedSubCourt?.id || "None"} | Booked slots count:{" "}
                    {bookedSlots.size}
                  </div>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-4">
                  <button
                    onClick={prevWeek}
                    disabled={currentWeekStart <= today}
                    className={`p-3 rounded-xl border transition-all
                      ${
                        currentWeekStart <= today
                          ? "border-green-400 bg-green-400 text-green-400 cursor-not-allowed"
                          : "border-green-400 bg-green-400 text-white hover:bg-green-400 hover:border-green-500"
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <span className="font-bold text-gray-900 text-xs sm:text-base md:text-lg">
                      {formatDateDisplay(weekDays[0])} -{" "}
                      {formatDateDisplay(weekDays[6])}
                    </span>
                  </div>

                  <button
                    onClick={nextWeek}
                    disabled={!canGoNext()}
                    className={`p-3 rounded-xl border transition-all
                      ${
                        !canGoNext()
                          ? "border-green-400 bg-green-400 text-green-400 cursor-not-allowed"
                          : "border-green-400 bg-green-400 text-white hover:bg-green-400 hover:border-green-500"
                      }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Time Table */}
                <div className="bg-gray-50 rounded-none p-1 sm:p-6 overflow-x-auto">
                  <div className="mb-4 text-center">
                    <p className="text-gray-600 text-[7px] sm:text-xs md:text-sm">
                      Chọn một hoặc nhiều khung giờ bằng cách click vào ô tương
                      ứng
                    </p>
                  </div>
                  <table
                    className="min-w-full border-separate"
                    style={{ borderSpacing: "0" }}
                  >
                    <thead>
                      <tr>
                        <th className="px-1 sm:px-4 py-2 sm:py-3 text-left font-bold text-gray-900 bg-white border-r border-gray-200 text-[7px] sm:text-sm md:text-base">
                          Khung giờ
                        </th>
                        {weekDays.map((date, idx) => (
                          <th
                            key={idx}
                            className={`px-1 sm:px-4 py-2 sm:py-3 text-center font-bold text-gray-900 bg-white border-r border-gray-200 ${
                              idx === weekDays.length - 1 ? "" : ""
                            }`}
                          >
                            <div className="text-[7px] sm:text-xs md:text-sm">
                              {formatDateDisplay(date)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const startHour = hour;
                        const endHour = (hour + 1) % 24;
                        const hourStr = `${startHour
                          .toString()
                          .padStart(2, "0")}:00`;
                        return (
                          <tr key={hour} className="border-t border-gray-200">
                            <td className="px-1 sm:px-4 py-2 sm:py-3 font-semibold text-gray-900 bg-white border-r border-gray-200 text-[7px] sm:text-sm md:text-base">
                              {`${startHour}:00 - ${endHour}:00`}
                            </td>
                            {weekDays.map((date, idx) => {
                              // Check if this time slot is within the field's operating hours
                              const isWithinHours =
                                selectedField &&
                                startHour >= selectedField.startHour &&
                                startHour < selectedField.endHour;

                              // Check if the time slot is in the past
                              const slotDate = new Date(
                                `${formatDate(date)}T${hourStr}:00`
                              );
                              const isPastSlot = slotDate < new Date();

                              // Check if this slot is selected (in the array)
                              const isSelected = selectedTimeSlots.some(
                                (slot) =>
                                  slot.date === formatDate(date) &&
                                  slot.startTime === hourStr
                              );

                              // Check if this slot is booked for the currently selected sub-court
                              const isBooked = selectedSubCourt
                                ? isSlotBooked(formatDate(date), hourStr)
                                : false;

                              // Check if this slot is pending for the currently selected sub-court
                              const isPending = selectedSubCourt
                                ? isSlotPending(formatDate(date), hourStr)
                                : false;

                              // If outside operating hours, show "Outside hours"
                              if (!isWithinHours) {
                                return (
                                  <td
                                    key={idx}
                                    className="px-1 sm:px-4 py-2 sm:py-3 text-center bg-red-100 text-red-700 border-r border-gray-200 cursor-not-allowed text-[8px] sm:text-xs md:text-sm"
                                  >
                                    Ngoài giờ
                                  </td>
                                );
                              }

                              // If in the past, show "Outside hours"
                              if (isPastSlot) {
                                return (
                                  <td
                                    key={idx}
                                    className="px-1 sm:px-4 py-2 sm:py-3 text-center bg-red-100 text-red-700 border-r border-gray-200 cursor-not-allowed text-[8px] sm:text-xs md:text-sm"
                                  >
                                    Ngoài giờ
                                  </td>
                                );
                              }

                              // If booked (COMPLETED), show "Booked" with light blue background
                              if (isBooked) {
                                return (
                                  <td
                                    key={idx}
                                    className="px-1 sm:px-4 py-2 sm:py-3 text-center bg-blue-200 text-blue-800 border-r border-gray-200 cursor-not-allowed text-[7px] sm:text-xs md:text-sm"
                                  >
                                    Đã đặt
                                  </td>
                                );
                              }

                              // If pending, show "Pending" with even lighter yellow background
                              if (isPending) {
                                return (
                                  <td
                                    key={idx}
                                    className="px-1 sm:px-4 py-2 sm:py-3 text-center bg-yellow-100 text-yellow-700 border-r border-gray-200 cursor-not-allowed text-[7px] sm:text-xs md:text-sm"
                                  >
                                    Đang chờ
                                  </td>
                                );
                              }

                              return (
                                <td
                                  key={idx}
                                  className={`px-1 sm:px-4 py-2 sm:py-3 text-center transition-all border-r border-gray-200 cursor-pointer text-[7px] sm:text-xs md:text-sm
                                    ${
                                      isSelected
                                        ? "bg-green-400 text-white hover:bg-gray-700 shadow-lg"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    }`}
                                  onClick={() => {
                                    // Allow selection only for future slots within operating hours
                                    if (
                                      isWithinHours &&
                                      !isPastSlot &&
                                      !isBooked &&
                                      !isPending
                                    ) {
                                      const newTimeSlot = {
                                        id: `${formatDate(date)}-${hourStr}`,
                                        date: formatDate(date),
                                        startTime: hourStr,
                                        endTime: `${endHour
                                          .toString()
                                          .padStart(2, "0")}:00`,
                                        isBooked: false,
                                        price: selectedField
                                          ? selectedField.normalPricePerHour ||
                                            0
                                          : 0,
                                      };

                                      // Toggle selection
                                      const isSelected = selectedTimeSlots.some(
                                        (slot) =>
                                          slot.date === newTimeSlot.date &&
                                          slot.startTime ===
                                            newTimeSlot.startTime
                                      );

                                      if (isSelected) {
                                        // Remove from selection
                                        setSelectedTimeSlots((prev) =>
                                          prev.filter(
                                            (slot) =>
                                              !(
                                                slot.date ===
                                                  newTimeSlot.date &&
                                                slot.startTime ===
                                                  newTimeSlot.startTime
                                              )
                                          )
                                        );
                                      } else {
                                        // Add to selection
                                        setSelectedTimeSlots((prev) => [
                                          ...prev,
                                          newTimeSlot,
                                        ]);
                                        setSelectedDate(formatDate(date)); // Set date when first slot is selected
                                      }
                                    }
                                  }}
                                >
                                  {isSelected ? "Đã chọn" : "Trống"}
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
                    <div className="mt-4 text-center text-gray-600 text-[7px] sm:text-xs md:text-sm">
                      Đang tải lịch đặt sân...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 &&
              !isBookingSuccess &&
              !loading &&
              !stepLoading && (
                <div>
                  <div className="text-center mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                      Xác nhận đặt sân
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg">
                      Kiểm tra thông tin và hoàn tất đặt sân
                    </p>
                  </div>

                  {/* Authentication warning for non-authenticated users */}
                  {!isAuthenticated && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Bạn cần đăng nhập để hoàn tất đặt sân. Bạn sẽ được
                            chuyển hướng đến trang đăng nhập khi nhấn nút xác
                            nhận.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-8">
                    {/* Voucher Selection Section */}
                    {isAuthenticated &&
                      availableVouchers.length > 0 &&
                      !isPaymentCancelled && (
                        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-400" />
                            Chọn voucher giảm giá
                          </h3>

                          {/* Voucher error message */}
                          {voucherErrorMessage && (
                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 text-sm">
                                {voucherErrorMessage}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <button
                              onClick={() => setTempSelectedVoucher(null)}
                              className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                                tempSelectedVoucher === null ||
                                (tempSelectedVoucher === null &&
                                  selectedVoucher === null)
                                  ? "border-green-400 bg-green-50 shadow-sm"
                                  : "border-gray-200 hover:border-green-400"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-2 sm:mr-3 flex items-center justify-center ${
                                    tempSelectedVoucher === null ||
                                    (tempSelectedVoucher === null &&
                                      selectedVoucher === null)
                                      ? "border-green-400 bg-green-400"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {(tempSelectedVoucher === null ||
                                    (tempSelectedVoucher === null &&
                                      selectedVoucher === null)) && (
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-800 text-sm sm:base">
                                  Không sử dụng voucher
                                </span>
                              </div>
                            </button>

                            {availableVouchers.map((voucher) => (
                              <button
                                key={voucher.voucher.id}
                                onClick={() => setTempSelectedVoucher(voucher)}
                                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                                  tempSelectedVoucher?.voucher.id ===
                                    voucher.voucher.id ||
                                  selectedVoucher?.voucher.id ===
                                    voucher.voucher.id
                                    ? "border-green-400 bg-green-50 shadow-sm"
                                    : "border-gray-200 hover:border-green-400"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-2 sm:mr-3 flex items-center justify-center ${
                                        tempSelectedVoucher?.voucher.id ===
                                          voucher.voucher.id ||
                                        selectedVoucher?.voucher.id ===
                                          voucher.voucher.id
                                          ? "border-green-400 bg-green-400"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {(tempSelectedVoucher?.voucher.id ===
                                        voucher.voucher.id ||
                                        selectedVoucher?.voucher.id ===
                                          voucher.voucher.id) && (
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                                      )}
                                    </div>
                                    <div className="text-left">
                                      <div className="font-bold text-gray-900 text-sm sm:base">
                                        {voucher.voucher.code}
                                      </div>
                                      <div className="text-xs sm:text-sm text-gray-600">
                                        Giảm{" "}
                                        {voucher.voucher.percentage
                                          ? `${voucher.voucher.discountValue}%`
                                          : `${voucher.voucher.discountValue.toLocaleString()}đ`}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs sm:text-sm text-gray-500">
                                      Đơn tối thiểu
                                    </div>
                                    <div className="font-bold text-gray-800 text-sm sm:base">
                                      {voucher.voucher.minOrderValue.toLocaleString()}
                                      đ
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Apply/Remove Voucher Buttons */}
                          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                            {selectedVoucher ? (
                              <button
                                onClick={removeVoucher}
                                className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors text-sm sm:base"
                              >
                                Bỏ áp dụng voucher
                              </button>
                            ) : tempSelectedVoucher ? (
                              <button
                                onClick={applyVoucher}
                                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-400 hover:bg-green-400 text-white rounded-xl font-medium transition-colors text-sm sm:base"
                              >
                                Áp dụng voucher
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )}

                    {/* Booking Summary */}
                    {!isPaymentCancelled && (
                      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                          Thông tin đặt sân
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium text-sm sm:base">
                              Môn thể thao:
                            </span>
                            <span className="font-bold text-green-400 text-sm sm:base">
                              {selectedSport === "football"
                                ? "Bóng đá"
                                : selectedSport === "badminton"
                                ? "Cầu lông"
                                : "Pickle Ball"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium text-sm sm:base">
                              Sân lớn:
                            </span>
                            <span className="font-bold text-gray-800 text-sm sm:base">
                              {selectedField?.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-medium text-sm sm:base">
                              Sân nhỏ:
                            </span>
                            <span className="font-bold text-gray-800 text-sm sm:base">
                              {selectedSubCourt?.name}
                            </span>
                          </div>
                          <div className="py-2 sm:py-3 border-b border-gray-100">
                            <div className="text-gray-600 font-medium mb-1 sm:mb-2 text-sm sm:base">
                              Khung giờ đã chọn:
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                              {Array.from(
                                new Set(
                                  selectedTimeSlots.map((slot) => slot.date)
                                )
                              ).map((date) => {
                                const slotsForDate = selectedTimeSlots.filter(
                                  (slot) => slot.date === date
                                );
                                return (
                                  <div key={date} className="ml-2 sm:ml-4">
                                    <div className="font-medium text-gray-700 text-sm sm:base">
                                      Ngày:{" "}
                                      {new Date(date).toLocaleDateString(
                                        "vi-VN"
                                      )}
                                    </div>
                                    <div className="ml-2 sm:ml-4 mt-1 space-y-1">
                                      {slotsForDate.map((slot, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center"
                                        >
                                          <span className="text-gray-800 text-sm sm:base">
                                            {slot.startTime} - {slot.endTime}
                                          </span>
                                          <span className="text-green-400 font-bold text-sm sm:base">
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

                          {/* Voucher Discount Display */}
                          {selectedVoucher && (
                            <div
                              key={`voucher-${selectedVoucher.voucher.id}`}
                              className="py-3 sm:py-4 border-b border-gray-100 bg-green-50 rounded-lg px-3 sm:px-4"
                            >
                              <div className="flex justify-between items-center mb-1 sm:mb-2">
                                <span className="text-gray-700 font-bold text-sm sm:base">
                                  Voucher giảm giá:
                                </span>
                                <span className="font-bold text-green-400 text-base sm:text-lg">
                                  {selectedVoucher.voucher.code}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm sm:base">
                                  Giá trị giảm:
                                </span>
                                <span className="font-bold text-green-400 text-base sm:text-lg">
                                  {selectedVoucher.voucher.percentage
                                    ? `-${selectedVoucher.voucher.discountValue}%`
                                    : `-${selectedVoucher.voucher.discountValue.toLocaleString()}đ`}
                                </span>
                              </div>
                            </div>
                          )}

                          <div
                            key={`summary-${
                              selectedVoucher?.voucher.id || "none"
                            }`}
                            className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 border-2 border-green-400 shadow-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-base sm:text-xl font-bold text-gray-800">
                                Tổng tiền:
                              </span>
                              <span className="text-2xl sm:text-3xl font-bold text-green-400">
                                {formatPrice(calculateTotalPrice())}
                              </span>
                            </div>
                            {selectedVoucher && (
                              <div
                                key={`applied-${selectedVoucher.voucher.id}`}
                                className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-400 font-bold text-right"
                              >
                                Đã áp dụng voucher giảm giá
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment QR Code Section */}
                    {showPaymentQR &&
                      paymentResponse?.data &&
                      !isPaymentCancelled && (
                        <div className="bg-white rounded-2xl p-3 sm:p-8 border border-gray-100 shadow-sm">
                          <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6 flex items-center">
                            <QrCode className="w-4 h-4 sm:w-6 sm:h-6 mr-2 text-green-400" />
                            Thanh toán qua QR Code
                          </h3>
                          <div className="text-center">
                            <p className="text-gray-600 mb-3 sm:mb-6 text-xs sm:base">
                              Vui lòng quét mã QR bên dưới để thanh toán
                            </p>
                            <div className="flex justify-center mb-3 sm:mb-6">
                              <div className="border-2 sm:border-4 border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-4 inline-block">
                                <Image
                                  src={paymentResponse.data.qrCode}
                                  alt="Payment QR Code"
                                  width={180}
                                  height={180}
                                  className="rounded-md sm:rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-green-400">
                              <div className="flex justify-between items-center mb-1 sm:mb-2">
                                <span className="text-gray-600 text-xs sm:base">
                                  Số tiền cần thanh toán:
                                </span>
                                <span className="text-base sm:text-xl font-bold text-green-400">
                                  {formatPrice(paymentResponse.data.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-xs sm:base">
                                  Mã đơn hàng:
                                </span>
                                <span className="font-mono text-gray-800 text-xs sm:base">
                                  {paymentResponse.data.ordersId}
                                </span>
                              </div>
                            </div>
                            <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500">
                              Sau khi thanh toán thành công, bạn sẽ nhận được
                              xác nhận qua email.
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Payment Cancelled Message */}
                    {isPaymentCancelled && (
                      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-100 shadow-sm text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center">
                          <X className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
                          Thanh toán đã bị hủy
                        </h3>
                        <div className="flex justify-center mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:base">
                          Bạn đã hủy thanh toán cho đơn đặt sân. Nếu muốn tiếp
                          tục đặt sân, vui lòng nhấn nút "Đặt lại" bên dưới.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Success Screen - Hiển thị khi isBookingSuccess = true */}
            {currentStep === 5 &&
              isBookingSuccess &&
              !loading &&
              !stepLoading && (
                <div className="min-h-screen bg-white flex items-center justify-center p-2 md:p-6 lg:p-8">
                  <div className="w-full max-w-6xl">
                    {/* Success Card */}
                    <div className="bg-white shadow-2xl overflow-hidden rounded-lg">
                      {/* Header Section */}
                      <div className="bg-green-400 px-6 py-8 md:py-12 text-center relative border-b-4 border-white">
                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-white rounded-full mb-6 shadow-xl animate-bounce">
                            <CheckCircle
                              className="w-12 h-12 md:w-16 md:h-16 text-green-400"
                              strokeWidth={3}
                            />
                          </div>
                          <h1 className="text-xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                            ĐẶT SÂN THÀNH CÔNG!
                          </h1>
                          <div className="flex items-center justify-center gap-2 text-gray-900 text-sm md:text-xl font-bold">
                            <Sparkles className="w-5 h-5" />
                            <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi</p>
                            <Sparkles className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 md:p-10 bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                          {/* Left Column */}
                          <div className="space-y-6">
                            {/* Sport Info */}
                            <div className="bg-white shadow-md rounded-lg">
                              <div className="bg-green-400 px-4 py-3 border-b-2 border-white rounded-t-lg">
                                <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
                                  <Activity className="w-5 h-5" />
                                  THÔNG TIN MÔN THỂ THAO
                                </h3>
                              </div>
                              <div className="p-5 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200">
                                  <span className="text-gray-600 font-bold text-xs md:text-base">
                                    Môn thể thao:
                                  </span>
                                  <span className="font-black text-gray-900 text-xs md:text-base">
                                    {selectedSport === "football"
                                      ? "BÓNG ĐÁ"
                                      : selectedSport === "badminton"
                                      ? "CẦU LÔNG"
                                      : "PICKLE BALL"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 font-bold text-xs md:text-base">
                                    Sân:
                                  </span>
                                  <span className="font-black text-gray-900 text-xs md:text-base">
                                    {selectedField?.name}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* SubCourt Info */}
                            <div className="bg-white shadow-md rounded-lg">
                              <div className="bg-white px-4 py-3 border-b-2 border-gray-200 rounded-t-lg">
                                <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-green-400" />
                                  THÔNG TIN SÂN NHỎ
                                </h3>
                              </div>
                              <div className="p-5 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200">
                                  <span className="text-gray-600 font-bold text-xs md:text-base">
                                    Tên sân nhỏ:
                                  </span>
                                  <span className="font-black text-gray-900 text-xs md:text-base">
                                    {selectedSubCourt?.name}
                                  </span>
                                </div>
                                {selectedSubCourt?.capacity && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-bold text-xs md:text-base">
                                      Sức chứa:
                                    </span>
                                    <span className="font-black text-gray-900 text-xs md:text-base">
                                      {selectedSubCourt.capacity} NGƯỜI
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Time Slots */}
                          <div className="bg-white shadow-md rounded-lg">
                            <div className="bg-white px-4 py-3 border-b-2 border-gray-200 rounded-t-lg">
                              <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-400" />
                                KHUNG GIỜ ĐÃ ĐẶT
                              </h3>
                            </div>
                            <div className="p-5">
                              <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
                                {Array.from(
                                  new Set(
                                    selectedTimeSlots.map((slot) => slot.date)
                                  )
                                ).map((date) => {
                                  const slotsForDate = selectedTimeSlots.filter(
                                    (slot) => slot.date === date
                                  );
                                  return (
                                    <div
                                      key={date}
                                      className="border-b-2 border-gray-200 pb-4 last:border-0 last:pb-0"
                                    >
                                      <div className="font-black text-gray-900 mb-3 flex items-center gap-2 text-xs md:text-base">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                        {new Date(date).toLocaleDateString(
                                          "vi-VN",
                                          {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        {slotsForDate.map((slot, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center bg-gray-100 rounded p-3 hover:bg-green-400 transition-colors duration-200"
                                          >
                                            <span className="font-bold text-gray-900 text-xs md:text-base">
                                              {slot.startTime} - {slot.endTime}
                                            </span>
                                            <span className="text-gray-900 font-black text-xs md:text-base">
                                              {formatPrice(slot.price)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Total */}
                              <div className="mt-6 pt-5 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center bg-green-400 p-4 rounded-lg shadow-md">
                                  <span className="text-base md:text-2xl font-black text-gray-900">
                                    TỔNG TIỀN:
                                  </span>
                                  <span className="text-lg md:text-3xl font-black text-gray-900">
                                    {formatPrice(
                                      selectedTimeSlots.reduce(
                                        (total, slot) => total + slot.price,
                                        0
                                      )
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="text-center border-t-2 border-gray-200 pt-8">
                          <button
                            onClick={handleGoHome}
                            className="w-full md:w-auto px-8 md:px-16 py-4 md:py-5 bg-green-400 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-green-400 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-base md:text-xl font-black group flex items-center justify-center mx-auto gap-3"
                          >
                            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            VỀ TRANG CHỦ
                          </button>

                          <div className="mt-6 p-4 bg-gray-100 rounded-lg inline-block">
                            <p className="text-gray-900 text-xs md:text-base font-bold">
                              📋 Xem chi tiết trong phần "ĐƠN HÀNG CỦA TÔI"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                      <div className="inline-block bg-gray-900 text-green-400 px-6 py-3 rounded-lg font-bold text-xs">
                        ✨ Chúc bạn có trải nghiệm vui vẻ! ✨
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Navigation Buttons - Chỉ hiển thị khi không phải màn hình success */}
            {!isBookingSuccess && !stepLoading && (
              <div className="flex justify-between mt-6 sm:mt-8">
                {showPaymentQR && !isPaymentCancelled ? (
                  <>
                    <button
                      onClick={() => {
                        // Show confirmation modal instead of reloading immediately
                        setShowCancelModal(true);
                      }}
                      className="flex items-center space-x-1 sm:space-x-3 px-4 sm:px-8 py-2 sm:py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <X className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-base font-semibold">
                        Hủy thanh toán
                      </span>
                    </button>

                    {/* Cancel Payment Confirmation Modal */}
                    {showCancelModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Xác nhận hủy thanh toán
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn hủy thanh toán không? Thao tác
                            này sẽ hủy bỏ đơn đặt sân hiện tại.
                          </p>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowCancelModal(false)}
                              className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm sm:text-base"
                            >
                              Quay lại
                            </button>
                            <button
                              onClick={() => {
                                setShowCancelModal(false);
                                setIsPaymentCancelled(true);
                                // Stop polling if it's running
                                setIsCheckingStatus(false);
                              }}
                              className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium text-sm sm:text-base"
                            >
                              Xác nhận hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : isPaymentCancelled ? null : (
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-1 sm:space-x-3 px-4 sm:px-8 py-2 sm:py-4 border-2 border-gray-300 rounded-2xl hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-base font-semibold">
                      Quay lại
                    </span>
                  </button>
                )}

                {/* Show different buttons based on payment state */}
                {isPaymentCancelled ? (
                  <button
                    onClick={() => {
                      // Reload the page to restart the process
                      window.location.reload();
                    }}
                    className="flex items-center space-x-1 sm:space-x-3 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-green-400 to-green-400 text-white rounded-2xl hover:from-green-400 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-xs sm:text-base font-semibold">
                      Đặt lại
                    </span>
                  </button>
                ) : !showPaymentQR ? (
                  <button
                    onClick={() => {
                      if (currentStep === 5) {
                        handleConfirmBooking();
                      } else {
                        nextStep();
                      }
                    }}
                    disabled={!canProceed()}
                    className="flex items-center space-x-1 sm:space-x-3 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-green-400 to-green-400 text-white rounded-2xl hover:from-green-400 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-xs sm:text-base font-semibold">
                      {currentStep === 5
                        ? !isAuthenticated
                          ? "Đăng nhập để đặt sân"
                          : "Xác nhận đặt sân"
                        : "Tiếp tục"}
                    </span>
                    {currentStep < 5 && (
                      <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

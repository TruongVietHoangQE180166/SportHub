import { create } from 'zustand';
import { 
  getPopularFields,
  getAllFields,
  getMainSports,
  getFieldsBySport,
  getSubCourts,
  getTimeSlots,
  getOwnerByField,
  getReviewsByField,
  getAllFieldServer,
  getFieldDetailServer,
  getSmallFieldBookings,
  createBooking,
  createPayment,
  getOrderStatus,
  getUserOrders,
  cancelBooking,
  getUserPoints,
  getUserVouchers,
  exchangeUserVoucher
} from '../services/fieldService';
import { Field, MainSport, SubCourt, TimeSlot, Owner, Review, ServerField, FieldBooking, BookingResponse, CreateBookingRequest, CreateBookingResponse, PaymentRequest, PaymentResponse, UserOrdersResponse, UserPoint, UserVoucher, UserVoucherExchangeResponse } from '../types/field';

interface FieldState {
  popularFields: Field[];
  allFields: Field[];
  serverFields: ServerField[];
  mainSports: MainSport[];
  fieldsBySport: Field[];
  subCourts: SubCourt[];
  timeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  owner: Owner | null;
  reviews: Review[];
  selectedField: ServerField | null;
  smallFieldBookings: FieldBooking[];
  totalBookings: number;
  orderStatus: any | null;
  userOrders: UserOrdersResponse | null;
  userPoints: UserPoint | null;
  userVouchers: UserVoucher[] | null;
  totalVouchers: number;
  
  fetchPopularFields: () => Promise<void>;
  fetchAllFields: () => Promise<void>;
  fetchServerFields: () => Promise<void>;
  fetchFieldDetail: (fieldId: string) => Promise<void>;
  fetchMainSports: () => Promise<void>;
  fetchFieldsBySport: (sport: string) => Promise<void>;
  fetchSubCourts: (fieldId: number) => Promise<void>;
  fetchTimeSlots: (fieldId: number, subCourtId: string) => Promise<void>;
  fetchOwnerByField: (fieldId: number) => Promise<void>;
  fetchReviewsByField: (fieldId: number) => Promise<void>;
  fetchSmallFieldBookings: (smallFieldId: string) => Promise<void>;
  createBooking: (bookingData: CreateBookingRequest) => Promise<CreateBookingResponse>;
  createPayment: (paymentData: PaymentRequest) => Promise<PaymentResponse>;
  fetchOrderStatus: (orderId: string) => Promise<void>;
  fetchUserOrders: (userId: string) => Promise<void>;
  cancelBooking: (bookingId: string, bookingData: any) => Promise<any>;
  fetchUserPoints: (userId: string) => Promise<void>;
  fetchUserVouchers: (userId: string) => Promise<void>;
  exchangeUserVoucher: (voucher: {
    discountValue: number;
    minOrderValue: number;
    image: string;
    exchangePoint: number;
    active: boolean;
    percentage: boolean;
  }) => Promise<UserVoucherExchangeResponse>;
}

export const useFieldStore = create<FieldState>((set) => ({
  popularFields: [],
  allFields: [],
  serverFields: [],
  mainSports: [],
  fieldsBySport: [],
  subCourts: [],
  timeSlots: [],
  loading: false,
  error: null,
  owner: null,
  reviews: [],
  selectedField: null,
  smallFieldBookings: [],
  totalBookings: 0,
  orderStatus: null,
  userOrders: null,
  userPoints: null,
  userVouchers: null,
  totalVouchers: 0,

  fetchPopularFields: async () => {
    set({ loading: true, error: null });
    try {
      const fields = await getPopularFields();
      set({ popularFields: fields, loading: false });
    } catch {
      set({
        popularFields: [],
        error: 'Failed to fetch popular fields',
        loading: false
      });
    }
  },

  fetchAllFields: async () => {
    set({ loading: true, error: null });
    try {
      const fields = await getAllFields();
      set({ allFields: fields, loading: false });
    } catch {
      set({
        allFields: [],
        error: 'Failed to fetch all fields',
        loading: false
      });
    }
  },

  fetchMainSports: async () => {
    set({ loading: true, error: null });
    try {
      const sports = await getMainSports();
      set({ mainSports: sports, loading: false });
    } catch {
      set({
        mainSports: [],
        error: 'Failed to fetch main sports',
        loading: false
      });
    }
  },

  fetchFieldsBySport: async (sport: string) => {
    set({ loading: true, error: null });
    try {
      const fields = await getFieldsBySport(sport);
      set({ fieldsBySport: fields, loading: false });
    } catch {
      set({
        fieldsBySport: [],
        error: `Failed to fetch ${sport} fields`,
        loading: false
      });
    }
  },

  fetchSubCourts: async (fieldId: number) => {
    set({ loading: true, error: null });
    try {
      const subCourts = await getSubCourts(fieldId);
      set({ subCourts, loading: false });
    } catch {
      set({
        subCourts: [],
        error: 'Failed to fetch sub courts',
        loading: false
      });
    }
  },

  fetchTimeSlots: async (fieldId: number, subCourtId: string) => {
    set({ loading: true, error: null });
    try {
      const timeSlots = await getTimeSlots(fieldId, subCourtId);
      set({ timeSlots, loading: false });
    } catch {
      set({
        timeSlots: [],
        error: 'Failed to fetch time slots',
        loading: false
      });
    }
  },

  fetchOwnerByField: async (fieldId: number) => {
    set({ loading: true, error: null });
    try {
      const owner = await getOwnerByField(fieldId);
      set({ owner: owner || null, loading: false });
    } catch {
      set({ owner: null, error: 'Failed to fetch owner', loading: false });
    }
  },

  fetchReviewsByField: async (fieldId: number) => {
    set({ loading: true, error: null });
    try {
      const reviews = await getReviewsByField(fieldId);
      set({ reviews, loading: false });
    } catch {
      set({ reviews: [], error: 'Failed to fetch reviews', loading: false });
    }
  },

  fetchServerFields: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await getAllFieldServer();
      set({ serverFields: data, loading: false });
    } catch {
      set({ serverFields: [], error: 'Failed to fetch server fields', loading: false });
    }
  },

  fetchFieldDetail: async (fieldId: string) => {
    set({ loading: true, error: null });
    try {
      const fieldDetail = await getFieldDetailServer(fieldId);
      set({ selectedField: fieldDetail, loading: false });
    } catch (error) {
      set({ selectedField: null, error: 'Failed to fetch field detail', loading: false });
      throw error;
    }
  },

  fetchSmallFieldBookings: async (smallFieldId: string) => {
    set({ loading: true, error: null });
    try {
      const response: BookingResponse = await getSmallFieldBookings(smallFieldId);
      set({ 
        smallFieldBookings: response.data.content, 
        totalBookings: response.data.totalElement,
        loading: false 
      });
    } catch (error) {
      set({ 
        smallFieldBookings: [], 
        totalBookings: 0,
        error: 'Failed to fetch small field bookings', 
        loading: false 
      });
      throw error;
    }
  },

  createBooking: async (bookingData: CreateBookingRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await createBooking(bookingData);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: 'Failed to create booking', loading: false });
      throw error;
    }
  },

  createPayment: async (paymentData: PaymentRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await createPayment(paymentData);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: 'Failed to create payment', loading: false });
      throw error;
    }
  },

  fetchOrderStatus: async (orderId: string) => {
    set({ loading: true, error: null });
    try {
      const status = await getOrderStatus(orderId);
      set({ orderStatus: status, loading: false });
    } catch (error) {
      set({ orderStatus: null, error: 'Failed to fetch order status', loading: false });
      throw error;
    }
  },

  fetchUserOrders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const orders = await getUserOrders(userId);
      set({ userOrders: orders, loading: false });
    } catch (error) {
      set({ userOrders: null, error: 'Failed to fetch user orders', loading: false });
      throw error;
    }
  },

  cancelBooking: async (bookingId: string, bookingData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await cancelBooking(bookingId, bookingData);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: 'Failed to cancel booking', loading: false });
      throw error;
    }
  },

  fetchUserPoints: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const points = await getUserPoints(userId);
      set({ userPoints: points.data, loading: false });
    } catch (error) {
      set({ userPoints: null, error: 'Failed to fetch user points', loading: false });
      throw error;
    }
  },

  fetchUserVouchers: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const vouchers = await getUserVouchers(userId);
      set({ 
        userVouchers: vouchers.data.content, 
        totalVouchers: vouchers.data.totalElement,
        loading: false 
      });
    } catch (error) {
      set({ userVouchers: null, totalVouchers: 0, error: 'Failed to fetch user vouchers', loading: false });
      throw error;
    }
  },

  exchangeUserVoucher: async (voucher: {
    discountValue: number;
    minOrderValue: number;
    image: string;
    exchangePoint: number;
    active: boolean;
    percentage: boolean;
  }) => {
    set({ loading: true, error: null });
    try {
      const response = await exchangeUserVoucher(voucher);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: 'Failed to exchange user voucher', loading: false });
      throw error;
    }
  },

}));
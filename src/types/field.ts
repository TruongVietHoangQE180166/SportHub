export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; 
  comment: string;
  date: string; 
  userAvatar?: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  businessLicense?: string;
  establishedYear?: number;
  description?: string;
  socialMedia?: {
    facebook?: string;
    zalo?: string;
    website?: string;
  };
}

export interface Field {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number; 
  reviewsList: Review[]; 
  price: string;
  normalPricePerHour?: number; // Add normal price per hour
  peakPricePerHour?: number;   // Add peak price per hour
  openingHours: string;
  startHour: number;
  endHour: number;
  image: string;
  description: string;
  sport: 'football' | 'badminton' | 'pickle';
  isPopular: boolean;
  subCourts: SubCourt[];
  owner: Owner; 
}

export interface SubCourt {
  id: string;
  name: string;
  description?: string;
  capacity?: string;
  available?: boolean;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
}

export interface MainSport {
  name: string;
  icon: string;
  description: string;
  courts: number;
  color: string;
}

// Updated interface for the field data from the server API to match the new structure
export interface ServerField {
  id: string;
  createdDate: string;
  fieldName: string;
  location: string;
  normalPricePerHour: number;
  peakPricePerHour: number;
  openTime: string;
  closeTime: string;
  description: string;
  typeFieldName: string;
  ownerName: string;
  typeFieldId: string;
  numberPhone: string;
  avatar?: string;
  images: string[];
  rateResponses: any[];
  smallFieldResponses: SmallField[];
  averageRating: number;
  totalBookings: number;
  available: boolean;
}

export interface SmallField {
  id: string;
  createdDate: string;
  smallFiledName: string; // Note: This appears to be a typo in the API ("Filed" instead of "Field")
  description: string;
  capacity: string;
  available: boolean;
  booked: boolean;
}

// Add the new booking interface
export interface FieldBooking {
  id: string;
  userId: string;
  fieldId: string;
  fieldName: string;
  smallField: SmallField;
  avatar: string;
  email: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createDate: string | null;
}

export interface BookingResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: FieldBooking[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

// New types for createBooking function
export interface CreateBookingRequest {
  smallFieldId: string;
  startTimes: string[];
}

export interface CreateBookingResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: FieldBooking[];
  success: boolean;
}

// New types for payment functionality
export interface PaymentRequest {
  bookingId: string[];
}

export interface PaymentResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    method: 'BANK' | 'CASH' | 'WALLET';
    qrCode: string;
    ordersId: string;
  };
  success: boolean;
}

// New types for user orders
export interface OrderBooking {
  id: string;
  userId: string;
  fieldId: string;
  fieldName: string;
  smallField: SmallField;
  avatar: string;
  email: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createDate: string | null;
}

export interface UserOrder {
  id: string;
  status: string;
  totalAmount: number;
  userId: string;
  email: string;
  booking: OrderBooking[];
  location: string;
}

export interface UserOrdersResponse {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: null;
  data: {
    content: UserOrder[];
    request: {
      page: number;
      size: number;
      sortRequest: {
        direction: string;
        field: string;
      };
    };
    totalElement: number;
  };
  success: boolean;
}

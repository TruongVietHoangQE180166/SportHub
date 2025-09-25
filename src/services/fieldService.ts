import { Field, MainSport, SubCourt, TimeSlot, Owner, Review, ServerField, FieldBooking, BookingResponse, CreateBookingRequest, CreateBookingResponse, PaymentRequest, PaymentResponse, UserOrdersResponse } from '../types/field';
import { allFields, popularFields, mainSports } from '../data/field';
import { api } from '../config/api.config';

export const getPopularFields = (): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(popularFields || []);
    }, 300);
  });
};

export const getAllFields = (): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allFields || []);
    }, 500);
  });
};

export const getMainSports = (): Promise<MainSport[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mainSports || []);
    }, 200);
  });
};

export const getFieldsBySport = (sport: string): Promise<Field[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredFields = allFields.filter(field => field.sport === sport);
      resolve(filteredFields || []);
    }, 400);
  });
};

export const getSubCourts = (fieldId: number): Promise<SubCourt[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.subCourts || []);
    }, 300);
  });
};

export const getTimeSlots = (fieldId: number, subCourtId: string): Promise<TimeSlot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      const subCourt = field?.subCourts.find(sc => sc.id === subCourtId);
      resolve(subCourt?.timeSlots || []);
    }, 250);
  });
};

export const getOwnerByField = (fieldId: number): Promise<Owner | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.owner);
    }, 200);
  });
};

export const getReviewsByField = (fieldId: number): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const field = allFields.find(f => f.id === fieldId);
      resolve(field?.reviewsList || []);
    }, 200);
  });
};

export const getAllFieldServer = async (): Promise<{ data: ServerField[]; total: number }> => {
  try {
    const response = await api.get('/api/field', {
      params: {
        page: 1,
        size: 10,
        field: 'createdDate',
        direction: 'desc',
      }
    });
    
    return {
      data: response.data.data.content || [],
      total: response.data.data.totalElement || 0
    };
  } catch (error) {
    console.error('Error fetching fields from server:', error);
    throw error;
  }
};

export const getFieldDetailServer = async (fieldId: string): Promise<ServerField> => {
  try {
    const response = await api.get('/api/field', {
      params: {
        fieldId: fieldId
      }
    });
    // Extract the field data from the content array
    if (response.data.data && response.data.data.content && response.data.data.content.length > 0) {
      return response.data.data.content[0];
    } else {
      throw new Error('No field data found for the given ID');
    }
  } catch (error) {
    console.error(`Error fetching field detail for ID ${fieldId}:`, error);
    throw error;
  }
};

export const getSmallFieldBookings = async (smallFieldId: string): Promise<BookingResponse> => {
  try {
    const response = await api.get<BookingResponse>('/api/booking/smallfield-or-field', {
      params: {
        page: 1,
        size: 1000,
        field: 'createdDate',
        direction: 'desc',
        smallFieldIdOrFieldId: smallFieldId,
      },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    // Filter the bookings to only include those for the requested small field
    const filteredContent = response.data.data.content.filter(booking => 
      booking.smallField && booking.smallField.id === smallFieldId
    );
    
    // Return the response with filtered content
    return {
      ...response.data,
      data: {
        ...response.data.data,
        content: filteredContent
      }
    };
  } catch (error) {
    console.error('Error fetching small field bookings for ID', smallFieldId, ':', error);
    throw error;
  }
};

export const createBooking = async (bookingData: CreateBookingRequest): Promise<CreateBookingResponse> => {
  try {
    const response = await api.post<CreateBookingResponse>('/api/booking', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await api.post<PaymentResponse>('/api/payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: string): Promise<any> => {
  try {
    const response = await api.get('/api/orders/status', {
      params: {
        orderId: orderId
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching order status for ID ${orderId}:`, error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<UserOrdersResponse> => {
  try {
    const response = await api.get<UserOrdersResponse>('/api/orders/user', {
      params: {
        page: 1,
        size: 1000,
        field: 'createdDate',
        direction: 'desc',
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string, bookingData: any): Promise<any> => {
  try {
    const response = await api.put<any>('/api/booking/{bookingId}', bookingData, {
      params: {
        bookingId: bookingId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

import axios from "./axios";

/* ---------------- TYPES ---------------- */

export interface Address {
  line1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface PricingSnapshot {
  currency: string;
  basePrice: number;
  priceUnit: string;
  tax:number;
  minHours: number;
  totalHours: number;
  quotedSubtotal: number;
  discount: number;
  totalPayable: number;
  platformCommission: number;
  providerShare: number;
}

export interface Booking {
  _id: string;
  customerId: string;
  providerId: {
    _id: string;
    name: string;
    email: string;
  };
  serviceId: {
    _id: string;
    title: string;
    basePrice: number;
    priceUnit: string;
  };
  categoryId: string | null;
  status: string;
  scheduledAt: string;
  durationHours: number;
  serviceAddress: Address;
  pricingSnapshot: PricingSnapshot;
  notes?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ---------------- CREATE BOOKING ---------------- */

export interface BookingData {
  serviceId: string;
  scheduledAt: string;
  durationHours: number;
  address: Address;
  notes?: string;
  specialInstructions?: string;
}

export interface BookingResponse {
  message: string;
  booking: Booking;
}

/* ---------------- PAYMENT ---------------- */

export interface PaymentIntentResponse {
  message: string;
  clientSecret: string;
  paymentIntentId: string;
  transactionId: string;
}

export interface SyncPaymentResponse {
  message: string;
  booking: Booking;
}

/* ---------------- GET BOOKINGS ---------------- */

export interface GetBookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: Pagination;
}

/* ---------------- API ---------------- */

export const bookingApi = {
  /* Create booking */
  createBooking: async (data: BookingData): Promise<BookingResponse> => {
    const response = await axios.post("/bookings", data);
    return response.data;
  },

  /* Create Stripe payment intent */
  createPaymentIntent: async (
    bookingId: string
  ): Promise<PaymentIntentResponse> => {
    const response = await axios.post(
      `/payments/bookings/${bookingId}/create-intent`,
      { bookingId }
    );
    return response.data;
  },

  /* Sync payment after Stripe success */
  syncPayment: async (
    paymentIntentId: string
  ): Promise<SyncPaymentResponse> => {
    const response = await axios.post("/sync-payment", {
      paymentIntentId,
    });
    return response.data;
  },

  /* ✅ GET MY BOOKINGS */
  getMyBookings: async (
    page = 1,
    limit = 20
  ): Promise<GetBookingsResponse> => {
    const response = await axios.get("/bookings", {
      params: { page, limit },
    });
    return response.data;
  },

  cancelBooking : async (bookingId : string)=> {
    const response = await axios.post("/cancelBooking",{
      "bookingId" : bookingId
    })
    return response;
  },

  getThreadId : async (bookingId : string)=>{

      const response = await axios.post("/chat/threads",{
        bookingId
      })

      return response.data
  }

};

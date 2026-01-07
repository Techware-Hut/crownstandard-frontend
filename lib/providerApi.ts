import axios from "./axios";

/* ======================================================
   DASHBOARD TYPES
====================================================== */

export interface ProviderDashboardBooking {
  _id: string;
  status: string;
  scheduledAt: string;
  durationHours: number;

  serviceId: {
    title: string;
  };

  customerId: {
    name: string;
  };

  serviceAddress: {
    line1: string;
    city: string;
    state: string;
    country: string;
  };

  pricingSnapshot: {
    totalPayable: number;
    currency: string;
  };
}

export interface ProviderDashboardResponse {
  success: boolean;
  data: {
    activeServices: number;
    activeBookings: number;
    monthlyEarnings: number;
    providerShare: number;
    tips: number;
    averageRate: number;
    completedThisMonth: number;
    recentBookings: ProviderDashboardBooking[];
  };
}

/* ======================================================
   SERVICE TYPES
====================================================== */

export interface ProviderService {
  _id: string;
  providerId: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  priceUnit: string;
  minHours: number;
  includes: string[];
  exclusions: string[];
  media: string[];
  ratingSummary?: {
    avg: number;
    count: number;
  };
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderServicesResponse {
  success: boolean;
  data: ProviderService[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateServiceData {
  title: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  minHours: number;
  categoryId: string;
  includes: string[];
  exclusions: string[];
}

export interface CreateServiceResponse {
  success: boolean;
  data: ProviderService;
  message: string;
}


export interface ProviderBookingsResponse {
  success: boolean;
  data: any[];
  pagination?: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

//earning

/* ======================================================
   EARNINGS TYPES
====================================================== */

export interface EarningsData {
  _id: {
    year: number;
    week?: number;
    month?: number;
  };
  earnings: number;
  tips: number;
  bookings: number;
}

export interface EarningsResponse {
  success: boolean;
  data: EarningsData[];
  period: string;
}


/* ======================================================
   API
====================================================== */

export const providerApi = {
  /* -------- Dashboard -------- */
  getDashboard: async (): Promise<ProviderDashboardResponse> => {
    const res = await axios.get("/provider/dashboard");
    return res.data;
  },

  /* -------- My Services -------- */
getMyServices: async (): Promise<ProviderServicesResponse> => {
  const res = await axios.get("/service/my");
  return res.data;
},

createService: async (data: CreateServiceData): Promise<CreateServiceResponse> => {
  const res = await axios.post("/service", data);
  return res.data;
},
getProviderBookings: async (): Promise<ProviderBookingsResponse> => {
  const res = await axios.get("/provider/bookings");
  return res.data;
},

// Add to providerApi object in lib/providerApi.ts

acceptBooking: async (bookingId: string): Promise<BookingActionResponse> => {
  const res = await axios.post(`/bookings/${bookingId}/accept`);
  return res.data;
},

verifyOtp: async (bookingId: string, otp: string): Promise<BookingActionResponse> => {
  const res = await axios.post(`/bookings/${bookingId}/verify-otp`, { otp });
  return res.data;
},

completeBooking: async (bookingId: string): Promise<BookingActionResponse> => {
  const res = await axios.post(`/bookings/${bookingId}/complete`);
  return res.data;
},


getEarnings: async (period: "weekly" | "monthly" | "yearly"): Promise<EarningsResponse> => {
  const res = await axios.get(`/provider/earnings?period=${period}`);
  return res.data;
},



};




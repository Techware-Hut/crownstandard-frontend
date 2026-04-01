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

export interface ProviderStripeDashboardResponse{
  url : string
}

/* ======================================================
   SERVICE TYPES
====================================================== */

export interface ProviderAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

// Backward-compatible alias for older imports/usages.
export type address = ProviderAddress;

export interface ProviderProfile {
  address?: ProviderAddress;
  name?: string;
  phone?: string;
  email?: string;
  photo? : string;
}

export interface StripeConnectStatus {
  hasAccount: boolean;
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  onboardingComplete?: boolean;
}

export interface StripeConnectStatusResponse {
  success?: boolean;
  data?: StripeConnectStatus;
  hasAccount?: boolean;
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  onboardingComplete?: boolean;
}

export interface StripeOnboardingLinkResponse {
  success?: boolean;
  data?: {
    url?: string;
  };
  url?: string;
}

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

export interface UpdateServiceData {
  title?: string;
  description?: string;
  basePrice?: number;
  priceUnit?: string;
  minHours?: number;
  categoryId?: string;
  includes?: string[];
  exclusions?: string[];
  isActive?: boolean;
  isVisible?: boolean;
}

export interface CreateServiceResponse {
  success: boolean;
  data: ProviderService;
  message: string;
}

export interface ProviderBookingsResponse {
  success: boolean;
  data: ProviderBooking[];
  pagination?: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface ProviderBooking {
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
    city: string;
    state: string;
  };
  pricingSnapshot: {
    currency: string;
    providerShare: number;
  };
}

export interface BookingActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
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

  getStripeDashboard : async (): Promise<ProviderStripeDashboardResponse> => {

    const res = await axios.get("/provider/stripe/loginLink")

    return res.data
    
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

  updateService: async (serviceId: string, data: UpdateServiceData) => {
    const res = await axios.patch(`/service/${serviceId}`, data);
    return res.data;
  },

  getAvailibility : async ()=>{

    const res = await axios.get(`/provider/availability`)
    console.log(res)

  },

  updateAvailibility : async (data : any)=>{

    const res = await axios.patch("/provider/update-availability", data)
    console.log(res)
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

  getProfileDetails: async (): Promise<ProviderProfile> => {
    const res = await axios.get(`/provider/profile`);
    return res.data;
  },

  updateProfileDetails: async (data: ProviderProfile) => {

    const res = await axios.post(`provider/update`, data);

    return res.data;
  },

  updateProfilePhoto: async (imageFile : any)=>{

     try {
    // 1. Create FormData
    const formData = new FormData();
    formData.append("file", imageFile); // field name must match backend

    // 2. Send POST request
    const res = await axios.post("provider/changephoto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


  } catch (err) {
    console.error("Upload failed:", err);
  }
    
   
  },

  getStripeConnectStatus: async (): Promise<StripeConnectStatusResponse> => {
    const res = await axios.get("/provider/stripe/account/status");
    return res.data;
  },

  createStripeConnectAccount: async (name : string, email : string, country : string) => {
    const res = await axios.post("/provider/stripe/account", {
      name: name,
      email : email,
      country :  country
    });
    return res.data;
  },

  createStripeOnboardingLink: async (): Promise<StripeOnboardingLinkResponse> => {
    const res = await axios.post("/provider/stripe/account/onboarding");
    return res.data;
  },
};

import axios from "./axios";

/* ---------------- TYPES ---------------- */

export interface DashboardBooking {
  _id: string;
  serviceId: {
    title: string;
  };
  serviceAddress: {
    city: string;
    state: string;
  };
  scheduledAt: string;
  durationHours: number;
  pricingSnapshot: {
    totalPayable: number;
    currency: string;
  };
}

export interface CustomerAddress {
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

export interface CustomerProfile {
  address?: CustomerAddress;
  name?: string;
  phone?: string;
  email?: string;
  photo? : string;
}

export interface CustomerDashboardResponse {
  success: boolean;
  data: {
    totalBookings: number;
    completedServices: number;
    totalMoneySpent: number;
    favouriteProviders: number;
    recentBookings: DashboardBooking[];
  };
}

/* ---------------- API ---------------- */

export const customerApi = {
  getDashboard: async (): Promise<CustomerDashboardResponse> => {
    const res = await axios.get("/customer/dashboard");
    return res.data;
  },

  getProfileDetails: async (): Promise<CustomerProfile> => {
    const res = await axios.get(`/customer/profile`);
    return res.data;
  },

  updateProfileDetails: async (data: CustomerProfile) => {

    const res = await axios.patch(`/customer/profile-update`, data);
    return res.data;
  },

  
  updateProfilePhoto: async (imageFile : any)=>{
  
       try {
      // 1. Create FormData
      const formData = new FormData();
      formData.append("file", imageFile); // field name must match backend
  
      // 2. Send POST request
      const res = await axios.post("customer/changephoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
  
    } catch (err) {
      console.error("Upload failed:", err);
    }
      
     
    },

};

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
  }
};

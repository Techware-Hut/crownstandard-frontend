export interface Booking {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  price: string;
  image: string;
}

export interface BookingCus {
  id: string;
  serviceName: string;
  price: number;
  currency: string;
  time: string;
  duration: string;
  address: string;
  provider: string;
  instruction: string;
  status: "Pending" | "Accepted" | "Cancelled" | "Completed";
  paymentStatus: "Pending" | "succeeded" | "Refunded";
  cancelFee?: number;
  pricingSnapshot?: {
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
  };
}


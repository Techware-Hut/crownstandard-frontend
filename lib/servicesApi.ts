// lib/servicesApi.ts
import axios from './axios';

export interface ServiceFilters {
  lat?: number;
  lng?: number;
  radius?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ServiceResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: GroupedProvider[] | FlatService[];
}

export interface GroupedProvider {
  _id: string;
  name: string;
  profilePhoto: string;
  distance: number;
  services: Service[];
}

export interface Service {
  _id: string;
  title: string;
  basePrice: number;
  currency: string;
  priceUnit: string;
  media: string[];
  ratingSummary: {
    avg: number;
    count: number;
  };
}

export interface FlatService extends Service {
  slug?: string;
  description?: string;
  categoryId?: string;
  createdAt?: string;
  distanceKm?: number | null;
  provider?: {
    _id: string;
    name: string;
    email?: string;
    serviceAddress?: {
      line1?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
}

export interface SingleServiceResponse {
  success: boolean;
  data: {
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
    ratingSummary: {
      avg: number;
      count: number;
    };
    createdAt: string;
    provider: {
      _id: string;
      name: string;
      providerProfile: {
        approvalStatus?: string;
      };
    };
  };
}

export const servicesApi = {
  // Get all services
  getServices: async (filters?: ServiceFilters): Promise<ServiceResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.lat) params.append('lat', filters.lat.toString());
    if (filters?.lng) params.append('lng', filters.lng.toString());
    if (filters?.radius) params.append('radius', filters.radius.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(`/services?${params.toString()}`);
    return response.data;
  },

  // Get single service by ID
  getServiceById: async (id: string): Promise<SingleServiceResponse> => {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  }

};

     

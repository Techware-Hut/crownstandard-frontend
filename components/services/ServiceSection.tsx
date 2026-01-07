"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, Plus } from "lucide-react";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import Link from "next/link";
import { providerApi } from "@/lib/providerApi";

type ServiceUI = {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: string;
  image: string;
  isActive: boolean;
};

export default function ServiceSection() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<ServiceUI[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await providerApi.getMyServices();
      
      const mappedServices: ServiceUI[] = res.data.map((service) => ({
        id: service._id,
        title: service.title,
        category: "Service",
        price: `${service.currency} ${service.basePrice}/${service.priceUnit.replace('_', ' ')}`,
        rating: service.ratingSummary?.count && service.ratingSummary.count > 0 
          ? `${service.ratingSummary.avg.toFixed(1)} (${service.ratingSummary.count})`
          : "No reviews",
        image: service.media?.[0] || "/ServiceCleaning.png",
        isActive: service.isActive,
      }));

      setServices(mappedServices);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleServiceCreated = () => {
    loadServices(); // Refresh the services list
    setOpen(false);
  };

  return (
    <div className="mt-8">
      <div className="sm:flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
          <p className="text-sm text-gray-500">Manage your service offerings</p>
        </div>

        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter By
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Add Service
          </button>
          <Link
            href="/provider/dashboard/manage-service"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="bg-[#F3F1ED] p-2 py-4 sm:p-6 rounded-xl min-h-[250px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 bg-white shadow-sm rounded-2xl hover:shadow-md"
              >
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-gray-900">{service.title}</p>
                    <p className="text-sm text-gray-500">{service.category}</p>
                    <p className="text-xs text-gray-400">{service.rating}</p>
                    <div className="text-sm font-semibold text-gray-900">
                      {service.price}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full w-fit ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium text-gray-700">
              No services created yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first service to start receiving bookings
            </p>
            <button 
              onClick={() => setOpen(true)}
              className="mt-5 px-6 py-2 text-sm font-medium text-white bg-[#B28B32] rounded-full hover:bg-[#9A7629]"
            >
              Create Your First Service
            </button>
          </div>
        )}
      </div>

      <CreateServiceModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleServiceCreated}
      />
    </div>
  );
}

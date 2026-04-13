"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, Plus, PencilLine } from "lucide-react";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import EditServiceModal from "@/components/modals/EditServiceModal";
import Link from "next/link";
import { providerApi, ProviderService } from "@/lib/providerApi";

export default function ServiceSection() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<ProviderService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ProviderService | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await providerApi.getMyServices();
      
      setServices(res.data);
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

  const handleEditOpen = (service: ProviderService) => {
    setSelectedService(service);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedService(null);
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
            {services.map((service) => {
              const ratingLabel = service.ratingSummary?.count && service.ratingSummary.count > 0
                ? `${service.ratingSummary.avg.toFixed(1)} (${service.ratingSummary.count})`
                : "No reviews";
              const priceLabel = `${service.currency} ${service.basePrice}/${service.priceUnit.replace('_', ' ')}`;
              const imageSrc = service.media?.[0] || "/ServiceCleaning.png";

              return (
                <div
                  key={service._id}
                  className="p-4 bg-white shadow-sm rounded-2xl hover:shadow-md"
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                      <img
                        src={imageSrc}
                        alt={service.title}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-gray-900">{service.title}</p>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="text-xs text-gray-400">{ratingLabel}</p>
                      <div className="text-sm font-semibold text-gray-900">
                        {priceLabel}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full w-fit ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleEditOpen(service)}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 hover:text-amber-800"
                      aria-label={`Edit ${service.title}`}
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
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

      <EditServiceModal
        open={editOpen}
        service={selectedService}
        onClose={handleEditClose}
        onSubmit={loadServices}
      />
    </div>
  );
}

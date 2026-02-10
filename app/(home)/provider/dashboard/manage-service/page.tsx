"use client";

import { HandCoins, Pencil, Plus } from "lucide-react";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import { useEffect, useState } from "react";
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

export default function ManageServicePage() {

    const [open, setOpen] = useState(false);
    const [services, setServices] = useState<ServiceUI[]>([]);
    const [loading, setLoading] = useState(true);


    const loadServices = async () => {
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
      }


    useEffect(()=>{
        loadServices();
    },[])

    return (
        <main className="relative min-h-screen bg-white pt-6 md:pt-8 lg:pt-16 ">
            <div className="relative z-10 container 3xl:max-w-[1280px]">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">My Services</h1>

                </header>

                {/* Hourly Rate Section */}
                <section className="p-6 text-white  bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-[#b9903c]">
                                <HandCoins className="w-6 h-6 text-[#b9903c]" /> Hourly Rate
                            </h3>
                            <p className="text-md text-gray-400">
                                Set your hourly cleaning rate (minimum $25.00/hour)
                            </p>
                            <p className="mt-3 text-2xl font-semibold">$25.00/hour</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 border rounded-full hover:bg-gray-700">
                            <Pencil className="w-4 h-4" /> Edit Rate
                        </button>
                    </div>
                </section>

                {/* Specialties Section */}
                <section className="section">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                Specialties & Surcharges
                            </h2>
                            <p className="text-sm text-gray-500">
                                List your specialized skills and set surcharges for premium services
                            </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full hover:bg-gray-100">
                            <Plus className="w-4 h-4" /> Add Speciality
                        </button>
                    </div>

                    <div className="p-10 text-center bg-[#F6F4EF] rounded-xl">
                        <p className="font-medium text-gray-700">No specialties added yet</p>
                        <p className="mt-1 text-sm text-gray-500">
                            Add specialized skills to charge premium rates
                        </p>
                    </div>
                </section>

                {/* Manage Services Section */}
                <section className="pb-24">
                    <div className="mb-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            Manage Your Services
                        </h2>
                        <p className="text-sm text-gray-500">
                            Create and manage your cleaning service offerings
                        </p>
                    </div>

                    <div className="p-10 text-center bg-[#F6F4EF] rounded-xl">

                    {services.length === 0?
                        <>
                        <p className="font-medium text-gray-700">No services created yet</p>
                        <p className="mt-1 text-sm text-gray-500">
                            Create your first cleaning service to start receiving bookings
                        </p>
                        <button
                            onClick={() => setOpen(true)}
                            className="px-6 py-3 mt-5 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-[#111827]">
                            Create Your First Service
                        </button>
                        </>
              
                    :
                    
                    
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
                    }

                        <CreateServiceModal
                            open={open}
                            onClose={() => setOpen(false)}
                            onSubmit={(data) => console.log("New Service Data:", data)}
                        />
                    </div>
                </section>
            </div>

            <div className="absolute bottom-0 w-full h-64 bg-gray-900" />
        </main>
    );
}

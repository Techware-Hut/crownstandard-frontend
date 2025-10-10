"use client";

import Image from "next/image";
import {
    Calendar,
    Star,
    DollarSign,
    Heart,
    ArrowRight,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard"
import ActionCard from "@/components/dashboard/ActionCard"


type Booking = {
    id: string;
    title: string;
    type: string;
    location: string;
    datetime: string;
    price: string;
    image: string;
};

const bookings: Booking[] = [
    {
      id: "1",
      title: "Deluxe Apartment Cleaning",
      type: "Residential",
      location: "New York, NY",
      datetime: "20.05.2025 , 4:00p.m - 6:00p.m",
      price: "$30",
      image: "/ServiceCleaning.png", // place an image in /public/ServiceCleaning.png
    },
    {
      id: "2",
      title: "Deluxe Apartment Cleaning",
      type: "Residential",
      location: "New York, NY",
      datetime: "20.05.2025 , 4:00p.m - 6:00p.m",
      price: "$30",
      image: "/ServiceCleaning.png", // place an image in /public/ServiceCleaning.png
    },
];


export default function DashboardPage() {
    return (
        <main className="pt-6 md:pt-8 lg:pt-16 relative min-h-screen bg-white">
            <div className="relative z-10 container 3xl:max-w-[1280px]">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                        My Dashboard
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Here’s an overview of your cleaning services
                    </p>
                </header>

                {/* Top stats */}
                <section className="grid grid-cols-1 gap-3 mb-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Bookings"
                        value="0"
                        subtitle="All time bookings"
                        icon={<Calendar className="w-10 h-10 text-[#b9903c]" />}
                    />
                    <StatCard
                        title="Completed Services"
                        value="0"
                        subtitle="Successfully completed"
                        icon={<Star className="w-10 h-10 text-[#b9903c]" />}
                    />
                    <StatCard
                        title="Total Money saved"
                        value="$0.00"
                        subtitle="Lifetime Saving"
                        icon={<DollarSign className="w-10 h-10 text-[#b9903c]" />}
                    />
                    <StatCard
                        title="Favourite Providers"
                        value="0"
                        subtitle="Saved for later"
                        icon={<Heart className="w-10 h-10 text-[#b9903c]" />}
                    />
                </section>

                {/* Quick actions */}
                <section className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ActionCard title="Book Service" subtitle="Find and book cleaning services" />
                    <ActionCard title="My Bookings" subtitle="Manage your appointments" />
                    <ActionCard title="Favourites" subtitle="Your saved providers" />
                    <ActionCard title="Messages" subtitle="Chat with service provider" />
                </section>

                {/* Recent bookings */}
                <section className="pb-0 section">
                    <div className="items-center justify-between mb-4 sm:flex">
                        <div>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Recent Bookings</h2>
                            <p className="text-sm text-gray-500">
                                Your latest cleaning service appointments
                            </p>
                        </div>
                        {bookings.length > 0 && (
                            <button className="px-4 py-2 text-sm text-gray-700 font-semibold bg-[#F3F1ED] rounded-full hover:bg-[#e0dad0] mt-2 sm:mt-0">
                                View All
                            </button>
                        )}
                    </div>

                    {/* Single booking row */}
                    <div className="bg-[#F3F1ED] p-2 py-4 sm:p-6 rounded-xl">
                        {bookings.length > 0 ? (
                            // Booking cards
                            bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="mb-2 overflow-hidden bg-white border shadow-sm rounded-2xl"
                                >
                                    <div className="flex sm:items-center gap-4 md:gap-5 md:px-5 p-4">
                                        <div className="relative w-16 h-20 sm:h-16 overflow-hidden ring-1 ring-gray-200">
                                            <Image
                                                src={booking.image}
                                                alt={booking.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="grid items-center flex-1 grid-cols-1 gap-1 sm:gap-2 md:grid-cols-5 md:gap-4">
                                            <div className="md:col-span-2">
                                                <p className="font-semibold leading-tight text-gray-900">
                                                    {booking.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">{booking.type}</p>
                                            </div>

                                            <p className="text-sm text-gray-600">{booking.location}</p>
                                            <p className="text-sm text-gray-600">{booking.datetime}</p>
                                            <p className="font-bold text-gray-900 justify-self-end">
                                                {booking.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Empty state
                            <div className="py-12 text-center border border-gray-200 border-dashed rounded-2xl">
                                <p className="mb-4 text-gray-500">
                                    No bookings yet. Ready to get started?
                                </p>
                                <button className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition rounded-lg bg-amber-600 hover:bg-amber-700">
                                    Book Your First Service
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Decorative bottom band */}
            <div className="absolute bottom-0 w-full h-64 bg-gray-900" />
        </main >
    );
}


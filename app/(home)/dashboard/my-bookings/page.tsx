"use client";

import BookingCard from "@/components/dashboard/bookings/BookingCard";
import { BookingCus } from "@/types/booking";

export default function MyBookingsPage() {
  const bookings:BookingCus[] = [
    {
      id: "b1",
      serviceName: "Haircut & Styling",
      price: 200,
      currency: "USD",
      time: "September 20th, 2025 at 10:00",
      duration: "1h minimum",
      address: "100 Elm St, Austin, TX 73301",
      provider: "Service Provider",
      instruction: "Ring the doorbell twice",
      status: "Pending",
      cancelFee: 30,
    },
    {
      id: "b2",
      serviceName: "Deep Tissue Massage",
      price: 200,
      currency: "USD",
      time: "September 22nd, 2025 at 14:00",
      duration: "1h minimum",
      address: "100 Elm St, Austin, TX 73301",
      provider: "Service Provider",
      instruction: "Ring the doorbell twice",
      status: "Confirmed",
    },
  ];

  return (
    <div className="min-h-screen px-6 pt-6 md:pt-8 lg:pt-16 pb-10 container 3xl:max-w-[1280px]">
      <h1 className="mb-1 text-2xl lg:text-3xl font-bold text-gray-900">
        Your Cleaning Service Bookings
      </h1>
      <p className="mb-8 text-gray-600">
        Manage your scheduled cleaning appointments.
      </p>

      {/* Bookings */}
      <div className="space-y-6">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}

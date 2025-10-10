"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import BookingCard from "./BookingCard";
import { Booking } from "@/types/booking";

const dummyBookings: Booking[] = [
  {
    id: "1",
    title: "Deluxe Apartment Cleaning",
    category: "Residential",
    location: "New York, NY",
    date: "20.05.2025",
    time: "4:00p.m - 6:00p.m",
    price: "$30",
    image: "/ServiceCleaning.png",
  },
];

export default function BookingSection() {
  const [bookings] = useState<Booking[]>(dummyBookings);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="sm:flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
          <p className="text-sm text-gray-500">
            Manage your appointments and booking requests
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter By
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
            View All
          </button>
        </div>
      </div>

      {/* Booking List / Empty State */}
      <div className="p-2 py-4 sm:p-6 bg-[#F6F4EF] rounded-xl min-h-[200px] flex flex-col items-center justify-center">
        {bookings.length > 0 ? (
          <div className="w-full space-y-4">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7h18M3 12h18m-9 5h9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              No bookings yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You’ll see your upcoming bookings here once customers request your services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

export default function AvailabilitySection() {
  const [immediateBooking, setImmediateBooking] = useState(false);

  return (
    <div className="mt-8 space-y-8">
      {/* Immediate Booking Notice */}
      <div className="sm:flex items-center justify-between bg-[#FFF7E8] border border-[#E2B44A]/50 rounded-xl p-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Available for immediate booking
          </h3>
          <p className="text-sm text-gray-600">
            Make yourself visible to customers for quick cleaning jobs.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Turn this on when you’re ready to accept immediate booking requests for today.
          </p>
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => setImmediateBooking(!immediateBooking)}
          className={`relative w-12 h-6 mt-3 sm:mt-0 flex items-center rounded-full shrink-0 transition-colors ${
            immediateBooking ? "bg-[#B28B32]" : "bg-gray-300"
          }`}
        >
          <span
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              immediateBooking ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Availability Management */}
      <div>
        <div className="sm:flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Availability Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage your cleaning service offerings
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border bg-white border-gray-300 rounded-full hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter By
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
              Save Availability
            </button>
          </div>
        </div>

        {/* Placeholder (empty state) */}
        <div className="p-2 py-4 sm:p-6 bg-[#F6F4EF] rounded-xl min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">
            Configure your weekly or specific date availability here.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            (Feature coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}

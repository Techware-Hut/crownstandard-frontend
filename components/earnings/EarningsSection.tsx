"use client";

import { useState } from "react";

export default function EarningsSection() {
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "year">("week");
  const hasEarnings = false; // Toggle to true later when you fetch real data

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Earnings Breakdown</h2>
        <p className="mt-1 text-sm text-gray-500">
          Detailed view of your earnings and commission structure.
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-3">
        {(["week", "month", "year"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-5 py-2 text-sm font-medium rounded-full border ${
              selectedRange === range
                ? "bg-[#111827] text-white border-[#111827]"
                : "text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Earnings Section */}
      <div className="p-2 py-4 sm:p-6 bg-[#F6F4EF] rounded-xl min-h-[200px] flex flex-col items-center justify-center text-center">
        {hasEarnings ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Earnings Summary
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Coming soon – chart and detailed breakdown here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              No Earnings Found for the selected timeframe.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Complete some bookings to see your earnings here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

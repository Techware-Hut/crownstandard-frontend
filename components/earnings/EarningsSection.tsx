"use client";

import { useState, useEffect } from "react";
import { providerApi, EarningsData } from "@/lib/providerApi";

export default function EarningsSection() {
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "year">("week");
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEarnings = async (period: "weekly" | "monthly" | "yearly") => {
    setLoading(true);
    try {
      const result = await providerApi.getEarnings(period);
      if (result.success) {
        setEarningsData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const periodMap = { week: "weekly", month: "monthly", year: "yearly" } as const;
    fetchEarnings(periodMap[selectedRange]);
  }, [selectedRange]);

  const hasEarnings = earningsData.length > 0;
  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);
  const totalTips = earningsData.reduce((sum, item) => sum + item.tips, 0);
  const totalBookings = earningsData.reduce((sum, item) => sum + item.bookings, 0);

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
        {loading ? (
          <p className="text-sm text-gray-600">Loading earnings...</p>
        ) : hasEarnings ? (
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)}ly Earnings Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tips</p>
                <p className="text-xl font-bold text-gray-900">${totalTips.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
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

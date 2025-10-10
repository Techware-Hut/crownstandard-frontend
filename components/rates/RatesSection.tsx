"use client";

import {
  DUMMY_SERVICE,
  NormalizedService,
  normalizeService,
  formatMoney,
  formatPriceUnit,
} from "@/types/service";

export default function RatesSection() {

  const services: NormalizedService[] =[normalizeService(DUMMY_SERVICE)];

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Hourly Rates</h2>
        <p className="mt-1 text-sm text-gray-500">
          Set competitive rates for your cleaning services. Crown Standard keeps{" "}
          <span className="font-medium text-gray-700">25% commission</span> on bookings,
          but you keep <span className="font-medium text-gray-700">100% of all tips!</span>
        </p>
      </div>

      {/* Rates Management Section */}
      <div className="p-6 bg-[#F6F4EF] rounded-xl">
        {/* Inner Summary Banner */}
        <div className="bg-[#111827] text-white rounded-lg p-4 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-sm md:text-base">
          <p>
            <span className="text-gray-200">Minimum rate:</span>{" "}
            <span className="text-[#E9B949] font-semibold">$25/hour</span>
          </p>
          <p>
            <span className="text-gray-200">Platform Fee:</span>{" "}
            <span className="text-[#E9B949] font-semibold">25%</span>
          </p>
          <p>
            <span className="text-gray-200">You keep:</span>{" "}
            <span className="text-[#E9B949] font-semibold">75% + 100% Tips!</span>
          </p>
        </div>

        {/* Service Rate List or Empty State */}
        <div className="mt-6">
          {services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-between gap-4 p-4 transition-shadow bg-white shadow-sm md:flex-row rounded-2xl hover:shadow-md"
                >
                  {/* Service Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.coverImageUrl}
                        alt={service.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.badge ?? service.category}
                      </p>
                      <p className="text-xs text-gray-400">
                        {service.location || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Rate Info */}
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-600">Current Rate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatMoney(
                        service.pricing.amount,
                        service.pricing.currency
                      )}{" "}
                      <span className="text-xs text-gray-500">
                        {formatPriceUnit(service.pricing.unit)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[120px]">
              <p className="text-sm text-gray-500">
                No Services found.. Create a service first to set rates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

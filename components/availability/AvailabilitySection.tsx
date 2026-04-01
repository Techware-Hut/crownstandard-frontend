"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import AvailabilityModal, {
  AvailabilitySlotInput, DAYS
} from "@/components/modals/AvailabilityModal";
import { providerApi } from "@/lib/providerApi";

type AvailabilitySlot = AvailabilitySlotInput & { id: string };

export default function AvailabilitySection() {
  const [immediateBooking, setImmediateBooking] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(
    []
  );

  const handleSaveAvailability = async (slot: AvailabilitySlotInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    const daysArray = slot.days.map((day)=> DAYS.indexOf(day))
    const data = {
      days : daysArray,
      time : `${slot.start} - ${slot.end}` 
    }
    providerApi.updateAvailibility(data)
    
    setAvailabilitySlots(() => [{ ...slot, id }]);
  };

  const handleRemoveSlot = (id: string) => {
    setAvailabilitySlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const loadSlots = async()=>{

     await providerApi.getAvailibility();

  }

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
            {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border bg-white border-gray-300 rounded-full hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter By
            </button> */}
            <button
              onClick={() => setAvailabilityOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800"
            >
              {availabilitySlots.length > 0
                ? "Edit Availability"
                : "Add Availability"}
            </button>
          </div>
        </div>

        {/* Placeholder (empty state) */}
        <div className="p-2 py-4 sm:p-6 bg-[#F6F4EF] rounded-xl min-h-[200px] flex flex-col items-center justify-center">
          {availabilitySlots.length === 0 ? (
            <>
              <p className="text-sm text-gray-500">
                Configure your weekly or specific date availability here.
              </p>
            </>
          ) : (
            <div className="w-full max-w-xl space-y-3">
              {availabilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E2B44A]/30"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {slot.days.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.start} - {slot.end}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AvailabilityModal
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
        onSave={handleSaveAvailability}
        initialValue={availabilitySlots[0] ?? null}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LabeledInput from "@/components/ui/LabeledInput";
import { bookingApi } from "@/lib/bookingApi";
import { formatMoney } from "@/types/service";

export default function ServiceBookingForm({ service }: any) {
  const pricing = service.pricing;
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(2);

  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [notes, setNotes] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const scheduledAt = useMemo(() => {
  if (!date || !time) return "";
  
  try {
    // Ensure proper time format with zero-padding (HH:MM)
    const [hours, minutes = "00"] = time.split(":");
    const timeFormatted = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    const dateTimeString = `${date}T${timeFormatted}:00`;
    const dateObj = new Date(dateTimeString);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date/time combination:', dateTimeString);
      return "";
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error creating date:', error);
    return "";
  }
}, [date, time]);



  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!scheduledAt) throw new Error("Select date & time");

      const bookingPayload = {
        serviceId: service.id,
        scheduledAt,
        durationHours: duration,
        address: {
          line1: addressLine1,
          city,
          state: stateValue,
          country: "Canada",
          postalCode,
        },
        notes,
        specialInstructions,
      };

      const bookingRes = await bookingApi.createBooking(bookingPayload);
      
      // Redirect to payment route
      router.push(`/payment/${bookingRes.booking._id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 bg-white border rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px]">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Booking Details</h2>

          <div className="grid gap-4 mt-6 md:grid-cols-3">
            <LabeledInput label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 border rounded-lg px-3"
              />
            </LabeledInput>

            <LabeledInput label="Time">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 border rounded-lg px-3"
              >
                <option value="">Select</option>
                {Array.from({ length: 10 }).map((_, i) => {
                  const h = 8 + i;
                  return (
                  <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
  {h}:00
</option>

                  );
                })}
              </select>
            </LabeledInput>

            <LabeledInput label="Duration (hrs)">
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-11 border rounded-lg px-3"
              />
            </LabeledInput>
          </div>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Address"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full h-11 border rounded-lg px-3"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 border rounded-lg px-3"
              />
              <input
                placeholder="State"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value)}
                className="h-11 border rounded-lg px-3"
              />
              <input
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-11 border rounded-lg px-3"
              />
            </div>
          </div>

          <textarea
            className="w-full mt-4 border rounded-lg p-3"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <textarea
            className="w-full mt-4 border rounded-lg p-3"
            placeholder="Special instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />

          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>

        <aside className="p-6 bg-[#F4F1EC]">
          <h3 className="text-xl font-bold mb-4">Summary</h3>

          <div className="flex justify-between text-sm">
            <span>
              {duration}h × {formatMoney(pricing.amount, pricing.currency)}
            </span>
            <span>
              {formatMoney(pricing.amount * duration, pricing.currency)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>
              Tax
            </span>
            <span>
              13%
            </span>
          </div>

          <div className="flex justify-between mt-2 font-semibold">
            <span>Total</span>
            <span>
              {formatMoney((pricing.amount * duration) + ((pricing.amount * duration) * (13/100)) , pricing.currency)}
            </span>
          </div>

          <button
            onClick={handleCreateBooking}
            disabled={loading}
            className="mt-6 w-full bg-[#BE8F2E] text-white py-3 rounded-xl"
          >
            {loading ? "Processing..." : "Create Booking"}
          </button>
        </aside>
      </div>
    </section>
  );
}

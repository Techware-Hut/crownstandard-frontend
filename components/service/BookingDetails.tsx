"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LabeledInput from "@/components/ui/LabeledInput";
import { bookingApi } from "@/lib/bookingApi";
import { formatMoney } from "@/types/service";


const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const tax : Record<string, number> = {
  "Alberta": 0.05,
  "British Columbia": 0.12,
  "Manitoba": 0.12,
  "New Brunswick": 0.15,
  "Newfoundland and Labrador": 0.15,
  "Northwest Territories": 0.05,
  "Nova Scotia": 0.15,
  "Nunavut": 0.05,
  "Ontario": 0.13,
  "Prince Edward Island": 0.15,
  "Quebec": 0.14975,
  "Saskatchewan": 0.11,
  "Yukon": 0.05
};


  const provinceMap :Record<string, string>= {
    A: "Newfoundland and Labrador",
    B: "Nova Scotia",
    C: "Prince Edward Island",
    E: "New Brunswick",
    G: "Quebec",
    H: "Quebec",
    J: "Quebec",
    K: "Ontario",
    L: "Ontario",
    M: "Ontario",
    N: "Ontario",
    P: "Ontario",
    R: "Manitoba",
    S: "Saskatchewan",
    T: "Alberta",
    V: "British Columbia",
    Y: "Yukon"
  };


export default function ServiceBookingForm({ service }: any) {
  const pricing = service.pricing;
  const router = useRouter();
  const approvalStatus = service?.providerApprovalStatus;
  const isProviderApproved =
    !approvalStatus || ["active", "approved"].includes(String(approvalStatus).toLowerCase());

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

      if (!isProviderApproved) {
        throw new Error("This provider is pending approval. Booking is not available yet.");
      }
      if (!scheduledAt) throw new Error("Select date & time");
      else if(!addressLine1) throw new Error("Please enter address");
      else if(!city) throw new Error("Please enter city")
      else if(!stateValue)throw new Error("Please enter state / province")
     else if(!postalCode)throw new Error("Please enter postal code")


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
      //console.log(err)
    } finally {
      setLoading(false);
    }
  };


function getProvinceFromPostalCode(postalCode :string) {
      if (!postalCode) return null;

      // Normalize input (remove spaces and uppercase)
      const code = postalCode.replace(/\s+/g, '').toUpperCase();

      const firstLetter = code[0];

        // Special handling for X (Nunavut & Northwest Territories)
  if (firstLetter === "X") {
    const fsa = code.substring(0, 3);

    const nunavutFSAs = ["X0A", "X0B", "X0C"];
    const nwtFSAs = ["X0E", "X0G", "X1A"];

    if (nunavutFSAs.includes(fsa)) return "Nunavut";
    if (nwtFSAs.includes(fsa)) return "Northwest Territories";

    return "Northwest Territories or Nunavut";
  }

  return provinceMap[firstLetter] || "";
}


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
              required
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
              {/* <input
                placeholder="State"
                value={stateValue}
                onChange={(e) => setStateValue(e.target.value)}
                className="h-11 border rounded-lg px-3"
              /> */}
              <select
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  className="h-11 border rounded-lg px-3"
                >
                  <option value="">Select State / Province</option>

                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
              </select>
              <input
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value)
                  setStateValue(getProvinceFromPostalCode(e.target.value) || "")

                }}
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

          {!isProviderApproved && (
            <p className="mt-4 text-sm text-amber-700">
              This provider is pending approval by the admin. Booking will be available once
              they are approved.
            </p>
          )}
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
              {(tax[stateValue] * 100 ) || 0}% 
            </span>
          </div>

          <div className="flex justify-between mt-2 font-semibold">
            <span>Total</span>
            <span>
              {formatMoney((pricing.amount * duration) + ((pricing.amount * duration) * (tax[stateValue] || 0)) , pricing.currency)}
            </span>
          </div>

          <button
            onClick={handleCreateBooking}
            disabled={loading || !isProviderApproved}
            className="mt-6 w-full bg-[#BE8F2E] text-white py-3 rounded-xl"
          >
            {loading ? "Processing..." : "Create Booking"}
          </button>
        </aside>
      </div>
    </section>
  );
}

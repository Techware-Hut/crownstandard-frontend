import { BookingCus } from "@/types/booking";
import { MapPin, CalendarDays, Clock, User, Info } from "lucide-react";

export default function BookingCard({ booking }: { booking: BookingCus }) {
  const isPending = booking.status === "Pending";

  return (
    <div
      className={`relative border rounded-xl p-6 bg-white shadow-sm ${
        isPending ? "border-amber-200 bg-[#FBF9F5]" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{booking.serviceName}</h2>
          <p className="text-sm text-gray-600">
            See what customers and other users have said about your services
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium  w-fit rounded-full ${
            isPending
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid gap-3 mt-4 text-sm text-gray-800 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#C5A04B]" />
          {booking.time}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C5A04B]" />
          {booking.duration}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C5A04B]" />
          {booking.address}
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#C5A04B]" />
          <span>
            Service Provider:{" "}
            <span className="font-semibold">{booking.provider}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 col-span-full">
          <Info className="w-4 h-4 text-[#C5A04B]" />
          <span>
            Special Instruction:{" "}
            <span className="font-semibold">{booking.instruction}</span>
          </span>
        </div>
      </div>

      {/* Footer */}
      {isPending && (
        <div className="flex flex-col gap-3 pt-4 mt-5 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
          <button className="px-4 py-2 text-sm font-semibold text-red-700 transition bg-red-100 rounded-full hover:bg-red-200">
            Cancel Booking (${(booking.cancelFee ?? 0).toFixed(2)} Fee)
          </button>
          <p className="text-sm text-red-600">
            Cancellation fee: (${(booking.cancelFee ?? 0).toFixed(2)} (15% of booking cost)
          </p>
        </div>
      )}
    </div>
  );
}

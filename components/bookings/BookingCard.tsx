import Image from "next/image";
import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 overflow-hidden rounded-md">
          <Image
            src={booking.image}
            alt={booking.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-semibold text-gray-900">{booking.title}</p>
          <p className="text-sm text-gray-500">{booking.category}</p>
        </div>
      </div>

      <div className="flex-col hidden text-sm text-right text-gray-600 md:flex">
        <span>{booking.location}</span>
        <span>{booking.date}, {booking.time}</span>
      </div>

      <div className="text-lg font-semibold text-gray-900">{booking.price}</div>
    </div>
  );
}

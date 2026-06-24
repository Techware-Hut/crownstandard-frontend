"use client";

import { useEffect, useState } from "react";
import BookingCard from "@/components/dashboard/bookings/BookingCard";
import { bookingApi } from "@/lib/bookingApi";
import { BookingCus } from "@/types/booking";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarX } from "lucide-react";
import Link from "next/link";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingCus[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBookings = async () => {
      try {

        if (!localStorage.getItem("user")) {
          router.push("/login")
          return;

        }

        const res = await bookingApi.getMyBookings();
        res.data.map((data) => {
          console.log(data.status)
        })

        const normalizeStatus = (status: string): "Pending" | "Accepted" | "Cancelled" | "Completed" => {
          switch (status) {
            case "pending_provider_accept":
            case "pending":
              return "Pending";
            case "accepted":
            case "confirmed":
              return "Accepted";
            case "cancelled":
            case "canceled":
              return "Cancelled";
            case "completed":
              return "Completed";
            default:
              return "Pending";
          }
        };

        const mapped: BookingCus[] = res.data.filter(data => data.status !== "pending_payment").map((b) => ({
          id: b._id,
          serviceName: b.serviceId.title,
          price: b.pricingSnapshot.totalPayable,
          currency: b.pricingSnapshot.currency,
          time: new Date(b.scheduledAt).toLocaleString(),
          duration: `${b.durationHours}h`,
          address: `${b.serviceAddress.line1}, ${b.serviceAddress.city}, ${b.serviceAddress.state}`,
          provider: b.providerId?.name ?? "Not assigned yet",
          instruction: b.specialInstructions || "—",
          status: normalizeStatus(b.status),
          paymentStatus: "succeeded",
          cancelFee: ((b.pricingSnapshot.totalPayable) + (b.pricingSnapshot.totalPayable * b.pricingSnapshot.tax)) * 0.15,
          pricingSnapshot: b.pricingSnapshot,
        }));

        setBookings(mapped);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);


  return (
    <div className="min-h-screen px-6 pt-6 md:pt-8 lg:pt-16 pb-10 container 3xl:max-w-[1280px]">
      <h1 className="mb-1 text-2xl lg:text-3xl font-bold text-gray-900">
        Your  Service Bookings
      </h1>
      <p className="mb-8 text-gray-600">
        Manage your scheduled appointments.
      </p>

      {loading && <div className="text-gray-500">Loading bookings...</div>}

      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <CalendarX className="h-8 w-8 text-amber-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900">
            No Bookings Yet
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            You haven't booked any cleaning services yet. Browse our available
            services and schedule your first appointment in just a few clicks.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Explore Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}

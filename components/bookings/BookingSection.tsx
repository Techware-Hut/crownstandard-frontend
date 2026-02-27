"use client";

import { useState, useEffect } from "react";
import { Filter, MessageCircle } from "lucide-react";
import { providerApi } from "@/lib/providerApi";
import { useRouter } from "next/navigation";

type BookingUI = {
  id: string;
  title: string;
  customer: string;
  location: string;
  datetime: string;
  price: string;
  status: string;
  rawStatus: string;
  image: string;
};

export default function BookingSection() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpModal, setOtpModal] = useState<{ open: boolean; bookingId: string }>({ open: false, bookingId: "" });
  const [otp, setOtp] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await providerApi.getProviderBookings();
      
      const mappedBookings: BookingUI[] = res.data.map((booking) => ({
        id: booking._id,
        title: booking.serviceId.title,
        customer: booking.customerId.name,
        location: `${booking.serviceAddress.city}, ${booking.serviceAddress.state}`,
        datetime: `${new Date(booking.scheduledAt).toLocaleDateString()} • ${booking.durationHours}h`,
        price: `${booking.pricingSnapshot.currency} ${booking.pricingSnapshot.providerShare}`,
        status: booking.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        rawStatus: booking.status,
        image: "/ServiceCleaning.png",
      }));

      setBookings(mappedBookings);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAccept = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await providerApi.acceptBooking(bookingId);
      loadBookings();
    } catch (err) {
      console.error("Failed to accept booking", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setActionLoading(otpModal.bookingId);
      await providerApi.verifyOtp(otpModal.bookingId, otp);
      setOtpModal({ open: false, bookingId: "" });
      setOtp("");
      loadBookings();
    } catch (err) {
      console.error("Failed to verify OTP", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await providerApi.completeBooking(bookingId);
      loadBookings();
    } catch (err) {
      console.error("Failed to complete booking", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getActionButton = (booking: BookingUI) => {
    if (booking.rawStatus === "pending_provider_accept") {
      return (
        <button
          onClick={() => handleAccept(booking.id)}
          disabled={actionLoading === booking.id}
          className="px-3 py-1 text-xs bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50"
        >
          {actionLoading === booking.id ? "..." : "Accept"}
        </button>
      );
    }
    
    if (booking.rawStatus === "accepted") {
      return (
        <button
          onClick={() => setOtpModal({ open: true, bookingId: booking.id })}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Verify OTP
        </button>
      );
    }

    if (booking.rawStatus === "in_progress") {
      return (
        <button
          onClick={() => handleComplete(booking.id)}
          disabled={actionLoading === booking.id}
          className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
        >
          {actionLoading === booking.id ? "..." : "Complete"}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="mt-8">
      <div className="sm:flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
          <p className="text-sm text-gray-500">Manage your appointments and booking requests</p>
        </div>

        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter By
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800">
            View All
          </button>
        </div>
      </div>

      <div className="p-2 py-4 sm:p-6 bg-[#F6F4EF] rounded-xl min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="w-full space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                    <img src={booking.image} alt={booking.title} className="object-cover w-full h-full" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.title}</p>
                      <p className="text-sm text-gray-500">{booking.customer}</p>
                    </div>
                    <p className="text-sm text-gray-600">{booking.location}</p>
                    <p className="text-sm text-gray-600">{booking.datetime}</p>
                    <p className="font-semibold text-gray-900">{booking.price}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status.includes('In Progress') 
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status.includes('Completed')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => 
                            //router.push("/conversation/" + booking.id)
                            console.log(booking.id)
                            }
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs text-white rounded-full bg-gray-900 hover:bg-gray-800"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat
                        </button>
                        {getActionButton(booking)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <h3 className="text-lg font-medium text-gray-700">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You'll see your upcoming bookings here once customers request your services.
            </p>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {otpModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setOtpModal({ open: false, bookingId: "" })}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || actionLoading === otpModal.bookingId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading === otpModal.bookingId ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

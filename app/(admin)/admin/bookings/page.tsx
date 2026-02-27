"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";

interface Booking {
  _id: string;
  customerId: { name: string; email: string };
  providerId: { name: string; email: string } | null;
  serviceId: { title: string };
  status: string;
  scheduledAt: string;
  durationHours: number;
  serviceAddress: {
    line1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  payment: {
    status: string;
    amount: number;
    currency: string;
    applicationFee: number;
    transferAmount: number;
    refundedAmount: number;
  };
  payout: { status: string };
  tipSummary: { hasTip: boolean; totalTip: number; currency: string };
  completionOtp: { code: string | null; verified: boolean };
  pricingSnapshot: {
    quotedSubtotal: number;
    discount: number;
    totalPayable: number;
    platformCommission: number;
    providerShare: number;
  };
  notes: string;
  specialInstructions: string;
  createdAt: string;
}

interface BookingStats {
  overview: {
    totalBookings: number;
    totalRevenue: number;
    avgBookingValue: number;
  };
  byStatus: { _id: string; count: number }[];
  monthly: {
    _id: { year: number; month: number };
    count: number;
    revenue: number;
  }[];
}

export default function AdminBookingsPage() {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [cancelModal, setCancelModal] = useState<{ show: boolean; id: string }>({
    show: false,
    id: "",
  });
  const [cancelReason, setCancelReason] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);


  const filteredBookings = useMemo(() => {
  if (!search.trim()) return bookings;

  const q = search.toLowerCase();

  return bookings.filter((b) => {
    return (
      b._id.toLowerCase().includes(q) ||
      b.customerId?.name?.toLowerCase().includes(q) ||
      b.customerId?.email?.toLowerCase().includes(q) ||
      b.providerId?.name?.toLowerCase().includes(q) ||
      b.serviceAddress?.city?.toLowerCase().includes(q) ||
      b.serviceAddress?.state?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q) ||
      b.payment?.status?.toLowerCase().includes(q)
    );
  });
}, [bookings, search]);


  /* ---------------- STATS API ---------------- */
  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/admin/bookings/stats`,
        { credentials: "include" } // <-- SAME AS CURL COOKIE AUTH
      );

      if (!res.ok) throw new Error();
      const json = await res.json();
      setStats(json.data);
    } catch {
      showToast("Failed to load booking stats", "error");
    }
  };

  /* ---------------- BOOKINGS API ---------------- */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/admin/bookings`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error();
      const json = await res.json();
      setBookings(json.data ?? []);
    } catch {
      showToast("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const cancelBooking = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/admin/bookings/${cancelModal.id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: cancelReason }),
        }
      );

      if (!res.ok) throw new Error();
      showToast("Booking cancelled", "success");
      setCancelModal({ show: false, id: "" });
      setCancelReason("");
      fetchBookings();
      fetchStats();
    } catch {
      showToast("Cancel failed", "error");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();
      showToast("Status updated", "success");
      fetchBookings();
      fetchStats();
    } catch {
      showToast("Update failed", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Bookings</h2>

      {/* ---------------- STATS CARDS ---------------- */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat title="Total Bookings" value={stats.overview.totalBookings} />
            <Stat title="Total Revenue" value={`$${stats.overview.totalRevenue.toFixed(2)}`} />
            <Stat
              title="Avg Booking Value"
              value={`$${stats.overview.avgBookingValue.toFixed(2)}`}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Bookings by Status</h3>
            <div className="flex gap-2 flex-wrap">
              {stats.byStatus.map((s) => (
                <span
                  key={s._id}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  {s._id.replace(/_/g, " ")} : {s.count}
                </span>
              ))}
            </div>
          </div>


      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Search Bookings</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email, city, status..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
          />

          {/* <button
            onClick={() => {}}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Search
          </button> */}
        </div>
      </div>


        </>
      )}

      {/* ---------------- BOOKINGS TABLE ---------------- */}
  {/* Updated table to match other components style */}
<div className="bg-white shadow rounded-lg">
  <div className="px-6 py-4 border-b">
    <h3 className="text-lg font-medium">Bookings ({bookings.length})</h3>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredBookings.map((b) => (
          <tr key={b._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">#{b._id.slice(-6)}</div>
                <div className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-400">
                  {b.serviceAddress.city}, {b.serviceAddress.state}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{b.customerId.name}</div>
                <div className="text-sm text-gray-500">{b.customerId.email}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {b.providerId ? (
                <div>
                  <div className="font-medium text-gray-900">{b.providerId.name}</div>
                  <div className="text-gray-500">{b.providerId.email}</div>
                </div>
              ) : (
                <span className="text-gray-400">No Provider</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{b.serviceId.title}</div>
          <div className="text-sm text-gray-500">
  {b.payment.currency} {b.pricingSnapshot.totalPayable}
</div>

                <div className="text-xs text-gray-400">
                  {b.durationHours}h duration
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div>
                <div className="font-medium text-gray-900">
                  {new Date(b.scheduledAt).toLocaleDateString()}
                </div>
                <div className="text-gray-500">
                  {new Date(b.scheduledAt).toLocaleTimeString()}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  b.payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                  b.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {b.payment.status}
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  {b.payment.currency} {b.payment.amount}
                </div>
                {b.tipSummary.hasTip && (
                  <div className="text-xs text-green-600">
                    +{b.tipSummary.currency} {b.tipSummary.totalTip} tip
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  b.status === 'completed' ? 'bg-green-100 text-green-800' :
                  b.status === 'pending_provider_accept' ? 'bg-yellow-100 text-yellow-800' :
                  b.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  b.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                  b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {b.status.replace(/_/g, ' ')}
                </span>
           {(b as any).disputeStatus !== 'none' && (
  <div className="text-xs text-red-600 mt-1">
    Dispute: {(b as any).disputeStatus}
  </div>
)}

              {b.completionOtp.verified && (
  <div className="text-xs text-green-600 mt-1">
    OTP Verified
  </div>
)}
{b.completionOtp.code && !b.completionOtp.verified && (
  <div className="text-xs text-blue-600 mt-1">
    OTP: {b.completionOtp.code}
  </div>
)}

              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  View Details
                </button>
                
                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <button
                    onClick={() => setCancelModal({ show: true, id: b._id })}
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
                
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(b._id, 'in_progress')}
                    className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    Start
                  </button>
                )}
                
                {b.status === 'in_progress' && (
                  <button
                    onClick={() => updateStatus(b._id, 'completed')}
                    className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    Complete
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* ---------------- BOOKING DETAILS MODAL ---------------- */}
      {selectedBooking && (
        <Modal onClose={() => setSelectedBooking(null)}>
          <BookingDetails booking={selectedBooking} />
        </Modal>
      )}

      {/* ---------------- CANCEL MODAL ---------------- */}
      {cancelModal.show && (
        <Modal onClose={() => setCancelModal({ show: false, id: "" })}>
          <h3 className="font-semibold mb-2">Cancel Booking</h3>
          <textarea
            className="w-full border p-2 mb-3"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <button
            onClick={cancelBooking}
            disabled={!cancelReason}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Confirm Cancel
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const Stat = ({ title, value }: { title: string; value: any }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Modal = ({ children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="float-right">✕</button>
      {children}
    </div>
  </div>
);

const BookingDetails = ({ booking }: { booking: Booking }) => (
  <div className="space-y-4 text-sm">
    <h3 className="text-lg font-semibold">Booking Details</h3>

    <section>
      <b>Payment</b>
      <p>Status: {booking.payment.status}</p>
      <p>Total: ${booking.payment.amount}</p>
      {/* <p>Platform Fee: ${booking.payment.applicationFee}</p>
      <p>Provider Share: ${booking.payment.transferAmount}</p> */}
      <p>Platform Fee: ${(booking.payment.amount * 0.1).toFixed(2) }</p>
      <p>Provider Share: ${(booking.payment.amount * 0.9).toFixed(2)}</p>
    </section>

    <section>
      <b>Pricing</b>
      <p>Subtotal: ${booking.pricingSnapshot.quotedSubtotal}</p>
      <p>Discount: ${booking.pricingSnapshot.discount}</p>
      <p>Total Payable: ${booking.pricingSnapshot.totalPayable}</p>
    </section>

    <section>
      <b>Address</b>
      <p>
        {booking.serviceAddress.line1}, {booking.serviceAddress.city},{" "}
        {booking.serviceAddress.state},{" "}
        {booking.serviceAddress.country} -{" "}
        {booking.serviceAddress.postalCode}
      </p>
    </section>

    <section>
      <b>Notes</b>
      <p>{booking.notes || "—"}</p>
      <p>{booking.specialInstructions || "—"}</p>
    </section>
  </div>
);

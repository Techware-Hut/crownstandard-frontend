"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Analytics {
  userGrowth: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
  bookingTrends: Array<{
    _id: { year: number; month: number };
    count: number;
    revenue: number;
  }>;
  topCategories: any[];
}

export default function DashboardAnalytics({ analytics }: { analytics: Analytics }) {
  const userGrowthData = analytics.userGrowth.map((u) => ({
    name: `${u._id.month}/${u._id.year}`,
    users: u.count,
  }));

  const bookingTrendData = analytics.bookingTrends.map((b) => ({
    name: `${b._id.month}/${b._id.year}`,
    bookings: b.count,
    revenue: b.revenue,
  }));

  return (
    <div className="space-y-8">
      {/* USER GROWTH */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>

        {userGrowthData.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* BOOKING TRENDS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>

        {bookingTrendData.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#22c55e" />
              <Bar dataKey="revenue" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

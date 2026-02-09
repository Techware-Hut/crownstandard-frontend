"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import DashboardAnalytics from "./DashboardAnalytics";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

interface DashboardStats {
  users: {
    total: number;
    active: number;
    pendingProviders: number;
    byRole: {
      customer: number;
      admin: number;
      provider: number;
    };
  };
  services: {
    total: number;
    active: number;
    pending: number;
  };
  bookings: {
    total: number;
    completed: number;
    pending: number;
  };
  revenue: {
    totalRevenue: number;
    platformRevenue: number;
    avgBookingValue: number;
  };
  recentActivity: {
    newUsers: number;
    newBookings: number;
  };
}

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

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard/stats`, {
          credentials: "include",
        }),
        fetch(`${API_BASE}/admin/dashboard/analytics`, {
          credentials: "include",
        }),
      ]);

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s.data);
      }

      if (analyticsRes.ok) {
        const a = await analyticsRes.json();
        setAnalytics(a.data);
      }
    } catch (err) {
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Welcome */}
      {user && (
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-lg font-semibold">Welcome back</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats?.users.total} sub={`Active ${stats?.users.active}`} />
        <DashboardCard title="Services" value={stats?.services.active} sub={`Total ${stats?.services.total}`} />
        <DashboardCard title="Bookings" value={stats?.bookings.total} sub={`Completed ${stats?.bookings.completed}`} />
        <DashboardCard title="Revenue" value={`CAD ${stats?.revenue.totalRevenue}`} sub={`Avg cad ${stats?.revenue.avgBookingValue}`} />
      </div>
      {/* RECENT ACTIVITY */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-2 gap-6">
          <ActivityStat label="New Users" value={stats?.recentActivity.newUsers} />
          <ActivityStat label="New Bookings" value={stats?.recentActivity.newBookings} />
        </div>
      </div>

      {/* ANALYTICS */}
      {analytics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>

          {/* User Growth */}
          <div className="mb-4">
            <p className="font-medium mb-2">User Growth</p>
            {analytics.userGrowth.map((u) => (
              <p key={`${u._id.year}-${u._id.month}`} className="text-sm text-gray-600">
                {u._id.month}/{u._id.year} → {u.count} users
              </p>
            ))}
          </div>

          {/* Booking Trends */}
          <div>
            <p className="font-medium mb-2">Booking Trends</p>
          {analytics && <DashboardAnalytics analytics={analytics} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DashboardCard({
  title,
  value,
  sub,
}: {
  title: string;
  value?: any;
  sub?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value ?? 0}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function RoleStat({
  label,
  value,
  color,
}: {
  label: string;
  value?: number;
  color: string;
}) {
  return (
    <div>
      <p className={`text-2xl font-bold text-${color}-600`}>{value ?? 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ActivityStat({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="text-xl font-bold">{value ?? 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

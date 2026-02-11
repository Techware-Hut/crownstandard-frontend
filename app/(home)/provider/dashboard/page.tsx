"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Star,
  DollarSign,
  Heart,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import ActionCard from "@/components/dashboard/ActionCard";
import BookingSection from "@/components/bookings/BookingSection";
import ServiceSection from "@/components/services/ServiceSection";
import AvailabilitySection from "@/components/availability/AvailabilitySection";
import RatesSection from "@/components/rates/RatesSection";
import EarningsSection from "@/components/earnings/EarningsSection";
import GpsTrackingSection from "@/components/gps/GpsTrackingSection";

import { providerApi, ProviderDashboardResponse } from "@/lib/providerApi";
import Cookies from "js-cookie";


/* ---------------- TYPES ---------------- */

type TabKey =
  | "overview"
  | "bookings"
  | "services"
  | "availability"
  | "rates"
  | "earnings"
  | "gps";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings" },
  { key: "services", label: "Services" },
  { key: "availability", label: "Availability" },
  { key: "rates", label: "Rates" },
  { key: "earnings", label: "Earnings" },
  { key: "gps", label: "GPS Tracking" },
];

/* ---------------- PAGE ---------------- */

export default function ProviderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading dashboard...
        </div>
      }
    >
      <ProviderDashboard />
    </Suspense>
  );
}

/* ---------------- DASHBOARD ---------------- */

function ProviderDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get("tab") as TabKey) || "overview";
  const [tab, setTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const currentTab = (searchParams.get("tab") as TabKey) || "overview";
    if (currentTab !== tab) setTab(currentTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="pt-6 md:pt-8 lg:pt-16 min-h-screen bg-white relative">
      <div className="container 3xl:max-w-[1280px] relative z-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your cleaning business
          </p>
        </header>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 mb-3">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  router.push(`/provider/dashboard?tab=${t.key}`, {
                    scroll: false,
                  });
                }}
                className={[
                  "px-5 py-2 rounded-md text-sm font-medium border transition",
                  active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-[#b9903c] text-white hover:bg-gray-900",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <hr className="mb-8" />

        {/* Content */}
        {tab === "overview" && <OverviewTab />}
        {tab === "bookings" && <BookingSection />}
        {tab === "services" && <ServiceSection />}
        {tab === "availability" && <AvailabilitySection />}
        {tab === "rates" && <RatesSection />}
        {tab === "earnings" && <EarningsSection />}
        {tab === "gps" && <GpsTrackingSection />}
      </div>

      {/* <div className="absolute bottom-0 w-full h-64 bg-gray-900" /> */}
    </main>
  );
}

/* ---------------- OVERVIEW TAB ---------------- */

function OverviewTab() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] =
    useState<ProviderDashboardResponse["data"] | null>(null);


    const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {

      const user = Cookies.get("user_role") === "provider" ? true : false;
      if(!user){
        router.push("/login")
        return;
      }


      try {
        const res = await providerApi.getDashboard();
 
        setDashboard(res.data);
      } catch (err) {
        console.error("Failed to load provider dashboard", err);
        router.push("/login")
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading overview...</div>;
  }

  if (!dashboard) {
    return (
      <div className="text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <>
      {/* KPI CARDS */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Active Services"
          value={dashboard.activeServices.toString()}
          subtitle="Service listings"
          icon={<Calendar className="w-10 h-10 text-[#b9903c]" />}
        />

        <StatCard
          title="Active Bookings"
          value={dashboard.activeBookings.toString()}
          subtitle="Confirmed & in progress"
          icon={<Star className="w-10 h-10 text-[#b9903c]" />}
        />

        <StatCard
          title="Monthly Earnings"
          value={`$${dashboard.monthlyEarnings.toFixed(2)}`}
          subtitle="Paid this month"
          icon={<DollarSign className="w-10 h-10 text-[#b9903c]" />}
        />

        <StatCard
          title="Average Rate"
          value={`$${dashboard.averageRate.toFixed(2)}`}
          subtitle="Per hour"
          icon={<Heart className="w-10 h-10 text-[#b9903c]" />}
        />
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <ActionCard
          title="Manage Services"
          subtitle="Add or edit services"
          href="/provider/dashboard?tab=services"
        />
        <ActionCard
          title="View Bookings"
          subtitle="Manage appointments"
          href="/provider/dashboard?tab=bookings"
        />
        <ActionCard
          title="Messages"
          subtitle="Chat with customers"
          href="/conversation"
        />
        <ActionCard
          title="Profile & Settings"
          subtitle="Update your profile"
          href="/provider/profile"
        />
      </section>

      {/* RECENT BOOKINGS */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Recent Bookings
        </h2>

        <div className="bg-[#F3F1ED] p-4 sm:p-6 rounded-xl">
          {dashboard.recentBookings.length > 0 ? (
            dashboard.recentBookings.map((b) => (
              <div
                key={b._id}
                className="mb-3 bg-white border rounded-2xl shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {b.serviceId.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Customer: {b.customerId.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {b.serviceAddress.line1},{" "}
                      {b.serviceAddress.city},{" "}
                      {b.serviceAddress.state}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    {new Date(b.scheduledAt).toLocaleDateString()}
                  </div>

                  <div className="font-bold text-gray-900">
                    ${b.pricingSnapshot.totalPayable}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border border-dashed rounded-xl">
              <p className="text-gray-500">
                No recent bookings yet
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

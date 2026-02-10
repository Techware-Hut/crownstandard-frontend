"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Calendar,
  Star,
  DollarSign,
  Heart,
  ArrowRight,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import ActionCard from "@/components/dashboard/ActionCard";
import { customerApi } from "@/lib/customerApi";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

type RecentBookingUI = {
  id: string;
  title: string;
  type: string;
  location: string;
  datetime: string;
  price: string;
  image: string;
};




export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedServices: 0,
    totalMoneySpent: 0,
    favouriteProviders: 0,
  });
  const [bookings, setBookings] = useState<RecentBookingUI[]>([]);
  const router = useRouter();



  const fetchDashboard = async () => {
    try {
      const myHeaders = new Headers();

      myHeaders.append("Cooke", "auth_token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTg0NmU1ZWQxN2MxOTgxMTJhNGU3Y2YiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NzAzODI3ODMsImV4cCI6MTc3MDk4NzU4M30.remP_U9EwvQLidjx51a3e-U-x9l49zOZT9oYU9aryKA")
      ;

      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
        credentials: "include"
      };

      const response = await fetch("http://localhost:4000/api/customer/dashboard", requestOptions);
      const result = await response.json();
      console.log(result);
      
      return result;
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      throw error;
    }
  }

  useEffect(() => {


    
  
    const loadDashboard = async () => {
  
      const user = Cookies.get("user_role") === "customer" ? true : false;
      if(!user){
        router.push("/login")
        return;
      }


      
   
      try {
        const res = await customerApi.getDashboard();

        // const res = await customerApi.getDashboardNew();
        

   

        const d = res.data;

        setStats({
          totalBookings: d.totalBookings,
          completedServices: d.completedServices,
          totalMoneySpent: d.totalMoneySpent,
          favouriteProviders: d.favouriteProviders,
        });

        const mappedBookings: RecentBookingUI[] = d.recentBookings.map(
          (b) => ({
            id: b._id,
            title: b.serviceId.title,
            type: "Cleaning Service",
            location: `${b.serviceAddress.city}, ${b.serviceAddress.state}`,
            datetime: `${new Date(b.scheduledAt).toLocaleDateString()} • ${
              b.durationHours
            }h`,
            price: `${b.pricingSnapshot.currency} ${b.pricingSnapshot.totalPayable}`,
            image: "/ServiceCleaning.png",
          })
        );

        setBookings(mappedBookings);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <main className="pt-6 md:pt-8 lg:pt-16 relative min-h-screen bg-white">
      <div className="relative z-10 container 3xl:max-w-[1280px]">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
            My Dashboard
          </h1>
          <p className="mt-1 text-gray-500">
            Here’s an overview of your cleaning services
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toString()}
            subtitle="All time bookings"
            icon={<Calendar className="w-10 h-10 text-[#b9903c]" />}
          />
          <StatCard
            title="Completed Services"
            value={stats.completedServices.toString()}
            subtitle="Successfully completed"
            icon={<Star className="w-10 h-10 text-[#b9903c]" />}
          />
          <StatCard
            title="Total Time Saved In Hours"
            value={`${stats.totalMoneySpent.toFixed(2)}`}
            // value="2"
            subtitle=""
            // icon={<DollarSign className="w-10 h-10 text-[#b9903c]" />}
            icon={<></>}
          />
          <StatCard
            title="Favourite Providers"
            value={stats.favouriteProviders.toString()}
            subtitle="Saved for later"
            icon={<Heart className="w-10 h-10 text-[#b9903c]" />}
          />
        </section>

        {/* Actions */}
<section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <ActionCard
    title="Book Service"
    subtitle="Find and book cleaning services"
    href="/services"
  />
  <ActionCard
    title="My Bookings"
    subtitle="Manage your appointments"
    href="/dashboard/my-bookings"
  />
  <ActionCard
    title="Favourites"
    subtitle="Your saved providers"
  />
  <ActionCard
    title="Messages"
    subtitle="Chat with service provider"
    href="/conversation"
  />
</section>


        {/* Recent bookings */}
        <section className="pb-0 section">
          <div className="items-center justify-between mb-4 sm:flex">
            <div>
              <h2 className="text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                Recent Bookings
              </h2>
              <p className="text-sm text-gray-500">
                Your latest cleaning service appointments
              </p>
            </div>
          </div>

          <div className="bg-[#F3F1ED] p-4 sm:p-6 rounded-xl">
            {loading ? (
              <p className="text-gray-500 text-center py-8">
                Loading dashboard…
              </p>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="mb-2 overflow-hidden bg-white border shadow-sm rounded-2xl"
                >
                  <div className="flex gap-4 p-4 md:px-5">
                    <div className="relative w-16 h-16 overflow-hidden ring-1 ring-gray-200">
                      <Image
                        src={booking.image}
                        alt={booking.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-5">
                      <div className="md:col-span-2">
                        <p className="font-semibold text-gray-900">
                          {booking.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.type}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600">
                        {booking.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.datetime}
                      </p>
                      <p className="font-bold text-gray-900 text-right">
                        {booking.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border border-dashed rounded-2xl">
                <p className="mb-4 text-gray-500">
                  No bookings yet. Ready to get started?
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white rounded-lg bg-amber-600 hover:bg-amber-700">
                  Book Your First Service
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 w-full h-64 bg-gray-900" />
    </main>
  );
}

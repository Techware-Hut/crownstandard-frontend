"use client";

import { useState } from "react";
import ProviderHeader from "@/components/provider/ProviderHeader";
import QuickMessage from "@/components/provider/QuickMessage";
import TabSwitcher from "@/components/provider/TabSwitcher";
import ServiceCard from "@/components/provider/ServiceCard";
import ReviewItem from "@/components/reviews/ReviewItem";


import { DUMMY_SERVICE, ID } from "@/types/service";

export default function ProviderProfilePage() {
  const [activeTab, setActiveTab] = useState<"services" | "reviews">("services");
  const services = [DUMMY_SERVICE, { ...DUMMY_SERVICE, id: "svc_002" as ID, name: "Move-out Deep Cleaning" }];
  const reviews = [
    {
      id: "1",
      name: "Marlin Doe",
      rating: 5.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "2",
      name: "Marlin Doe",
      rating: 4.5,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "3",
      name: "Marlin Doe",
      rating: 2.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "4",
      name: "Marlin Doe",
      rating: 3.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
  ];

  return (
    <div className="pt-6 md:pt-8 lg:pt-16 pb-10 container 3xl:max-w-[1280px]">
      <h1 className="mb-6 text-2xl lg:text-3xl font-bold">Provider Profile</h1>

      <ProviderHeader />
      <QuickMessage />

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      <hr className="mt-3" />

      {activeTab === "services" ? (
        <div className="grid gap-4 sm:gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F3F1ED] p-4 sm:p-6 mt-8 rounded-2xl">
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} {...review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

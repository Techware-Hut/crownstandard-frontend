// app/(home)/services/page.tsx
"use client";

import { useEffect, useState } from "react";
import BannerSection from "@/components/BannerSection";
import ServiceCard from "@/components/ServiceCard";
import ServiceCardSkeleton from "@/components/ServiceCardSkeleton";
import { FlatService, GroupedProvider, servicesApi } from "@/lib/servicesApi";
import Cookies from "js-cookie";

type UiService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge: string;
  provider: string;
};

type Coordinates = {
  lat: number;
  lng: number;
};

const LOCATION_STORAGE_KEY = "customer_location";
const DEFAULT_RADIUS_KM = 25;

const isGroupedProvider = (
  item: GroupedProvider | FlatService
): item is GroupedProvider => Array.isArray((item as GroupedProvider).services);

export default function ServicesPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(200);
  const [minRating, setMinRating] = useState("Any Rating");
  const [sortBy, setSortBy] = useState("Most Relevant");

  const [services, setServices] = useState<UiService[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<Coordinates | null>(null);
  const [locationReady, setLocationReady] = useState(false);


  const checkProvider = () => {
    const isProvider = Cookies.get("user_role") === "provider" ? true : false;
    setProvider(isProvider);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    checkProvider();

    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Coordinates;
        if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
          setCustomerLocation(parsed);
        }
      } catch (parseError) {
        console.error("Failed to parse stored customer location", parseError);
      }
    }

    setLocationReady(true);
  }, []);


  useEffect(() => {
    if (!locationReady) return;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await servicesApi.getServices({
          lat: customerLocation?.lat,
          lng: customerLocation?.lng,
          radius: customerLocation ? DEFAULT_RADIUS_KM : undefined,
          minPrice: 25,
          maxPrice: price,
          page: 1,
          limit: 10,
        });



        const mapped: UiService[] = (res.data ?? []).flatMap((item) => {
          if (isGroupedProvider(item)) {
            return item.services.map((service) => ({
              id: service._id,
              title: service.title,
              slug: service.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              description: "Professional service provided by a verified vendor.",
              price: service.basePrice,
              duration: service.priceUnit === "per_hour" ? "Per hour" : "Per service",
              location:
                typeof item.distance === "number"
                  ? `${item.distance.toFixed(1)} km away`
                  : item.name,
              rating: service.ratingSummary?.avg ?? 0,
              reviews: service.ratingSummary?.count ?? 0,
              imageUrl: service.media?.[0] || "/ServiceCleaning.png",
              badge: "Verified",
              provider: item.name,
            }));
          }

          return [
            {
              id: item._id,
              title: item.title,
              slug: (item.slug || item.title)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, ""),
              description: item.description || "Professional service provided by a verified vendor.",
              price: item.basePrice,
              duration: item.priceUnit === "per_hour" ? "Per hour" : "Per service",
              location:
                typeof item.distanceKm === "number"
                  ? `${item.distanceKm.toFixed(1)} km away`
                  : [
                      item.provider?.serviceAddress?.city,
                      item.provider?.serviceAddress?.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location unavailable",
              rating: item.ratingSummary?.avg ?? 0,
              reviews: item.ratingSummary?.count ?? 0,
              imageUrl: item.media?.[0] || "/ServiceCleaning.png",
              badge: "Verified",
              provider: item.provider?.name || "Unknown provider",
            },
          ];
        });

        setServices(mapped);
        setTotal(res.total);
      } catch (error) {
        console.error("Failed to fetch services", error);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [price, minRating, sortBy, customerLocation, locationReady]);

  const filtered = services
    .filter((s) => {
      const searchMatch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase());

      const ratingMatch =
        minRating === "Any Rating" ? true : s.rating >= Number(minRating);

      return searchMatch && ratingMatch;
    })
    .sort((a, b) => {
      if (sortBy === "Lowest Price") return a.price - b.price;
      if (sortBy === "Highest Price") return b.price - a.price;
      if (sortBy === "Top Rated") return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      <BannerSection
        title="Premium Cleaning Services"
        subtitle="Discover trusted professionals in your area."
        imageUrl="/GetStarted-banner.png"
        page="Services"
      />

      <div className="h-32 sm:h-40 lg:h-[200px] w-full bg-[#BB9239]" />

      <section className="relative z-10 container -mt-20">
        <div className="p-6 bg-white rounded-2xl shadow ring-1 ring-gray-200">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold">Search & Filter Services</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-sm border rounded-full"
            >
              {showFilters ? "Hide Filter" : "Show Filter"}
            </button>
          </div>


    
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services or providers…"
            className="w-[90%] px-4 py-2 mb-4 border rounded-lg"
          />

          <button onClick={()=> setSearch(search)} className="ml-5 bg-[#E4E3E8] p-2 rounded-lg">Search</button>
     

          {showFilters && (
            <div className="grid gap-4 md:grid-cols-3">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option>Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option>Most Relevant</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
                <option>Top Rated</option>
              </select>

              <div>
                <label className="block mb-1 text-sm">Max Hourly Price: ${price}</label>
                <input
                  type="range"
                  min={25}
                  max={200}
                  step={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500">No services found.</p>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Showing {filtered.length} of {total} services
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} provider={provider} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

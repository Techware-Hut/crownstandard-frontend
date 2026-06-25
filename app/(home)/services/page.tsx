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
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Search & Filter Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find trusted cleaning professionals near you.
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full border border-[#BB9239] px-5 py-2 text-sm font-medium text-[#BB9239] transition hover:bg-[#BB9239] hover:text-white"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Search */}
          <div className="p-6">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services or providers..."
                  className="h-12 w-full rounded-xl border border-gray-200 pl-12 pr-4 outline-none transition focus:border-[#BB9239]"
                />
              </div>

              <button
                onClick={() => setSearch(search)}
                className="h-12 rounded-xl bg-[#BB9239] px-6 font-medium text-white transition hover:opacity-90"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-6 grid gap-5 rounded-2xl bg-gray-50 p-5 md:grid-cols-3">
                {/* Rating */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Rating
                  </label>

                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 outline-none focus:border-[#BB9239]"
                  >
                    <option>Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sort By
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 outline-none focus:border-[#BB9239]"
                  >
                    <option>Most Relevant</option>
                    <option>Lowest Price</option>
                    <option>Highest Price</option>
                    <option>Top Rated</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Max Price
                    </label>

                    <span className="rounded-full bg-[#BB9239]/10 px-3 py-1 text-sm font-semibold text-[#BB9239]">
                      ${price}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={25}
                    max={200}
                    step={10}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-[#BB9239]"
                  />
                </div>
              </div>
            )}
          </div>
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
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#BB9239]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#BB9239]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                No Services Found
              </h3>

              <p className="mt-2 max-w-md text-gray-500">
                We couldn't find any services matching your search or filter criteria.
                Try adjusting your search, rating, or price range.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setMinRating("Any Rating");
                  setSortBy("Most Relevant");
                  setPrice(200);
                }}
                className="mt-6 rounded-full bg-[#BB9239] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Clear Filters
              </button>
            </div>
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

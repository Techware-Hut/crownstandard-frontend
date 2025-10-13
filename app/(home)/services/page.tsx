// app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BannerSection from "@/components/BannerSection";
import ServiceCard from "@/components/ServiceCard";
import ServiceCardSkeleton from "@/components/ServiceCardSkeleton";

type Service = {
    id: number;
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

const FILTER_TABS = [
    "All Services",
    "Basic Cleaning",
    "Residential",
    "Commercial",
    "Deep Cleaning",
    "Regular Cleaning",
    "Move In/Out",
];

const SERVICES: Service[] = [
    {
        id: 1,
        title: "Deluxe Apartment Cleaning",
        slug: "Deluxe-Apartment-Cleaning",
        description:
            "Thorough cleaning for apartments, including kitchen, bathroom, and living areas. Perfect ...",
        price: 30,
        duration: "2h minimum",
        location: "New York, NY",
        rating: 3.8,
        reviews: 57,
        imageUrl: "/ServiceCleaning.png",
        badge: "Residential",
        provider: "SparklePro",
    },
    {
        id: 2,
        title: "Deluxe Apartment Cleaning",
        slug: "Deluxe-Apartment-Cleaning-1",
        description:
            "Thorough cleaning for apartments, including kitchen, bathroom, and living areas. Perfect ...",
        price: 30,
        duration: "2h minimum",
        location: "New York, NY",
        rating: 4.8,
        reviews: 57,
        imageUrl: "/ServiceCleaning.png",
        badge: "Residential",
        provider: "SparklePro",
    },
    {
        id: 3,
        title: "Deluxe Apartment Cleaning",
        slug: "Deluxe-Apartment-Cleaning-2",
        description:
            "Thorough cleaning for apartments, including kitchen, bathroom, and living areas. Perfect ...",
        price: 30,
        duration: "2h minimum",
        location: "New York, NY",
        rating: 4.8,
        reviews: 57,
        imageUrl: "/ServiceCleaning.png",
        badge: "Residential",
        provider: "SparklePro",
    },
];

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("All Services");
    const [showFilters, setShowFilters] = useState(true);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [price, setPrice] = useState(30);
    const [minRating, setMinRating] = useState("Any Rating");
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 400); // simulate network
        return () => clearTimeout(t);
    }, [activeTab, query, price, minRating, sortBy]);

    // basic client-side filter/sort (can be replaced with real data later)
    const filtered = SERVICES.filter((s) => {
        const matchesTab =
            activeTab === "All Services" ||
            s.badge.toLowerCase().includes(activeTab.toLowerCase());

        const q = query.trim().toLowerCase();
        const searchq = search.trim().toLowerCase();

        const matchesQuery =
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q);

        const matchesSearch =
            !searchq ||
            s.title.toLowerCase().includes(searchq) ||
            s.description.toLowerCase().includes(searchq) ||
            s.provider.toLowerCase().includes(searchq) ||
            s.location.toLowerCase().includes(searchq);

        const matchesPrice = s.price <= price;
        const matchesRating = minRating === "Any Rating" ? true : s.rating >= parseFloat(minRating);

        return matchesTab && matchesQuery && matchesSearch && matchesPrice && matchesRating;
    }).sort((a, b) => {
        if (sortBy === "Lowest Price") return a.price - b.price;
        if (sortBy === "Highest Price") return b.price - a.price;
        if (sortBy === "Top Rated") return b.rating - a.rating;
        return 0;
    });

    return (
        <>
            <BannerSection
                title="Premium Cleaning Services"
                subtitle="Discover trusted professionals in your area. All providers are verified and insured."
                imageUrl="/GetStarted-banner.png"
                page="Services"
            />

            <div className="h-32 sm:h-40 lg:h-[200px] w-full bg-[#BB9239]" />

            {/* search & filters card */}
            <section className="relative z-10 container 3xl:max-w-[1280px] -mt-20">
                <div className="px-4 lg:px-8 py-4 lg:py-10 bg-white shadow-sm rounded-2xl ring-1 ring-gray-200">
                    {/* top row: search + hide/show filter */}
                    <div className="flex items-start justify-between">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                            Search & Filter Services
                        </h2>

                        <button
                            type="button"
                            onClick={() => setShowFilters((v) => !v)}
                            aria-expanded={showFilters}
                            className="items-center hidden gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-full md:flex bg-gray-50 hover:bg-gray-100"
                        >
                            {/* funnel icon */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
                            </svg>
                            {showFilters ? "Hide Filter" : "Show Filter"}
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        {/* big search bar */}
                        <div className="relative flex-1">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search services, providers, locations…"
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                aria-label="Search services"
                            />
                            {/* magnifier icon (inline svg) */}
                            <svg
                                className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="7"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>

                        {/* hide/show filter button */}

                    </div>

                    {/* collapsible filters (tabs + inputs) */}
                    {showFilters && (
                        <>
                            {/* tabs */}
                            <div className="flex flex-wrap lg:gap-3 gap-2 mb-4">
                                {FILTER_TABS.map((label) => {
                                    const active = activeTab === label;
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => setActiveTab(label)}
                                            aria-pressed={active}
                                            className={[
                                                "px-4 py-2 rounded-full text-sm font-medium border transition",
                                                active
                                                    ? "bg-gray-900 text-white border-gray-900"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
                                            ].join(" ")}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* inputs row */}
                            <div className="grid gap-4 md:grid-cols-4">
                                {/* service area */}
                                <div className="md:col-span-1">
                                    <label className="block mb-1 text-sm text-gray-600">Service Area</label>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Enter city, zip code, or address..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                </div>

                                {/* price slider */}
                                <div className="md:col-span-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600">Price Range (per hour)</span>
                                        <span className="text-xs text-gray-500">${25} — ${price}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={25}
                                        max={200}
                                        step={10}
                                        value={price}
                                        onChange={(e) => setPrice(parseInt(e.target.value))}
                                        className="w-full accent-gray-900"
                                    />
                                    <div className="flex justify-between text-[11px] text-gray-500">
                                        <span>$25</span>
                                        <span>$200</span>
                                    </div>
                                </div>

                                {/* rating */}
                                <div className="md:col-span-1">
                                    <label className="block mb-1 text-sm text-gray-600">Minimum Rating</label>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    >
                                        <option>Any Rating</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="3">3+ Stars</option>
                                    </select>
                                </div>

                                {/* sort */}
                                <div className="md:col-span-1">
                                    <label className="block mb-1 text-sm text-gray-600">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    >
                                        <option>Most Relevant</option>
                                        <option>Lowest Price</option>
                                        <option>Highest Price</option>
                                        <option>Top Rated</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* results */}
            <section className="section">
                <div className="container 3xl:max-w-[1280px]">
                {loading ? (
                    <>
                        <p className="mb-6 text-gray-600" role="status" aria-live="polite">
                            Loading services…
                        </p>
                        <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <ServiceCardSkeleton key={i} />
                            ))}
                        </div>
                    </>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                        <p className="text-center">No services found.</p>
                    </div>
                ) : (
                    <>
                        <p className="mb-6 text-gray-600">
                            Showing {filtered.length} of {SERVICES.length} services
                        </p>
                        <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((s) => (
                                <ServiceCard key={s.id} service={s} />
                            ))}
                        </div>
                    </>
                )}
                </div>
            </section>
        </>
    );
}

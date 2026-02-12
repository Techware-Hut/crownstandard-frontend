"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { providerApi, ProviderProfile } from "@/lib/providerApi";

interface ProfilePageProps {
    role: "provider" | "customer";
}

const USA_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
];

const USA_CITIES = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
    "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
    "Indianapolis", "Charlotte", "San Francisco", "Seattle", "Denver", "Boston"
];

const CANADA_PROVINCES = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Yukon"
];

const CANADA_CITIES = [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg",
    "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "St. John's"
];

export default function ProfilePage({ role }: ProfilePageProps) {
    const [editable, setEditable] = useState(false);
    const [profile, setProfile] = useState<ProviderProfile>()
    const [country, setCountry] = useState("CANADA");

    const isProvider = role === "provider";
    const states = country === "USA" ? USA_STATES : CANADA_PROVINCES;
    const cities = country === "USA" ? USA_CITIES : CANADA_CITIES;

    const getProfile =async ()=>{
    const providerProfile = await providerApi.getProfileDetails();
    setProfile(providerProfile)
    }

    useEffect(()=>{
        getProfile();
    },[])

    return (
        <main className="relative min-h-screen bg-white">
            <div className="relative z-10 max-w-6xl px-6 py-8 mx-auto lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                        {isProvider ? "Provider Profile" : "Customer Profile"}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage your account information and preferences
                    </p>
                </header>

                {/* Top Form Section */}
                <section className="grid grid-cols-1 sm:gap-6 md:grid-cols-3">
                    {/* Left Inputs */}
                    <div className="col-span-2 space-y-3 ">
                        <div className="text-md font-bold text-[#b9903c]">
                            Account Type: {isProvider ? "Provider" : "Customer"}
                        </div>
                    
                   
                        <div className="grid grid-cols-1 gap-2 lg:gap-4 grid-cols-1">
                            <InputField  label="Full Name" value={profile?.name || ""} placeholder="Enter full name..." />
                            <InputField label="Email Address" value={profile?.email || ""} placeholder="Enter email..." />
                            <InputField label="Phone Number" value={profile?.number?.toString() || ""} placeholder="+91 9876543210" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <select 
                                value={profile?.address?.country || 'CANADA'}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#b9903c] focus:outline-none"
                            >
                                <option value="CANADA">CANADA</option>
                                <option value="USA">USA</option>
                   
                            </select>
                        </div>
                        <InputField label="Address" value={profile?.address.street || ""} placeholder="Street address..." />
        

                        <div className="grid grid-cols-3 gap-2 lg:gap-4">
                            <SelectField 
                                label="City" 
                                placeholder="Select city"
                                options={cities}
                            />
                            <SelectField 
                                label={"State / Province"} 
                                placeholder={country === "USA" ? "Select State / Province" : "Select province"}
                                options={states}
                            />
                            <InputField  label="Zip Code / Postal Code" value={profile?.address?.zipCode?.toString() || ""} placeholder="Zip Code / Postal Code" />
  
                        </div>

                    </div>

                    {/* Right Avatar Section */}
                    <div className="flex flex-col items-center justify-start sm:border-l-4 pt-6">
                        <div className="flex items-center justify-center w-20 h-20 mb-4 overflow-hidden bg-gray-200 rounded-full ring-1 ring-gray-300">
                            <Image
                                src="/avatar-placeholder.png"
                                alt="Profile"
                                width={64}
                                height={64}
                                className="object-cover rounded-full"
                            />
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-amber-700"
                            onClick={() => setEditable(!editable)}
                        >
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </section>

                {/* Conditional Sections */}
                {isProvider ? (
                    <ProviderExtras />
                ) : (
                    <CustomerExtras />
                )}
            </div>

            {/* <div className="absolute bottom-0 w-full h-64 bg-gray-900" /> */}
        </main>
    );
}

/* ---------- Reusable Input Field ---------- */
function InputField({
    label,
    placeholder,
    value,
    readonly=true
}: {
    label: string;
    placeholder: string;
    value : string
    readonly? : boolean
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                placeholder={placeholder}
                defaultValue={value}
                readOnly={readonly}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#b9903c] focus:outline-none"
            />
        </div>
    );
}

/* ---------- Reusable Select Field ---------- */
function SelectField({
    label,
    placeholder,
    options,
}: {
    label: string;
    placeholder: string;
    options: string[];
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <select className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#b9903c] focus:outline-none">
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* ---------- Provider-Specific Section ---------- */
function ProviderExtras() {
    return (
        <>
            <section className="p-6 mb-8 mt-5 text-white bg-gray-900 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#b9903c]">
                            Hourly Rate
                        </h3>
                        <p className="text-xs text-gray-400">
                            Set your hourly cleaning rate (minimum $25.00/hour)
                        </p>
                        <p className="mt-3 text-xl font-semibold">$25.00/hour</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 border rounded-full hover:bg-gray-700">
                        <Pencil className="w-4 h-4" /> Edit Rate
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 bg-[#F6F4EF] gap-6 md:grid-cols-2">
                <InfoCard title="Location Management" />
                <InfoCard title="Booking Preferences" />
            </div>
        </>
    );
}

/* ---------- Customer-Specific Section ---------- */
function CustomerExtras() {
    return (
        <>
            <div className="section grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoCard title="Location Management" />
                <div className="p-6 rounded-xl bg-[#F3F1ED]">
                    <h3 className="mb-4 text-lg font-bold text-[#b9903c] ">
                        Booking Preferences
                    </h3>

                    <div className="space-y-5 text-sm text-gray-700">
                        {/* Trusted & Verified */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Trusted & Verified</p>
                                <p className="text-gray-500 text-[13px]">
                                    All service providers are background checked
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mt-1 border-gray-300 rounded text-[#b9903c] focus:ring-amber-500"
                            />
                        </div>

                        {/* Top Rated */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Top Rated</p>
                                <p className="text-gray-500 text-[13px]">
                                    4.8+ average rating from satisfied customers
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mt-1 border-gray-300 rounded text-[#b9903c] focus:ring-amber-500"
                            />
                        </div>

                        {/* Growing Community */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Growing Community</p>
                                <p className="text-gray-500 text-[13px]">
                                    Join thousands of happy customers and providers
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                className="mt-1 border-gray-300 rounded text-[#b9903c] focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <section className="mb-10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 ">
                        Billing Information
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full hover:bg-gray-100">
                        <Plus className="w-4 h-4" /> Add Payment Method
                    </button>
                </div>
                <div className="p-5 text-sm bg-[#F3F1ED] rounded-xl">
                    <p className="font-medium text-gray-800">
                        Secure Payment Processing
                    </p>
                    <p className="mt-1 text-gray-500">
                        All payment information is encrypted and processed securely through
                        Stripe. We never store your complete card details on our servers.
                    </p>
                </div>
            </section>
        </>
    );
}

/* ---------- Reusable Components ---------- */
function InfoCard({ title }: { title: string }) {
    return (
        <div className="p-6 text-gray-800 bg-[#F3F1ED] rounded-xl">
            <h3 className="text-xl font-bold text-[#b9903c]">{title}</h3>
        </div>
    );
}

function Preference({
    label,
    checked = false,
    
}: {
    label: string;
    checked?: boolean;
}) {
    return (
        <label className="flex items-start gap-2">
            <input
                type="checkbox"
                defaultChecked={checked}
                className="mt-1 border-gray-300 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>{label}</span>
        </label>
    );
}

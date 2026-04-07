"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import {
    providerApi,
    ProviderProfile,
    StripeConnectStatusResponse,
} from "@/lib/providerApi";
import { useRouter } from "next/navigation";

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
    // const [editable, setEditable] = useState(false);
    const [profile, setProfile] = useState<ProviderProfile>({})

    const [editMode, setEditMode] = useState(false)

    const isProvider = role === "provider";
    const selectedCountry = profile?.address?.country || "CANADA";
    const states = selectedCountry === "USA" ? USA_STATES : CANADA_PROVINCES;
    const cities = selectedCountry === "USA" ? USA_CITIES : CANADA_CITIES;

    const getProfile =async ()=>{

        const providerProfile = await providerApi.getProfileDetails();
        

  
        setProfile(providerProfile)
    }

    const saveData = async()=>{

        await providerApi.updateProfileDetails(profile);


    }

    const changePhoto = async (imageFile : any)=>{

        await providerApi.updateProfilePhoto(imageFile)

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
                            <InputField onChange={(e)=> setProfile((prev)=> ({...prev, name : e.target.value}))} readonly={!editMode}  label="Full Name"  value={profile?.name || ""} placeholder="Enter full name..." />
                            <InputField  readonly={true} label="Email Address" value={profile?.email || ""} placeholder="Enter email..." />
                            <InputField onChange={(e)=> setProfile((prev)=> ({...prev, phone : e.target.value}))}readonly={!editMode} label="Phone Number" value={profile?.phone?.toString() || ""} placeholder="Enter phone number..." />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <select 
                                disabled={!editMode}
                                value={profile?.address?.country || 'CANADA'}
                                onChange={(e) =>
                                setProfile(prev => ({
                                    ...prev,
                                    address: {
                                    ...prev?.address, 
                                    country: e.target.value
                                    },
                                }))
                                }

                                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#b9903c] focus:outline-none"
                            >
                                <option value="CANADA">CANADA</option>
                                <option value="USA">USA</option>
                   
                            </select>
                        </div>
                        <InputField  readonly={!editMode} label="Address" value={profile?.address?.line1 || ""} placeholder="Street address..." 
                        
                         onChange={(e) =>
                                setProfile(prev => ({
                                    ...prev,
                                    address: {
                                    ...prev?.address, 
                                    line1: e.target.value
                                    },
                                }))
                        }
                        />
        

                        <div className="grid grid-cols-3 gap-2 lg:gap-4">
                            <SelectField 
                                label="City" 
                                placeholder={profile?.address?.city || "Select city"}
                                options={cities}
                                disabled={!editMode}
                                // value={"Toronto"}
                                onChange={(e) =>
                                setProfile(prev => ({
                                    ...prev,
                                    address: {
                                    ...prev?.address, 
                                    city: e.target.value
                                    },
                                }))
                                }
                            />
                            <SelectField 
                                label={"State / Province"} 
                                placeholder={profile?.address?.state || "Select State / Province"}
                                options={states}
                                value={profile.address?.state}
                                disabled={!editMode}
                                    onChange={(e) =>
                                setProfile(prev => ({
                                    ...prev,
                                    address: {
                                    ...prev?.address, 
                                    state: e.target.value
                                    },
                                }))
                                }

                            />
                            <InputField
                                onChange={(e) =>
                                    setProfile(prev => ({
                                        ...prev,
                                        address: {
                                        ...prev?.address, 
                                        postalCode: Number(e.target.value)
                                        },
                                    }))
                                }
                                readonly={!editMode} label="Zip Code / Postal Code" value={profile?.address?.postalCode?.toString() || ""} placeholder="Zip Code / Postal Code" />
  
                        </div>

                    </div>

                    {/* Right Avatar Section */}
                    <div className="flex flex-col items-center justify-start sm:border-l-4 pt-6">
                   <div className="relative flex items-center justify-center w-20 h-20 mb-4 overflow-hidden bg-gray-200 rounded-full ring-1 ring-gray-300 group cursor-pointer">
    
                            <Image
                            src={profile.photo ?? "/icons8-customer-90.png"}

                            alt="Profile"
                            width={64}
                            height={64}
                            className={profile.photo ? "object-cover rounded-full" : ""}
                            />

                             {/* Hidden input */}
                            <input
                            id="fileUpload"
                            type="file"
                            name="change"
                            className="hidden"
                            onChange={(e) => {

                                const file = e.target.files?.[0]
                                if(!file) return;
                                const url = URL.createObjectURL(file)
                                setProfile({
                                    ...profile,
                                    photo :  url
                                })

                                changePhoto(file)
                            }}
                            />

                            {/* Overlay trigger */}
                            <label
                            htmlFor="fileUpload"
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                            >
                            Change Photo
                            </label>
                            
                            

                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-amber-700"
                            onClick={() => {
                                setEditMode(!editMode)
                                
                                if(editMode)
                                    saveData();
                            }}
                        >
                            {editMode ? "Save" : <><Pencil className="w-4 h-4" /> Edit Profile </>}
                        </button>
                    </div>
                </section>

                {/* Conditional Sections */}
                {isProvider ? (
                    <ProviderExtras 
                    profile={profile}
                    country={selectedCountry}/>
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
    readonly=true,
    onChange
    
}: {
    label: string;
    placeholder: string;
    value : string
    readonly : boolean,
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                readOnly={readonly}
                onChange={onChange}
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
    disabled,
    value,
    onChange

    
}: {
    label: string;
    placeholder: string;
    options: string[];
    disabled : boolean,
    value? : string,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <select onChange={onChange} disabled={disabled} className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#b9903c] focus:outline-none">
                <option value={value}>{placeholder}</option>
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
function ProviderExtras({profile, country} : {profile : ProviderProfile, country : string}) {
    const [status, setStatus] = useState({
        hasAccount: false,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
    });
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [connectError, setConnectError] = useState<string | null>(null);
    const [openingOnboardingLink, setOpeningOnboardingLink] = useState(false);

    const router = useRouter()

    const normalizeStatus = useCallback((raw: StripeConnectStatusResponse) => {
        const payload = raw.data ?? raw;
        const hasAccount = Boolean(payload.hasAccount || payload.accountId);
        const detailsSubmitted = Boolean(payload.detailsSubmitted);
        const chargesEnabled = Boolean(payload.chargesEnabled);
        const payoutsEnabled = Boolean(payload.payoutsEnabled);

        return {
            hasAccount,
            detailsSubmitted,
            chargesEnabled,
            payoutsEnabled,
            onboardingComplete:
                Boolean(payload.onboardingComplete) ||
                (detailsSubmitted && chargesEnabled && payoutsEnabled),
        };
    }, []);

    const loadConnectStatus = useCallback(async () => {
        setLoadingStatus(true);
        setConnectError(null);
        try {
            const res = await providerApi.getStripeConnectStatus();
            const nextStatus = normalizeStatus(res);
            setStatus(nextStatus);
        } catch (error) {
            setConnectError("Unable to load Stripe account status.");
            console.error("Stripe status fetch failed", error);
        } finally {
            setLoadingStatus(false);
        }
    }, [normalizeStatus]);

    useEffect(() => {
        loadConnectStatus();
    }, [loadConnectStatus]);

    const handleStartOnboarding = async () => {
        setConnectError(null);
        try {
      
            await providerApi.createStripeConnectAccount(profile.name || "", profile.email || "", country === "CANADA" ? "CA" : "USA");
            await loadConnectStatus();
        } catch (error) {
            setConnectError("Unable to create a Stripe Connect account.");
            console.error("Stripe account creation failed", error);
        }
    };

    const handleOpenOnboardingLink = async () => {
        setConnectError(null);
        setOpeningOnboardingLink(true);
        try {
            const res = await providerApi.createStripeOnboardingLink();
            const onboardingUrl = res.url || res.data?.url;

            if (!onboardingUrl) {
                throw new Error("Stripe onboarding link is missing in response.");
            }

            window.location.assign(onboardingUrl);
        } catch (error) {
            setConnectError("Unable to open Stripe onboarding right now.");
            console.error("Stripe onboarding link fetch failed", error);
        } finally {
            setOpeningOnboardingLink(false);
        }
    };

    const stripeDashboard = async ()=>{
        const dashboardUrl = await providerApi.getStripeDashboard(); 
        console.log(dashboardUrl.url)
        router.push(dashboardUrl.url)
    }

    return (
        <>

            <section className="p-6 mt-5 mb-2 bg-[#F3F1ED] rounded-xl">
                <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-[#b9903c]">Stripe Connect</h3>
                        <p className="text-sm text-gray-600">
                            Complete onboarding to receive payouts and manage your account.
                        </p>
                    </div>
                    <button
                        onClick={loadConnectStatus}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-full hover:bg-gray-50"
                    >
                        Refresh Status
                    </button>
                </div>

                {loadingStatus ? (
                    <p className="text-sm text-gray-600">Loading Stripe status...</p>
                ) : (
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                        <StatusBadge label="Account Created" active={status.hasAccount} />
                        <StatusBadge label="Details Submitted" active={status.detailsSubmitted} />
                        <StatusBadge label="Charges Enabled" active={status.chargesEnabled} />
                        <StatusBadge label="Payouts Enabled" active={status.payoutsEnabled} />
                    </div>
                )}

                {connectError && (
                    <p className="mb-4 text-sm font-medium text-red-600">{connectError}</p>
                )}



                {!status.hasAccount && !loadingStatus && (
                    <button
                        onClick={handleStartOnboarding}
                        className="px-4 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-amber-700"
                    >
                        Create / Connect Stripe Account
                    </button>
                )}

                {status.hasAccount && (
                    <div className="space-y-4">
                        <button
                            onClick={stripeDashboard}
                            disabled={openingOnboardingLink}
                            className="px-4 mr-3 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Dashboard
                        </button>

                        {!status.onboardingComplete &&
                        <button
                            onClick={handleOpenOnboardingLink}
                            disabled={openingOnboardingLink}
                            className="px-4 py-2 text-sm font-medium text-white rounded-full bg-[#b9903c] hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {openingOnboardingLink
                                ? "Opening Stripe..."
                                : !status.onboardingComplete &&
                                     "Continue Stripe Onboarding"}
                        </button>
                        }
                    </div>
                )}
            </section>

            <div className="grid grid-cols-1 gap-6 bg-[#F6F4EF] md:grid-cols-2">
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

function StatusBadge({ label, active }: { label: string; active: boolean }) {
    return (
        <span
            className={`px-2.5 py-1 rounded-full font-medium ${
                active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
            }`}
        >
            {label}
        </span>
    );
}

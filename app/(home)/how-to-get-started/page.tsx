// app/how-to-get-started/page.tsx
"use client"

import {
    ShieldCheck, Users, UserPlus, Clock, FileCheck, Settings,
    CheckCircle2, MapPin, CalendarDays, CreditCard, Star,
} from "lucide-react";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import BannerSection from "@/components/BannerSection";
import Image from "next/image";
import FAQSection from "@/components/FAQSection";
import BottomCTA from "@/components/BottomCTA";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function HowToGetStartedPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const go_to_registerpage = (type: string) => {
        router.push("/register?type=" + type)
    }

    useEffect(() => {
        const token = Cookies.get("auth_token");
        setIsLoggedIn(!!token);
    }, []);

    const faqs: { group: string; items: { q: string; a: string }[] }[] = [
        {
            group: "Getting Started",
            items: [
                { q: "How do I know if Crown Standard is available in my area?", a: "Enter your address on the signup or booking flow. We’ll show real-time availability of providers nearby." },
                { q: "Is it free to create an account?", a: "Yes. Creating a customer or provider account is completely free." },
                { q: "How long does verification take for service providers?", a: "Typically 2–3 business days once all documents are submitted and readable." },
            ],
        },
        {
            group: "Account & Security",
            items: [
                { q: "How secure is my personal information?", a: "We use encryption in transit and at rest. You can also enable login alerts in Settings." },
                { q: "Can I change my account type later?", a: "Yes. You can add a provider profile from your customer account or vice-versa." },
                { q: "What if I forget my password?", a: "Use the 'Forgot password' link on the login page to reset securely by email." },
            ],
        },
        {
            group: "For Customers",
            items: [
                { q: "How do I know if a provider is trustworthy?", a: "Providers are identity-verified, insured, and reviewed by customers. Look for high ratings and badges." },
                { q: "Can I book recurring cleaning?", a: "Yes—choose weekly, bi-weekly, or monthly during checkout." },
                { q: "Do I need to be home?", a: "Not required. Add secure access instructions in your booking notes." },
            ],
        },
        {
            group: "For Service Providers",
            items: [
                { q: "What insurance do I need?", a: "General liability coverage is recommended (and required in some areas)." },
                { q: "How much commission is charged?", a: "Providers keep 75% of bookings plus 100% of tips." },
                { q: "Can I bring my own team?", a: "Yes—add team members in your provider dashboard and set roles." },
            ],
        },
        {
            group: "Payments & Pricing",
            items: [
                { q: "What payment methods do you accept?", a: "Credit/debit cards and selected digital wallets." },
                { q: "When am I charged?", a: "Customers are charged after the service is completed." },
                { q: "Platform fess?", a: "10%" },
                { q: "Are there hidden fees?", a: "No hidden fees. Taxes and any extras are shown before you confirm." },
                { q: "Refunds if I’m not satisfied?", a: "Contact support within 24 hours; we’ll make it right per our policy." },
            ],
        },
        {
            group: "Technical Support",
            items: [
                { q: "Is there a mobile app?", a: "Mobile web works great; native apps are coming soon." },
                { q: "I’m having trouble with the website.", a: "Clear cache/cookies or try an incognito window. If it persists, contact support." },
                { q: "How do I update my account info?", a: "Open Settings → Profile to edit personal details, address, and preferences." },
            ],
        },
    ];

    return (
        <>
            <BannerSection
                title="How to Get Started"
                subtitle="Follow our step-by-step guide to create your account and start using Crown Standard, whether you're looking for cleaning services or want to provide them."
                imageUrl="/GetStarted-banner.png"
                page="Getting Started Guide"
            />
            <div className="section mx-auto max-w-7xl">
                <div className="container 3xl:max-w-[1280px]">
                    {/* Two main cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                        {/* Customers */}
                        <section className="overflow-hidden border-l-[1px] border-l-[#BB9239] bg-card text-card-foreground relative">
                            {/* Gold label bar */}
                            <div className="p-4 lg:px-5 text-white md:px-4 md:py-5 bg-[#BB9239]">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 shrink-0" />
                                    <span className="uppercase tracking-wide font-semibold text-xl lg:text-2xl mb-1">
                                        For Customers
                                    </span>
                                </div>
                                <p className="text-[15px] text-muted-foreground">
                                    Need professional cleaning services?
                                </p>
                            </div>

                            <div className="p-6 mb-8 md:mb-20 md:p-8 pr-0">

                                <ol className="space-y-4 md:space-y-5">
                                    {/* 1 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <UserPlus className="w-5 h-5 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <UserPlus className="w-4 h-4 text-muted-foreground" /> */}
                                                Create Your Account
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Sign up with your email and create a secure password
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                                    Visit the sign-up page and choose “Customer” account type
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                                    Enter your full name, email address, and create a strong password
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                                    Verify your email address by clicking the link we send you
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                                                    Complete your profile with contact information and preferences
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 2 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                Set Your Location
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Add your address to find nearby service providers
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Enter your home or business address in your profile</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Set your service area preferences</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Add any special access instructions for your property</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Save multiple addresses if you need services at different locations</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 3 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <CalendarDays className="w-4 h-4 text-muted-foreground" /> */}
                                                Browse &amp; Book Services
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Find the perfect cleaning service for your needs
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Browse available professionals in your area</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Read reviews and check ratings</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Compare prices and service offerings</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Select date, time, and service duration</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Add special requests or cleaning preferences</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 4 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <CreditCard className="w-4 h-4 text-muted-foreground" /> */}
                                                Secure Payment
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">Pay safely with our secure payment system</p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Add your preferred payment method</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Review booking details and total cost</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Complete payment via secure checkout</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Receive confirmation by email and in-app</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 5 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <Star className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <Star className="w-4 h-4 text-muted-foreground" /> */}
                                                Enjoy & Review
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Relax while professionals clean, then share your experience
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Track arrivals in real-time</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Chat in-app with providers</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Inspect work and provide feedback</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Leave a review &amp; earn loyalty points</li>
                                            </ul>
                                        </div>
                                    </li>
                                </ol>

                            </div>
                            {
                                !isLoggedIn && (
                                    <div className="absolute bottom-0 w-full p-6 pb-0 md:p-8 md:pb-0 md:pr-0">
                                        <CTAButton onClick={() => go_to_registerpage("customer")} size="lg" variant="primaryGradient" className="w-full mt-7">
                                            Get Started as Customer
                                        </CTAButton>
                                    </div>
                                )
                            }
                        </section>

                        {/* Providers */}
                        <section className="overflow-hidden border-l-[1px] border-l-[#BB9239] bg-card text-card-foreground relative">
                            {/* Gold label bar */}
                            <div className="p-4 lg:px-5 text-white md:px-4 md:py-5 bg-[#BB9239]">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    <span className="uppercase tracking-wide font-semibold text-xl lg:text-2xl mb-1">
                                        For Service Providers
                                    </span>
                                </div>
                                <p className="text-[15px] text-muted-foreground">
                                    Want to grow your cleaning business?
                                </p>
                            </div>

                            <div className="p-6 mb-8 md:mb-20 md:p-8 pr-0">

                                <ol className="space-y-4 md:space-y-5">
                                    {/* 1 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <UserPlus className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <UserPlus className="w-4 h-4 text-muted-foreground" /> */}
                                                Create Provider Account
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Sign up as a professional cleaning service provider
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Visit the sign-up page and choose 'Service Provider' account type</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Enter your business name, personal details, and contact information</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Create a strong password and verify your email address</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Agree to our terms of service and provider agreement</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 2 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <FileCheck className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <FileCheck className="w-4 h-4 text-muted-foreground" /> */}
                                                Complete Verification
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Submit required documents for background checks
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Upload a valid government-issued photo ID</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Provide proof of business registration (if applicable)</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Submit insurance certificates (general liability required)</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Complete background check authorization form</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Wait 2–3 business days for verification approval</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 3 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <Settings className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <Settings className="w-4 h-4 text-muted-foreground" /> */}
                                                Set Up Your Profile
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Create an attractive profile to showcase your services
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Add a professional profile photo and business logo</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Write a compelling description of your services</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> List your specialties (residential, commercial, deep cleaning, etc.)</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Set your service areas and travel radius</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Upload additional photos of your work (before/after shots)</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 4 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <Clock className="w-4 h-4 text-muted-foreground" /> */}
                                                Configure Availability
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Set your working hours and booking preferences
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Set your weekly availability schedule</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Configure minimum and maximum booking durations</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Set your rates for different service types</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Add any seasonal availability changes</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Enable instant booking or manual approval for requests</li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 5 */}
                                    <li className="flex items-start bg-[#F4F1ED] py-4 rounded-lg">
                                        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center text-[13px] font-semibold bg-[#BB9239] text-white translate-x-[-20px]">
                                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                        </span>
                                        <div className="flex-1 pr-5">
                                            <h3 className="flex items-center gap-2 font-semibold text-primary">
                                                {/* <CalendarDays className="w-4 h-4 text-muted-foreground" /> */}
                                                Start Accepting Bookings
                                            </h3>
                                            <p className="mt-1 text-[15px] text-foreground">
                                                Begin receiving and managing customer bookings
                                            </p>
                                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Receive booking notifications via email and app</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Review customer requests and location details</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Accept or decline bookings based on your availability</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Communicate with customers about service details</li>
                                                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5" /> Track your earnings and manage your business growth</li>
                                            </ul>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {
                                !isLoggedIn && (
                                    <div className="absolute bottom-0 w-full p-6 pb-0 md:pb-0 md:p-8 md:pr-0">
                                        <CTAButton onClick={() => go_to_registerpage("provider")} size="lg" variant="primaryGradient" className="w-full mt-7">
                                            Get Started as Provider
                                        </CTAButton>
                                    </div>
                                )
                            }
                        </section>
                    </div>
                </div>
            </div>

            {/* Important info strip */}
            <section className="relative py-12 overflow-hidden text-white sm:py-14 md:py-16">
                {/* background image (same as banner) */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/about-banner.png"
                        alt="bg"
                        fill
                        priority={false}
                        className="object-cover"
                    />
                    {/* dark overlay */}
                    <div className="absolute inset-0 bg-black opacity-[88%]" />
                </div>

                <div className="container 3xl:max-w-[1280px]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                            Important Information
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-white/85">
                            Stay secure and get verified quickly before booking or accepting jobs.
                        </p>
                    </div>

                    {/* info cards grid */}
                    <div className="grid gap-6 mt-10 sm:grid-cols-2">
                        {/* Account Security */}
                        <div className="p-4 border rounded-2xl bg-white/10 backdrop-blur-sm border-white/10 md:p-6">
                            <h3 className="text-lg font-semibold text-[#BB9239] md-4 md:mb-6">Account Security</h3>
                            <ul className="mt-3 space-y-2 text-sm text-left md:text-base text-white/85">
                                <li>• Use a strong, unique password for your account</li>
                                <li>• Verify your email address to ensure account security</li>
                                <li>• Enable notifications to stay updated on your bookings</li>
                            </ul>
                        </div>

                        {/* Verification Process */}
                        <div className="p-4 border rounded-2xl bg-white/10 backdrop-blur-sm border-white/10 md:p-6">
                            <h3 className="text-lg font-semibold text-[#BB9239] md-4 md:mb-6">Verification Process</h3>
                            <ul className="mt-3 space-y-2 text-sm text-left md:text-base text-white/85">
                                <li>• Provider verification typically takes 2–3 business days</li>
                                <li>• Ensure all uploaded documents are clear and legible</li>
                                <li>• All providers must have valid insurance coverage</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <FAQSection />
            <BottomCTA />

        </>
    );
}

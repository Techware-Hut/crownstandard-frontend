"use client";

import { Clock, ShieldCheck, Headphones, Mail, Contact } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function SupportPage() {

    const [data, setData] = useState<any>(null);
    const [InquiryForm, setInquiryForm] = useState({
        fullName: "",
        email: "",
        requestType: "Feedback",
        priorityLevel: "Normal",
        relatedBookingId: "",
        message: "",
    });
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        message: "", 
    });
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {
            fullName: "",
            email: "",
            message: "",
        };

        let valid = true;

        if (!InquiryForm.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            valid = false;
        }

        if (!InquiryForm.email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(InquiryForm.email)) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }

        if (!InquiryForm.message.trim()) {
            newErrors.message = "Message is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setInquiryForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        // console.log("inquiryform", InquiryForm);
        try {
            setLoading(true);
            const res = await api.post("/support", InquiryForm);
            // console.log(res.data);
            setInquiryForm({
                fullName: "",
                email: "",
                requestType: "Feedback",
                priorityLevel: "Normal",
                relatedBookingId: "",
                message: "",
            });

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupportData();
    }, []);

    const fetchSupportData = async () => {
        try {
            const res = await api.get("/contact-details");
            setData(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const formatBusinessHours = (value?: string) => {
        if (!value || value === "Closed") return "Closed";

        if (value.includes("undefined")) return "Closed";

        const [start, end] = value.split(" – ");

        if (!start || !end || end === "undefined") return "Closed";

        return `${start} – ${end}`;
    };

    const featureCards = [
        {
            title: "Quick Response",
            desc: "Our support team responds to most requests within 24 hours.",
            icon: <Clock className="text-white w-7 h-7" />,
        },
        {
            title: "Secure & Private",
            desc: "All communications are encrypted and handled confidentially.",
            icon: <ShieldCheck className="text-white w-7 h-7" />,
        },
        {
            title: "24/7 Availability",
            desc: "Submit requests anytime – we’ll get back to you within business hours.",
            icon: <Headphones className="text-white w-7 h-7" />,
        },
    ];

    return (
        <div className="container 3xl:max-w-[1280px] flex flex-col bg-white">
            {/* ===== Header Section ===== */}
            <div className="pt-12">
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Support Center</h1>
                <p className="max-w-2xl mt-2 text-gray-500">
                    Get help from our admin team for feedback, disputes, or other issues.
                </p>
            </div>

            {/* ===== Feature Cards ===== */}
            <div className="grid grid-cols-1 gap-3 mt-10 md:gap-4 lg:gap-6 sm:grid-cols-3">
                {featureCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="relative overflow-hidden border border-amber-100 rounded-lg p-4 md:p-6 bg-gradient-to-br from-[#FFFFFF] to-[#FFF6E2] hover:shadow-sm transition-all"
                    >
                        {/* decorative pattern (top-right) */}
                        <Image
                            src="/pattern-top-right.png"
                            alt=""
                            width={656}            // set the natural width
                            height={256}           // set the natural height
                            className="absolute top-0 right-0 object-contain pointer-events-none select-none opacity-80 mix-blend-luminosity"
                        />
                        {/* card content */}
                        <div className="relative">
                            <div className="flex items-center justify-center w-12 h-12 bg-[#C49A3F] rounded-md mb-5">
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900 md:text-xl">{card.title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-gray-600">{card.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== Booking Form & Contact Info ===== */}
            <div className="flex flex-wrap gap-4 py-12 lg:gap-8">
                {/* Left – Booking Details */}
                <div className="flex-1 bg-[#F3F1ED] p-4 lg:p-8 rounded-xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 py-2 md:text-2xl">Enquiry Form</h2>
                    {/* <p className="mb-6 text-sm text-gray-500">
                        Fill in your preferred date, time, and location
                    </p> */}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 lg:gap-5 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Full Name<span className="ml-1 text-red-500">*</span></label>
                            <input
                                value={InquiryForm.fullName}
                                onChange={handleChange}
                                name="fullName"
                                type="text"
                                placeholder="Enter full name"
                                className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Address<span className="ml-1 text-red-500">*</span></label>
                            <input
                                value={InquiryForm.email}
                                onChange={handleChange}
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Type of Request</label>
                            <select value={InquiryForm.requestType} name="requestType" onChange={handleChange} className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600">
                                <option>Feedback</option>
                                <option>Dispute</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Priority Level</label>
                            <select value={InquiryForm.priorityLevel} name="priorityLevel" onChange={handleChange} className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600">
                                <option>Normal</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Related Booking ID (Optional)
                            </label>
                            <input
                                value={InquiryForm.relatedBookingId}
                                onChange={handleChange}
                                name="relatedBookingId"
                                type="text"
                                placeholder="Enter booking ID"
                                className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Message<span className="ml-1 text-red-500">*</span></label>
                            <textarea
                                rows={5}
                                name="message"
                                value={InquiryForm.message}
                                onChange={handleChange}
                                placeholder="Any specific requirements or notes..."
                                className="w-full px-3 py-2 mt-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-amber-600"
                            />
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-3 text-white rounded-md bg-[#b9903c] disabled:opacity-50"
                            >
                                {loading
                                    ? "Please wait..."
                                    : "Submit Support Request"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right – Contact Info */}
                <div className="w-full lg:w-[40%] bg-[#1D2432] text-white p-4 lg:p-8 rounded-xl flex flex-col justify-between">
                    <div>
                        <h3 className="md:mb-4 text-xl md:text-2xl font-bold text-[#C49A3F]">Other Ways To Reach Us</h3>
                        <p className="mb-6 text-sm text-gray-300">
                            Need immediate assistance? Try these alternatives.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <p className="text-lg font-medium">Direct Email</p>
                                <p className="mt-1 text-base font-medium text-gray-500">
                                    For urgent matters email us directly at{" "}
                                    <span className="font-medium text-[#b9903c]">
                                        {data?.directEmail}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-medium">Phone</p>
                                <p className="mt-1 text-base font-medium text-gray-500">
                                    <span className="font-medium text-[#b9903c]">
                                        {data?.phone}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-medium">Business Hours</p>
                                <div className="space-y-3 text-gray-500">
                                    <p>
                                        <span className="font-medium">Monday – Friday:</span>{" "}
                                        {data?.businessHours?.mondayFriday}
                                    </p>
                                    <p>
                                        <span className="font-medium">Saturday:</span>{" "}
                                        {data?.businessHours?.saturday}
                                    </p>
                                    <p>
                                        <span className="font-medium">Sunday:</span>{" "}
                                        {formatBusinessHours(data?.businessHours?.sunday)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-10 border-t border-gray-600">
                        <p className="text-sm font-medium">Emergency Situation</p>
                        <p className="mt-1 text-sm text-gray-300">
                            For urgent or safety concerns, please mark your request as{" "}
                            <span className="font-semibold text-[#b9903c]">“High Priority”</span> and
                            contact us directly at the email above. We monitor high priority requests
                            throughout the day.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

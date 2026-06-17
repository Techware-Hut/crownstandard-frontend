"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function SupportConfig() {
    const [form, setForm] = useState({
        id: "",
        directEmail: "",
        phone: "",
        businessHours: {
            mondayFriday: "",
            saturday: "",
            sunday: "",
        },
        activeDays: {
            saturday: true,
            sunday: true,
        },
    });

    const toggleDay = (key: "saturday" | "sunday") => {
        setForm((prev) => ({
            ...prev,
            activeDays: {
                ...prev.activeDays,
                [key]: !prev.activeDays[key],
            },
            businessHours: {
                ...prev.businessHours,
                [key]: !prev.activeDays[key]
                    ? prev.businessHours[key]
                    : "Closed",
            },
        }));
    };

    const updateField = (key: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateBusinessHours = (
        key: string,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            businessHours: {
                ...prev.businessHours,
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        try {
            const formatTime = (time: string) => {
                if (!time) return "";

                const [hour, minute] = time.split(":").map(Number);
                const period = hour >= 12 ? "P.M" : "A.M";
                const formattedHour = hour % 12 || 12;

                return `${formattedHour}:${String(minute).padStart(2, "0")} ${period}`;
            };

            const payload = {
                directEmail: form.directEmail,
                phone: form.phone,
                businessHours: {
                    mondayFriday: form.businessHours.mondayFriday ? `${formatTime(form.businessHours.mondayFriday.split(" – ")[0])} – ${formatTime(form.businessHours.mondayFriday.split(" – ")[1])}` : "Closed",
                    saturday: form.businessHours.saturday ? `${formatTime(form.businessHours.saturday.split(" – ")[0])} – ${formatTime(form.businessHours.saturday.split(" – ")[1])}` : "Closed",
                    sunday: form.businessHours.sunday ? `${formatTime(form.businessHours.sunday.split(" – ")[0])} – ${formatTime(form.businessHours.sunday.split(" – ")[1])}` : "Closed",
                },
            };

            let response;

            if (form.id) {
                response = await api.put(`/contact-details/${form.id}`, payload);
            } else {
                response = await api.post("/contact-details", payload);
            }

            console.log("Success", response.data);
            alert("Support configuration saved");
            if (!form.id && response.data?.data?._id) {
                setForm((prev) => ({
                    ...prev,
                    id: response.data.data._id,
                }));
            }
        } catch (error: any) {
            console.log(error.response?.data);
            alert("Failed to save");
        }
    };

    useEffect(() => {
        getContactDetails();
    }, []);

    const isClosed = (value?: string) => {
        return (
            !value ||
            value === "Closed" ||
            value.includes("undefined")
        );
    };

    const safeConvert = (time?: string) => {
        if (!time) return "";

        const [value = ""] = time.split(" ");
        const [hourStr = "0", minuteStr = "0"] = value.split(":");

        let hour = Number(hourStr);
        const minute = Number(minuteStr);

        if (isNaN(hour) || isNaN(minute)) return "";

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    };

    const parseBusinessHours = (value?: string) => {
        if (isClosed(value)) return "";
        const parts = value?.split(" – ") || [];
        const start = safeConvert(parts[0]);
        const end = safeConvert(parts[1]);
        if (!start || !end) return "";
        return `${start} – ${end}`;
    };

    const getContactDetails = async () => {
        try {
            const res = await api.get("/contact-details");
            const data = res.data.data;

            setForm({
                id: data._id,
                directEmail: data.directEmail || "",
                phone: data.phone || "",

                activeDays: {
                    saturday: !isClosed(data.businessHours?.saturday),
                    sunday: !isClosed(data.businessHours?.sunday),
                },

                businessHours: {
                    mondayFriday: parseBusinessHours(data.businessHours?.mondayFriday),
                    saturday: parseBusinessHours(data.businessHours?.saturday),
                    sunday: parseBusinessHours(data.businessHours?.sunday),
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="rounded-xl bg-white p-6 shadow">

            <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                    Support Configuration
                </h2>

                <p className="text-sm text-gray-500">
                    Manage contact details and business hours
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Direct Email
                    </label>

                    <input
                        type="email"
                        value={form.directEmail}
                        onChange={(e) => updateField("directEmail", e.target.value)}
                        placeholder="support@company.com"
                        className="w-full rounded-lg border p-3 outline-none" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone
                    </label>

                    <input
                        type="number"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1 000000000"
                        className="w-full rounded-lg border p-3" />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="mb-5 text-lg font-semibold">
                    Business Hours
                </h3>
                <div className="overflow-hidden rounded-xl border">
                    {[
                        {
                            label: "Monday – Friday",
                            key: "mondayFriday",
                            isToggle: false,
                        },
                        {
                            label: "Saturday",
                            key: "saturday",
                            isToggle: true,
                        },
                        {
                            label: "Sunday",
                            key: "sunday",
                            isToggle: true,
                        },
                    ].map((day, index) => (
                        <div
                            key={day.key}
                            className={`flex items-center justify-between px-6 py-5 ${index !== 2 ? "border-b" : ""
                                }`}
                        >
                            <div className="flex w-[220px] items-center gap-3 font-medium">
                                {day.label}
                                {day.isToggle && (
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={form.activeDays[day.key as "saturday" | "sunday"]}
                                            onChange={() => toggleDay(day.key as "saturday" | "sunday")}
                                        />
                                        <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></div>
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                                    </label>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {day.isToggle &&
                                    !form.activeDays[
                                    day.key as "saturday" | "sunday"
                                    ] ? (
                                    <span className="text-sm text-gray-500">
                                        Closed
                                    </span>
                                ) : (
                                    <>
                                        <input
                                            type="time"
                                            value={
                                                form.businessHours[
                                                    day.key as keyof typeof form.businessHours
                                                ]
                                                    ?.split(" – ")[0] || ""
                                            }
                                            onChange={(e) => {
                                                const end =
                                                    form.businessHours[
                                                        day.key as keyof typeof form.businessHours
                                                    ]
                                                        ?.split(" – ")[1] || "";

                                                updateBusinessHours(
                                                    day.key,
                                                    `${e.target.value} – ${end}`
                                                );
                                            }}
                                            className="rounded-lg border px-4 py-3"
                                        />

                                        <span className="text-gray-500">
                                            to
                                        </span>

                                        <input
                                            type="time"
                                            value={
                                                form.businessHours[
                                                    day.key as keyof typeof form.businessHours
                                                ]
                                                    ?.split(" – ")[1] || ""
                                            }
                                            onChange={(e) => {
                                                const start =
                                                    form.businessHours[
                                                        day.key as keyof typeof form.businessHours
                                                    ]
                                                        ?.split(" – ")[0] || "";

                                                updateBusinessHours(
                                                    day.key,
                                                    `${start} – ${e.target.value}`
                                                );
                                            }}
                                            className="rounded-lg border px-4 py-3"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSave} className="mt-8 rounded-lg bg-black px-6 py-3 text-white">
                Save Changes
            </button>

        </section>
    );
}
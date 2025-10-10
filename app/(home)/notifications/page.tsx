"use client";
import { Bell, CheckCheck } from "lucide-react";
import type { Notification } from "@/types/notification";
import NotificationCard from "@/components/notifications/NotificationCard";

export default function NotificationsPage() {
    const notifications: Notification[] = [
        {
            id:"01",
            title: "New Booking Received",
            message:
                "Your booking with Dr. Ananya Sharma has been confirmed for Sept 21, 2025 at 4:00 PM.",
            type: "Booking",
            time: "6 days ago",
            unread: true,
        },
        {
            id:"02",
            title: "New Review Received",
            message:
                "Your booking with Dr. Ananya Sharma has been confirmed for Sept 21, 2025 at 4:00 PM.",
            type: "Review",
            time: "6 days ago",
            unread: false,
        },
        {
            id:"03",
            title: "Pro Tip of the Day",
            message:
                "Your booking with Dr. Ananya Sharma has been confirmed for Sept 21, 2025 at 4:00 PM.",
            type: "Tip",
            time: "6 days ago",
            unread: false,
        },
        {
            id:"04",
            title: "System Maintenance Schedule",
            message:
                "Your booking with Dr. Ananya Sharma has been confirmed for Sept 21, 2025 at 4:00 PM.",
            type: "System",
            time: "6 days ago",
            unread: false,
        },
    ];


    const handleMarkAllRead = () => {
        console.log("All notifications marked as read.");
    };

    return (
        <div className="min-h-screen px-6 py-10 mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    All Notifications
                </h1>
                {/* {
                    notifications.length !== 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-[#1D2432] border rounded-full border-gray-300 hover:bg-gray-50 transition"
                        >
                            <CheckCheck size={16} /> Mark All As Read
                        </button>
                    )
                } */}
            </div>

            <hr className="mb-8" />

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-[#F5F3EF] rounded-2xl">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#B89029]/10 mb-6">
                        <Bell className="w-10 h-10 text-[#B89029]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1D2432]">
                        No Notifications Yet
                    </h3>
                    <p className="max-w-sm mt-2 text-sm text-gray-500">
                        You’re all caught up! New updates and alerts will appear here once
                        available.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-5 lg:grid-cols-2">
                    {notifications.map((n, i) => (
                        <NotificationCard key={i} {...n} />
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";
import { useState } from "react";
import { Gift, Users, History, Coins } from "lucide-react";
import RewardCard from "./RewardCard";

export default function RewardsTabs() {
    const tabs = [
        { name: "Rewards Catalogue", icon: <Gift size={16} /> },
        { name: "Refer Friends", icon: <Users size={16} /> },
        { name: "Points History", icon: <History size={16} /> },
    ];

    const [active, setActive] = useState(0);

    return (
        <div className="pt-10">
            {/* --- Tab Header --- */}
            <div className="relative flex gap-2 flex-wrap">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`relative sm:flex-1 p-3 text-sm sm:text-base font-medium rounded-md transition-colors duration-200 ${i === active
                                ? "bg-[#1D2432] text-white"
                                : "bg-[#B89029] text-white/90 hover:bg-[#a47f24]"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {tab.icon}
                            {tab.name}
                        </div>

                        {/* ▼ Active triangle indicator */}
                        {i === active && (
                            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#1D2432]" />
                        )}
                    </button>
                ))}
            </div>
            <hr className="mt-4 bg-gray-900" />

            {/* --- Tab Content --- */}
            <div className="mt-12 pb-8 sm:pb-10 lg:pb-24">
                {active === 0 && <RewardsCatalogue />}
                {active === 1 && <ReferFriends />}
                {active === 2 && <PointsHistory />}
            </div>
        </div>
    );
}

function RewardsCatalogue() {
    return (
        <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Rewards Catalogue
            </h2>
            <p className="mb-6 text-sm text-gray-500">
                Redeem your points for exciting discounts and offers.
            </p>

            <div className="grid grid-cols-1 gap-3 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <RewardCard key={i} />
                ))}
            </div>
        </section>
    );
}

function ReferFriends() {
    return (
        <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Refer Friends &amp; Earn
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Invite your friends to join Crown Standard. You’ll earn bonus points for
                every successful referral.
            </p>

            <div className="p-6 bg-white border shadow-sm rounded-xl">
                <p className="text-sm text-gray-600">
                    Share your unique referral link with friends:
                </p>
                <div className="flex gap-3 mt-3">
                    <input
                        type="text"
                        value="https://crownstandard.ca/referral/ABC123"
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                    />
                    <button
                        onClick={() => navigator.clipboard.writeText("https://crownstandard.ca/referral/ABC123")}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md bg-[#1D2432] hover:bg-[#111827]"
                    >
                        Copy
                    </button>
                </div>

                <div className="flex items-center justify-between mt-6 p-4 bg-[#F3F1ED] rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-800">Referral Bonus</p>
                        <p className="text-xs text-gray-500">You earn 200 points per signup</p>
                    </div>
                    <Coins className="w-6 h-6 text-[#B89029]" />
                </div>
            </div>
        </section>
    );
}

function PointsHistory() {
    const history = [
        { date: "2025-09-22", action: "Redeemed ₹100 Service Discount", points: -200 },
        { date: "2025-09-15", action: "Referral Bonus", points: +200 },
        { date: "2025-09-08", action: "Booking Completed", points: +150 },
    ];

    return (
        <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Points History</h2>
            <p className="text-sm text-gray-500 mb-6">Track your recent transactions.</p>

            <div className="overflow-hidden border rounded-xl">
                <table className="w-full text-sm text-left text-gray-700 bg-white">
                    <thead className="bg-[#F3F1ED] text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                            <th className="px-4 py-3 font-medium text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, i) => (
                            <tr
                                key={i}
                                className="transition border-t border-gray-100 hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">{item.date}</td>
                                <td className="px-4 py-3">{item.action}</td>
                                <td
                                    className={`px-4 py-3 text-right font-medium ${item.points > 0 ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {item.points > 0 ? `+${item.points}` : item.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

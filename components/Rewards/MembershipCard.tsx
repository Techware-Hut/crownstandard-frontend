import { Medal, Gift, Wallet, Award } from "lucide-react";

export default function MembershipCard() {
    return (
        <section className="grid grid-cols-5 gap-5 p-4 md:p-8 lg:p-10 text-white bg-brand-gold rounded-2xl">
            {/* Left Section */}
            <div className="flex flex-col items-start col-span-5 sm:col-span-2 lg:col-span-2 ">
                <div className="flex flex-col lg:flex-row items-start gap-4 mb-6">
                    {/* Icon container */}
                    <div className="flex items-center justify-center w-16 h-16 bg-white shadow-md rounded-xl shrink-0">
                        <Medal className="w-8 h-8 text-[#C49A3C]" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold leading-tight">Gold Member</h3>
                        <p className="text-sm leading-snug opacity-90">
                            Earn points and unlock exclusive rewards
                        </p>
                    </div>
                </div>

                <button className="px-6 py-2 text-sm font-medium transition border rounded-full border-white/70 hover:bg-white/10">
                    850 Points
                </button>
            </div>

            {/* Right: stat "cards" */}
            <div className="grid items-center grid-cols-1 gap-2 md:gap-3 sm:grid-cols-3 lg:gap-8 col-span-5 sm:col-span-3 lg:col-span-3 ">
                {[
                    { label: "Total earned", value: "1500", Icon: Award },
                    { label: "Total Redeemed", value: "650", Icon: Gift },
                    { label: "Available Balance", value: "850", Icon: Wallet },
                ].map(({ label, value, Icon }, i) => (
                    <div
                        key={i}
                        className="
                            sm:text-center rounded-xl
                            ring-1 ring-white/10
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
                            px-3 lg:px-8 py-6
                            flex flex-row sm:flex-col items-center sm:justify-center gap-4
                            lg:min-w-[180px]
                            backdrop-blur-[2px] h-full
                            "
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                        <Icon className="w-10 h-10 mb-4 text-white opacity-90" aria-hidden="true" />
                        <div>
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none text-white">{value}</p>
                        <p className="mt-2 sm:mt-3 text-sm text-white/90">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}

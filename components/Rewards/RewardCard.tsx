import { Coins } from "lucide-react";

export default function RewardCard() {
  return (
    <div className="p-5 bg-white border shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-600 px-4 py-2 bg-[#F3F1ED] rounded-full">
          <Coins size={14} className="text-[#B89029]" /> 200 Points
        </span>
        <span className="text-xs font-medium text-[#B89029] border border-[#B89029] px-4 py-2 rounded-full">
          100% OFF
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-3 md:mt-5 lg:mt-8">₹100 Service Discount</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get ₹100 off on your next booking.
      </p>

      <button className="w-full mt-4 py-2 bg-[#1D2432] text-white text-sm font-medium rounded-full hover:bg-[#111827]">
        Redeem Now
      </button>
    </div>
  );
}

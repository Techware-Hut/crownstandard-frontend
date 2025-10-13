"use client";

interface TabSwitcherProps {
  activeTab: "services" | "reviews";
  setActiveTab: (tab: "services" | "reviews") => void;
}

export default function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-5 mt-8">
      {/* Services Tab */}
      <button
        onClick={() => setActiveTab("services")}
        className={`relative px-8 flex-1 py-2 font-medium transition-all duration-100 border border-gray-300 rounded-md ${
          activeTab === "services"
            ? "bg-gray-900 text-white border-gray-900 shadow-md translate-y-[-1px]"
            : "bg-brand-gold text-white translate-y-[-1px]"
        }`}
      >
        Services
        {activeTab === "services" && (
          <div className="absolute -bottom-[10px] left-1/2 transition-all duration-200 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gray-900" />
        )}
      </button>

      {/* Reviews Tab */}
      <button
        onClick={() => setActiveTab("reviews")}
        className={`relative px-8 py-2 flex-1 font-medium transition-all duration-100 border border-gray-300 rounded-md ${
          activeTab === "reviews"
            ? "bg-gray-900 text-white border-gray-900 shadow-md translate-y-[-1px]"
            : "bg-brand-gold text-white shadow-md translate-y-[-1px]"
        }`}
      >
        Reviews
        {activeTab === "reviews" && (
          <div className="absolute -bottom-[10px] left-1/2 transition-all duration-200 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gray-900" />
        )}
      </button>
    </div>
  );
}

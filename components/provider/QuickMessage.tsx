import { ArrowRight } from "lucide-react";

export default function QuickMessage() {
  const messages = [
    "I’d like to know more about your services.",
    "Are you available for a consultation?",
    "What makes your cleaning service unique?",
    "I saw your reviews and would like to discuss a potential booking.",
  ];

  return (
    <div className="mt-8 bg-[#F3F1ED] rounded-lg p-4 sm:p-6">
      <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Message</h3>

      <ul className="divide-y divide-gray-200">
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`group cursor-pointer flex items-center gap-3 py-3 px-2 rounded-md transition-colors duration-200 hover:bg-[#FFFDF6]`}
          >
            {/* icon circle */}
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border bg-brand-gold/70 text-white transition-all duration-200 group-hover:bg-brand-gold group-hover:text-white"}
              `}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </span>

            {/* text */}
            <span
              className={`text-sm text-[#737373] transition-colors duration-200 group-hover:font-semibold group-hover:text-[#1F2937]`}
            >
              {msg}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

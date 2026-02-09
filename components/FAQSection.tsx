"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I know if Crown Standard is available in my area?",
    a: "Enter your address on the signup or booking flow. We’ll show real-time availability of providers nearby.",
  },
  {
    q: "Is it free to create an account?",
    a: "Yes. Creating a customer or provider account is completely free.",
  },
  {
    q: "How long does the verification process take for service providers?",
    a: "Verification usually takes 2–3 business days once documents are submitted.",
  },
  {
    q: "What is the platform fee?",
    a: "Platform fee is 10%"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-background pb-0">
      <div className="container 3xl:max-w-[1280px]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Find answers to the most common questions about getting started with
            Crown Standard
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12 divide-y divide-gray-200">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx}>
                {/* Question Trigger */}
                <button
                  onClick={() => toggle(idx)}
                  className={`w-full flex items-center justify-between py-4 px-4 text-left text-base font-semibold transition-colors ${
                    isOpen
                      ? "bg-[#BB9239] text-white"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {item.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-4 py-3 text-sm text-muted-foreground bg-card">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

type Stat = { label: string; value: number; suffix?: string };

export default function WhyChooseStats({
  backgroundUrl,               // e.g. "/about-banner.png" (same as BannerSection)
  stats = [
    { label: "Happy Customers", value: 12000, suffix: "+" },
    { label: "Verified Cleaners", value: 850, suffix: "+" },
    { label: "Services Completed", value: 45000, suffix: "+" },
    { label: "Average Rating", value: 4.9 },

  ],
}: {
  backgroundUrl: string;
  stats?: Stat[];
}) {
  // tiny mount flag for a subtle "count-up" reveal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative py-12 overflow-hidden text-white sm:py-14 md:py-20 lg:py-36">
      {/* background image (same as banner) */}
      <div className="absolute inset-0 -z-10">
        <Image src={backgroundUrl} alt="" fill priority={false} className="object-cover" />
        {/* base wash + gradient like your banner */}
        <div className="absolute inset-0 bg-black opacity-[88%]" />

        {/* <div className="absolute inset-0 bg-gradient-to-b from-[rgba(41,48,58,0.38)] to-[#1F2937]" /> */}
      </div>

      <div className="container 3xl:max-w-[1280px]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">Why Choose Crown Standard?</h2>
          <p className="mt-2 mb-5 text-sm md:text-base text-white/85">
            Trusted by thousands, backed by quality, and powered by convenience.
          </p>
        </div>

        {/* stats grid */}
        <div className="grid gap-4 lg:gap-6 mt-8 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 text-center border rounded-2xl bg-white/10 backdrop-blur-sm border-white/10 md:p-6 lg:p-10"
            >
              <div
                className={`
                  font-bold tracking-tight
                  text-2xl md:text-3xl lg:text-5xl text-[#b9903c]
                  transition-transform duration-500
                  ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}
                `}
              >
                {s.value.toLocaleString()}
                {s.suffix ? <span className="ml-1">{s.suffix}</span> : null}
              </div>
              <div className="mt-2 md:mt-4 text-sm md:text-lg text-white/85">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

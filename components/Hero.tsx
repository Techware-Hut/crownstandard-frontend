"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Cookies from "js-cookie";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 fill-current">
      <path d="M15.65 1.5c.1 1.2-.35 2.4-1.05 3.23-.77.92-2.03 1.64-3.2 1.54-.15-1.15.4-2.37 1.1-3.12.78-.85 2.14-1.54 3.15-1.65ZM19.44 17.2c-.52 1.18-.77 1.7-1.44 2.73-.93 1.44-2.24 3.24-3.86 3.26-1.44.01-1.8-.94-3.75-.93-1.95.01-2.35.95-3.8.94-1.61-.02-2.85-1.64-3.78-3.08-2.6-4.04-2.88-8.77-1.27-11.25 1.14-1.77 2.94-2.8 4.64-2.8 1.73 0 2.82.95 4.25.95 1.39 0 2.23-.95 4.23-.95 1.52 0 3.14.83 4.28 2.27-3.76 2.05-3.15 7.44.5 8.86Z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7">
      <path d="M3.4 2.2 13.8 12 3.4 21.8a2 2 0 0 1-.4-1.2V3.4c0-.44.15-.86.4-1.2Z" fill="#00C4CC" />
      <path d="m16.95 15.03-3.15-3.03 3.16-3.03 3.8 2.16c1.65.94 1.65 2.83 0 3.77l-3.8 2.13Z" fill="#FFB300" />
      <path d="M3.4 2.2c.3-.4.77-.64 1.27-.67l12.28 7.44-3.15 3.03L3.4 2.2Z" fill="#00E676" />
      <path d="m3.4 21.8 10.4-9.8 3.15 3.03-12.28 7.44a1.8 1.8 0 0 1-1.27-.67Z" fill="#FF5252" />
    </svg>
  );
}

export default function Hero() {
  const { user } = useAuth();
  const [dashboardLink, setDashboardLink] = useState("/login");

  useEffect(() => {
    const user_role = Cookies.get("user_role");

    if (!user_role) {
      setDashboardLink("/login");
      return;
    }

    switch (user_role) {
      case "customer":
        setDashboardLink("/dashboard");
        break;
      case "provider":
        setDashboardLink("/provider/dashboard");
        break;
      default:
        setDashboardLink("/login");
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full min-h-[620px] sm:min-h-[700px] md:min-h-[820px] lg:min-h-[900px]">
        <Image
          src="/banner.png"
          alt="Crown Standard team"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            sm:object-center
            object-[46%_0%]
          "
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#D9D9D9] mix-blend-multiply"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(41,48,58,0.38)] to-[#1F2937]"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container 3xl:max-w-[1280px]">
            <div className="max-w-5xl px-4 mx-auto text-center text-white">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">
                Welcome to Crown Standard
              </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90">
                Experience premium cleaning services with trusted professionals.
                <br className="hidden sm:block" />
                Book in minutes, relax for hours.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                {/* <Link href="#get-started" className="btn-primary px-8 py-2.5 md:py-3 rounded-full border-[#b9903c]">
                  Book Now
                </Link>
                <Link href={dashboardLink} className="text-white border-white/60 border-[1px] px-6 md:px-8 py-2.5 md:py-3 rounded-full">
                  My Dashboard
                </Link> */}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <Link
                  href="https://apps.apple.com/in/app/crown-standard-cleaning/id6764820454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/25 bg-[#0f0f10] px-5 py-3 text-left text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-black"
                >
                  <AppleIcon />
                  <span className="leading-tight">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">
                      Download on the
                    </span>
                    <span className="block text-base font-semibold">
                      App Store
                    </span>
                  </span>
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=ca.crownstandard.crownstandard&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/25 bg-[#0f0f10] px-5 py-3 text-left text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-black"
                >
                  <GooglePlayIcon />
                  <span className="leading-tight">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">
                      Get it on
                    </span>
                    <span className="block text-base font-semibold">
                      Google Play
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

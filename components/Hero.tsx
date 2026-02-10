"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import Cookies from "js-cookie";

export default function Hero() {
  const { user } = useAuth();

  const getDashboardLink = () => {

    const user_role = Cookies.get("user_role")


    if (!user_role) return "/login";
      
    switch (user_role) {
      case "customer":
        return "/dashboard";
      case "provider":
        return "/provider/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/login";
    }
  };

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
                <Link href="#get-started" className="btn-primary px-8 py-2.5 md:py-3 rounded-full border-[#b9903c]">
                  Book Now
                </Link>
                <Link href={getDashboardLink()} className="text-white border-white/60 border-[1px] px-6 md:px-8 py-2.5 md:py-3 rounded-full">
                  My Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

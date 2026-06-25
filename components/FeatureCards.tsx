"use client"
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CalendarIcon, ShieldStarIcon, StarsBadgeIcon } from "./Icons";


function PatternBG({ dark }: { dark?: boolean }) {
  // subtle top-right pattern like the mock (SVG data URI)
  const svg = encodeURIComponent(`
    <svg width="260" height="180" viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="${dark ? "#ffffff" : "#111827"}" stroke-opacity="${dark ? 0.06 : 0.06}" stroke-width="8">
        <circle cx="220" cy="30" r="28"/>
        <rect x="170" y="75" width="64" height="40" rx="10"/>
        <path d="M190 150h60"/>
        <circle cx="120" cy="40" r="20"/>
        <path d="M90 110h80"/>
      </g>
    </svg>
  `);

  return (
    <div
      aria-hidden
      className="absolute top-0 right-0 w-48 h-40 pointer-events-none md:h-48 md:w-60"
      style={{ background: `url("data:image/svg+xml,${svg}") right top / contain no-repeat` }}
    />
  );
}

function FeatureCard({
  title,
  desc,
  cta,
  dark,
  icon,
  href,
}: {
  title: string;
  desc: string;
  cta: string;
  dark?: boolean;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <article
      className={`relative rounded-[18px] md:rounded-[22px] p-3 md:p-4 lg:p-8 shadow-soft ${
        dark ? "bg-brand-dark text-white" : "bg-white"
      }`}
    >
      {!dark && <PatternBG />}

      {/* big icon tile */}
      <div
        className={`inline-flex h-16 w-16 items-center justify-center rounded-lg lg:h-20 lg:w-20 p-3 ${
          dark ? "bg-brand-gold text-white" : "bg-brand-gold text-white"
        }`}
      >
        {icon}
      </div>

      <h3
        className={`mt-8 font-bold leading-tight ${
          dark ? "text-white" : "text-slate-900"
        } text-xl  md:text-2xl lg:text-3xl`}
      >
        {title}
      </h3>

      <p
        className={`mt-3 text-sm md:text-base ${
          dark ? "text-white/80" : "text-slate-600"
        }`}
      >
        {desc}
      </p>

      {/* CTA styles: dark card = gold outline; light cards = dark pill */}
      {dark ? (
        <a
          href={href}
          className="inline-flex items-center justify-center px-6 py-3 mt-6 text-sm font-semibold transition border rounded-full border-brand-gold/70 text-brand-gold hover:bg-brand-gold/10"
        >
          {cta}
        </a>
      ) : (
        <a
          href={href}
          className="inline-flex items-center justify-center px-6 py-3 mt-6 text-sm font-semibold text-white transition rounded-full bg-brand-dark hover:brightness-110"
        >
          {cta}
        </a>
      )}
    </article>
  );
}


export default function FeatureCards() {
  const [dashboardLink, setDashboardLink] = useState("/login");

  useEffect(() => {
    const user_role = Cookies.get("user_role");

    if (!user_role) {
      setDashboardLink("/login");
      return;
    }

    switch (user_role) {
      case "customer":
        setDashboardLink("/dashboard/my-bookings");
        break;
      case "provider":
        setDashboardLink("/provider/dashboard");
        break;
      case "admin":
        setDashboardLink("/admin/dashboard");
        break;
      default:
        setDashboardLink("/login");
    }
  }, []);

  return (
    <section className="relative">
      {/* gold band behind cards (height matches mock) */}
      <div className="absolute inset-x-0 h-full bg-brand-gold -z-10" />

      {/* pull cards upward to overlap the band */}
      <div className="grid gap-4 lg:gap-6 p-5 pb-10 mx-auto -mt-16 max-w-7xl md:-mt-20 sm:grid-cols-2 md:grid-cols-3">
        <FeatureCard
          title="Quick Booking"
          desc="Book your cleaning service in just 3 steps. Select date, time, and preferences."
          cta="Start Booking"
          icon={<CalendarClock className="w-12 h-12" />}
          href="how-to-get-started"
        />

        <FeatureCard
          dark
          title="Trusted Professionals"
          desc="All service providers are verified, insured, and highly rated by customers."
          cta="Browse Service"
          icon={<ShieldStarIcon className="w-12 h-12" />}
          href="services"
        />

        <FeatureCard
          title="Easy Management"
          desc="Track bookings, chat with providers, and leave reviews — all in one place."
          cta="My Bookings"
          icon={<StarsBadgeIcon className="w-12 h-12" />}
          href={dashboardLink}
        />
      </div>
    </section>
  );
}

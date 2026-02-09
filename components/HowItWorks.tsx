// components/HowCrownWorks.tsx
import { Briefcase, ClipboardCheck } from "lucide-react";

type Step = { title: string; desc: string };

function StepsList({
  steps,
  variant,
}: {
  steps: Step[];
  variant: "dark" | "light";
}) {
  const numBase =
    variant === "dark"
      ? "bg-white/10 text-white"
      : "bg-black/5 text-slate-800";
  const titleBase =
    variant === "dark" ? "text-white" : "text-slate-900";
  const descBase =
    variant === "dark" ? "text-white/70" : "text-slate-600";

  return (
    <ul className="mt-6 space-y-6">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <div
            className={`h-9 w-9 shrink-0 rounded-full grid place-items-center font-semibold ${numBase}`}
          >
            {i + 1}
          </div>

          <div className="min-w-0">
            <div className={`font-semibold ${titleBase}`}>{s.title}</div>
            <p className={`mt-1 text-sm leading-relaxed ${descBase}`}>
              {s.desc}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WorkCard({
  variant,
  title,
  icon,
  steps,
}: {
  variant: "dark" | "light";
  title: string;
  icon: React.ReactNode;
  steps: Step[];
}) {
  const base =
    "rounded-[18px] p-7 lg:p-10 shadow-soft overflow-hidden";
  const wrap =
    variant === "dark"
      ? "bg-brand-dark"
      : "bg-[#F3EFE9]"; // soft beige like mock
  const heading =
    variant === "dark" ? "text-white" : "text-slate-900";
  const rule =
    variant === "dark" ? "bg-brand-gold/80" : "bg-brand-gold/70";

  return (
    <article className={`${base} ${wrap}`}>
      {/* icon tile */}
      <div className="inline-flex items-center justify-center w-16 h-16 text-white rounded-lg bg-brand-gold">
        {icon}
      </div>

      <h3 className={`mt-6 text-2xl font-semibold ${heading}`}>
        {title}
      </h3>

      {/* gold divider line */}
      <div className={`mt-4 h-[2px] w-full ${rule}`} />

      <StepsList steps={steps} variant={variant} />
    </article>
  );
}

export default function HowCrownWorks() {
  return (
    <section className="pt-14 md:pt-20">
      <div className="container 3xl:max-w-[1280px]">
        {/* section header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-slate-900">
            How Crown Standard Works
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            Simple, secure, and reliable – booking professional cleaning services has never been easier.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 mt-10 md:grid-cols-2">
          <WorkCard
            variant="dark"
            title="For Customers"
            icon={<ClipboardCheck className="h-7 w-7" strokeWidth={2} />}
            steps={[
              {
                title: "Browse Services",
                desc:
                  "Explore verified cleaners in your area with detailed profiles and reviews.",
              },
              {
                title: "Book & Pay",
                desc:
                  "Select your preferred date, time, and service details. Pay securely online.",
              },
              {
                title: "Relax & Enjoy",
                desc:
                  "Track your booking, communicate with your cleaner, and enjoy the results.",
              },
            ]}
          />

          <WorkCard
            variant="light"
            title="For Service Provider"
            icon={<Briefcase className="h-7 w-7" strokeWidth={2} />}
            steps={[
              {
                title: "Register & Get Approved",
                desc:
                  "Complete onboarding and verification to join a trusted professional network.",
              },
              {
                title: "Choose Work & Get Paid",
                desc:
                  "Accept jobs that fit your availability and receive secure, on-time payments.",
              },
              {
                title: "Build Your Reputation",
                desc:
                  "Deliver great service, gain customer ratings, and grow your long-term earnings.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

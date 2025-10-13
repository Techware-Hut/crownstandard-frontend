// components/AboutTwoCards.tsx
import Image from "next/image";

type Props = {
  /** background image in /public, e.g. "/about-pattern.png" */
  backgroundUrl: string;
};

export default function AboutTwoCards({ backgroundUrl }: Props) {
  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-24">
      {/* background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundUrl}
          alt=""
          fill
          priority={false}
          className="object-cover"
        />
        {/* optional soft gold tint to match design; remove if not needed */}
        <div className="absolute inset-0 bg-[#c69e4b] mix-blend-multiply" />
      </div>

      <div className="container 3xl:max-w-[1280px] grid gap-6 md:grid-cols-2">
        <Card
          title="For Customers"
          items={[
            "Connect customers with trusted, professional cleaning services",
            "Provide flexible earning opportunities for service providers",
            "Maintain the highest standards of quality and safety",
          ]}
        />

        <Card
          title="For Service Providers"
          items={[
            "Build a community based on trust, reliability, and excellence",
            "Make professional cleaning accessible to everyone",
          ]}
        />
      </div>
    </section>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="p-6 rounded-2xl bg-white/95 shadow-soft md:p-8 md:py-10">
      <h3 className="text-xl font-semibold md:text-2xl text-slate-900">{title}</h3>

      {/* thin divider under title */}
      <div className="mt-3 h-[2px] w-24 bg-slate-200" />

      <ul className="mt-5 space-y-2 md:space-y-4 text-sm md:text-base text-slate-700">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full ring-1 ring-brand-gold/50">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-brand-gold" fill="currentColor">
                <path d="M7.5 13.1 4.9 10.5l-1 1 3.6 3.6 8-8-1-1-7 7Z" />
              </svg>
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

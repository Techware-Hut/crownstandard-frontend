import Image from "next/image";
import Link from "next/link";

export default function NeedCleaning() {
  return (
    <section id="about" className="px-5">
      <div className="grid items-center gap-4 md:gap-6 lg:gap-10 md:grid-cols-2">
        {/* left: image */}
        <div className="relative w-full overflow-hidden rounded-2xl shadow-soft aspect-[16/12] lg:aspect-[5/4] h-full">
          <Image
            src="/index-image1.png"
            alt="Cleaner with supplies"
            fill
            priority={false}
            sizes="(min-width: 1024px) 550px, 100vw"
            className="object-cover"
          />
        </div>

        {/* right: content */}
        <div className="lg:px-5">
          {/* icon tile */}
          <div className="inline-flex items-center justify-center w-16 h-16 text-white rounded-lg bg-brand-gold">
            {/* shield/stack icon to match the mock */}
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 3l7 3v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z" />
              <path d="m12 8 1 2 2 .3-1.5 1.5.4 2.1L12 13l-1.9.9.4-2.1L9 10.3l2-.3 1-2Z" fill="currentColor" />
            </svg>
          </div>

          <h2 className="mt-5 font-bold tracking-tight text-slate-900 text-2xl md:text-3xl lg:text-4xl">
            Need Cleaning?
          </h2>
          <p className="mt-2 text-slate-500">
            Get your home or office cleaned by trusted professionals.
          </p>

          {/* checklist */}
          <ul className="mt-6 space-y-3 text-[15px] md:text-base text-slate-700">
            {[
              "Browse verified cleaning services",
              "Book instantly with flexible scheduling",
              "Secure payment and satisfaction guarantee",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 mt-1 rounded-full ring-1 ring-brand-gold/40">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-brand-gold" fill="currentColor">
                    <path d="M7.5 13.1 4.9 10.5l-1 1 3.6 3.6 8-8-1-1-7 7Z" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* thin gold divider like the mock */}
          <div className="w-full my-6 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />

          {/* buttons */}
          <div className="flex flex-wrap gap-3">
            {/* gold filled */}
            <Link href="#services" className="px-6 py-2.5 md:py-3 text-white rounded-full bg-brand-gold">
              Find Cleaners
            </Link>

            {/* outline */}
            <Link
              href="#"
              className="px-6 py-2.5 md:py-3 bg-white font-semibold border rounded-full text-slate-800 border-slate-300 hover:bg-slate-50"
            >
              Dashboard
            </Link>

            {/* dark filled */}
            <Link href="#" className="px-6 py-2.5 md:py-3 rounded-full btn-dark">
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

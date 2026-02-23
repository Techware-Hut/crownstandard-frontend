import Image from "next/image";
import Link from "next/link";

type Props = {
  patternUrl: string; // e.g. "/pattern-lines.png"
};

export default function CTASection({ patternUrl }: Props) {
  return (
    <section className="relative py-12 md:py-20">
      <div className="container 3xl:max-w-[1280px]">
        <div className="relative py-16 overflow-hidden text-center text-white rounded-2xl bg-brand-dark md:py-20">
          {/* pattern top-left */}
          <Image
            src={patternUrl}
            alt=""
            width={500}
            height={500}
            className="absolute top-0 left-0 pointer-events-none select-none mix-blend-luminosity"
          />
          {/* pattern bottom-right */}
          <Image
            src={patternUrl}
            alt=""
            width={500}
            height={500}
            className="absolute bottom-0 right-0 rotate-180 pointer-events-none select-none mix-blend-luminosity"
          />

          {/* content */}
          <div className="relative z-10 max-w-3xl px-4 mx-auto">
            <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
              Ready to Experience Crown Standard?
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/80">
              Join our growing community of satisfied customers and professional service providers
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="services"
                className="px-6 py-3 font-medium text-white rounded-full bg-brand-gold hover:opacity-90"
              >
                Book a Service
              </Link>
              <Link
                href="/"
                className="px-6 py-3 text-white bg-transparent border rounded-full border-white/30 hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

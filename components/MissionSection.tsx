import { Target } from "lucide-react";
import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="py-16 bg-white section md:py-24">
      <div className="container 3xl:max-w-[1280px] grid gap-10 md:grid-cols-2 md:items-center">
        {/* left: text */}
        <div>
          <div className="inline-flex items-center justify-center text-white rounded-lg h-14 w-14 bg-brand-gold">
            <Target className="h-7 w-7" strokeWidth={2} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            At Crown Standard, we believe that everyone deserves a clean,
            comfortable living and working environment. Our mission is to
            revolutionize the cleaning service industry by creating a seamless,
            trustworthy platform that benefits both customers seeking quality
            services and professionals looking to grow their businesses.
          </p>
        </div>

        {/* right: image */}
        <div className="relative w-full overflow-hidden rounded-2xl shadow-soft aspect-[4/3] h-full">
          <Image
            src="/ourMission.png" // replace with your mission image
            alt="Our Mission"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

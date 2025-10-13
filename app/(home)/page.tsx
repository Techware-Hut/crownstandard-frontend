import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import NeedCleaning from "@/components/NeedCleaning";

export default function Page() {
  return (
    <main className="relative">
      {/* <Navbar /> */}
      <Hero />
      <div id="get-started" className="bg-brand-gold">
        {/* spacer for the gold band under hero */}
        <div className="container 3xl:max-w-[1280px] h-0" />
      </div>
      <FeatureCards />
      <section id="services" className="pt-6 section">
        <div className="mx-auto max-w-7xl">
          <NeedCleaning />
        </div>
      </section>
    </main>
  );
}

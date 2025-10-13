import Image from "next/image";

type Variant = "dark" | "gold";

type Feature = {
    title: string;
    description: string;
    variant: Variant;
};

type Props = {
    patternUrl: string; // e.g. "/pattern-web.png"
};

const base =
    "relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-soft";

const variantClasses: Record<Variant, string> = {
    dark: "bg-brand-dark text-white",
    gold: "bg-brand-gold text-white",
};

const descClasses: Record<Variant, string> = {
    dark: "text-white/80",
    gold: "text-white/90",
};

function FeatureTile({ item, patternUrl }: { item: Feature; patternUrl: string }) {
    return (
        <article className={`${base} ${variantClasses[item.variant]} relative overflow-hidden pt-20`}>
            {/* pattern pinned to top-left */}
            <Image
                src={patternUrl}           // e.g. "/pattern-top-left.png" in /public
                alt=""
                width={300}
                height={300}
                priority={false}
                className="absolute top-0 left-0 pointer-events-none select-none mix-blend-luminosity"
                aria-hidden
            />

            {/* content above pattern */}
            <div className="relative z-10 mt-5 md:mt-20">
                <h3 className="text-lg font-semibold text-center md:text-xl">{item.title}</h3>
                <p className={`mt-2 text-sm md:text-base text-center ${descClasses[item.variant]}`}>
                    {item.description}
                </p>
            </div>
        </article>
    );
}


export default function WhyChooseGrid({ patternUrl }: Props) {
    const features: Feature[] = [
        {
            title: "Verified & Insured",
            description:
                "All providers pass background checks and carry insurance for your peace of mind.",
            variant: "gold",
        },
        {
            title: "Flexible Scheduling",
            description:
                "Book services that fit your schedule with same-day and next-day options.",
            variant: "dark",
        },
        {
            title: "Quality Guaranteed",
            description:
                "Our satisfaction guarantee means we’ll make it right, every time.",
            variant: "gold",
        },
        {
            title: "Trusted Community",
            description:
                "Join thousands of satisfied customers and professional cleaners.",
            variant: "dark",
        },
        {
            title: "Mobile-First Experience",
            description:
                "Real-time updates, GPS tracking, and instant messaging on the go.",
            variant: "gold",
        },
        {
            title: "Secure Payments",
            description:
                "Safe payment processing with multiple options and transparent pricing.",
            variant: "dark",
        },
    ];

    return (
        <section className="section bg-[#F6F1E5]">
            <div className="container 3xl:max-w-[1280px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-slate-900">
                        Why Choose Crown Standard?
                    </h2>
                    <p className="max-w-2xl mx-auto mt-2 text-sm md:text-base text-slate-600">
                        We built our platform with both customers and providers in mind—
                        focusing on trust, quality, and convenience.
                    </p>
                </div>

                {/* grid */}
                <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <FeatureTile key={f.title} item={f} patternUrl={patternUrl} />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { notFound } from "next/navigation";
import BannerSection from "@/components/BannerSection";
import {
    DUMMY_SERVICE,
    ID,
    normalizeService,
    type Service,
} from "@/types/service";
import ServiceOverviewCard from "@/components/service/ServiceOverviewCard";
import BookingDetails from "@/components/service/BookingDetails";

// ---------------- Data (stub) ----------------
async function getService(id: string): Promise<Service | null> {
    if (!id) return null;
    return { ...DUMMY_SERVICE, id: id as ID };
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ serviceid?: string | string[] }>;
}) {
    const resolvedParams = await params;
    const raw = resolvedParams?.serviceid;
    const serviceId = Array.isArray(raw) ? raw[0] : raw ?? "";

    if (!serviceId) {
        return notFound();
    }

    const fetched = await getService(serviceId);
    if (!fetched) {
        return notFound();
    }

    const service = normalizeService(fetched);

    return (
        <>
            <BannerSection
                title={serviceId}
                imageUrl="/GetStarted-banner.png"
                page={`service / ${serviceId}`}
            />

            {/* Light beige content section */}
            <section className="section bg-white">
                <div className="container 3xl:max-w-[1280px]">
                    <ServiceOverviewCard service={service} />
                </div>
            </section>
            <section className="relative">
                {/* Beige top section */}
                <div className="section bg-[#F4F1EC]">
                    <div className="relative z-20 container 3xl:max-w-[1280px]">
                        <BookingDetails service={service} />
                    </div>
                </div>

                {/* Dark band (starts higher, covers enough height) */}
                <div
                    className="absolute inset-x-0 -bottom-0 h-[400px] bg-[#1F2937] md:h-[300px] z-0"
                    aria-hidden="true"
                />


            </section>

            {/* Dark bottom band */}
        </>
    );
}

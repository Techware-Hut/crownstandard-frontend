

import { notFound } from "next/navigation";
import BannerSection from "@/components/BannerSection";
import {
    ID,
    normalizeService,
    type Service,
    PriceUnit,
    BadgeType,
} from "@/types/service";
import ServiceOverviewCard from "@/components/service/ServiceOverviewCard";
import BookingDetails from "@/components/service/BookingDetails";
import { servicesApi } from "@/lib/servicesApi";

async function getService(id: string): Promise<Service | null> {
  if (!id) return null;


  try {
    const response = await servicesApi.getServiceById(id);
    return {
      id: response.data._id as ID,
      name: response.data.title,
      category: "Home Services",
      badge: BadgeType.Residential,
      rating: response.data.ratingSummary.avg,
      reviewCount: response.data.ratingSummary.count,
      pricing: {
        amount: response.data.basePrice,
        currency: response.data.currency,
        unit: response.data.priceUnit === "per_hour" ? PriceUnit.PerHour : PriceUnit.PerService,
        minHours: response.data.minHours
      },
      coverImageUrl: response.data.media[0] || "/ServiceCleaning.png",
      shortDescription: response.data.description,
      provider: {
        id: response.data.provider._id as ID,
        name: response.data.provider.name
      },
      providerApprovalStatus: response.data.provider?.providerProfile?.approvalStatus ?? null,
      highlights: response.data.includes || [],
      whatsIncluded: response.data.includes || [],
      whatsExcluded: response.data.exclusions || []
    };
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
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
                title={service.name}
                imageUrl="/GetStarted-banner.png"
                page={`service / ${service.name}`}
            />

            <section className="section bg-white">
                <div className="container 3xl:max-w-[1280px]">
                    <ServiceOverviewCard service={service} />
                </div>
            </section>
            <section className="relative">
                <div className="section bg-[#F4F1EC]">
                    <div className="relative z-20 container 3xl:max-w-[1280px]">
                        <BookingDetails service={service} />
                    </div>
                </div>

                <div
                    className="absolute inset-x-0 -bottom-0 h-[400px] bg-[#1F2937] md:h-[300px] z-0"
                    aria-hidden="true"
                />
            </section>
        </>
    );
}

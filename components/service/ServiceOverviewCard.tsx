// components/service/ServiceOverviewCard.tsx
import Image from "next/image";
import { DollarSign, Clock, MapPin, UserRound } from "lucide-react";
import Pill from "@/components/ui/Pill";
import {
  type NormalizedService,
  formatMoney,
  PriceUnit,
} from "@/types/service";

export default function ServiceOverviewCard({ service }: { service: NormalizedService }) {
  const priceLabel =
    formatMoney(service.pricing.amount, service.pricing.currency) +
    (service.pricing.unit === PriceUnit.PerHour ? "/hour" : "/service");
  const minLabel = service.pricing.minHours ? `${service.pricing.minHours}h minimum` : null;

  return (
    <section className="mt-8 rounded-2xl">
      <div className="grid gap-6 lg:gap-10 md:grid-cols-[360px,1fr]">
        {/* Left: Image with badge */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border bg-white">
            <Image
              src={service.coverImageUrl}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 360px"
              priority
            />
          </div>
          {service.badge ? (
            <span className="absolute px-3 py-1 text-xs font-medium text-white bg-yellow-600 rounded-full left-3 top-3">
              {service.badge.charAt(0).toUpperCase() + service.badge.slice(1)}
            </span>
          ) : null}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-[#F4F1EC] px-4 py-1 text-sm shadow-sm">Profile</button>
            <button className="rounded-full bg-[#F4F1EC] px-4 py-1 text-sm shadow-sm">Add to Favourites</button>
            <button className="rounded-full bg-[#F4F1EC] px-4 py-1 text-sm shadow-sm">Tip</button>
          </div>

          {/* Title + short description */}
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">{service.name}</h1>
            <p className="max-w-2xl mt-2 text-gray-600">{service.shortDescription}</p>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-2 text-gray-700">
            <Pill>
              <DollarSign className="w-4 h-4" /> {priceLabel}
            </Pill>
            {minLabel ? (
              <Pill>
                <Clock className="w-4 h-4" /> {minLabel}
              </Pill>
            ) : null}
            {service.location ? (
              <Pill>
                <MapPin className="w-4 h-4" /> {service.location}
              </Pill>
            ) : null}
            {service.provider?.name ? (
              <Pill>
                <UserRound className="w-4 h-4" /> Provider: {service.provider.name}
              </Pill>
            ) : null}
          </div>

          {/* Rating (optional if you want it visible here) */}
          {/* <RatingStars rating={service.rating} /> */}

          {/* Notice */}
          {service.longNotice ? (
            <div className="rounded-xl bg-[#F4F1EC] p-4 text-sm text-gray-700 shadow-sm">
              <span className="font-medium">Service Notice: </span>
              {service.longNotice}
            </div>
          ) : null}

          {/* Disclaimer */}
          {service.disclaimer ? (
            <div className="p-4 text-sm border rounded-xl bg-amber-50 text-amber-900">
              <span className="font-medium">Important Disclaimer: </span>
              {service.disclaimer}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

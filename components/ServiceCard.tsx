"use client"
import Image from "next/image";
import { renderStars } from "@/utils/renderStars";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge: string;
  provider: string;
};

export default function ServiceCard({ service, provider}: { service: Service, provider : boolean }) {

    const router = useRouter();

    const go_to_servicepage = ()=>{
        if(!localStorage.getItem("user"))
            router.push("/login")
        else
            router.push(`/service/${service.id}`)

    }

    return (
<article className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
    {/* Image - reduced height */}
    <div className="relative">
  <Image
  src={service.imageUrl}
  alt={service.title}
  width={640}
  height={500}
  className="object-cover w-full sm:object-contain md:object-cover h-48"
/>
        <span className="absolute left-3 top-3 rounded-full bg-[#C9A254] px-2 py-1 text-xs font-semibold text-white">
            {service.badge}
        </span>
    </div>

    {/* Middle content - reduced padding */}
    <div className="p-3">
        <div className="flex flex-wrap items-center gap-1 mb-2 text-xs">
            <button className="px-3 py-1 rounded-full bg-[#F4F1EC]">Profile</button>
            <button className="px-2 py-1 rounded-full bg-[#F4F1EC]">Favourites</button>
            <button className="px-2 py-1 rounded-full bg-[#F4F1EC]">Tip</button>
        </div>

        <h3 className="text-base font-semibold">{service.title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>

        <div className="mt-3 mb-1 text-sm text-gray-800">
            <span className="font-semibold">${service.price}/hour</span> • {service.duration}
        </div>
        <div className="text-sm text-gray-600">{service.location}</div>
    </div>

    {/* Bottom details - reduced padding */}
    <div className="p-3 bg-[#FFF6E2]">
        <div className="flex items-center justify-between text-sm">
            <div>
                <div className="font-medium">{service.provider}</div>
                <div className="flex items-center gap-2 mb-2">
                    {renderStars(service.rating)}
                    <span className="text-[11px] text-gray-600">
                        {service.rating} ({service.reviews})
                    </span>
                </div>
            </div>
            <div className="text-right">
                <div className="font-semibold">${service.price}/h</div>
                <div className="text-xs text-gray-600">Starting rate</div>
            </div>
        </div>
        {!provider &&
            <button
                // href={`/service/${service.id}`}
                onClick={go_to_servicepage}
                className="block w-full py-2 mt-3 text-sm font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-black"
            >
                Book This Service
            </button>
        }
    </div>
</article>

    );
}

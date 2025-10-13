import Image from "next/image";
import { Star, Phone, Mail, MapPin, Heart, User2, Banknote } from "lucide-react";

const renderStars = (rating:number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1 text-[#B89029]">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-current" />
            ))}
            {hasHalfStar && (
                <div className="relative w-3.5 h-3.5">
                    <Star className="w-3.5 h-3.5 text-gray-300" />
                    <Star
                        className="absolute left-0 top-0 w-3.5 h-3.5 text-[#B89029] fill-current"
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
            ))}
        </div>
    );
};

export default function ProviderHeader() {
    return (
        <div className="grid md:grid-cols-[1fr_1fr] gap-6">
            {/* Left: Provider Info */}
            <div className="relative flex items-center justify-between p-4 sm:p-6 overflow-hidden rounded-lg bg-[#F6F4EF]">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Avatar */}
                    <div className="flex items-center justify-center mt-1 overflow-hidden bg-gray-100 border-4 border-gray-400 rounded-full">
                        {/* <Image
                            src="/avatar-placeholder.png"
                            alt="Provider avatar"
                            width={64}
                            height={64}
                            className="object-cover"
                        /> */}
                        <User2 className="w-16 h-16 text-gray-400" />
                    </div>

                    {/* Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Sofia</h2>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                            {renderStars(4.7)}
                            <span className="ml-1 text-sm font-medium text-gray-800">(4.7)</span>
                            <span className="text-sm text-gray-600">(93 Reviews)</span>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-3 space-y-1 text-sm text-gray-700 flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 sm:w-1/2 w-full">
                                <Phone className="w-4 h-4 text-[#C5A04B]" />
                                <span className="font-semibold text-gray-900">+1 (555) 123-4567</span>
                            </div>

                            <div className="flex items-center gap-2 sm:w-1/2 w-full">
                                <Mail className="w-4 h-4 text-[#C5A04B]" />
                                <a
                                    href="mailto:sofia.styles@example.com"
                                    className="text-gray-700 hover:underline hover:text-gray-900"
                                >
                                    sofia.styles@example.com
                                </a>
                            </div>

                            <div className="flex items-center gap-2 sm:w-1/2 w-full">
                                <MapPin className="w-4 h-4 text-[#C5A04B]" />
                                <span>Los Angeles, CA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite (Heart) Button */}
                <button
                    className="absolute flex items-center justify-center w-9 h-9 transition rounded-full top-6 right-6 bg-[#C5A04B]/90 hover:bg-[#C5A04B] shadow-sm"
                    title="Add to favorites"
                >
                    <Heart className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Right: Starting Rate */}
            <div className="relative p-4 sm:p-6 overflow-hidden text-white rounded-lg bg-[#1E2432]">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center text-brand-gold">
                            <Banknote />
                        </span>
                        <p className="text-xl font-bold text-brand-gold">Starting Rate</p>
                    </div>
                    <p className="mb-4 text-xs text-gray-400">
                        Base cleaning rate. Additional rate may apply.
                    </p>
                    <p className=" text-2xl lg:text-3xl font-semibold">$60.00/hour</p>
                </div>

                {/* Decorative pattern */}
                <Image
                    src="/pattern-top-right.png"
                    alt="pattern"
                    width={150}
                    height={150}
                    className="absolute bottom-0 right-0 pointer-events-none select-none opacity-20"
                />
            </div>
        </div>
    );
}

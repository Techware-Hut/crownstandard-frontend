import { Star } from "lucide-react";

interface ReviewsSummaryCardProps {
  totalReviews: number;
  avgRating: number; // e.g., 4.3, 3.5, etc.
}

export default function ReviewsSummaryCard({
  totalReviews,
  avgRating,
}: ReviewsSummaryCardProps) {
  const renderStars = () => {
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-[#B89029]">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300" />
            <Star
              className="absolute left-0 top-0 w-4 h-4 text-[#B89029] fill-current"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 shadow-sm bg-[#F2F0EC] md:w-1/2"
    >
      {/* soft radial highlight */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-24 w-28
          rounded-bl-[999px] bg-[radial-gradient(circle_at_top_right,white_0%,#F2F0EC_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900">
            Reviews Received
          </p>

          <p className="my-2 text-3xl font-bold text-[#b9903c]">
            {totalReviews}
          </p>

          <div className="flex items-center gap-1 mt-1">
            {renderStars()}
            <span className="ml-1 text-xs text-gray-600">
              ({avgRating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* icon bubble */}
        <div className="grid w-12 h-12 shrink-0 place-items-center rounded-xl">
          <Star className="w-7 h-7 text-[#B89029]" />
        </div>
      </div>
    </div>
    
  );
}

import { Star } from "lucide-react";

interface ReviewItemProps {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export default function ReviewItem({
  name,
  rating,
  date,
  comment,
}: ReviewItemProps) {

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-[#B89029]">
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

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-start justify-between p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="flex items-center justify-center w-10 h-10 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full shrink-0">
          {initials}
        </div>

        {/* Review content */}
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">{name}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-[#B89029]">
              {renderStars()}
            </div>
            <p className="text-xs text-gray-500">
              ({rating.toFixed(1)}) {date}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{comment}</p>
        </div>
      </div>
    </div>
  );
}

import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewsSummaryCard from "@/components/reviews/ReviewsSummaryCard";
import ReviewItem from "@/components/reviews/ReviewItem";

export default function ReviewsPage() {
  const reviews = [
    {
      id: "1",
      name: "Marlin Doe",
      rating: 5.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "2",
      name: "Marlin Doe",
      rating: 4.5,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "3",
      name: "Marlin Doe",
      rating: 2.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
    {
      id: "4",
      name: "Marlin Doe",
      rating: 3.0,
      date: "Sep 15, 2025",
      comment: "See what customers and other users have said about your services",
    },
  ];

  return (
    <div className="relative">


      <div className="relative z-10 container 3xl:max-w-[1280px] px-6 pt-6 md:pt-8 lg:pt-16 pb-10">
        {/* Header */}
        <ReviewsHeader />

        {/* Summary Card */}
        <div className="mt-8 mb-12">
          <ReviewsSummaryCard totalReviews={24} avgRating={4.6} />
        </div>

        {/* Reviews Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-[#1D2432]">
            Reviews About My Services
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            See what customers and other users have said about your services
          </p>

          <div className="bg-[#F5F3EF] p-4 sm:p-6 rounded-2xl">
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewItem key={review.id} {...review} />
              ))}
            </div>
          </div>
        </section>

      </div>
      <div className="absolute bottom-0 w-full h-64 bg-gray-900" />
    </div>
  );
}

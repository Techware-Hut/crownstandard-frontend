import FavoriteCard from "@/components/Favorites/FavoriteCard";
import EmptyFavorites from "@/components/Favorites/EmptyFavorites";

export default function FavoritesPage() {
    const favorites = [
        {
            name: "Alice Johnson",
            date: "01/08/2025",
            services: [
                {
                    title: "Deep Tissue Massage",
                    type: "Massage",
                    rate: "$120/hour",
                    min: "1.5h minimum",
                    location: "Downtown LA",
                },
            ],
        },
        {
            name: "Wellness Spa Co.",
            date: "20/07/2025",
            services: [
                {
                    title: "Hydra Facial",
                    type: "Facial",
                    rate: "$120/hour",
                    min: "1.5h minimum",
                    location: "Downtown LA",
                },
                {
                    title: "Hydra Facial",
                    type: "Facial",
                    rate: "$120/hour",
                    min: "1.5h minimum",
                    location: "Downtown LA",
                },
            ],
        },
        {
            name: "James Lee",
            date: "05/09/2025",
            services: [
                {
                    title: "Deep Tissue Massage",
                    type: "Massage",
                    rate: "$120/hour",
                    min: "1.5h minimum",
                    location: "Downtown LA",
                },
            ],
        },
        {
            name: "James Lee",
            date: "05/09/2025",
            services: [
                {
                    title: "Deep Tissue Massage",
                    type: "Massage",
                    rate: "$120/hour",
                    min: "1.5h minimum",
                    location: "Downtown LA",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen px-6 pt-6 md:pt-8 lg:pt-16  container 3xl:max-w-[1280px]">
            {/* Header */}
            <header className="lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Favorite Cleaners</h1>
            </header>

            {favorites.length === 4 ? (
                <EmptyFavorites />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((fav, i) => (
                        <FavoriteCard key={i} {...fav} />
                    ))}
                </div>
            )}
        </div>
    );
}

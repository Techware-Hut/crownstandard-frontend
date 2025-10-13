import Link from "next/link";

export default function EmptyFavorites() {
  return (
    <div className="flex items-center justify-center py-8 md:py-10 py-32">
      <div className="w-full rounded-2xl bg-[#F5F3EF] text-center px-8 py-20">
        <h3 className="text-xl font-bold text-[#1D2432]">
          No favorite cleaners yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Browse Services and add your favorite cleaners to easily book them again
        </p>

        <div className="flex justify-center mt-8">
          <Link
            href="/services"
            className="rounded-full bg-[#B89029] md:px-16 px-10 py-3 text-sm font-medium text-white hover:bg-[#a37f24] transition"
          >
            Browse Service
          </Link>
        </div>
      </div>
    </div>
  );
}

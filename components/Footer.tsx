import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1D2432] text-white">
      <div className="h-[10px] w-full bg-brand-gold"></div>
      <div className="container 3xl:max-w-[1280px] flex flex-col gap-3 py-6 text-sm text-gray-300 md:flex-row md:items-center md:justify-between">
        <p>Crown Standard Cleaning</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="transition hover:text-[#b9903c]">
            Privacy Policy
          </Link>
                    <Link href="/accessibility" className="transition hover:text-[#b9903c]">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}

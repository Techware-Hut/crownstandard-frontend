import Image from "next/image";
import Link from "next/link";

export default function BottomCTA() {
    return (
        <section className="relative section">
            <div className="container 3xl:max-w-[1280px]">
                {/* Dark rounded panel */}
                <div className="relative overflow-visible rounded-2xl bg-[#1F2937] text-white">
                    {/* Geometric line art */}
                    <Image
                        src="/pattern-top-left.png"
                        alt=""
                        width={500}
                        height={500}
                        className="absolute top-0 left-0 pointer-events-none select-none mix-blend-luminosity"
                    />
                    {/* pattern bottom-right */}
                    <Image
                        src="/pattern-top-left.png"
                        alt=""
                        width={500}
                        height={500}
                        className="absolute bottom-0 right-0 rotate-180 pointer-events-none select-none mix-blend-luminosity"
                    />

                    {/* Content row */}
                    <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-8 pb-0 sm:px-8 sm:py-10 sm:flex-row 868:items-end sm:justify-between 868:gap-10 868:pl-24 868:pr-10 868:py-14 sm:pb-0 sm:justify-center sm:items-center">
                        {/* Left: icon + copy + buttons */}
                        <div className="max-w-3xl md:max-w-xl md:pb-6 lg:pb-0">
                            <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-md bg-[#BB9239] sm:h-11 sm:w-11">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-white sm:h-6 sm:w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 10a4 4 0 118 0c0 1.657-1.343 2.5-2.5 3.25C12.5 14 12 14.5 12 16m0 3h.01"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                                Still have questions?
                            </h2>
                            <p className="max-w-xl mt-2 text-sm text-white/80 sm:text-base">
                                Our support team is here to help you get started.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 mt-5 sm:mt-6 sm:flex-row sm:gap-4">
                                <Link href="/contact" className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-[#BB9239] text-white shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BB9239]/80">
                                    Contact Support
                                </Link>
                                <Link href={"/"} className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white transition-colors border rounded-full border-white/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                                    Back to Home
                                </Link>
                            </div>
                        </div>

                        {/* Right: cleaning model */}
                        {/* Mobile: inline image below content */}
                        <div className="self-center w-full md:w-50 max-w-xs sm:max-w-sm 868:hidden md:absolute md:bottom-0 md:right-[-40px]">
                            <Image
                                src="/cleaning-person.png"
                                alt="Cleaning person"
                                width={520}
                                height={680}
                                className="object-contain w-full h-auto"
                            />
                        </div>

                        {/* Desktop: anchored bottom-right with fixed heights */}
                        <div className="absolute bottom-0 right-[-40px] hidden -mt-10 868:block">
                            <Image
                                src="/cleaning-person.png"
                                alt="Cleaning person"
                                width={520}
                                height={680}
                                className="h-[340px] w-auto object-contain md:h-[350px] lg:h-[380px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

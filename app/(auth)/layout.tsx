// app/(auth)/layout.tsx
import "@/styles/tokens.css";
import type { ReactNode } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <div className="relative min-h-screen w-full bg-[#FFF8F0] text-[#0B0B0B] flex items-center">

                <div className="absolute top-0 w-[35vw] right-0 h-full pointer-events-none"
                    style={{
                        background: "linear-gradient(360deg, #1F2937 0%, #BB9239 100%)",
                    }}
                />

                {/* top-right illustration */}
                <div className="absolute top-0 left-0">
                    <Image
                        src="/auth-illustration.png" // replace with your actual asset
                        alt="Auth Illustration"
                        width={700}
                        height={700}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* main content grid */}
                <main className="relative z-10 w-full max-w-6xl px-4 mx-auto md:px-6 lg:px-8">
                    <div className="grid items-stretch grid-cols-1 gap-6 md:gap-4 lg:gap-10 md:grid-cols-2 ">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled ? "bg-white/85 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container 3xl:max-w-[1280px] flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded-md ring-1 ring-black/10">
            {/* small mark (optional) */}
            <Image src="/banner.png" alt="" fill className="object-cover" />
          </div>
          <div className="text-sm">
            <div className="font-semibold leading-none">Crown Standard</div>
            <div className="text-[11px] text-slate-500 leading-none">Cleaning Co.</div>
          </div>
        </Link>

        <nav className="items-center hidden gap-8 text-sm md:flex">
          <a href="#get-started" className="hover:text-brand-gold">Get Started</a>
          <a href="/about" className="hover:text-brand-gold">About</a>
          <a href="#services" className="hover:text-brand-gold">Services</a>
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          <Link href="#" className="btn btn-dark">Customer Login</Link>
          <Link href="#" className="btn btn-ghost">Provider Login</Link>
        </div>

        {/* mobile menu (simple) */}
        <div className="md:hidden">
          <a href="#get-started" className="btn btn-dark">Get Started</a>
        </div>
      </div>
    </header>
  );
}

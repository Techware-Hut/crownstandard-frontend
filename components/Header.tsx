"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";



export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(false)

  const router = useRouter();

 
  const logOut = ()=>{
    localStorage.removeItem("user")
    localStorage.removeItem("user_role")
    Cookies.remove("user_role")
    Cookies.remove('user_id')
    if(localStorage.getItem("google")){
        signOut();
        localStorage.removeItem("google")
    }


    checkUser();
    router.push("/")
  

  }


  const dashboard = ()=>{

  const type = Cookies.get("user_role")
  router.push(type === "provider" ? "/provider/dashboard" : "/dashboard");

  }
  
  const checkUser = ()=>{
    if(localStorage.getItem("user"))
        setUser(true)
    else
        setUser(false)
  }
   

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);

    checkUser();


    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (optional: if using next/navigation you can listen to pathname)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-cs-border bg-white/80 backdrop-blur transition-shadow ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="w-full container 3xl:max-w-[1280px]">
        {/* Top row */}
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="grid w-10 h-10 overflow-hidden border rounded border-cs-border bg-cs-gold/20 place-items-center sm:h-12 sm:w-12">
              <Image
                src="/logo.png"
                alt="Crown Standard"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-cs-charcoal sm:text-xl">
                Crown Standard
              </div>
              <div className="text-xs text-cs-sub sm:text-sm">Cleaning Co.</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="items-center hidden gap-8 text-base text-cs-charcoal lg:flex">
            <Link href="/" className="hover:text-cs-gold">Home</Link>
            <Link href="/how-to-get-started" className="hover:text-cs-gold">Get Started</Link>
            <Link href="/about" className="hover:text-cs-gold">About</Link>
            <Link href="/services" className="hover:text-cs-gold">Services</Link>
            <Link href="/contact" className="hover:text-cs-gold">Contact</Link>

          </nav>

          {/* Desktop auth */}
          <div className="items-center hidden gap-3 lg:flex">
            {user ? (
              <>

              <button
                onClick={dashboard}
                className="text-sm font-semibold px-4 py-2.5 rounded-full bg-[#B8892D] text-white hover:opacity-90 shadow-sm"
              >
                Dashboard
              </button>
              <button
                onClick={logOut}
                className="text-sm font-semibold px-4 py-2.5 rounded-full bg-slate-900 text-white hover:opacity-90 shadow-sm"
              >
                Sign Out
              </button>

              </>
            ) : (
              <>
                <Link
                  href="/login?type=customer"
                  className="text-sm font-semibold px-4 py-2.5 rounded-full bg-slate-900 text-white hover:opacity-90 shadow-sm"
                >
                  Customer Login
                </Link>
                <Link
                  href="/login?type=provider"
                  className="text-sm font-medium px-4 py-2.5 rounded-full bg-white text-cs-charcoal border border-cs-border hover:bg-cs-gold/20"
                >
                  Provider Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center w-10 h-10 border rounded-full lg:hidden border-cs-border text-cs-charcoal hover:bg-cs-gold/10"
          >
            <svg
              className={`h-5 w-5 transition-transform ${open ? "rotate-90" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu (collapsible) */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-1 pb-4">
            <nav className="grid gap-2 text-cs-charcoal">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:bg-cs-gold/10"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/how-to-get-started"
                className="px-3 py-2 rounded-lg hover:bg-cs-gold/10"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-lg hover:bg-cs-gold/10"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 rounded-lg hover:bg-cs-gold/10"
                onClick={() => setOpen(false)}
              >
                Services
              </Link>

              <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-cs-gold/10"
              onClick={()=> setOpen(false)}>
              Contact
              </Link>
            </nav>

            <div className="grid gap-2 mt-3">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    logOut();
                  }}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold bg-slate-900 text-white hover:opacity-90 shadow-sm"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login?type=customer"
                    className="rounded-full px-4 py-2.5 text-center text-sm font-semibold bg-slate-900 text-white hover:opacity-90 shadow-sm"
                    onClick={() => setOpen(false)}
                  >
                    Customer Login
                  </Link>
                  <Link
                    href="/login?type=provider"
                    className="rounded-full px-4 py-2.5 text-center text-sm font-medium bg-white text-cs-charcoal border border-cs-border hover:bg-cs-gold/20"
                    onClick={() => setOpen(false)}
                  >
                    Provider Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import LogoutModal from "./auth/LogoutModal";



export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Get Started", href: "/how-to-get-started" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const token = Cookies.get("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  const logOut = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user")
    localStorage.removeItem("user_role")
    Cookies.remove("user_role")
    Cookies.remove('user_id')
    if (localStorage.getItem("google")) {
      signOut();
      localStorage.removeItem("google")
    }

    checkUser();
    setShowLogoutModal(false);
    router.push("/")
  }


  const dashboard = () => {
    const type = Cookies.get("user_role")
    router.push(type === "provider" ? "/provider/dashboard" : "/dashboard");
  }

  const checkUser = () => {
    const token = Cookies.get("auth_token");
    setIsLoggedIn(!!token);
  };


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
    <>
      <header
        className={`sticky top-0 z-50 border-b border-cs-border bg-white/80 backdrop-blur transition-shadow ${scrolled ? "shadow-soft" : ""
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
            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative text-base font-medium transition-all duration-300 ${isActive
                      ? "text-[#C1A869] underline"
                      : "text-cs-charcoal hover:text-cs-gold"
                      }`}
                  >
                    {link.label}

                    <span
                      className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-cs-gold transition-all duration-300 ${isActive
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop auth */}
            <div className="items-center hidden gap-3 lg:flex">
              {isLoggedIn ? (
                <>

                  <button
                    onClick={dashboard}
                    className="text-sm font-semibold px-4 py-2.5 rounded-full bg-[#B8892D] text-white hover:opacity-90 shadow-sm"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(true)}
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
            className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
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
                  onClick={() => setOpen(false)}>
                  Contact
                </Link>
              </nav>

              <div className="grid gap-2 mt-3">
                {isLoggedIn ? (
                  <button
                    // onClick={() => {
                    //   setOpen(false);
                    //   logOut();
                    // }}
                    onClick={() => setShowLogoutModal(true)}
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
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logOut}
      />
    </>
  );
}

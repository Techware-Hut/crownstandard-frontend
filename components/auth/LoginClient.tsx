"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Star, Users } from "lucide-react";
import RoleToggle, { type UserType } from "@/components/auth/RoleToggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE 

const LOCATION_STORAGE_KEY = "customer_location";


export default function LoginClient({
  type,
  showForgot,
}: {
  type: UserType;
  showForgot: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const { data, status } = useSession()

  const persistCustomerLocation = useCallback(async () => {
    if (typeof window === "undefined" || type !== "customer" || !("geolocation" in navigator)) {
      return;
    }

    const location = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });

    if (!location) return;

    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    document.cookie = `customer_lat=${location.lat}; path=/`;
    document.cookie = `customer_lng=${location.lng}; path=/`;
  }, [type]);

// console.log(session.)



  const googleSignIn = useCallback(async (user: Session) => {
      try {
          const res = await fetch(`${API_BASE}/auth/oauth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email :  user.user?.email, name : user.user?.name, picture : user.user?.image, role: type }),
              credentials: "include",
          });

          const responseData = await res.json();
          // console.log("OAuth response:", { status: res.status, data: responseData });
          
          if (!res.ok) throw new Error(responseData?.message ?? `Login failed (${res.status})`);

          // Refresh the session to ensure authentication is updated
          // await update();
          // document.cookie = `auth_token=${responseData.token}`
          // document.cookie = `user_id=${responseData.user.id}`
          // document.cookie = `user_role=${responseData.user.role}`
          localStorage.setItem("user","true")
          localStorage.setItem('google', "true")
          await persistCustomerLocation();
          router.push(responseData.user.role === "provider" ? "/provider/dashboard" : "/dashboard");
      } catch (err) {
          console.error("Google sign-in error:", err);
          setError(err instanceof Error ? err.message : "Google sign-in failed");
      }
  }, [persistCustomerLocation, router, type]);


  
    useEffect(()=>{
      if (status === "authenticated" && data) {
        googleSignIn(data);
      }
    }, [status, data, googleSignIn])





  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {      
      const body = { email, password, role: type };

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include", 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Login failed");

      await persistCustomerLocation();
      router.push(type === "provider" ? "/provider/dashboard" : "/dashboard");

      localStorage.setItem("user","true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ForgotPasswordModal open={showForgot} onClose={() => router.back()} />

      {/* LEFT MARKETING SECTION */}
      <section className="flex-col justify-center hidden md:flex">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo.png" alt="Crown Standard" width={40} height={40} />
            <div className="leading-tight">
              <p className="font-semibold">Crown Standard</p>
              <p className="text-sm text-[#6B7280]">Cleaning Co.</p>
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold leading-snug text-[#1F2937]">
            Professional Cleaning <br className="hidden lg:block" /> Made Simple
          </h1>
          <p className="mt-3 text-sm text-[#6B7280]">
            Connect with trusted cleaning professionals or grow your cleaning business.
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#F0E2C9] text-[#B8892D]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium">Trusted &amp; Verified</p>
                <p className="text-sm text-[#6B7280]">
                  All service providers are background checked
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#F0E2C9] text-[#B8892D]">
                <Star className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium">Top Rated</p>
                <p className="text-sm text-[#6B7280]">
                  4.8+ average rating from satisfied customers
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#F0E2C9] text-[#B8892D]">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium">Growing Community</p>
                <p className="text-sm text-[#6B7280]">
                  Join thousands of happy customers and providers
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* RIGHT: FORM CARD */}
      <section className="relative">
        <div className="relative rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-[#F3F4F6] p-5 sm:p-6 lg:p-7">
          <header className="mb-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Sign in to access your cleaning dashboard
            </p>
          </header>

          <RoleToggle value={type} />

          <form className="mt-4 space-y-4" onSubmit={handleLogin}>
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" variant="gold" full className="rounded-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs uppercase text-[#9CA3AF]">Or</span>
            </div>
          </div>

          {/* Google */}
       {/* Google */}
<Button onClick={()=> signIn("google")} type="button" variant="dark" full className="gap-2">
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue With Google
</Button>


          {/* Links */}
          <div className="mt-4 space-y-2 text-sm text-center">
            <Link href="/login?forgot-password" className="text-[#6B7280] hover:underline">
              Forgot Password?
            </Link>
            <p className="text-[#6B7280]">
              Don’t have an account?{" "}
              <Link href={`/register?type=${type}`} className="font-medium text-[#0B0B0B] hover:underline">
                Create One
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Star, Users } from "lucide-react";
import RoleToggle, { type UserType } from "@/components/auth/RoleToggle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { useState } from "react";

const API_BASE = "http://crownstandrad.ca-central-1.elasticbeanstalk.com";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = {
        email,
        password,
        role: type, // 👈 role = type
        type,       // 👈 type sent separately too
      };

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token and user info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect based on role/type
      if (type === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
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
          <Button type="button" variant="dark" full className="gap-2">
            <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden>
              <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.7-37.1-5.3-55H272v104h146.9..." />
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

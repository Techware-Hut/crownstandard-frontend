"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE // later change to api.mosaicbizhub.com

export default function RegisterForm({ type }: { type: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    const requiredFields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "confirmPassword", label: "Confirm Password" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData].trim()) {
        validationErrors[field.key] = `${field.label} is required`;
      }
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Registration failed");
      }

      alert("Registration successful!");
      router.push(`/login?type=${type}`);
    } catch (err) {
      console.log("error", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   // console.log(formData)

  //   try {
  //     const res = await fetch(`${API_BASE}/auth/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...formData, role: type }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message ?? "Registration failed");

  //     alert("Registration successful!");
  //     router.push(`/login?type=${type}`);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <input type="hidden" name="type" value={type} />

      <Input
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className={errors.name ? "border border-red-500" : ""}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name}</p>
      )}

      <Input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? "border border-red-500" : ""}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email}</p>
      )}

      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className={errors.password ? "border border-red-500" : ""}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={errors.confirmPassword ? "border border-red-500" : ""}
      />

      {errors.confirmPassword && (
        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
      )}


      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="gold" full className="rounded-full" disabled={loading}>
        {loading ? "Registering..." : "Sign Up"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (!newPassword.trim()) {
            setError("Password is required.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to reset password.");
                return;
            }

            setSuccess("Password changed successfully.");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Reset Password
                </h1>

                <p className="mt-2 text-center text-gray-500">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <Input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {success && (
                        <p className="text-sm text-green-600">{success}</p>
                    )}

                    <Button
                        type="submit"
                        full
                        variant="dark"
                        disabled={loading}
                        className="rounded-full"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
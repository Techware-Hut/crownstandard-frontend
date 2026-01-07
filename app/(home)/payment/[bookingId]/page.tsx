"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { bookingApi } from "@/lib/bookingApi";

/* ---------------- CHECKOUT FORM ---------------- */

function CheckoutForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setProcessing(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess(result.paymentIntent.id);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border rounded-2xl px-6 py-7 bg-white shadow-sm">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
              },
            },
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[#635BFF] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-60"
      >
        {processing ? "Processing Payment…" : "Pay Securely"}
      </button>
    </form>
  );
}

/* ---------------- PAGE ---------------- */

export default function PaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const router = useRouter();
  const { bookingId } = use(params);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [step, setStep] = useState<"loading" | "payment" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await bookingApi.createPaymentIntent(bookingId);
        setClientSecret(res.clientSecret);
        setStep("payment");
      } catch {
        setError("Failed to initialize payment");
      }
    };

    initPayment();
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      await bookingApi.syncPayment(paymentIntentId);
    } catch (err) {
      console.error("Payment sync failed", err);
      // Do NOT block success UI
    } finally {
      setStep("success");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {step === "loading" && (
        <div className="bg-white px-10 py-12 rounded-2xl shadow text-center">
          <p className="text-gray-600">Initializing secure payment…</p>
        </div>
      )}

      {step === "payment" && clientSecret && (
        <div className="bg-white px-10 py-12 rounded-2xl shadow max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <p className="text-sm text-gray-500">
              Your card details are securely encrypted by Stripe
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}

      {step === "success" && (
        <div className="bg-white px-12 py-14 rounded-2xl shadow max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-3xl">✓</span>
          </div>

          <h2 className="text-2xl font-bold text-green-600">
            Payment Successful
          </h2>

          <p className="text-gray-600">
            Your booking is confirmed and payment has been received.
          </p>

          <button
            onClick={() => router.push("/dashboard/my-bookings")}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            View My Bookings
          </button>
        </div>
      )}

      {error && (
        <div className="bg-white px-10 py-12 rounded-2xl shadow text-center text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

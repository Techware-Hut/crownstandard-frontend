"use client";
import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

function CheckoutForm({ clientSecret, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (error) {
      console.error(error);
    } else {
      onSuccess();
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded" />
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

export default function PaymentForm({ clientSecret, onSuccess }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  productTier?: 'plus' | 'pro';
  consultationId?: string;
  userId: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function CheckoutButton({
  productTier,
  consultationId,
  userId,
  children,
  className = '',
  disabled = false,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productTier,
          consultationId,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={disabled || isLoading}
        className={`${className} ${
          isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Stripe Product Price IDs
export const STRIPE_PRICES = {
  PLUS: process.env.STRIPE_PRICE_ID_PLUS || '',
  PRO: process.env.STRIPE_PRICE_ID_PRO || '',
} as const;

// Validate that price IDs are properly set (not placeholder values)
if (process.env.NODE_ENV !== 'development' || process.env.SKIP_STRIPE_VALIDATION !== 'true') {
  if (STRIPE_PRICES.PLUS && (STRIPE_PRICES.PLUS.startsWith('price_...') || STRIPE_PRICES.PLUS.length < 10)) {
    console.warn('⚠️  Warning: STRIPE_PRICE_ID_PLUS appears to be a placeholder value. Please update with a real Stripe Price ID.');
  }

  if (STRIPE_PRICES.PRO && (STRIPE_PRICES.PRO.startsWith('price_...') || STRIPE_PRICES.PRO.length < 10)) {
    console.warn('⚠️  Warning: STRIPE_PRICE_ID_PRO appears to be a placeholder value. Please update with a real Stripe Price ID.');
  }
}

// Product metadata
export const PRODUCTS = {
  PLUS: {
    name: 'Rahvana Plus',
    price: 9.99,
    priceId: STRIPE_PRICES.PLUS,
    tier: 'plus',
    features: [
      'Everything in Core',
      'Cloud Backup (Cross-device)',
      'Form Filling Masterclass',
      'NVC Document Verification',
    ],
  },
  PRO: {
    name: 'Rahvana Pro',
    price: 199,
    priceId: STRIPE_PRICES.PRO,
    tier: 'pro',
    features: [
      'Everything in Plus',
      'Document Review by Experts',
      'Mock Interview Preparation',
    ],
  },
} as const;

export type ProductTier = 'core' | 'plus' | 'pro';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type ProductType = 'subscription' | 'consultation';

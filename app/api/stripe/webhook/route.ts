import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { paymentService } from '@/lib/services/paymentService';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Disable body parsing for webhook
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('Checkout session completed:', session.id);

  const userId = session.metadata.user_id;
  const productType = session.metadata.product_type;
  const productId = session.metadata.product_id;

  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Get payment record
  const payment = await paymentService.getPaymentBySessionId(session.id);

  if (!payment) {
    console.error('Payment record not found for session:', session.id);
    return;
  }

  // Update payment with payment intent ID
  await paymentService.updatePayment(payment.id, {
    stripe_payment_id: session.payment_intent as string,
    status: 'succeeded',
  });

  // Handle subscription upgrade
  if (productType === 'subscription') {
    await paymentService.updateUserSubscription(
      userId,
      productId as 'plus' | 'pro',
      session.customer as string
    );

    console.log(`User ${userId} upgraded to ${productId}`);

    // Send confirmation email
    await sendSubscriptionConfirmationEmail(
      session.customer_details?.email || '',
      productId
    );
  }

  // Handle consultation payment
  if (productType === 'consultation') {
    // Update consultation booking payment status
    const { error } = await supabase
      .from('consultation_bookings')
      .update({
        payment_id: payment.id,
        payment_status: 'paid',
      })
      .eq('id', productId);

    if (error) {
      console.error('Error updating consultation payment status:', error);
    } else {
      console.log(`Consultation ${productId} marked as paid`);
    }

    // Send consultation confirmation email
    await sendConsultationConfirmationEmail(
      session.customer_details?.email || '',
      session.metadata.consultation_reference || productId
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  const payment = await paymentService.getPaymentByStripeId(paymentIntent.id);

  if (payment && payment.status !== 'succeeded') {
    await paymentService.updatePayment(payment.id, {
      status: 'succeeded',
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id);

  const payment = await paymentService.getPaymentByStripeId(paymentIntent.id);

  if (payment) {
    await paymentService.updatePayment(payment.id, {
      status: 'failed',
    });

    // Update consultation booking if applicable
    if (payment.product_type === 'consultation') {
      await supabase
        .from('consultation_bookings')
        .update({ payment_status: 'failed' })
        .eq('id', payment.product_id);
    }
  }
}

async function sendSubscriptionConfirmationEmail(email: string, tier: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `Welcome to Rahvana ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Payment Successful! 🎉</h1>
          <p>Thank you for upgrading to Rahvana ${tier.charAt(0).toUpperCase() + tier.slice(1)}!</p>
          <p>Your subscription is now active and you have access to all premium features.</p>
          <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0d9488; margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Access your dashboard to explore new features</li>
              <li>Cloud backup is now enabled for all your data</li>
              <li>Check out the Form Filling Masterclass</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The Rahvana Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
  }
}

async function sendConsultationConfirmationEmail(email: string, referenceId: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Consultation Payment Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Payment Received! ✓</h1>
          <p>Your payment for consultation booking <strong>${referenceId}</strong> has been confirmed.</p>
          <p>Our team will review your booking and send you a confirmation with the scheduled time shortly.</p>
          <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0d9488; margin-top: 0;">Next Steps:</h3>
            <ul>
              <li>You'll receive a confirmation email within 24 hours</li>
              <li>Check your email for the meeting link before your scheduled time</li>
              <li>Prepare any documents you'd like to discuss</li>
            </ul>
          </div>
          <p>If you have any questions, please contact us at support@rahvana.com</p>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The Rahvana Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending consultation confirmation email:', error);
  }
}

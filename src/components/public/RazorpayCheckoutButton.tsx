'use client';

import React, { useState } from 'react';
import Loader from '@/components/shared/Loader';

interface RazorpayCheckoutProps {
  bookingId: string;
  product: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  onSuccess?: (bookingId: string) => void;
  onError?: (errorMsg: string) => void;
}

const PRODUCT_DETAILS: Record<string, { label: string; amountDisplay: string }> = {
  consult_48h: { label: '48-Hour Video Response Consultation', amountDisplay: '₹500' },
  online_live: { label: 'Online Video Consultation', amountDisplay: '₹1,000' },
  second_opinion: { label: 'Surgical Second Opinion', amountDisplay: '₹800' },
  international: { label: 'International Consultation', amountDisplay: '$25 USD' },
  opd: { label: 'In-Person OPD Consultation', amountDisplay: '₹1,000' },
  imaging_review: { label: 'Online Video Consultation', amountDisplay: '₹1,000' },
};

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

export default function RazorpayCheckoutButton({
  bookingId,
  product,
  patientName = 'Patient',
  patientEmail = '',
  patientPhone = '',
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const productInfo = PRODUCT_DETAILS[product] || { label: 'Consultation', amountInINR: 1000 };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ('Razorpay' in window) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setErrorMsg(null);

      // 1. Create Razorpay order server-side
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initialize payment order');
      }

      const orderData = await orderRes.json();

      // 2. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Razorpay payment gateway failed to load. Please check network connection.');
      }

      // 3. Configure Razorpay Modal Options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dr. Pulak Vatsya',
        description: `${productInfo.label} — StepUp Joints`,
        image: '/images/hero/dr-pulak-hero.jpg',
        order_id: orderData.order_id,
        prefill: {
          name: orderData.patient_name || patientName,
          email: orderData.patient_email || patientEmail,
          contact: orderData.patient_phone || patientPhone,
        },
        theme: {
          color: '#2563EB', // Exact MedDocX Electric Royal Blue
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // 4. Verify Payment Signature Server-Side
            const verifyRes = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json().catch(() => ({}));
              throw new Error(verifyErr.error || 'Payment signature verification failed');
            }

            setIsProcessing(false);
            if (onSuccess) onSuccess(bookingId);
          } catch (err: unknown) {
            setIsProcessing(false);
            const msg = (err as Error).message || 'Payment verification failed';
            setErrorMsg(msg);
            if (onError) onError(msg);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log('[RAZORPAY] Payment modal dismissed by user');
          },
        },
      };

      const windowWithRazorpay = window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void; on: (event: string, handler: (res: RazorpayErrorResponse) => void) => void } };
      const rzp = new windowWithRazorpay.Razorpay(options);
      rzp.on('payment.failed', function (response: RazorpayErrorResponse) {
        setIsProcessing(false);
        const reason = response.error?.description || 'Payment transaction failed';
        setErrorMsg(reason);
        if (onError) onError(reason);
      });

      rzp.open();

    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = (err as Error).message || 'Error creating payment checkout';
      setErrorMsg(msg);
      if (onError) onError(msg);
    }
  };

  return (
    <div className="razorpay-checkout-container" style={{ textAlign: 'center' }}>
      {errorMsg && (
        <div style={{ padding: '0.75rem 1rem', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isProcessing}
        className="btn btn--pill-primary btn--lg"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '0.875rem 1.75rem',
          fontSize: '1.05rem',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.75 : 1,
        }}
      >
        {isProcessing ? (
          <Loader size="sm" color="white" label="Opening Payment Gateway..." center={false} />
        ) : (
          <>
            <span>Pay {productInfo.amountDisplay} & Confirm Appointment</span>
            <span className="btn--pill-icon">↗</span>
          </>
        )}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
        🔒 256-bit Encrypted Secure Payment via Razorpay (UPI, Credit/Debit Cards, NetBanking)
      </p>
    </div>
  );
}

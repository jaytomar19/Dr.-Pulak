import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import { VerifyPaymentSchema } from '@/lib/validators';
import { sendPaymentConfirmedToStaff, sendWhatsAppBookingConfirmationToClinic } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'verify-payment', 5, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const body = await req.json().catch(() => null);
    const parsed = VerifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: 'Invalid payment verification payload',
        details: parsed.error.format(),
      }, { status: 400 });
    }

    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    // 1. Fetch booking record
    const booking = await prisma.bookings.findUnique({
      where: { booking_id },
      include: {
        payments: {
          where: { razorpay_order_id },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking record not found' }, { status: 404 });
    }

    // 2. If already paid, return success idempotently
    if (booking.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Booking is already verified as paid',
        booking_id: booking.booking_id,
        payment_status: 'paid',
      }, { status: 200 });
    }

    // 3. Verify server-side HMAC signature using Razorpay secret
    const isValidSignature = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      console.warn(`[SECURITY] Invalid payment signature attempt for booking ${booking_id}`);

      // Log failed payment status safely
      await prisma.payments.upsert({
        where: { razorpay_order_id },
        create: {
          booking_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount_paise: 0,
          status: 'FAILED',
          error_code: 'BAD_SIGNATURE',
          error_description: 'Razorpay HMAC-SHA256 signature verification failed',
        },
        update: {
          status: 'FAILED',
          error_code: 'BAD_SIGNATURE',
          error_description: 'Razorpay HMAC-SHA256 signature verification failed',
        },
      });

      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 4. Update database atomically inside a transaction
    await prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.bookings.update({
        where: { booking_id },
        data: {
          payment_status: 'paid',
          status: 'confirmed',
          payment_provider_ref: razorpay_order_id,
        },
      });

      // Update payment record
      await tx.payments.upsert({
        where: { razorpay_order_id },
        create: {
          booking_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount_paise: 100000, // Updated by create-order
          status: 'PAID',
        },
        update: {
          razorpay_payment_id,
          razorpay_signature,
          status: 'PAID',
        },
      });

      // Update lead conversion state
      await tx.leads.update({
        where: { lead_id: booking.lead_id },
        data: {
          lead_status: 'Converted',
        },
      });

      // Queue delivery confirmation log
      await tx.delivery_log.create({
        data: {
          lead_id: booking.lead_id,
          channel: 'email',
          template_name: 'booking_payment_verified',
          status: 'queued',
        },
      });
    });

    // 5. Non-blocking staff notifications (Email + WhatsApp)
    const confirmedAmount = booking.payments[0]?.amount_paise || 99900;

    void sendPaymentConfirmedToStaff(
      booking.lead_id,
      booking.booking_id,
      booking.product,
      confirmedAmount
    ).catch((err) => console.error('[NOTIF] Payment verification email dispatch failed:', err));

    void sendWhatsAppBookingConfirmationToClinic(booking.booking_id)
      .catch((err) => console.error('[NOTIF] WhatsApp clinic alert dispatch failed:', err));

    return NextResponse.json({
      success: true,
      booking_id: booking.booking_id,
      payment_status: 'paid',
      message: 'Payment verified and appointment confirmed successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

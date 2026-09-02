import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from '@/lib/razorpay';
import { decryptLeadPII } from '@/lib/encryption';
import { z } from 'zod';

const CreateOrderRequestSchema = z.object({
  booking_id: z.string().uuid(),
});

// Authoritative consultation prices in INR paise (server-side source of truth)
const PRODUCT_PRICES_SUBUNITS: Record<string, number> = {
  opd: 129900,           // ₹1,299
  consult_48h: 50000,    // ₹500
  online_live: 99900,    // ₹999
  second_opinion: 79900, // ₹799
  international: 219900, // ₹2,199
  imaging_review: 50000, // ₹500 (Mapped to 48-Hour Video Response)
};

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'create-payment-order', 5, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const body = await req.json().catch(() => null);
    const parsed = CreateOrderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const { booking_id } = parsed.data;

    const booking = await prisma.bookings.findUnique({
      where: { booking_id },
      include: {
        lead: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.payment_status === 'paid') {
      return NextResponse.json({ error: 'Booking is already paid' }, { status: 400 });
    }

    const currency = 'INR';
    const amountSubunits = PRODUCT_PRICES_SUBUNITS[booking.product] || 99900;
    const receipt = `rcpt_${booking.booking_id.substring(0, 8)}`;

    const patientName = booking.lead.name;
    let patientPhone = '';
    let patientEmail = '';

    try {
      const decrypted = decryptLeadPII({ phone: booking.lead.phone, email: booking.lead.email });
      patientPhone = decrypted.phone;
      patientEmail = decrypted.email;
    } catch {
      patientPhone = booking.lead.phone;
      patientEmail = booking.lead.email;
    }

    const razorpayOrder = await createRazorpayOrder(
      amountSubunits,
      receipt,
      {
        booking_id: booking.booking_id,
        lead_id: booking.lead_id,
        product: booking.product,
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
      },
      currency
    );

    // Save payment record and booking provider ref in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.bookings.update({
        where: { booking_id },
        data: {
          payment_provider_ref: razorpayOrder.id,
        },
      });

      await tx.payments.upsert({
        where: { razorpay_order_id: razorpayOrder.id },
        create: {
          booking_id: booking.booking_id,
          razorpay_order_id: razorpayOrder.id,
          amount_paise: amountSubunits,
          currency: razorpayOrder.currency || currency,
          status: 'PENDING',
        },
        update: {
          amount_paise: amountSubunits,
          currency: razorpayOrder.currency || currency,
          status: 'PENDING',
        },
      });
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: getRazorpayKeyId(),
      booking_id: booking.booking_id,
      product: booking.product,
      patient_name: patientName,
      patient_email: patientEmail,
      patient_phone: patientPhone,
      is_configured: isRazorpayConfigured(),
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

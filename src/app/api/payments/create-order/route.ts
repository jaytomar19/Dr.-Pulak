import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from '@/lib/razorpay';
import { z } from 'zod';

const CreateOrderRequestSchema = z.object({
  booking_id: z.string().uuid(),
});

// Default consultation prices in INR paise (e.g. ₹1000 = 100000 paise)
const PRODUCT_PRICES_PAISE: Record<string, number> = {
  opd: 100000,
  online_live: 100000,
  imaging_review: 150000,
  second_opinion: 200000,
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

    const amountPaise = PRODUCT_PRICES_PAISE[booking.product] || 100000;
    const receipt = `rcpt_${booking.booking_id.substring(0, 8)}`;

    const razorpayOrder = await createRazorpayOrder(amountPaise, receipt, {
      booking_id: booking.booking_id,
      lead_id: booking.lead_id,
      product: booking.product,
    });

    // Save payment provider order reference to booking record
    await prisma.bookings.update({
      where: { booking_id },
      data: {
        payment_provider_ref: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: getRazorpayKeyId(),
      booking_id: booking.booking_id,
      product: booking.product,
      is_configured: isRazorpayConfigured(),
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

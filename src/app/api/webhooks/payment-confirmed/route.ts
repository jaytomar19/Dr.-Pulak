import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { sendPaymentConfirmedToStaff, sendWhatsAppBookingConfirmationToClinic } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Reject webhook requests if secret is configured but signature fails
    if (webhookSecret) {
      if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
        console.warn('Rejected invalid Razorpay webhook signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    } else {
      console.warn('RAZORPAY_WEBHOOK_SECRET is unconfigured. Webhook signature check skipped for local dev.');
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const bookingId = paymentEntity?.notes?.booking_id;

      if (orderId || bookingId) {
        // Find booking by order_id or booking_id
        const booking = await prisma.bookings.findFirst({
          where: {
            OR: [
              ...(orderId ? [{ payment_provider_ref: orderId }] : []),
              ...(bookingId ? [{ booking_id: bookingId }] : []),
            ],
          },
        });

        if (booking && booking.payment_status !== 'paid') {
          const paymentId = paymentEntity?.id;
          const amountPaise = paymentEntity?.amount || 100000;

          await prisma.$transaction(async (tx) => {
            await tx.bookings.update({
              where: { booking_id: booking.booking_id },
              data: {
                payment_status: 'paid',
                status: 'confirmed',
                payment_provider_ref: orderId || booking.payment_provider_ref,
              },
            });

            if (orderId) {
              await tx.payments.upsert({
                where: { razorpay_order_id: orderId },
                create: {
                  booking_id: booking.booking_id,
                  razorpay_order_id: orderId,
                  razorpay_payment_id: paymentId || null,
                  amount_paise: amountPaise,
                  status: 'PAID',
                },
                update: {
                  razorpay_payment_id: paymentId || undefined,
                  status: 'PAID',
                },
              });
            }

            await tx.leads.update({
              where: { lead_id: booking.lead_id },
              data: {
                lead_status: 'Converted',
              },
            });

            await tx.delivery_log.create({
              data: {
                lead_id: booking.lead_id,
                channel: 'email',
                template_name: 'booking_payment_confirmed',
                status: 'queued',
              },
            });
          });

          // Non-blocking notification dispatches (Email + WhatsApp)
          const amount = paymentEntity?.amount || 0;
          void sendPaymentConfirmedToStaff(
            booking.lead_id,
            booking.booking_id,
            booking.product,
            amount
          ).catch((err) => console.error('[NOTIF] Payment confirmation email dispatch failed:', err));

          void sendWhatsAppBookingConfirmationToClinic(booking.booking_id)
            .catch((err) => console.error('[NOTIF] WhatsApp clinic alert dispatch failed:', err));
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { BookingStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const payload = body.payload || body;
    const bookingUid = payload.uid || payload.bookingId || body.booking_id;

    if (bookingUid) {
      const existingBooking = await prisma.bookings.findFirst({
        where: {
          OR: [
            { booking_id: bookingUid },
            { payment_provider_ref: bookingUid },
          ],
        },
      });

      if (existingBooking) {
        await prisma.bookings.update({
          where: { booking_id: existingBooking.booking_id },
          data: { status: BookingStatus.confirmed },
        });

        await prisma.leads.update({
          where: { lead_id: existingBooking.lead_id },
          data: {
            lead_status: 'Booked',
            appointment_status: 'Confirmed',
          },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing booking webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

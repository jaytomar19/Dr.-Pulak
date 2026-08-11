import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import { BookingStatusUpdateSchema } from '@/lib/validators';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const { id } = await params;

    const booking = await prisma.bookings.findUnique({
      where: { booking_id: id },
      include: {
        lead: {
          select: {
            lead_id: true,
            name: true,
            lead_status: true,
            created_at: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = BookingStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
    }

    const existingBooking = await prisma.bookings.findUnique({
      where: { booking_id: id },
      select: { booking_id: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: {
        ...(parsed.data.status && { status: parsed.data.status as BookingStatus }),
        ...(parsed.data.payment_status && { payment_status: parsed.data.payment_status as PaymentStatus }),
        ...(parsed.data.payment_provider_ref && { payment_provider_ref: parsed.data.payment_provider_ref }),
      },
    });

    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

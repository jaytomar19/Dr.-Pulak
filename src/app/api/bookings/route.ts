import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { CreatePublicBookingSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import { BookingStatus, PaymentStatus, ProductType, Prisma } from '@prisma/client';
import { sendBookingConfirmationToStaff } from '@/lib/notifications';
import { decryptLeadPII } from '@/lib/encryption';
import { validateRequestedSlot } from '@/lib/availability';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'create-booking', 5, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const body = await req.json().catch(() => null);
    const parsed = CreatePublicBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: 'Invalid booking data',
        details: parsed.error.format(),
      }, { status: 400 });
    }

    const { lead_id, product, slot_datetime } = parsed.data;

    // 1. Strict Server-Side Doctor Availability & Slot Validation
    const slotValidation = await validateRequestedSlot(slot_datetime, product);
    if (!slotValidation.valid) {
      return NextResponse.json({
        error: slotValidation.error || 'Requested slot is unavailable',
      }, { status: 400 });
    }

    const slotDate = new Date(slot_datetime);

    // 2. Verify linked lead exists
    const leadExists = await prisma.leads.findUnique({
      where: { lead_id },
      select: { lead_id: true, name: true },
    });

    if (!leadExists) {
      return NextResponse.json({ error: 'Lead record not found' }, { status: 404 });
    }

    // 3. Race Condition / Double Booking Protection within Database Transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Re-verify no active booking exists for the exact same slot datetime
      const existingSlotBooking = await tx.bookings.findFirst({
        where: {
          slot_datetime: slotDate,
          status: { in: [BookingStatus.confirmed, BookingStatus.rescheduled, BookingStatus.completed] },
        },
      });

      if (existingSlotBooking) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      const newBooking = await tx.bookings.create({
        data: {
          lead_id,
          product: product as ProductType,
          slot_datetime: slotDate,
          payment_status: PaymentStatus.pending,
          status: BookingStatus.confirmed,
        },
      });

      await tx.leads.update({
        where: { lead_id },
        data: {
          lead_status: 'Booked',
          appointment_status: 'Scheduled',
        },
      });

      return newBooking;
    });

    // Non-blocking staff notification
    void sendBookingConfirmationToStaff(
      booking.lead_id,
      leadExists.name,
      booking.product,
      booking.slot_datetime
    ).catch((err) => console.error('[NOTIF] Booking confirmation dispatch failed:', err));

    return NextResponse.json({
      booking_id: booking.booking_id,
      lead_id: booking.lead_id,
      product: booking.product,
      slot_datetime: booking.slot_datetime.toISOString(),
      payment_status: booking.payment_status,
      status: booking.status,
      created_at: booking.created_at.toISOString(),
    }, { status: 201 });

  } catch (error: unknown) {
    if ((error as Error).message === 'SLOT_ALREADY_BOOKED') {
      return NextResponse.json({ error: 'This slot has just been reserved by another patient. Please choose a different time slot.' }, { status: 409 });
    }

    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const statusParam = searchParams.get('status');
    const productParam = searchParams.get('product');

    const where: Prisma.bookingsWhereInput = {};

    if (statusParam && Object.values(BookingStatus).includes(statusParam as BookingStatus)) {
      where.status = statusParam as BookingStatus;
    }

    if (productParam && Object.values(ProductType).includes(productParam as ProductType)) {
      where.product = productParam as ProductType;
    }

    const total = await prisma.bookings.count({ where });
    const rawBookings = await prisma.bookings.findMany({
      where,
      orderBy: { slot_datetime: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        lead: {
          select: {
            lead_id: true,
            name: true,
            phone: true,
            email: true,
            lead_status: true,
            created_at: true,
          },
        },
        payments: {
          select: {
            payment_id: true,
            razorpay_order_id: true,
            razorpay_payment_id: true,
            amount_paise: true,
            currency: true,
            status: true,
            created_at: true,
          },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
        medical_documents: {
          select: {
            document_id: true,
            file_name: true,
            file_type: true,
            file_size: true,
            notes: true,
            created_at: true,
          },
        },
      },
    });

    const bookings = rawBookings.map((b) => {
      let phone = b.lead?.phone || '';
      let email = b.lead?.email || '';
      try {
        const decrypted = decryptLeadPII({ phone: b.lead?.phone || '', email: b.lead?.email || '' });
        phone = decrypted.phone;
        email = decrypted.email;
      } catch {
        // Keep fallback
      }

      return {
        ...b,
        lead: {
          ...b.lead,
          phone,
          email,
        },
      };
    });

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';
import {
  CreateScheduleSchema,
  CreateAvailabilitySchema,
  CreateBlockedSlotSchema,
} from '@/lib/validators';
import { formatToISTDateString } from '@/lib/availability';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const { searchParams } = req.nextUrl;
    const dateParam = searchParams.get('date') || formatToISTDateString(new Date());

    const schedules = await prisma.doctor_schedules.findMany({
      orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
    });

    const dateAvailabilities = await prisma.doctor_availability.findMany({
      orderBy: [{ date: 'asc' }, { start_time: 'asc' }],
    });

    const blockedSlots = await prisma.blocked_slots.findMany({
      orderBy: { start_time: 'asc' },
    });

    const targetDate = new Date(`${dateParam}T00:00:00.000Z`);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    const dayBookings = await prisma.bookings.findMany({
      where: {
        slot_datetime: {
          gte: targetDate,
          lt: nextDate,
        },
      },
      include: {
        lead: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { slot_datetime: 'asc' },
    });

    return NextResponse.json({
      date: dateParam,
      schedules,
      dateAvailabilities,
      blockedSlots,
      dayBookings,
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Admin GET availability error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { type } = body;

    if (type === 'schedule') {
      const parsed = CreateScheduleSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
      }

      const schedule = await prisma.doctor_schedules.create({
        data: {
          day_of_week: parsed.data.day_of_week,
          start_time: parsed.data.start_time,
          end_time: parsed.data.end_time,
          slot_duration: parsed.data.slot_duration,
          is_active: parsed.data.is_active ?? true,
        },
      });

      return NextResponse.json({ success: true, schedule }, { status: 201 });
    }

    if (type === 'availability') {
      const parsed = CreateAvailabilitySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
      }

      const availability = await prisma.doctor_availability.create({
        data: {
          date: new Date(`${parsed.data.date}T00:00:00.000Z`),
          start_time: parsed.data.start_time,
          end_time: parsed.data.end_time,
          slot_duration: parsed.data.slot_duration,
          is_available: parsed.data.is_available ?? true,
        },
      });

      return NextResponse.json({ success: true, availability }, { status: 201 });
    }

    if (type === 'block') {
      const parsed = CreateBlockedSlotSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
      }

      const block = await prisma.blocked_slots.create({
        data: {
          title: parsed.data.title || 'Blocked by doctor',
          start_time: new Date(parsed.data.start_time),
          end_time: new Date(parsed.data.end_time),
        },
      });

      return NextResponse.json({ success: true, block }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type parameter. Expected "schedule", "availability", or "block"' }, { status: 400 });

  } catch (error) {
    console.error('[API] Admin POST availability error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

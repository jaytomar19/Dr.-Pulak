import prisma from '@/lib/db';
import { BookingStatus } from '@prisma/client';

export interface SlotInfo {
  time: string;          // HH:mm (e.g. "10:00")
  datetimeISO: string;   // ISO 8601 string with +05:30 offset
  status: 'available' | 'booked' | 'blocked';
  reason?: string;
}

// Canonical Timezone for clinic
export const CLINIC_TIMEZONE = 'Asia/Kolkata';
export const IST_OFFSET_MINUTES = 330; // UTC+5:30

/**
 * Returns current Date in IST.
 */
export function getCurrentISTDate(): Date {
  const now = new Date();
  return now;
}

/**
 * Helper to format a Date or HH:mm in IST string representation
 */
export function formatToISTDateString(date: Date): string {
  // Format to YYYY-MM-DD in Asia/Kolkata
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // YYYY-MM-DD
}

/**
 * Helper to get day of week in IST (0 = Sun, 1 = Mon ... 6 = Sat)
 */
export function getISTDayOfWeek(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return utcDate.getUTCDay();
}

/**
 * Convert Date object to IST HH:mm format
 */
export function getISTTimeString(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date);
}

/**
 * Parse YYYY-MM-DD and HH:mm to an exact Date object representing that IST time
 */
export function parseISTDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // IST is UTC+5:30. Subtract 5h 30m to get UTC time
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute, 0) - (IST_OFFSET_MINUTES * 60 * 1000);
  return new Date(utcMillis);
}

/**
 * Get start and end Date objects in UTC for a full IST day (00:00:00 to 23:59:59.999 IST)
 */
export function getISTDayRange(dateStr: string): { start: Date; end: Date } {
  const start = parseISTDateTime(dateStr, '00:00');
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { start, end };
}

/**
 * Generate time slots between start_time and end_time (HH:mm) with interval in minutes
 */
function generateTimeIntervals(startTimeStr: string, endTimeStr: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTimeStr.split(':').map(Number);
  const [endH, endM] = endTimeStr.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + intervalMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const m = (currentMinutes % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}

/**
 * Fetch all slots for a specific date (YYYY-MM-DD) with status: available, booked, or blocked
 */
export async function getSlotsForDate(dateStr: string): Promise<SlotInfo[]> {
  const { start: dayStart, end: dayEnd } = getISTDayRange(dateStr);
  const dayOfWeek = getISTDayOfWeek(dateStr);
  const targetDate = new Date(`${dateStr}T00:00:00.000Z`);

  // 1. Check specific date availability overrides
  const dateAvailabilities = await prisma.doctor_availability.findMany({
    where: { date: targetDate },
    orderBy: { start_time: 'asc' },
  });

  interface ScheduleWindow {
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_available: boolean;
  }

  let windows: ScheduleWindow[] = [];

  if (dateAvailabilities.length > 0) {
    windows = dateAvailabilities.map((a) => ({
      start_time: a.start_time,
      end_time: a.end_time,
      slot_duration: a.slot_duration,
      is_available: a.is_available,
    }));
  } else {
    // 2. Fallback to weekly schedule rules
    const weeklySchedules = await prisma.doctor_schedules.findMany({
      where: { day_of_week: dayOfWeek, is_active: true },
      orderBy: { start_time: 'asc' },
    });

    if (weeklySchedules.length > 0) {
      windows = weeklySchedules.map((s) => ({
        start_time: s.start_time,
        end_time: s.end_time,
        slot_duration: s.slot_duration,
        is_available: true,
      }));
    } else {
      // 3. System default working hours if no schedule configured in database at all
      const totalSchedulesCount = await prisma.doctor_schedules.count();
      if (totalSchedulesCount === 0) {
        windows = [
          { start_time: '10:00', end_time: '13:00', slot_duration: 30, is_available: true },
          { start_time: '17:00', end_time: '20:00', slot_duration: 30, is_available: true },
        ];
      }
    }
  }

  // Generate candidate time strings
  const candidateSlots: { time: string; duration: number }[] = [];
  for (const w of windows) {
    if (!w.is_available) continue;
    const intervals = generateTimeIntervals(w.start_time, w.end_time, w.slot_duration);
    for (const timeStr of intervals) {
      candidateSlots.push({ time: timeStr, duration: w.slot_duration });
    }
  }

  if (candidateSlots.length === 0) {
    return [];
  }

  // 4. Fetch blocked slots overlapping this day
  const blockedPeriods = await prisma.blocked_slots.findMany({
    where: {
      start_time: { lte: dayEnd },
      end_time: { gte: dayStart },
    },
  });

  // 5. Fetch existing active bookings for this day
  const activeBookings = await prisma.bookings.findMany({
    where: {
      slot_datetime: { gte: dayStart, lte: dayEnd },
      status: { in: [BookingStatus.confirmed, BookingStatus.rescheduled, BookingStatus.completed] },
    },
    select: { slot_datetime: true },
  });

  const bookedTimestamps = new Set(
    activeBookings.map((b) => b.slot_datetime.getTime())
  );

  const result: SlotInfo[] = [];

  for (const slot of candidateSlots) {
    const slotStart = parseISTDateTime(dateStr, slot.time);
    const slotEnd = new Date(slotStart.getTime() + slot.duration * 60 * 1000);
    const slotISO = slotStart.toISOString();

    // Check if booked
    const isBooked = bookedTimestamps.has(slotStart.getTime());

    // Check if blocked
    const overlappingBlock = blockedPeriods.find(
      (b) => b.start_time < slotEnd && b.end_time > slotStart
    );

    let status: 'available' | 'booked' | 'blocked' = 'available';
    let reason: string | undefined = undefined;

    if (isBooked) {
      status = 'booked';
      reason = 'Already booked by a patient';
    } else if (overlappingBlock) {
      status = 'blocked';
      reason = overlappingBlock.title || 'Blocked by doctor';
    }

    result.push({
      time: slot.time,
      datetimeISO: slotISO,
      status,
      reason,
    });
  }

  return result;
}

/**
 * Server-side validation function to verify if a requested ISO slot datetime is valid for booking
 */
export async function validateRequestedSlot(slotDatetimeISO: string, product?: string): Promise<{ valid: boolean; error?: string }> {
  const slotDate = new Date(slotDatetimeISO);

  if (isNaN(slotDate.getTime())) {
    return { valid: false, error: 'Invalid date/time format' };
  }

  // 48-Hour Video Response is an asynchronous service and does not require live schedule matching
  if (product === 'consult_48h' || product === 'imaging_review') {
    return { valid: true };
  }

  const now = new Date();
  if (slotDate <= now) {
    return { valid: false, error: 'Appointment time must be in the future' };
  }

  // Derive date string YYYY-MM-DD in IST
  const dateStr = formatToISTDateString(slotDate);
  const timeStr = getISTTimeString(slotDate);

  // Fetch slots for that date
  const slots = await getSlotsForDate(dateStr);
  
  // Find matching slot
  const matchingSlot = slots.find((s) => s.time === timeStr);

  if (!matchingSlot) {
    return { valid: false, error: 'Selected time slot is outside doctor\'s available working hours' };
  }

  if (matchingSlot.status === 'blocked') {
    return { valid: false, error: `Selected time slot is blocked (${matchingSlot.reason || 'Doctor unavailable'})` };
  }

  if (matchingSlot.status === 'booked') {
    return { valid: false, error: 'Selected time slot has already been booked by another patient' };
  }

  return { valid: true };
}

import { NextRequest, NextResponse } from 'next/server';
import { getSlotsForDate, formatToISTDateString } from '@/lib/availability';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'get-availability', 60, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const { searchParams } = req.nextUrl;
    let dateStr = searchParams.get('date');

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // Default to today's date in IST
      dateStr = formatToISTDateString(new Date());
    }

    const slots = await getSlotsForDate(dateStr);

    return NextResponse.json({
      date: dateStr,
      slots,
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Availability fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor availability' }, { status: 500 });
  }
}

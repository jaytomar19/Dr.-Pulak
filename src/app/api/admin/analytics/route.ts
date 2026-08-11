import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin']);
    if (roleError) return roleError;

    const [assessmentsStarted, leadsTotal, bookingsTotal, bandA, bandB, bandC, bandR] = await Promise.all([
      prisma.assessment_sessions.count(),
      prisma.leads.count(),
      prisma.bookings.count(),
      prisma.assessment_sessions.count({ where: { band_result: 'A' } }),
      prisma.assessment_sessions.count({ where: { band_result: 'B' } }),
      prisma.assessment_sessions.count({ where: { band_result: 'C' } }),
      prisma.assessment_sessions.count({ where: { band_result: 'R' } }),
    ]);

    return NextResponse.json({
      assessments_started: assessmentsStarted,
      contacts_captured: leadsTotal,
      bookings_total: bookingsTotal,
      band_distribution: { A: bandA, B: bandB, C: bandC, R: bandR },
      conversion_rates: {
        lead_capture_rate: assessmentsStarted > 0 ? ((leadsTotal / assessmentsStarted) * 100).toFixed(1) + '%' : '0%',
        booking_rate: leadsTotal > 0 ? ((bookingsTotal / leadsTotal) * 100).toFixed(1) + '%' : '0%',
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, getResultForBand, isAssessmentSessionAuthorized } from '@/lib/assessment';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!isAssessmentSessionAuthorized(req.cookies.get(ASSESSMENT_SESSION_COOKIE)?.value, id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const session = await prisma.assessment_sessions.findUnique({
      where: { session_id: id },
      select: { lead_id: true, band_result: true, completed_at: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (!session.lead_id || !session.completed_at || !session.band_result) {
      return NextResponse.json({ error: 'Assessment result is not available' }, { status: 403 });
    }

    return NextResponse.json({ result: getResultForBand(session.band_result) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

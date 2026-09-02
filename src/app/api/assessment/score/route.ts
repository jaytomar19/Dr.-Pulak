import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, isAssessmentSessionAuthorized, type AssessmentAnswers } from '@/lib/assessment';
import { scoreAssessment } from '@/lib/scoring';
import { ScoreRequestSchema } from '@/lib/validators';
import { sendBandRAlert } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsedBody = ScoreRequestSchema.safeParse(body);
    if (!parsedBody.success) return NextResponse.json({ error: 'Invalid scoring request' }, { status: 400 });

    const { session_id: sessionId } = parsedBody.data;
    if (!isAssessmentSessionAuthorized(req.cookies.get(ASSESSMENT_SESSION_COOKIE)?.value, sessionId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const session = await prisma.assessment_sessions.findUnique({
      where: { session_id: sessionId },
      select: { answers: true, lead_id: true, completed_at: true, band_result: true, total_score: true, flags: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (!session.lead_id) return NextResponse.json({ error: 'Contact capture is required before scoring' }, { status: 403 });

    // Return cached result if scoring already completed
    if (session.completed_at && session.band_result) {
      return NextResponse.json({ band: session.band_result, totalScore: session.total_score, flags: session.flags }, { status: 200 });
    }

    const answers = (session.answers && typeof session.answers === 'object' && !Array.isArray(session.answers)
      ? session.answers
      : {}) as AssessmentAnswers;

    const score = scoreAssessment(answers);

    await prisma.assessment_sessions.update({
      where: { session_id: sessionId },
      data: {
        band_result: score.band,
        total_score: score.totalPoints,
        flags: score.flags,
        completed_at: new Date(),
      },
    });

    // Band R urgent internal alert (fire-and-forget — does NOT delay patient response)
    if (score.band === 'R') {
      const flags = Array.isArray(score.flags)
        ? (score.flags as string[])
        : typeof score.flags === 'string'
          ? [score.flags]
          : [];

      // Non-blocking — we don't await so the patient response is instant
      void sendBandRAlert(sessionId, flags, session.lead_id).catch((err) =>
        console.error('[BAND_R_ALERT] Notification dispatch error:', err)
      );
    }

    return NextResponse.json({ band: score.band, totalScore: score.totalPoints, flags: score.flags }, { status: 200 });
  } catch (error) {
    console.error('Error scoring assessment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

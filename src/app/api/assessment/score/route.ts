import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, assessmentQuestions, isAssessmentSessionAuthorized, type AssessmentAnswers } from '@/lib/assessment';
import { scoreAssessment } from '@/lib/scoring';
import { ScoreRequestSchema } from '@/lib/validators';

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
      select: { answers: true, lead_id: true, completed_at: true, band_result: true, flags: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (!session.lead_id) return NextResponse.json({ error: 'Contact capture is required before scoring' }, { status: 403 });

    // Return cached result if scoring already completed
    if (session.completed_at && session.band_result) {
      return NextResponse.json({ band: session.band_result, flags: session.flags }, { status: 200 });
    }

    const answers = (session.answers && typeof session.answers === 'object' && !Array.isArray(session.answers)
      ? session.answers
      : {}) as AssessmentAnswers;
    if (!assessmentQuestions.every((question) => answers[question.id])) {
      return NextResponse.json({ error: 'All assessment questions must be completed before scoring' }, { status: 400 });
    }

    const score = scoreAssessment(answers);

    await prisma.assessment_sessions.update({
      where: { session_id: sessionId },
      data: { band_result: score.band, flags: score.flags, completed_at: new Date() },
    });

    // Band R internal alert — spec §5.2 / results.config.json: fire_internal_alert: true
    // Band R leads are also excluded from all automation sequences (exclude_from_automation: true).
    if (score.band === 'R') {
      // TODO (Phase 4): Replace this server-side log with a real internal notification
      // (e.g. transactional email to the doctor, WhatsApp BSP message) once the delivery
      // integration is configured. The actual channel is defined by the EMAIL_PROVIDER /
      // WHATSAPP_BSP_PROVIDER env vars — do NOT invent credentials here.
      // HARD CONSTRAINT: Never include name/phone/email/raw answers in alert payload.
      console.error(
        '[BAND_R_ALERT] High-priority assessment result requires immediate clinical review. session_id=%s flags=%s',
        sessionId,
        Array.isArray(score.flags) ? score.flags.join(',') : String(score.flags),
      );
    }

    return NextResponse.json({ band: score.band, flags: score.flags }, { status: 200 });
  } catch (error) {
    console.error('Error scoring assessment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

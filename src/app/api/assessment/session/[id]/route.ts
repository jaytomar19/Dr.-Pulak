import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, getConfiguredAnswer, isAssessmentSessionAuthorized } from '@/lib/assessment';
import { UpdateSessionSchema } from '@/lib/validators';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!isAssessmentSessionAuthorized(req.cookies.get(ASSESSMENT_SESSION_COOKIE)?.value, id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsedBody = UpdateSessionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
    }

    const answer = getConfiguredAnswer(parsedBody.data.question_id, parsedBody.data.answer_value);
    if (!answer) {
      return NextResponse.json({ error: 'Answer does not match the assessment configuration' }, { status: 400 });
    }

    const session = await prisma.assessment_sessions.findUnique({
      where: { session_id: id },
      select: { answers: true, completed_at: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (session.completed_at) return NextResponse.json({ error: 'Assessment is already complete' }, { status: 409 });

    const answers = (session.answers && typeof session.answers === 'object' && !Array.isArray(session.answers)
      ? session.answers
      : {}) as Record<string, unknown>;

    await prisma.assessment_sessions.update({
      where: { session_id: id },
      data: { answers: { ...answers, [parsedBody.data.question_id]: answer } as Prisma.InputJsonValue },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!isAssessmentSessionAuthorized(req.cookies.get(ASSESSMENT_SESSION_COOKIE)?.value, id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const session = await prisma.assessment_sessions.findUnique({
      where: { session_id: id },
      select: { session_id: true, started_at: true, completed_at: true, lead_id: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    return NextResponse.json({
      session: {
        session_id: session.session_id,
        started_at: session.started_at,
        completed_at: session.completed_at,
        has_contact: Boolean(session.lead_id),
      },
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

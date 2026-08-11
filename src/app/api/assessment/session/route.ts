import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE } from '@/lib/assessment';
import { CreateSessionSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsedBody = CreateSessionSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid session request' }, { status: 400 });
    }

    const session = await prisma.assessment_sessions.create({
      data: {
        campaign_source: parsedBody.data.campaign_source ?? parsedBody.data.utm_source,
      },
      select: { session_id: true },
    });

    const response = NextResponse.json({ session_id: session.session_id }, { status: 201 });
    response.cookies.set(ASSESSMENT_SESSION_COOKIE, session.session_id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

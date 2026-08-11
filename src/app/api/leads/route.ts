import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, isAssessmentSessionAuthorized } from '@/lib/assessment';
import { encryptLeadPII } from '@/lib/encryption';
import { CreateLeadSchema } from '@/lib/validators';

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsedBody = CreateLeadSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid contact details' }, { status: 400 });
    }

    const data = parsedBody.data;
    if (!isAssessmentSessionAuthorized(req.cookies.get(ASSESSMENT_SESSION_COOKIE)?.value, data.session_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const session = await prisma.assessment_sessions.findUnique({
      where: { session_id: data.session_id },
      select: { session_id: true, lead_id: true, campaign_source: true },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (session.lead_id) return NextResponse.json({ error: 'Contact details have already been submitted' }, { status: 409 });

    const encryptedPii = encryptLeadPII({ phone: data.phone, email: data.email });
    const clientIp = getClientIp(req);

    const lead = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.leads.create({
        data: {
          name: data.name,
          phone: encryptedPii.phone,
          email: encryptedPii.email,
          session_id: session.session_id,
          source: session.campaign_source,
        },
        select: { lead_id: true },
      });

      await tx.assessment_sessions.update({
        where: { session_id: session.session_id },
        data: { lead_id: createdLead.lead_id },
      });

      await tx.consent_records.createMany({
        data: [
          {
            lead_id: createdLead.lead_id,
            consent_type: 'service',
            consent_text_version: data.consent_text_version,
            ip_address: clientIp,
            granted: true,
          },
          {
            lead_id: createdLead.lead_id,
            consent_type: 'marketing',
            consent_text_version: data.consent_text_version,
            ip_address: clientIp,
            granted: data.consent_marketing,
          },
        ],
      });

      return createdLead;
    });

    return NextResponse.json({ lead_id: lead.lead_id }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // TODO: Auth check - Admin only
    // TODO: parse query params for filters (status, band, source, date range, assigned, page, limit)
    // TODO: prisma query for paginated leads

    return NextResponse.json({ leads: [], pagination: {} }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

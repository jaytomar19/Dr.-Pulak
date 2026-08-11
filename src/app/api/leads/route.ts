import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ASSESSMENT_SESSION_COOKIE, isAssessmentSessionAuthorized } from '@/lib/assessment';
import { encryptLeadPII, decryptLeadPII } from '@/lib/encryption';
import { CreateLeadSchema } from '@/lib/validators';
import { auth } from '@/lib/auth';
import { LeadStatus, Prisma } from '@prisma/client';

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
    // 1. Server-side Authorization Check
    const authSession = await auth();
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Query Parameters
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search')?.trim();
    const shouldDecrypt = searchParams.get('decrypt') === 'true';

    // 3. Build Prisma Where Filter
    const where: Prisma.leadsWhereInput = {};

    if (statusParam && Object.values(LeadStatus).includes(statusParam as LeadStatus)) {
      where.lead_status = statusParam as LeadStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 4. Query Total Count & Paginated Records
    const total = await prisma.leads.count({ where });
    const rawLeads = await prisma.leads.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        session: {
          select: {
            session_id: true,
            band_result: true,
            flags: true,
            started_at: true,
            completed_at: true,
          },
        },
        consent_records: {
          select: {
            consent_type: true,
            granted: true,
            timestamp: true,
          },
        },
      },
    });

    // 5. Format & Least Privilege Decryption
    const leads = rawLeads.map((lead) => {
      let decryptedPhone = '••••••••';
      let decryptedEmail = '••••••••';

      if (shouldDecrypt) {
        try {
          const decrypted = decryptLeadPII({ phone: lead.phone, email: lead.email });
          decryptedPhone = decrypted.phone;
          decryptedEmail = decrypted.email;
        } catch {
          decryptedPhone = '[Decryption Error]';
          decryptedEmail = '[Decryption Error]';
        }
      }

      return {
        lead_id: lead.lead_id,
        name: lead.name,
        phone: decryptedPhone,
        email: decryptedEmail,
        is_pii_masked: !shouldDecrypt,
        source: lead.source,
        lead_status: lead.lead_status,
        appointment_status: lead.appointment_status,
        notes: lead.notes,
        assigned_staff: lead.assigned_staff,
        last_contacted_at: lead.last_contacted_at,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
        session: lead.session,
        consent_records: lead.consent_records,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

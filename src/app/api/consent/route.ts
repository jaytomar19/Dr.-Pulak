import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { enforceRole } from '@/lib/rbac';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { ConsentType } from '@prisma/client';
import { z } from 'zod';

const ConsentRecordRequestSchema = z.object({
  lead_id: z.string().uuid(),
  consent_type: z.enum(['service', 'marketing']),
  consent_text_version: z.string().min(1).max(64),
  granted: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'record-consent', 10, 60 * 1000);
    if (!rateCheck.isAllowed && rateCheck.response) {
      return rateCheck.response;
    }

    const body = await req.json().catch(() => null);
    const parsed = ConsentRecordRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid consent data' }, { status: 400 });
    }

    const { lead_id, consent_type, consent_text_version, granted } = parsed.data;
    const ipAddress = getClientIp(req);

    const record = await prisma.consent_records.create({
      data: {
        lead_id,
        consent_type: consent_type as ConsentType,
        consent_text_version,
        ip_address: ipAddress,
        granted,
      },
    });

    return NextResponse.json({ success: true, consent_id: record.consent_id }, { status: 201 });
  } catch (error) {
    console.error('Error recording consent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const roleError = enforceRole(session, ['doctor', 'admin', 'staff']);
    if (roleError) return roleError;

    const leadId = req.nextUrl.searchParams.get('lead_id');
    if (!leadId) {
      return NextResponse.json({ error: 'lead_id query parameter is required' }, { status: 400 });
    }

    const records = await prisma.consent_records.findMany({
      where: { lead_id: leadId },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error('Error fetching consent records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

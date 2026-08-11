import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { decryptLeadPII } from '@/lib/encryption';
import { LeadStatusUpdateSchema } from '@/lib/validators';
import { LeadStatus, Prisma } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authSession = await auth();
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: lead_id } = await params;
    const shouldDecrypt = req.nextUrl.searchParams.get('decrypt') === 'true';

    const lead = await prisma.leads.findUnique({
      where: { lead_id },
      include: {
        session: true,
        consent_records: true,
        bookings: true,
        delivery_logs: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    let phone = '••••••••';
    let email = '••••••••';

    if (shouldDecrypt) {
      try {
        const decrypted = decryptLeadPII({ phone: lead.phone, email: lead.email });
        phone = decrypted.phone;
        email = decrypted.email;
      } catch {
        phone = '[Decryption Error]';
        email = '[Decryption Error]';
      }
    }

    return NextResponse.json({
      lead: {
        ...lead,
        phone,
        email,
        is_pii_masked: !shouldDecrypt,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching lead detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authSession = await auth();
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: lead_id } = await params;
    const body = await req.json().catch(() => null);

    const parsedBody = LeadStatusUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid lead status update payload', details: parsedBody.error.flatten() }, { status: 400 });
    }

    const existingLead = await prisma.leads.findUnique({
      where: { lead_id },
      select: { lead_id: true, lead_status: true },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const { lead_status, notes } = parsedBody.data;

    const updateData: Prisma.leadsUpdateInput = {
      lead_status: lead_status as LeadStatus,
      updated_at: new Date(),
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (lead_status === 'Contacted' && existingLead.lead_status !== 'Contacted') {
      updateData.last_contacted_at = new Date();
    }

    const updatedLead = await prisma.leads.update({
      where: { lead_id },
      data: updateData,
      select: {
        lead_id: true,
        name: true,
        lead_status: true,
        notes: true,
        last_contacted_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({ lead: updatedLead }, { status: 200 });

  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

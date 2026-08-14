import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { BandResult, Prisma } from '@prisma/client';
import { decryptLeadPII } from '@/lib/encryption';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const bandParam = searchParams.get('band');

    const where: Prisma.assessment_sessionsWhereInput = {};

    if (bandParam && Object.values(BandResult).includes(bandParam as BandResult)) {
      where.band_result = bandParam as BandResult;
    }

    const total = await prisma.assessment_sessions.count({ where });
    const rawSessions = await prisma.assessment_sessions.findMany({
      where,
      orderBy: { started_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        lead: {
          select: {
            lead_id: true,
            name: true,
            phone: true,
            email: true,
            lead_status: true,
            created_at: true,
          },
        },
      },
    });

    const sessions = rawSessions.map((sess) => {
      let phone = sess.lead?.phone || '';
      let email = sess.lead?.email || '';
      try {
        if (sess.lead?.phone || sess.lead?.email) {
          const decrypted = decryptLeadPII({ phone: sess.lead?.phone || '', email: sess.lead?.email || '' });
          phone = decrypted.phone;
          email = decrypted.email;
        }
      } catch {
        // Keep fallback
      }
      return {
        ...sess,
        lead: sess.lead ? { ...sess.lead, phone, email } : null,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      sessions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin assessment sessions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

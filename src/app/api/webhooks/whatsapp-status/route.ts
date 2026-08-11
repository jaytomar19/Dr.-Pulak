import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DeliveryStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const statusStr = (body.status || body.event || '').toLowerCase();
    let newStatus: DeliveryStatus = DeliveryStatus.sent;

    if (statusStr.includes('deliver') || statusStr.includes('read')) {
      newStatus = DeliveryStatus.delivered;
    } else if (statusStr.includes('fail') || statusStr.includes('error')) {
      newStatus = DeliveryStatus.failed;
    }

    const latestLog = await prisma.delivery_log.findFirst({
      where: { channel: 'whatsapp' },
      orderBy: { attempted_at: 'desc' },
    });

    if (latestLog) {
      await prisma.delivery_log.update({
        where: { id: latestLog.id },
        data: { status: newStatus },
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing whatsapp webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

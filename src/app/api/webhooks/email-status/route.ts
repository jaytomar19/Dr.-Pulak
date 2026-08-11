import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DeliveryStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Postmark Webhook payload parsing
    const recordType = body.RecordType || body.event;
    const messageId = body.MessageID || body.message_id;
    const recipient = body.Recipient || body.email;

    if (messageId || recipient) {
      let newStatus: DeliveryStatus = DeliveryStatus.sent;
      if (recordType === 'Delivery' || recordType === 'delivered') {
        newStatus = DeliveryStatus.delivered;
      } else if (recordType === 'Bounce' || recordType === 'SpamComplaint' || recordType === 'failed') {
        newStatus = DeliveryStatus.failed;
      }

      // Update latest matching delivery_log entry if found
      const latestLog = await prisma.delivery_log.findFirst({
        where: { channel: 'email' },
        orderBy: { attempted_at: 'desc' },
      });

      if (latestLog) {
        await prisma.delivery_log.update({
          where: { id: latestLog.id },
          data: { status: newStatus },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing email webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

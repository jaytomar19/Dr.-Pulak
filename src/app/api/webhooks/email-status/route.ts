import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DeliveryStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Postmark / transactional email provider payload parsing
    const providerMessageId = body.MessageID || body.message_id || body.MessageId;

    if (!providerMessageId) {
      console.warn('[EMAIL_WEBHOOK] Missing provider_message_id in webhook payload. Skipping update.');
      return NextResponse.json({ received: true, matched: false, reason: 'missing_provider_message_id' }, { status: 200 });
    }

    const recordType = (body.RecordType || body.event || '').toLowerCase();
    let newStatus: DeliveryStatus = DeliveryStatus.sent;
    const now = new Date();

    if (recordType === 'delivery' || recordType === 'delivered') {
      newStatus = DeliveryStatus.delivered;
    } else if (recordType === 'bounce' || recordType === 'spamcomplaint' || recordType === 'failed') {
      newStatus = DeliveryStatus.failed;
    }

    // Match delivery record strictly by exact provider_message_id
    const existingLog = await prisma.delivery_log.findUnique({
      where: { provider_message_id: String(providerMessageId) },
    });

    if (!existingLog) {
      console.warn(`[EMAIL_WEBHOOK] No delivery_log entry found for provider_message_id "${providerMessageId}".`);
      return NextResponse.json({ received: true, matched: false, reason: 'unknown_message_id' }, { status: 200 });
    }

    // Idempotency check
    if (existingLog.status === newStatus) {
      return NextResponse.json({ received: true, matched: true, status: 'already_up_to_date' }, { status: 200 });
    }

    await prisma.delivery_log.update({
      where: { id: existingLog.id },
      data: {
        status: newStatus,
        delivered_at: newStatus === DeliveryStatus.delivered ? (existingLog.delivered_at || now) : existingLog.delivered_at,
        failed_at: newStatus === DeliveryStatus.failed ? (existingLog.failed_at || now) : existingLog.failed_at,
      },
    });

    return NextResponse.json({ received: true, matched: true, status: newStatus }, { status: 200 });
  } catch (error) {
    console.error('Error processing email webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { DeliveryStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extract provider_message_id from Meta Cloud API or BSP payloads
    const providerMessageId =
      body.provider_message_id ||
      body.messageId ||
      body.msgId ||
      body.id ||
      body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]?.id;

    if (!providerMessageId) {
      console.warn('[WHATSAPP_WEBHOOK] Missing provider_message_id in status payload. Skipping update.');
      return NextResponse.json({ received: true, matched: false, reason: 'missing_provider_message_id' }, { status: 200 });
    }

    const statusStr = (
      body.status ||
      body.event ||
      body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]?.status ||
      ''
    ).toLowerCase();

    let newStatus: DeliveryStatus = DeliveryStatus.sent;
    const now = new Date();

    if (statusStr.includes('deliver') || statusStr.includes('read')) {
      newStatus = DeliveryStatus.delivered;
    } else if (statusStr.includes('fail') || statusStr.includes('error') || statusStr.includes('undeliver')) {
      newStatus = DeliveryStatus.failed;
    }

    // Match delivery record strictly by exact provider_message_id
    const existingLog = await prisma.delivery_log.findUnique({
      where: { provider_message_id: providerMessageId },
    });

    if (!existingLog) {
      console.warn(`[WHATSAPP_WEBHOOK] No delivery_log entry found for provider_message_id "${providerMessageId}".`);
      return NextResponse.json({ received: true, matched: false, reason: 'unknown_message_id' }, { status: 200 });
    }

    // Idempotency: avoid redundant DB updates if status hasn't changed
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
    console.error('Error processing whatsapp webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

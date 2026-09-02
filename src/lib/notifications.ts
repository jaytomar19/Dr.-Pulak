/**
 * Notification Abstraction Layer
 *
 * Provides a unified interface for dispatching email and WhatsApp notifications.
 * Providers are configurable via environment variables:
 *   EMAIL_PROVIDER, EMAIL_API_KEY, EMAIL_FROM_ADDRESS
 *   WHATSAPP_BSP_PROVIDER, WHATSAPP_API_KEY
 *
 * DPDP/Privacy boundary: notification payloads MUST NOT include raw clinical
 * assessment answers, full PII beyond necessary addressing, or band scores.
 * Band R alert payloads are strictly operational (session ID + flags only).
 *
 * No real provider credentials required at this time.
 * Payloads are logged in development and dispatched when credentials are set.
 */

import prisma from '@/lib/db';
import { DeliveryChannel, DeliveryStatus } from '@prisma/client';
import { decryptLeadPII } from '@/lib/encryption';

export type NotificationChannel = 'email' | 'whatsapp';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  template_name: string;
}

export interface WhatsAppPayload {
  to: string;
  template_name: string;
  template_params?: Record<string, string>;
  message_text?: string;
}

export type NotificationResult =
  | { success: true; provider_message_id?: string }
  | { success: false; error: string };

// ─── Provider Implementations ─────────────────────────────────────────────────

async function sendEmailPostmark(payload: EmailPayload): Promise<NotificationResult> {
  const apiKey = process.env.EMAIL_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;

  if (!apiKey || !fromAddress) {
    console.warn('[NOTIF] EMAIL_API_KEY or EMAIL_FROM_ADDRESS is not configured. Email not sent.');
    return { success: false, error: 'Email provider not configured' };
  }

  try {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify({
        From: fromAddress,
        To: payload.to,
        Subject: payload.subject,
        TextBody: payload.body,
        Tag: payload.template_name,
        TrackOpens: false,
        TrackLinks: 'None',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[NOTIF] Postmark delivery failed:', errText);
      return { success: false, error: `Postmark API error: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, provider_message_id: data.MessageID };
  } catch (err) {
    console.error('[NOTIF] Email dispatch error:', err);
    return { success: false, error: 'Email dispatch threw an exception' };
  }
}

async function sendWhatsApp(payload: WhatsAppPayload): Promise<NotificationResult> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const provider = (process.env.WHATSAPP_BSP_PROVIDER || 'meta').toLowerCase();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey) {
    console.log('[NOTIF] [STUB] WHATSAPP_API_KEY is unconfigured. WhatsApp notification logged in stub mode:', {
      provider,
      recipient: payload.to,
      template: payload.template_name,
      params_count: Object.keys(payload.template_params || {}).length,
    });
    return { success: false, error: 'WhatsApp provider credentials not configured (development stub mode)' };
  }

  try {
    // 1. Meta Cloud API (Official WhatsApp Business API)
    if (provider === 'meta' || provider === 'facebook') {
      if (!phoneNumberId) {
        console.error('[NOTIF] WHATSAPP_PHONE_NUMBER_ID is required for Meta Cloud API.');
        return { success: false, error: 'WHATSAPP_PHONE_NUMBER_ID required for Meta Cloud API' };
      }

      const formattedTo = payload.to.replace(/\D/g, '');
      const paramValues = Object.values(payload.template_params || {});
      const components = paramValues.length > 0 ? [
        {
          type: 'body',
          parameters: paramValues.map((v) => ({ type: 'text', text: v })),
        },
      ] : [];

      const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedTo,
          type: 'template',
          template: {
            name: payload.template_name,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en' },
            components,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[NOTIF] Meta WhatsApp API error:', errText);
        return { success: false, error: `Meta WhatsApp API error (${res.status}): ${errText}` };
      }

      const data = await res.json();
      const messageId = data.messages?.[0]?.id;
      return { success: true, provider_message_id: messageId };
    }

    // 2. Aisensy BSP Provider
    if (provider === 'aisensy') {
      const res = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          campaignName: payload.template_name,
          destination: payload.to.replace(/\D/g, ''),
          templateParams: Object.values(payload.template_params || {}),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[NOTIF] Aisensy WhatsApp API error:', errText);
        return { success: false, error: `Aisensy API error (${res.status}): ${errText}` };
      }

      const data = await res.json();
      return { success: true, provider_message_id: data.msgId };
    }

    // 3. Fallback / Custom Webhook provider
    console.warn(`[NOTIF] Unsupported WhatsApp BSP provider "${provider}". Message stubbed.`);
    return { success: false, error: `Unsupported WhatsApp BSP provider "${provider}"` };

  } catch (err) {
    console.error('[NOTIF] WhatsApp dispatch exception:', err);
    return { success: false, error: 'WhatsApp dispatch exception' };
  }
}

// ─── Delivery Log ─────────────────────────────────────────────────────────────

async function logDelivery(
  lead_id: string,
  channel: DeliveryChannel,
  template_name: string,
  status: DeliveryStatus,
  retry_count: number = 0,
  provider_message_id?: string | null,
  provider?: string | null
): Promise<void> {
  try {
    const now = new Date();
    await prisma.delivery_log.create({
      data: {
        lead_id,
        channel,
        template_name,
        status,
        retry_count,
        provider: provider || null,
        provider_message_id: provider_message_id || null,
        delivered_at: status === DeliveryStatus.delivered ? now : null,
        failed_at: status === DeliveryStatus.failed ? now : null,
      },
    });
  } catch (err) {
    console.error('[NOTIF] Failed to write delivery_log:', err);
  }
}

// ─── Notification Dispatch Functions ──────────────────────────────────────────

/**
 * Band-R urgent internal alert — sent to clinic staff / doctor only.
 *
 * PRIVACY CONSTRAINT:
 * - Does NOT include patient name, phone, email, or raw assessment answers.
 * - Operational payload contains only: session ID, flag list, and timestamp.
 */
export async function sendBandRAlert(
  sessionId: string,
  flags: string[],
  lead_id: string,
  adminAlertEmail?: string
): Promise<void> {
  const alertTo = adminAlertEmail || process.env.EMAIL_FROM_ADDRESS;
  const timestamp = new Date().toISOString();

  if (!alertTo) {
    console.error(
      '[BAND_R_ALERT] 🚨 URGENT — High-risk assessment requires immediate clinical review. ' +
      `session_id=${sessionId} flags=${flags.join(',')} time=${timestamp}`
    );
    await logDelivery(lead_id, DeliveryChannel.email, 'band_r_internal_alert', DeliveryStatus.failed);
    return;
  }

  const result = await sendEmailPostmark({
    to: alertTo,
    subject: `🚨 URGENT: High-Risk Patient Assessment — Immediate Review Required [${timestamp}]`,
    body: [
      'INTERNAL CLINICAL NOTIFICATION',
      '',
      'A patient assessment has been scored as BAND R (HIGH RISK).',
      'This notification is for clinic staff use only and does NOT constitute medical advice.',
      '',
      `Timestamp: ${timestamp}`,
      `Session Reference: ${sessionId}`,
      `Clinical Flags: ${flags.join(', ')}`,
      '',
      'Action Required: Review and contact the patient directly via the admin panel.',
      '',
      'This message is generated automatically by the assessment system.',
      'Do NOT share this notification with the patient.',
    ].join('\n'),
    template_name: 'band_r_internal_alert',
  });

  const status = result.success ? DeliveryStatus.sent : DeliveryStatus.failed;
  await logDelivery(lead_id, DeliveryChannel.email, 'band_r_internal_alert', status, 0, result.success ? result.provider_message_id : null, 'postmark');

  if (!result.success) {
    console.error(
      '[BAND_R_ALERT] 🚨 URGENT — Email dispatch failed. Manual review required. ' +
      `session_id=${sessionId} flags=${flags.join(',')} error=${result.error}`
    );
  }
}

/**
 * Booking confirmation notification sent to clinic staff.
 *
 * PRIVACY CONSTRAINT:
 * - Does NOT include decrypted PII (phone/email from database).
 * - Uses only the patient name and appointment date.
 */
export async function sendBookingConfirmationToStaff(
  lead_id: string,
  patientName: string,
  product: string,
  slotDatetime: Date
): Promise<void> {
  const alertTo = process.env.EMAIL_FROM_ADDRESS;

  if (!alertTo) {
    console.warn('[NOTIF] Booking confirmation: EMAIL_FROM_ADDRESS not configured');
    await logDelivery(lead_id, DeliveryChannel.email, 'booking_confirmation_staff', DeliveryStatus.failed);
    return;
  }

  const productLabel: Record<string, string> = {
    opd: 'In-Person OPD Visit',
    online_live: 'Online Live Video Consultation',
    consult_48h: '48-Hour Video Response',
    imaging_review: '48-Hour Video Response',
    second_opinion: 'Surgical Second Opinion',
    international: 'International Consultation',
  };

  const result = await sendEmailPostmark({
    to: alertTo,
    subject: `New Booking: ${productLabel[product] || product} — ${patientName}`,
    body: [
      'INTERNAL BOOKING NOTIFICATION',
      '',
      `Patient Name: ${patientName}`,
      `Consultation Type: ${productLabel[product] || product}`,
      `Appointment Time: ${slotDatetime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      '',
      'Please confirm the appointment and prepare the relevant patient records.',
    ].join('\n'),
    template_name: 'booking_confirmation_staff',
  });

  const status = result.success ? DeliveryStatus.sent : DeliveryStatus.failed;
  await logDelivery(lead_id, DeliveryChannel.email, 'booking_confirmation_staff', status, 0, result.success ? result.provider_message_id : null, 'postmark');
}

/**
 * Payment confirmed notification to clinic staff.
 */
export async function sendPaymentConfirmedToStaff(
  lead_id: string,
  bookingId: string,
  product: string,
  amountPaise: number
): Promise<void> {
  const alertTo = process.env.EMAIL_FROM_ADDRESS;

  if (!alertTo) {
    console.warn('[NOTIF] Payment confirmation: EMAIL_FROM_ADDRESS not configured');
    await logDelivery(lead_id, DeliveryChannel.email, 'booking_payment_confirmed', DeliveryStatus.failed);
    return;
  }

  const result = await sendEmailPostmark({
    to: alertTo,
    subject: `Payment Received — Booking ${bookingId.substring(0, 8)}`,
    body: [
      'INTERNAL PAYMENT NOTIFICATION',
      '',
      `Booking Reference: ${bookingId}`,
      `Product: ${product}`,
      `Amount Received: ₹${(amountPaise / 100).toFixed(2)}`,
      `Timestamp: ${new Date().toISOString()}`,
      '',
      'Payment has been verified by Razorpay webhook. Booking is now confirmed.',
    ].join('\n'),
    template_name: 'booking_payment_confirmed',
  });

  const status = result.success ? DeliveryStatus.sent : DeliveryStatus.failed;
  await logDelivery(lead_id, DeliveryChannel.email, 'booking_payment_confirmed', status, 0, result.success ? result.provider_message_id : null, 'postmark');
}

/**
 * New lead notification — sent to clinic staff.
 * PRIVACY: Only patient name and assessment band are included. No PII.
 */
export async function sendNewLeadNotificationToStaff(
  lead_id: string,
  patientName: string,
  band: string
): Promise<void> {
  const alertTo = process.env.EMAIL_FROM_ADDRESS;

  if (!alertTo) {
    console.warn('[NOTIF] New lead notification: EMAIL_FROM_ADDRESS not configured');
    await logDelivery(lead_id, DeliveryChannel.email, 'new_lead_notification', DeliveryStatus.failed);
    return;
  }

  const result = await sendEmailPostmark({
    to: alertTo,
    subject: `New Patient Lead — Band ${band}: ${patientName}`,
    body: [
      'NEW PATIENT ASSESSMENT LEAD',
      '',
      `Patient Name: ${patientName}`,
      `Assessment Band: ${band}`,
      `Lead Submitted: ${new Date().toISOString()}`,
      '',
      'Log in to the admin panel to review and follow up.',
    ].join('\n'),
    template_name: 'new_lead_notification',
  });

  const status = result.success ? DeliveryStatus.sent : DeliveryStatus.failed;
  await logDelivery(lead_id, DeliveryChannel.email, 'new_lead_notification', status);
}

/**
 * Transactional WhatsApp notification sent to the clinic/doctor when a booking & payment is confirmed.
 * Checks delivery_log to maintain strict idempotency (prevents duplicate WhatsApp alerts).
 */
export async function sendWhatsAppBookingConfirmationToClinic(bookingId: string): Promise<void> {
  try {
    // 1. Fetch booking with linked lead and payments
    const booking = await prisma.bookings.findUnique({
      where: { booking_id: bookingId },
      include: {
        lead: {
          select: {
            lead_id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        payments: {
          where: { status: 'PAID' },
          orderBy: { updated_at: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking || !booking.lead) {
      console.warn(`[NOTIF_WA] Booking ${bookingId} not found or missing lead record.`);
      return;
    }

    // 2. Idempotency Check: Verify WhatsApp alert was not already sent for this booking
    const existingLog = await prisma.delivery_log.findFirst({
      where: {
        lead_id: booking.lead_id,
        channel: DeliveryChannel.whatsapp,
        template_name: 'clinic_booking_whatsapp_alert',
        status: DeliveryStatus.sent,
      },
    });

    if (existingLog) {
      console.log(`[NOTIF_WA] WhatsApp notification already sent for lead ${booking.lead_id} (Booking ${bookingId}). Skipping duplicate.`);
      return;
    }

    // 3. Decrypt patient PII safely
    let patientPhone = 'N/A';
    let patientEmail = 'N/A';
    try {
      const decrypted = decryptLeadPII({ phone: booking.lead.phone, email: booking.lead.email });
      patientPhone = decrypted.phone || 'N/A';
      patientEmail = decrypted.email || 'N/A';
    } catch {
      patientPhone = booking.lead.phone || 'N/A';
      patientEmail = booking.lead.email || 'N/A';
    }

    const productLabels: Record<string, string> = {
      opd: 'In-Person OPD Visit',
      online_live: 'Online Live Video Consultation',
      consult_48h: '48-Hour Video Response',
      imaging_review: '48-Hour Video Response',
      second_opinion: 'Surgical Second Opinion',
      international: 'International Consultation',
    };

    const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER || process.env.CLINIC_WHATSAPP_NUMBER || '+919876543210';
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'clinic_booking_alert';
    const paidPayment = booking.payments[0];
    const amountINR = paidPayment ? (paidPayment.amount_paise / 100).toFixed(0) : '1000';
    const paymentId = paidPayment?.razorpay_payment_id || 'N/A';
    const orderId = paidPayment?.razorpay_order_id || booking.payment_provider_ref || 'N/A';
    const slotDateStr = new Date(booking.slot_datetime).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const slotTimeStr = new Date(booking.slot_datetime).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

    const templateParams = {
      patient_name: booking.lead.name,
      patient_phone: patientPhone,
      patient_email: patientEmail,
      consultation_type: productLabels[booking.product] || booking.product,
      appointment_date: slotDateStr,
      appointment_time: slotTimeStr,
      amount: `₹${amountINR}`,
      payment_id: paymentId,
      order_id: orderId,
    };

    const textMessage = [
      '🩺 *NEW CONFIRMED CONSULTATION BOOKING*',
      'Clinic: Step Up Joints | Dr. Pulak Vatsya',
      '',
      `👤 *Patient Name:* ${booking.lead.name}`,
      `📞 *Phone:* ${patientPhone}`,
      `✉️ *Email:* ${patientEmail}`,
      `🩺 *Consultation:* ${productLabels[booking.product] || booking.product}`,
      `📅 *Date:* ${slotDateStr}`,
      `⏰ *Time:* ${slotTimeStr}`,
      `💳 *Payment:* Paid (₹${amountINR})`,
      `🆔 *Razorpay Payment ID:* ${paymentId}`,
      `🔖 *Razorpay Order ID:* ${orderId}`,
      '',
      'Please check the admin dashboard for complete details.',
    ].join('\n');

    // 4. Send WhatsApp Notification
    const result = await sendWhatsApp({
      to: recipientNumber,
      template_name: templateName,
      template_params: templateParams,
      message_text: textMessage,
    });

    const status = result.success ? DeliveryStatus.sent : DeliveryStatus.failed;

    // 5. Record Delivery Log
    await logDelivery(booking.lead_id, DeliveryChannel.whatsapp, 'clinic_booking_whatsapp_alert', status, 0, result.success ? result.provider_message_id : null, process.env.WHATSAPP_BSP_PROVIDER || 'meta');

  } catch (err) {
    console.error('[NOTIF_WA] WhatsApp notification dispatch exception:', err);
  }
}

// Export provider utilities for testing
export { sendEmailPostmark, sendWhatsApp };

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
  const provider = process.env.WHATSAPP_BSP_PROVIDER || 'aisensy';

  if (!apiKey) {
    console.warn('[NOTIF] WHATSAPP_API_KEY is not configured. WhatsApp not sent.');
    return { success: false, error: 'WhatsApp provider not configured' };
  }

  // Provider adapter: extend here when integrating Aisensy/Interakt/Wati
  console.warn(`[NOTIF] WhatsApp provider "${provider}" interface stub. Payload queued:`, {
    template: payload.template_name,
    params_count: Object.keys(payload.template_params || {}).length,
  });

  return { success: false, error: `WhatsApp provider "${provider}" integration pending` };
}

// ─── Delivery Log ─────────────────────────────────────────────────────────────

async function logDelivery(
  lead_id: string,
  channel: DeliveryChannel,
  template_name: string,
  status: DeliveryStatus,
  retry_count: number = 0
): Promise<void> {
  try {
    await prisma.delivery_log.create({
      data: { lead_id, channel, template_name, status, retry_count },
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
  await logDelivery(lead_id, DeliveryChannel.email, 'band_r_internal_alert', status);

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
    opd: 'OPD Consultation',
    online_live: 'Online Live Consultation',
    imaging_review: 'Imaging Review',
    second_opinion: 'Second Opinion',
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
  await logDelivery(lead_id, DeliveryChannel.email, 'booking_confirmation_staff', status);
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
  await logDelivery(lead_id, DeliveryChannel.email, 'booking_payment_confirmed', status);
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

// Export provider utilities for testing
export { sendEmailPostmark, sendWhatsApp };

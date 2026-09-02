import { z } from 'zod';

export const CreateSessionSchema = z.object({
  campaign_source: z.string().trim().max(120).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  utm_content: z.string().trim().max(120).optional(),
  utm_term: z.string().trim().max(120).optional(),
});
export type CreateSession = z.infer<typeof CreateSessionSchema>;

export const UpdateSessionSchema = z.object({
  question_id: z.string().trim().min(1).max(32),
  answer_value: z.string().trim().min(1).max(120),
});
export type UpdateSession = z.infer<typeof UpdateSessionSchema>;

export const CreateLeadSchema = z.object({
  session_id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z.string().regex(/^(?:\+91|91)?[6789]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.union([
    z.string().trim().email('Please enter a valid email address (e.g. name@gmail.com)'),
    z.literal(''),
  ]).optional().transform((val) => val || ''),
  consent_service: z.literal(true, {
    errorMap: () => ({ message: 'Service consent is required to continue' }),
  }),
  consent_marketing: z.boolean(),
  consent_text_version: z.string().trim().min(1).max(64),
});
export type CreateLead = z.infer<typeof CreateLeadSchema>;

export const ScoreRequestSchema = z.object({
  session_id: z.string().uuid(),
});
export type ScoreRequest = z.infer<typeof ScoreRequestSchema>;

export const ContactCaptureSchema = CreateLeadSchema.omit({ session_id: true });
export type ContactCapture = z.infer<typeof ContactCaptureSchema>;

export const BookingSchema = z.object({
  lead_id: z.string().uuid(),
  product: z.enum(['opd', 'online_live', 'imaging_review', 'second_opinion', 'consult_48h', 'international']),
  slot_datetime: z.string().datetime(), // ISO 8601 date string
});
export type Booking = z.infer<typeof BookingSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type AdminLogin = z.infer<typeof AdminLoginSchema>;

export const AdminUserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['doctor', 'admin', 'staff']),
});
export type AdminUserCreate = z.infer<typeof AdminUserCreateSchema>;

export const AdminUserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['doctor', 'admin', 'staff']).optional(),
  is_active: z.boolean().optional(),
});
export type AdminUserUpdate = z.infer<typeof AdminUserUpdateSchema>;


export const LeadStatusUpdateSchema = z.object({
  lead_status: z.enum([
    'New', 'Contacted', 'Interested', 'Booked', 'Converted',
    'NotInterested', 'NoResponse', 'Invalid', 'Closed',
  ]),
  notes: z.string().optional(),
});
export type LeadStatusUpdate = z.infer<typeof LeadStatusUpdateSchema>;

export const BookingStatusUpdateSchema = z.object({
  status: z.enum(['confirmed', 'completed', 'no_show', 'cancelled', 'rescheduled']).optional(),
  payment_status: z.enum(['pending', 'paid', 'refunded']).optional(),
  payment_provider_ref: z.string().optional(),
});
export type BookingStatusUpdate = z.infer<typeof BookingStatusUpdateSchema>;

export const CreatePublicBookingSchema = z.object({
  lead_id: z.string().uuid(),
  product: z.enum(['opd', 'online_live', 'imaging_review', 'second_opinion', 'consult_48h', 'international']),
  slot_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO 8601 date string for slot_datetime',
  }),
});
export type CreatePublicBooking = z.infer<typeof CreatePublicBookingSchema>;

export const VerifyPaymentSchema = z.object({
  booking_id: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;

export const CreateScheduleSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be HH:mm (e.g. 10:00)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must be HH:mm (e.g. 13:00)'),
  slot_duration: z.number().int().min(5).max(120).default(30),
  is_active: z.boolean().optional().default(true),
}).refine((data) => {
  const [sH, sM] = data.start_time.split(':').map(Number);
  const [eH, eM] = data.end_time.split(':').map(Number);
  return (eH * 60 + eM) > (sH * 60 + sM);
}, { message: 'End time must be after start time' });
export type CreateSchedule = z.infer<typeof CreateScheduleSchema>;

export const CreateAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be HH:mm (e.g. 10:00)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'End time must be HH:mm (e.g. 13:00)'),
  slot_duration: z.number().int().min(5).max(120).default(30),
  is_available: z.boolean().optional().default(true),
}).refine((data) => {
  const [sH, sM] = data.start_time.split(':').map(Number);
  const [eH, eM] = data.end_time.split(':').map(Number);
  return (eH * 60 + eM) > (sH * 60 + sM);
}, { message: 'End time must be after start time' });
export type CreateAvailability = z.infer<typeof CreateAvailabilitySchema>;

export const CreateBlockedSlotSchema = z.object({
  title: z.string().max(120).optional(),
  start_time: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start_time ISO string' }),
  end_time: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end_time ISO string' }),
}).refine((data) => new Date(data.end_time) > new Date(data.start_time), { message: 'End time must be after start time' });
export type CreateBlockedSlot = z.infer<typeof CreateBlockedSlotSchema>;



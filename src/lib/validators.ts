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
  session_id: z.string().uuid(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z.string().regex(/^(?:\+91|91)?[6789]\d{9}$/, 'Invalid Indian mobile number'),
  email: z.string().email('Invalid email address'),
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
  product: z.enum(['opd', 'online_live', 'imaging_review', 'second_opinion']),
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
  product: z.enum(['opd', 'online_live', 'imaging_review', 'second_opinion']),
  slot_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO 8601 date string for slot_datetime',
  }),
});
export type CreatePublicBooking = z.infer<typeof CreatePublicBookingSchema>;


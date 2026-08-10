import { z } from 'zod';

export const CreateSessionSchema = z.object({
  campaign_source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});
export type CreateSession = z.infer<typeof CreateSessionSchema>;

export const UpdateSessionSchema = z.object({
  question_id: z.string(),
  answer_value: z.string(),
});
export type UpdateSession = z.infer<typeof UpdateSessionSchema>;

export const CreateLeadSchema = z.object({
  session_id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(?:\+91|91)?[6789]\d{9}$/, 'Invalid Indian mobile number'),
  email: z.string().email('Invalid email address'),
  consent_service: z.boolean(),
  consent_marketing: z.boolean(),
  consent_text_version: z.string(),
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

export const LeadStatusUpdateSchema = z.object({
  lead_status: z.enum([
    'new', 'contacted', 'scheduled', 'completed', 'dropped', 'junk'
  ]),
  notes: z.string().optional(),
});
export type LeadStatusUpdate = z.infer<typeof LeadStatusUpdateSchema>;

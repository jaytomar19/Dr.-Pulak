import type { Metadata } from 'next';
import Reveal from '@/components/shared/Reveal';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Dr. Pulak Vatsya',
  description: 'Refund, cancellation, and rescheduling terms for online consultations, imaging reviews, and OPD appointments at StepUp Joints.',
};

export default function RefundPolicyPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">PRACTICE POLICIES</span>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Refund & Cancellation Policy
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          This policy outlines the cancellation, rescheduling, and refund terms applicable to all consultation services booked through the Dr. Pulak Vatsya / StepUp Joints platform.
        </p>
      </Reveal>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>1. OPD & Online Video Consultations</h2>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <li><strong>Cancellation prior to 24 hours:</strong> 100% refund of consultation fee via original payment method.</li>
          <li><strong>Cancellation within 24 hours:</strong> Rescheduling permitted at no additional charge. Cancellation without rescheduling incurs a 20% administrative handling fee.</li>
          <li><strong>No-Show Policy:</strong> Patients who fail to attend scheduled video calls or OPD slots without prior notice forfeit consultation fees.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>2. X-Ray / MRI Review & 48h Video Responses</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Once medical documents or DICOM scans have been uploaded and review has commenced by Dr. Pulak Vatsya, the review fee becomes non-refundable. If submitted files are unreadable or incomplete, our clinic will request replacement files before processing.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>3. Refund Processing Timeline</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '0.95rem' }}>
          Approved refunds are processed via Razorpay within 5 to 7 business days to the original payment instrument (Bank Account, Credit/Debit Card, or UPI).
        </p>
      </section>

      <div style={{ padding: '1.5rem', background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          For refund queries or rescheduling requests, contact our clinic at <a href={`mailto:${PRACTICE_CONFIG.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{PRACTICE_CONFIG.email}</a> or call <a href={PRACTICE_CONFIG.phoneTel} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{PRACTICE_CONFIG.phone}</a>.
        </p>
      </div>
    </div>
  );
}

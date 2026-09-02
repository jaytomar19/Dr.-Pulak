import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: '48-Hour Video Response | Dr. Pulak Vatsya',
  description: 'Upload your X-rays, MRI scans, and medical reports. Dr. Pulak Vatsya reviews your submitted material and sends a recorded video response within 48 hours.',
};

export default function XRayMRIReviewPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">ASYNCHRONOUS SPECIALIST EVALUATION</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          48-Hour Video Response
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Patients can upload their X-rays, MRI scans, reports, and relevant clinical information. Dr. Pulak Vatsya reviews the submitted material and sends a recorded video response explaining the findings and what they mean for the patient.
        </p>
      </Reveal>

      {/* Key Promise Banner */}
      <Reveal variant="fade-up" delay={80}>
        <div style={{ background: 'var(--color-primary-subtle)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, textAlign: 'center' }}>
            &ldquo;Dr. Pulak reviews your scans and reports and responds with a video note within 48 hours.&rdquo;
          </p>
        </div>
      </Reveal>

      {/* 6-Step Asynchronous Flow */}
      <Reveal variant="fade-up" delay={120}>
        <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.5rem' }}>Service Process Flow</h2>
          <ol style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '2', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Patient provides details</strong>: Enter your symptoms, medical history, and clinical questions.</li>
            <li><strong>Patient uploads scans</strong>: Securely attach X-rays, MRI reports, CT scans, or DICOM files.</li>
            <li><strong>Patient makes payment</strong>: Complete the quick and secure ₹500 fee payment via Razorpay.</li>
            <li><strong>Dr. Pulak reviews material</strong>: Dr. Vatsya thoroughly analyzes your imaging and notes.</li>
            <li><strong>Dr. Pulak records video response</strong>: A personalized video explanation is recorded detailing the findings.</li>
            <li><strong>Patient receives response within 48 hours</strong>: You receive your video note directly via secure link within 48 hours.</li>
          </ol>
          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(10, 110, 110, 0.08)', borderRadius: '12px', border: '1px solid rgba(10, 110, 110, 0.2)' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Fee: ₹500</span> — Asynchronous service with direct video note response (No live appointment calendar required).
          </div>
        </section>
      </Reveal>

      {/* CTA Box */}
      <Reveal variant="fade-up" delay={160}>
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
          <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Ready to Upload Your Scans?</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Submit your details and imaging files in under 2 minutes to receive your 48-hour video response.
          </p>
          <Link href="/consult/" className="btn btn--secondary btn--lg">
            Submit Scans for 48-Hour Video Response (₹500)
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

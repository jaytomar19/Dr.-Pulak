import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata: Metadata = {
  title: 'International Patient Consultation | Dr. Pulak Vatsya',
  description: 'Specialized video consultation and surgical second opinions for international patients and NRIs seeking orthopaedic care in New Delhi with Dr. Pulak Vatsya.',
};

export default function InternationalConsultationPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">INTERNATIONAL PATIENT SERVICES</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          International & NRI Consultation
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Dr. Pulak Vatsya offers virtual consultations, radiological evaluations, and surgical travel planning for international patients and NRIs considering joint surgery in New Delhi.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Services for Overseas Patients</h2>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <li>Virtual video consultation scheduled across international time zones.</li>
          <li>Detailed review of local X-rays, MRI scans, and blood work.</li>
          <li>Pre-operative surgical planning and estimated stay duration in New Delhi.</li>
          <li>Coordination support for hospital admission, nursing, and physical rehabilitation.</li>
        </ul>
        <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'var(--color-primary-subtle)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Fee: ₹2,199</span> — Includes international video consultation and radiological report.
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Schedule an International Consult</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Book online or contact our patient coordinator directly via WhatsApp.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/consult/" className="btn btn--secondary btn--lg">
            Book International Consultation
          </Link>
          <a href={PRACTICE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--lg">
            WhatsApp Patient Coordinator
          </a>
        </div>
      </div>
    </div>
  );
}

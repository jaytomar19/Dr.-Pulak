import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import TiltCard from '@/components/shared/TiltCard';
import Magnetic from '@/components/shared/Magnetic';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata: Metadata = {
  title: `In-Person Consultation | ${PRACTICE_CONFIG.doctorName}`,
  description: `Book an in-person consultation at ${PRACTICE_CONFIG.clinicName}, ${PRACTICE_CONFIG.location}.`,
};

export default function OPDConsultPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">CLINICAL OPD VISIT</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>In-Person Consultation — {PRACTICE_CONFIG.clinicName}</h1>
      </Reveal>
      
      <Reveal variant="fade-up" delay={80}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What to Expect</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
            An in-person visit allows for a comprehensive physical examination and direct discussion of your symptoms and treatment options. 
            {PRACTICE_CONFIG.doctorName} will carefully assess your condition and recommend a personalized care plan.
          </p>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={140}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What to Bring</h2>
          <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li>Previous medical records and prescriptions</li>
            <li>Recent X-rays, MRIs, or other imaging reports</li>
            <li>A list of any current medications</li>
          </ul>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={200}>
        <TiltCard maxTilt={3} scale={1.01}>
          <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Clinic Location & Contact</h2>
            <p style={{ color: 'var(--color-navy)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{PRACTICE_CONFIG.clinicName}</p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', lineHeight: '1.6' }}>{PRACTICE_CONFIG.fullAddress}</p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              📞 Phone: <a href={PRACTICE_CONFIG.phoneTel} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{PRACTICE_CONFIG.phone}</a>
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              ✉️ Email: <a href={`mailto:${PRACTICE_CONFIG.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{PRACTICE_CONFIG.email}</a>
            </p>
            <a
              href={PRACTICE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
              style={{ borderRadius: '9999px', fontSize: '0.9rem', display: 'inline-flex' }}
            >
              Get Directions on Google Maps ↗
            </a>
          </section>
        </TiltCard>
      </Reveal>

      <Reveal variant="fade-up" delay={240}>
        <div style={{ marginTop: '2.5rem' }}>
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--primary btn--lg" data-cursor="button">
              Book OPD Visit
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

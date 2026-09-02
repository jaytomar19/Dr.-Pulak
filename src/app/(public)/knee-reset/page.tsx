import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Knee Reset System | Doctor-Led Knee Health & Risk Scoring',
  description: 'The Knee Reset System by Dr. Pulak Vatsya includes a 9-question clinical risk assessment and structured non-surgical knee rehabilitation protocols.',
};

export default function KneeResetHubPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1080px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">DOCTOR-LED KNEE SYSTEM</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            The Knee Reset System
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            A comprehensive clinical assessment and joint restoration protocol designed by Dr. Pulak Vatsya to help patients understand their knee condition and avoid unnecessary early surgical interventions.
          </p>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ padding: '2.5rem', background: 'var(--color-bg-surface)', borderRadius: '20px', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
          <span className="eyebrow" style={{ fontSize: '0.75rem' }}>STEP 1 • CLINICAL EVALUATION</span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginTop: '0.25rem', marginBottom: '1rem' }}>
            Free 9-Question Assessment
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Answer 9 clinical questions regarding your pain intensity, stiffness, swelling, mechanical locking, and functional mobility. Receive an instant risk band score (Green, Yellow, Orange, Red) and tailored clinical next steps.
          </p>
          <Link href="/knee-reset/assessment/" className="btn btn--primary btn--full-width">
            Take Assessment Now (90 Seconds) →
          </Link>
        </div>

        <div style={{ padding: '2.5rem', background: 'var(--color-bg-surface)', borderRadius: '20px', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
          <span className="eyebrow" style={{ fontSize: '0.75rem' }}>STEP 2 • GUIDED RECOVERY</span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginTop: '0.25rem', marginBottom: '1rem' }}>
            Knee Reset Rehab Programme
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            A 90-day structured, non-surgical movement protocol aimed at rebalancing quadriceps-to-hamstring strength, improving patellar tracking, and restoring comfortable range of motion.
          </p>
          <Link href="/knee-reset/rehab/" className="btn btn--ghost btn--full-width">
            Learn About Knee Reset Rehab →
          </Link>
        </div>
      </div>
    </div>
  );
}

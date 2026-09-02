import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Knee Reset Rehab Programme | Non-Surgical Joint Restoration',
  description: 'Structured 90-day non-surgical knee rehabilitation protocol by Dr. Pulak Vatsya focusing on muscle balance, joint tracking, and functional recovery.',
};

export default function KneeResetRehabPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">NON-SURGICAL REHABILITATION</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Knee Reset Rehab Programme
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          The Knee Reset Rehab Programme is a 90-day evidence-based exercise and motion protocol designed for patients with early-to-moderate knee osteoarthritis, patellofemoral pain syndrome, or post-injury stiffness.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>3-Phase Clinical Structure</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Phase 1 (Weeks 1–4): Pain Reduction & Activation</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Focus on reducing intra-articular irritation, isometric quadriceps activation, gluteal strengthening, and gentle knee extension mobility.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Phase 2 (Weeks 5–8): Dynamic Loading & Tracking</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Introduction of closed-kinetic-chain exercises (mini-squats, step-downs), patellar tracking stabilization, and core stability.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>Phase 3 (Weeks 9–12): Functional Endurance</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Functional gait retraining, stair negotiation, and endurance strengthening to sustain long-term joint health.
            </p>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Find Out If You Qualify for Knee Reset Rehab</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Start by taking our free 9-question assessment to determine your joint risk band.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/knee-reset/assessment/" className="btn btn--secondary btn--lg">
            Take Knee Reset Assessment
          </Link>
          <Link href="/consult/opd/" className="btn btn--outline btn--lg">
            Consult Dr. Pulak in Clinic
          </Link>
        </div>
      </div>
    </div>
  );
}

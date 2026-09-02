import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Knee Pain Care & Non-Surgical Management | Dr. Pulak Vatsya',
  description: 'Evidence-based clinical evaluation for acute and chronic knee pain. Targeted non-surgical joint preservation, injection therapy, and physical conditioning.',
};

export default function KneePainPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">CONSERVATIVE JOINT CARE</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Comprehensive Knee Pain Management
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Knee pain is one of the most frequent musculoskeletal complaints across all age groups. Determining whether pain stems from early cartilage wear, tendonitis, ligament instability, or meniscus degeneration requires a thorough clinical assessment.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Non-Surgical Preservation Modalities</h2>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <li><strong>Targeted Physical Therapy:</strong> Quadriceps strengthening, hamstring flexibility, and gait optimization.</li>
          <li><strong>Intra-Articular Hyaluronic Acid (Viscosupplementation):</strong> Joint lubrication for mild-to-moderate osteoarthritis.</li>
          <li><strong>Biologic Injection Therapies (PRP):</strong> Autologous platelet-rich plasma to reduce intra-articular inflammation.</li>
          <li><strong>Biomechanics & Off-Loading Bracing:</strong> Unloader bracing for unicompartmental cartilage overload.</li>
        </ul>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Evaluate Your Knee Pain Risk Category</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Take our 90-second Knee Reset Assessment to receive instant clinical categorization and guidance.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/knee-reset/assessment/" className="btn btn--secondary btn--lg">
            Take Knee Reset Assessment
          </Link>
          <Link href="/knee-reset/rehab/" className="btn btn--outline btn--lg">
            Explore Knee Reset Rehab Programme
          </Link>
        </div>
      </div>
    </div>
  );
}

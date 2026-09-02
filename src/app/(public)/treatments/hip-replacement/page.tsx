import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Direct Anterior Approach Hip Replacement (DAA) | Dr. Pulak Vatsya',
  description: 'Muscle-sparing Direct Anterior Approach (DAA) hip replacement by Dr. Pulak Vatsya. Faster recovery, enhanced hip stability, and reduced post-operative pain.',
};

export default function HipReplacementPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">MUSCLE-SPARING HIP SURGERY</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Direct Anterior Approach (DAA) Hip Replacement
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Direct Anterior Approach hip replacement is an advanced surgical technique where the hip joint is accessed from the front of the body by navigating between natural muscle planes without detaching key hip stabilizing muscles.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Key Clinical Advantages of DAA Hip Arthroplasty</h2>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <li><strong>Muscle-Sparing Technique:</strong> Muscles and tendons are pushed aside rather than cut or detached, resulting in lower post-operative tissue inflammation.</li>
          <li><strong>Faster Mobilization:</strong> Patients frequently achieve unassisted walking and weight-bearing earlier compared to traditional posterior approaches.</li>
          <li><strong>Enhanced Dislocation Stability:</strong> Preserving posterior capsule structures significantly reduces the risk of post-operative hip dislocation.</li>
          <li><strong>Fewer Post-Operative Restrictions:</strong> Patients face fewer rigid movement restrictions during early rehabilitation.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Who is a Candidate for Hip Arthroplasty?</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
          Candidates typically present with severe hip osteoarthritis, avascular necrosis (AVN) of the femoral head, or rheumatoid joint destruction characterized by deep groin pain, stiffness during gait, and functional limitation.
        </p>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Get a Surgical Opinion for Your Hip Condition</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Schedule an OPD consultation or submit your pelvic X-rays / MRI for clinical evaluation.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/consult/opd/" className="btn btn--secondary btn--lg">
            Book In-Person OPD Consult
          </Link>
          <Link href="/consult/xray-mri-review/" className="btn btn--outline btn--lg">
            Submit Scans for 48-Hour Video Response
          </Link>
        </div>
      </div>
    </div>
  );
}

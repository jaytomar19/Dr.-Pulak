import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Robotic & Advanced Knee Replacement Surgery | Dr. Pulak Vatsya',
  description: 'Learn about robotic-assisted knee replacement, partial vs total knee arthroplasty, implant longevity, and joint preservation with Dr. Pulak Vatsya in New Delhi.',
};

export default function KneeReplacementPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">ROBOTIC ARTHROPLASTY & JOINT PRESERVATION</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Precision Knee Replacement Surgery
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Knee replacement surgery is a proven surgical intervention for end-stage osteoarthritis and severe joint degeneration when non-surgical management no longer provides adequate pain relief.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>When is Knee Replacement Indicated?</h2>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <li>Severe daily knee pain that restricts walking, stair climbing, and standing.</li>
          <li>Joint stiffness preventing full flexion or extension of the knee.</li>
          <li>Advanced cartilage loss confirmed on weight-bearing X-rays (Grade IV Osteoarthritis).</li>
          <li>Minimal relief from anti-inflammatory medications, intra-articular injections, or physical therapy.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Robotic-Assisted Surgical Precision</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
          Robotic-assisted knee arthroplasty utilizes 3D patient-specific CT modeling to map exact bone anatomy prior to surgery. This allows sub-millimeter precision when placing implant components, resulting in optimal soft tissue balance and natural knee alignment.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '1.05rem' }}>
          Key clinical benefits include preserved healthy collateral ligaments, reduced surgical trauma, less post-operative swelling, and accelerated physical rehabilitation.
        </p>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Surgical Options Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.75rem', background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Total Knee Arthroplasty (TKA)</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Resurfacing of all three compartments (medial, lateral, and patellofemoral) for global severe arthritis.
            </p>
          </div>
          <div style={{ padding: '1.75rem', background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Partial (Unicondylar) Knee Replacement</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Targeted replacement of only the damaged compartment (medial or lateral), preserving healthy bone and ligaments.
            </p>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Consult Dr. Pulak Vatsya for Knee Evaluation</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Upload your existing X-rays/MRI or schedule an in-person clinic visit in New Delhi.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/consult/xray-mri-review/" className="btn btn--secondary btn--lg">
            Submit Scans for 48-Hour Video Response
          </Link>
          <Link href="/consult/opd/" className="btn btn--outline btn--lg">
            Book In-Person OPD Visit
          </Link>
        </div>
      </div>
    </div>
  );
}

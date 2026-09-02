import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'ACL Surgery & Arthroscopic Ligament Reconstruction | Dr. Pulak Vatsya',
  description: 'Anatomical single and double-bundle ACL reconstruction, meniscus repair, and sports knee rehabilitation by Dr. Pulak Vatsya in New Delhi.',
};

export default function ACLSurgeryPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">SPORTS MEDICINE & ARTHROSCOPY</span>
        <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Anatomical ACL Reconstruction & Arthroscopic Repair
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: '1.75', marginBottom: '2.5rem' }}>
          Anterior Cruciate Ligament (ACL) tears represent one of the most common high-velocity sports injuries, causing knee instability, giving-way sensations, and secondary risk of meniscus tearing.
        </p>
      </Reveal>

      <section style={{ marginBottom: '3.5rem', background: 'var(--color-bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Anatomical Single-Bundle & Double-Bundle Surgery</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
          Modern ACL reconstruction focuses on placing autograft tissue (hamstring, bone-patellar tendon-bone, or quadriceps tendon) into the exact native anatomical footprint of the original ACL.
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '1.05rem' }}>
          <li><strong>Minimally Invasive Arthroscopy:</strong> Performed through 5mm keyhole portals.</li>
          <li><strong>Meniscus Preservation:</strong> Concomitant meniscal repair performed whenever possible to protect long-term articular cartilage.</li>
          <li><strong>Rigid Fixation Devices:</strong> Suspensory cortical button fixation ensures strong graft integration.</li>
        </ul>
      </section>

      <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '20px' }}>
        <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem' }}>Have an MRI Showing an ACL or Meniscus Tear?</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Get a comprehensive MRI review and clinical opinion on whether non-surgical rehabilitation or arthroscopic reconstruction is recommended.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/consult/xray-mri-review/" className="btn btn--secondary btn--lg">
            Submit MRI for 48-Hour Video Response
          </Link>
          <Link href="/consult/opd/" className="btn btn--outline btn--lg">
            Book Clinical OPD Visit
          </Link>
        </div>
      </div>
    </div>
  );
}

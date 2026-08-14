import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import TiltCard from '@/components/shared/TiltCard';
import Magnetic from '@/components/shared/Magnetic';

export const metadata: Metadata = {
  title: 'Imaging Review | Dr. Pulak Vatsya',
  description: 'Get an expert analysis of your X-ray or MRI scans by Dr. Pulak Vatsya.',
};

export default function ImagingReviewPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">DIAGNOSTIC SECOND LOOK</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Get Your X-Ray or MRI Reviewed by Dr. Vatsya</h1>
        
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Already have your scans but want an expert to interpret them? Submit your X-rays, MRIs, or CT scans for a detailed review and professional insight into your condition.
        </p>
      </Reveal>
      
      <Reveal variant="fade-up" delay={80}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it Works</h2>
          <ol style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li><strong>Upload Scans:</strong> Securely upload your digital imaging files (DICOM or high-quality images).</li>
            <li><strong>Provide Details:</strong> Briefly describe your symptoms and medical history.</li>
            <li><strong>Receive Report:</strong> Get a detailed written review and recommendation plan.</li>
          </ol>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={140}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Turnaround Time</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
            You will receive your comprehensive review report within <strong>24–48 business hours</strong> of successful submission.
          </p>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={200}>
        <TiltCard maxTilt={3} scale={1.01}>
          <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Review Fee</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>Standard Imaging Evaluation Rate</p>
          </section>
        </TiltCard>
      </Reveal>

      <Reveal variant="fade-up" delay={240}>
        <div style={{ marginTop: '2.5rem' }}>
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--primary btn--lg" data-cursor="button">
              Submit for Review
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

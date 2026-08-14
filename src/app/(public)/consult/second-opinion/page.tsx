import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import TiltCard from '@/components/shared/TiltCard';
import Magnetic from '@/components/shared/Magnetic';

export const metadata: Metadata = {
  title: 'Second Opinion on Knee Surgery | Dr. Pulak Vatsya',
  description: 'Request a comprehensive review and second opinion for knee surgery or complex cases.',
};

export default function SecondOpinionPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">EXPERT SURGICAL AUDIT</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Second Opinion on Knee Surgery</h1>
        
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Making a decision about knee surgery is significant. A second opinion can provide clarity, explore alternative options, and give you confidence in your treatment path.
        </p>
      </Reveal>
      
      <Reveal variant="fade-up" delay={80}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>When to Seek a Second Opinion</h2>
          <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li>You have been advised to undergo knee replacement or ACL surgery.</li>
            <li>Your symptoms have not improved with current treatments.</li>
            <li>You want to explore less invasive or conservative alternative options.</li>
            <li>You have a complex or recurrent joint condition.</li>
          </ul>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={140}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What&apos;s Included</h2>
          <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li>In-depth review of your complete medical history and all imaging scans.</li>
            <li>Detailed clinical discussion of your diagnosis.</li>
            <li>Exploration of all viable treatment pathways (surgical and conservative).</li>
            <li>A comprehensive written summary of the clinical recommendations.</li>
          </ul>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={200}>
        <TiltCard maxTilt={3} scale={1.01}>
          <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Second Opinion Fee</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>₹800</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              <strong>Required Submission</strong>: Please provide one report from another doctor along with the diagnosis and advice given by that physician during booking.
            </p>
          </section>
        </TiltCard>
      </Reveal>

      <Reveal variant="fade-up" delay={240}>
        <div style={{ marginTop: '2.5rem' }}>
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--primary btn--lg" data-cursor="button">
              Request Second Opinion
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

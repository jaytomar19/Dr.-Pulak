import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import TiltCard from '@/components/shared/TiltCard';
import Magnetic from '@/components/shared/Magnetic';

export const metadata: Metadata = {
  title: 'Online Video Consultation | Dr. Pulak Vatsya',
  description: 'Book an online video consultation with Dr. Pulak Vatsya from the comfort of your home.',
};

export default function OnlineConsultPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <span className="eyebrow">VIRTUAL CLINIC</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Online Video Consultation with Dr. Pulak Vatsya</h1>
        
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Get expert orthopedic advice without leaving your home. Our online video consultation provides a convenient way to discuss your symptoms, review reports, and explore treatment options.
        </p>
      </Reveal>
      
      <Reveal variant="fade-up" delay={80}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it Works</h2>
          <ol style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li><strong>Book your slot:</strong> Select a convenient time and complete the payment.</li>
            <li><strong>Share reports:</strong> Upload any previous X-rays, MRIs, or medical records securely.</li>
            <li><strong>Connect:</strong> Join the secure video link sent to your email at the scheduled time.</li>
          </ol>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={140}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What&apos;s Included</h2>
          <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8' }}>
            <li>15-minute video call with Dr. Pulak Vatsya</li>
            <li>Review of your medical history and imaging</li>
            <li>Digital prescription and care plan</li>
          </ul>
        </section>
      </Reveal>

      <Reveal variant="fade-up" delay={200}>
        <TiltCard maxTilt={3} scale={1.01}>
          <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Consultation Fee</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>₹999</p>
          </section>
        </TiltCard>
      </Reveal>

      <Reveal variant="fade-up" delay={240}>
        <div style={{ marginTop: '2.5rem' }}>
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--primary btn--lg" data-cursor="button">
              Book Online Consultation
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

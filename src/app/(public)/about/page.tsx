import type { Metadata } from 'next';
import Image from 'next/image';
import CredentialsBlock from '@/components/public/CredentialsBlock';
import Reveal from '@/components/shared/Reveal';
import TiltCard from '@/components/shared/TiltCard';

export const metadata: Metadata = {
  title: 'About Dr. Pulak Vatsya | Knee Specialist',
  description: 'Learn about Dr. Pulak Vatsya, his qualifications, experience, and philosophy of care.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1080px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">SENIOR ORTHOPAEDIC SURGEON</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem' }}>About Dr. Pulak Vatsya</h1>
          <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.125rem' }}>MS Orthopaedics • Fellowship Trained Knee & Joint Specialist</p>
        </div>
      </Reveal>
      
      {/* 2-Column Hero Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <Reveal variant="slide-right">
          <TiltCard maxTilt={3} scale={1.015}>
            <div className="img-reveal-wrap" style={{ position: 'relative', width: '100%', height: '460px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
              <Image
                src="/images/bio/dr-pulak-about.jpg"
                alt="Dr. Pulak Vatsya - Senior Orthopaedic Specialist"
                fill
                className="img-hover-zoom"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                priority
              />
            </div>
          </TiltCard>
        </Reveal>

        <Reveal variant="slide-left" delay={120}>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '1.25rem' }}>Clinical Integrity & Surgical Precision</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', lineHeight: '1.75', marginBottom: '1.25rem' }}>
              Dr. Pulak Vatsya is a dedicated orthopedic specialist with a focus on knee health, joint preservation, and advanced arthroscopic surgery. 
              Committed to evidence-based orthopaedic care, he combines fellowship-trained surgical expertise with a patient-centric, conservative-first clinical philosophy.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', lineHeight: '1.75' }}>
              He believes in empowering patients with transparent knowledge about their joint condition, ensuring they are active, informed participants in their treatment journey.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Qualifications & Secondary Image Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <Reveal variant="fade-up" delay={150}>
          <TiltCard maxTilt={2.5} scale={1.01}>
            <section style={{ padding: 'var(--space-8)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--color-navy)' }}>Qualifications & Clinical Background</h2>
              <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', marginBottom: '0', lineHeight: '1.9', fontSize: '1.05rem' }}>
                <li><strong>MBBS, MS Orthopaedics</strong> — Senior Surgical Specialist (AIIMS trained)</li>
                <li><strong>Fellowship in Joint Replacement & Arthroscopy</strong> — Advanced knee reconstruction</li>
                <li>Specialized focus on robotic knee replacement, ACL anatomical reconstruction, and non-surgical arthritis preservation</li>
                <li>Pioneer in patient education & evidence-based joint recovery protocols</li>
              </ul>
            </section>
          </TiltCard>
        </Reveal>

        <Reveal variant="fade-up" delay={200}>
          <div className="img-reveal-wrap" style={{ position: 'relative', width: '100%', height: '360px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="/images/bio/dr-pulak-aiims-profile.jpg"
              alt="Dr. Pulak Vatsya AIIMS Orthopaedics"
              fill
              className="img-hover-zoom"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>
        </Reveal>
      </div>

      <Reveal variant="fade-up" delay={250}>
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--color-navy)' }}>Philosophy of Care</h2>
          <blockquote style={{ color: 'var(--color-text-primary)', fontSize: '1.2rem', lineHeight: '1.8', fontStyle: 'italic', borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem', background: 'var(--color-bg-surface)', padding: '1.5rem 1.5rem 1.5rem 2rem', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}>
            &ldquo;Every patient&apos;s pain and lifestyle goals are unique. My approach centers on a thorough assessment and open communication. Whether a condition requires surgical intervention or can be managed through conservative methods, my goal is to provide the most effective and appropriate care.&rdquo;
          </blockquote>
        </section>
      </Reveal>

      <section style={{ marginTop: '4rem' }}>
        <CredentialsBlock />
      </section>
    </div>
  );
}

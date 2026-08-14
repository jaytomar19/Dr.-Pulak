import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AssessmentCTA from '@/components/public/AssessmentCTA';
import CredentialsBlock from '@/components/public/CredentialsBlock';
import GoogleReviewsWidget from '@/components/public/GoogleReviewsWidget';
import YouTubeRecentVideos from '@/components/public/YouTubeRecentVideos';
import InstagramReelsWidget from '@/components/public/InstagramReelsWidget';
import OnlineConsultExplainer from '@/components/public/OnlineConsultExplainer';
import LocationMapContact from '@/components/public/LocationMapContact';
import ConditionHubCards from '@/components/public/ConditionHubCards';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import Magnetic from '@/components/shared/Magnetic';

export const metadata = {
  title: 'Dr. Pulak Vatsya — Senior Orthopaedic Knee Surgeon, South Delhi',
  description: 'Evidence-based knee care, robotic joint replacement, and arthroscopic surgery by Dr. Pulak Vatsya at StepUp Joints, Lajpat Nagar, South Delhi.',
};

export default function HomePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        name: 'Dr. Pulak Vatsya',
        jobTitle: 'Senior Orthopaedic Surgeon',
        telephone: '+91-XXXXXXXXXX',
        url: 'https://drpulakvatsya.com',
        image: 'https://drpulakvatsya.com/images/dr-pulak.jpg',
        medicalSpecialty: 'Orthopaedic Surgery',
        worksFor: {
          '@type': 'MedicalClinic',
          name: 'StepUp Joints',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Lajpat Nagar',
            addressLocality: 'New Delhi',
            addressRegion: 'Delhi',
            addressCountry: 'IN',
          },
        },
      },
      {
        '@type': 'MedicalClinic',
        name: 'StepUp Joints',
        url: 'https://drpulakvatsya.com',
        telephone: '+91-XXXXXXXXXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Lajpat Nagar',
          addressLocality: 'New Delhi',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
      },
    ],
  };

  const consultOptions = [
    {
      title: 'In-Person OPD Visit',
      desc: 'Full clinical evaluation and digital imaging review at StepUp Joints clinic.',
      link: '/consult/opd/',
      cta: 'Book OPD Visit',
    },
    {
      title: 'Online Video Consult',
      desc: 'Remote video discussion for outstation patients and report analysis.',
      link: '/consult/online/',
      cta: 'Book Video Consult',
    },
    {
      title: 'Imaging & MRI Review',
      desc: 'Expert assessment of your existing X-Rays, MRI scans, and diagnostic tests.',
      link: '/consult/imaging-review/',
      cta: 'Request Scan Review',
    },
    {
      title: 'Surgical Second Opinion',
      desc: 'Independent evaluation before deciding on knee replacement or surgery.',
      link: '/consult/second-opinion/',
      cta: 'Get Second Opinion',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* 1. HERO SECTION (MedDocX Reference Composition) */}
      <section className="hero" style={{ padding: '3.5rem 0 4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="hero__watermark">STEPUP JOINTS</div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero__meddocx-grid">
            {/* Left Content */}
            <div className="hero__left">
              <Reveal variant="fade-up" delay={50}>
                <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>SENIOR ORTHOPAEDIC SURGEON</span>
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <h1 className="hero__title" style={{ fontSize: '3.2rem', lineHeight: 1.15, margin: '0.75rem 0 1.25rem 0' }}>
                  Your Trusted <span className="hero__title-accent">Healthcare Partner</span>
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={180}>
                <p className="hero__subtitle" style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Connecting patients with evidence-based knee care, robotic joint replacement, and personalized non-surgical treatment by Dr. Pulak Vatsya.
                </p>
              </Reveal>
              
              <Reveal variant="fade-up" delay={240}>
                <div className="hero__ctas" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Magnetic strength={5} maxOffset={8}>
                    <Link href="/consult/" className="btn btn--pill-primary" style={{ padding: '0.625rem 0.75rem 0.625rem 1.5rem', fontSize: '1rem' }} data-cursor="button">
                      <span>Book Appointment</span>
                      <span className="btn--pill-icon">↗</span>
                    </Link>
                  </Magnetic>
                  <Magnetic strength={5} maxOffset={8}>
                    <Link href="/knee-check/" className="btn btn--ghost" style={{ borderRadius: '9999px', padding: '0.75rem 1.5rem' }} data-cursor="button">
                      Take Free Knee Check
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>
            </div>

            {/* Center Doctor Photo */}
            <div className="hero__center-column">
              <Reveal variant="scale-up" delay={100}>
                <div className="hero__center-portrait">
                  <Image
                    src="/images/hero/dr-pulak-hero.jpg"
                    alt="Dr. Pulak Vatsya - Senior Orthopaedic Knee Surgeon"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="hero__center-img"
                    style={{ borderRadius: '24px' }}
                  />
                </div>
              </Reveal>
            </div>

            {/* Right Column Floating Badges */}
            <div className="hero__right-widgets">
              <Reveal variant="fade-down" delay={160}>
                <div className="hero__stat-card-pill">
                  <div className="hero__stat-card-icon">👥</div>
                  <div>
                    <div className="hero__stat-card-val">3,000+</div>
                    <div className="hero__stat-card-lbl">Satisfied Patients</div>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="fade-up" delay={260}>
                <div className="hero__review-widget-box">
                  <div className="hero__avatar-stack">
                    <div className="hero__avatar-circle">PV</div>
                    <div className="hero__avatar-circle">SJ</div>
                    <div className="hero__avatar-circle">AI</div>
                    <div className="hero__avatar-circle">MD</div>
                  </div>
                  <div className="hero__stars-row">★★★★★</div>
                  <div>
                    <div className="hero__review-text">24/7 Medical Support</div>
                    <div className="hero__review-sub">StepUp Joints • South Delhi</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALIZED KNEE CARE */}
      <section className="conditions-section">
        <div className="container">
          <Reveal variant="fade-up" className="section-header">
            <span className="eyebrow">SPECIALIZATION HUBS</span>
            <h2>Focused Expertise in Knee Health</h2>
            <p>Comprehensive diagnostic, conservative, and surgical care tailored to your joint condition.</p>
          </Reveal>
          <ConditionHubCards />
        </div>
      </section>

      {/* 3. PRACTICE PHILOSOPHY */}
      <CredentialsBlock />

      {/* 3.5 SURGICAL PRECISION & CLINICAL SHOWCASE */}
      <section className="surgical-showcase-section" style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-base)' }}>
        <div className="container">
          <Reveal variant="fade-up" className="section-header text-center" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="eyebrow eyebrow--gold">CLINICAL EXCELLENCE</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', margin: '0.5rem 0' }}>Surgical Precision & Patient-First Care</h2>
            <p style={{ margin: '0 auto', maxWidth: '640px', color: 'var(--color-text-secondary)' }}>Combining fellowship-trained surgical accuracy in the operating theater with attentive outpatient care.</p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'stretch' }}>
            <Reveal variant="slide-right">
              <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '100%', boxShadow: 'var(--shadow-md)', transition: 'transform 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo), border-color 0.4s var(--ease-out-expo)' }}>
                <div className="img-reveal-wrap" style={{ position: 'relative', width: '100%', height: '320px' }}>
                  <Image
                    src="/images/clinic/dr-pulak-surgery-centered.jpg"
                    alt="Dr. Pulak Vatsya in Operating Theater"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="img-hover-zoom"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>FELLOWSHIP SURGICAL ACCURACY</span>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', margin: '0.5rem 0 0.75rem 0' }}>Robotic & Arthroscopic Procedures</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                    Sub-specialized joint preservation, ACL reconstruction, and minimally invasive robotic knee replacement performed under strict aseptic international protocols.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="slide-left" delay={120}>
              <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '100%', boxShadow: 'var(--shadow-md)', transition: 'transform 0.4s var(--ease-out-expo), box-shadow 0.4s var(--ease-out-expo), border-color 0.4s var(--ease-out-expo)' }}>
                <div className="img-reveal-wrap" style={{ position: 'relative', width: '100%', height: '320px' }}>
                  <Image
                    src="/images/clinic/dr-pulak-fortis-centered.jpg"
                    alt="Dr. Pulak Vatsya Outpatient Consultation"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="img-hover-zoom"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PATIENT-CENTERED OPD</span>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', margin: '0.5rem 0 0.75rem 0' }}>Comprehensive Consultation & Evaluation</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                    Detailed clinical examination, digital MRI review, and clear communication ensuring every patient understands their conservative non-surgical and surgical options.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. PATIENT JOURNEY */}
      <OnlineConsultExplainer />

      {/* 5. ASSESSMENT CTA */}
      <AssessmentCTA />

      {/* 6. CLINICAL INSIGHTS */}
      <YouTubeRecentVideos />

      {/* 7. INSTAGRAM REELS */}
      <InstagramReelsWidget />

      {/* 8. REVIEWS & FEEDBACK */}
      <GoogleReviewsWidget />

      {/* 8. CLINIC LOCATION & CONTACT */}
      <LocationMapContact />

      {/* 9. FINAL CONSULTATION CTA */}
      <section className="consult-options-section">
        <div className="container">
          <Reveal variant="fade-up" className="section-header text-center">
            <span className="eyebrow">APPOINTMENTS & SERVICES</span>
            <h2>Select Your Consultation Preference</h2>
            <p>Flexible ways to consult Dr. Pulak Vatsya based on your location and clinical requirement.</p>
          </Reveal>

          <Stagger className="consult-options-grid" staggerInterval={80}>
            {consultOptions.map((opt, idx) => (
              <div key={idx} className="consult-option-card" data-cursor="card">
                <h3 className="consult-option-title">{opt.title}</h3>
                <p className="consult-option-desc">{opt.desc}</p>
                <Link href={opt.link} className="btn btn--ghost btn--sm btn--full-width" data-cursor="button">
                  {opt.cta} <span className="btn-arrow">→</span>
                </Link>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

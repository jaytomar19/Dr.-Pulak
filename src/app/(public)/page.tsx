import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';
import CredentialsBlock from '@/components/public/CredentialsBlock';
import YouTubeRecentVideos from '@/components/public/YouTubeRecentVideos';
import InstagramReelsWidget from '@/components/public/InstagramReelsWidget';
import OnlineConsultExplainer from '@/components/public/OnlineConsultExplainer';
import LocationMapContact from '@/components/public/LocationMapContact';
import ConditionHubCards from '@/components/public/ConditionHubCards';
import HeroDoctorGallery from '@/components/public/HeroDoctorGallery';
import FeaturedBlogSection from '@/components/public/FeaturedBlogSection';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import Magnetic from '@/components/shared/Magnetic';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata = {
  title: 'Dr. Pulak Vatsya — Senior Orthopaedic Knee Specialist | StepUp Joints',
  description: 'Diagnosis-first knee care, robotic joint replacement, ACL reconstruction, and non-surgical knee preservation by Dr. Pulak Vatsya in Lajpat Nagar, New Delhi.',
};

export default function HomePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        name: PRACTICE_CONFIG.doctorName,
        jobTitle: PRACTICE_CONFIG.specialty,
        telephone: PRACTICE_CONFIG.phone,
        url: 'https://drpulakvatsya.com',
        image: 'https://drpulakvatsya.com/images/doctor/pulak-main.webp',
        medicalSpecialty: 'Orthopaedic Surgery',
        worksFor: {
          '@type': 'MedicalClinic',
          name: PRACTICE_CONFIG.clinicName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: PRACTICE_CONFIG.fullAddress,
            addressLocality: 'Lajpat Nagar',
            addressRegion: 'Delhi',
            addressCountry: 'IN',
          },
        },
      },
      {
        '@type': 'MedicalClinic',
        name: PRACTICE_CONFIG.clinicName,
        url: 'https://drpulakvatsya.com',
        telephone: PRACTICE_CONFIG.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: PRACTICE_CONFIG.fullAddress,
          addressLocality: 'Lajpat Nagar',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
      },
    ],
  };

  const consultOptions = [
    {
      title: 'In-Person OPD Visit',
      desc: 'Full clinical evaluation and digital imaging review at StepUp Joints clinic, Lajpat Nagar, New Delhi.',
      price: '₹1,299 Consultation Fee',
      link: '/consult/opd/',
      cta: 'Book OPD Visit',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h6" />
        </svg>
      ),
    },
    {
      title: 'Online Live Video Consult',
      desc: 'Scheduled 1:1 live interactive video call with Dr. Pulak Vatsya. Full MRI & X-Ray report review included.',
      price: '₹999 Consultation Fee',
      link: '/consult/online/',
      cta: 'Book Video Consult',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      title: '48-Hour Video Response',
      desc: 'Upload your X-rays, MRI scans, and medical reports. Dr. Pulak reviews your submitted material and responds with a video note within 48 hours.',
      price: '₹500 Review Fee',
      link: '/consult/xray-mri-review/',
      cta: 'Submit Scans →',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <circle cx="10" cy="13" r="2" />
          <path d="M20 17l-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: 'Surgical Second Opinion',
      desc: 'Independent clinical evaluation of previous diagnosis and treatment advice before deciding on joint surgery.',
      price: '₹799 Second Opinion Fee',
      link: '/consult/second-opinion/',
      cta: 'Get Second Opinion',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* 1. HERO SECTION (Diagnosis-First Positioning) */}
      <section className="hero" style={{ padding: '3.5rem 0 4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="hero__watermark">DR. PULAK VATSYA</div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero__meddocx-grid">
            {/* Left Content */}
            <div className="hero__left">
              <Reveal variant="fade-up" delay={50}>
                <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  SENIOR ORTHOPAEDIC & KNEE SPECIALIST
                </span>
              </Reveal>

              <Reveal variant="fade-up" delay={120}>
                <h1 className="hero__title" style={{ fontSize: '3rem', lineHeight: 1.15, margin: '0.75rem 0 1.25rem 0' }}>
                  Not sure if your knee pain <span className="hero__title-accent">needs surgery?</span>
                </h1>
              </Reveal>

              <Reveal variant="fade-up" delay={180}>
                <p className="hero__subtitle" style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Get evidence-based clinical evaluation, non-surgical joint preservation, or robotic knee replacement guidance directly from Dr. Pulak Vatsya.
                </p>
              </Reveal>
              
              <Reveal variant="fade-up" delay={240}>
                <div className="hero__ctas" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Magnetic strength={5} maxOffset={8}>
                    <Link href="/knee-reset/assessment/" className="btn btn--pill-primary" style={{ padding: '0.625rem 0.75rem 0.625rem 1.5rem', fontSize: '1rem' }} data-cursor="button">
                      <span>Take Knee Reset Assessment</span>
                      <span className="btn--pill-icon">↗</span>
                    </Link>
                  </Magnetic>
                  <Magnetic strength={5} maxOffset={8}>
                    <Link href="/consult/" className="btn btn--ghost" style={{ borderRadius: '9999px', padding: '0.75rem 1.5rem' }} data-cursor="button">
                      Book Appointment
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>
            </div>

            {/* Center Doctor Photo Gallery */}
            <div className="hero__center-column">
              <Reveal variant="scale-up" delay={100}>
                <HeroDoctorGallery />
              </Reveal>
            </div>

            {/* Right Column Floating Badges */}
            <div className="hero__right-widgets">
              <Reveal variant="fade-down" delay={160}>
                <div className="hero__stat-card-pill">
                  <div className="hero__stat-card-icon">📍</div>
                  <div>
                    <div className="hero__stat-card-val">StepUp Joints</div>
                    <div className="hero__stat-card-lbl">Lajpat Nagar 4, New Delhi</div>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="fade-up" delay={260}>
                <div className="hero__review-widget-box">
                  <div className="hero__avatar-stack">
                    <div className="hero__avatar-circle">PV</div>
                    <div className="hero__avatar-circle">SJ</div>
                    <div className="hero__avatar-circle">FE</div>
                    <div className="hero__avatar-circle">MD</div>
                  </div>
                  <div>
                    <div className="hero__review-text">OPD & Online Consultations</div>
                    <div className="hero__review-sub">Fortis Escorts & StepUp Joints</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINICAL INSIGHTS / YOUTUBE EDUCATIONAL RESOURCES (MOVED DIRECTLY BELOW HERO) */}
      <YouTubeRecentVideos />

      {/* 3. SPECIALIZED KNEE CARE */}
      <section className="conditions-section">
        <div className="conditions-bg-dots-left" aria-hidden="true" />
        <div className="conditions-bg-dots-right" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Reveal variant="fade-up" className="conditions-header">
            <span className="eyebrow">TREATMENT & CONDITION HUBS</span>
            <h2 className="conditions-title">Focused Expertise in Knee & Joint Health</h2>
            <p className="conditions-subtitle">Evidence-based diagnostic, conservative, and surgical care tailored to your joint condition.</p>
          </Reveal>
          <ConditionHubCards />
        </div>
      </section>

      {/* 4. DIAGNOSIS-FIRST POSITIONING BANNER */}
      <section style={{ padding: '4rem 0', background: 'var(--color-primary-subtle)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <Reveal variant="slide-right">
              <div>
                <span className="eyebrow">DIAGNOSIS-FIRST APPROACH</span>
                <h2 style={{ fontSize: '2.25rem', color: 'var(--color-navy)', margin: '0.5rem 0 1rem' }}>
                  Is Your Knee Pain Mechanical, Inflammatory, or Degenerative?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Not all knee pain requires surgery. Early-stage cartilage wear and patellofemoral tracking issues often respond remarkably well to targeted joint preservation protocols.
                </p>
                <Link href="/knee-reset/assessment/" className="btn btn--primary">
                  Evaluate Symptoms in 90 Seconds →
                </Link>
              </div>
            </Reveal>
            <Reveal variant="slide-left" delay={120}>
              <div style={{ background: 'var(--color-bg-surface)', padding: '2rem', borderRadius: '20px', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>Clinical Risk Categorization</h3>
                <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <li><strong>Green Band:</strong> Low symptom burden • Prescriptive home exercise</li>
                  <li><strong>Yellow Band:</strong> Moderate discomfort • Supervised physical therapy</li>
                  <li><strong>Orange Band:</strong> Significant pain • Specialized OPD joint evaluation</li>
                  <li><strong>Red Band (Priority):</strong> Severe limitation • Direct doctor consultation</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. PRACTICE PHILOSOPHY & CREDENTIALS */}
      <CredentialsBlock />

      {/* 6. FEATURED BLOG & PATIENT EDUCATION */}
      <FeaturedBlogSection />

      {/* 7. PATIENT CONSULTATION JOURNEY */}
      <OnlineConsultExplainer />

      {/* 8. ASSESSMENT CTA */}
      <AssessmentCTA />

      {/* 9. INSTAGRAM REELS */}
      <InstagramReelsWidget />

      {/* 10. CLINIC LOCATION & CONTACT */}
      <LocationMapContact />


      {/* 12. FINAL CONSULTATION OPTIONS */}
      <section className="consult-options-section">
        <div className="container">
          <Reveal variant="fade-up" className="section-header text-center">
            <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'inline-block', marginBottom: '0.5rem' }}>
              APPOINTMENTS & SERVICES
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', margin: '0.5rem 0 1rem 0' }}>
              Select Your Consultation Preference
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Flexible ways to consult Dr. Pulak Vatsya based on your location and clinical requirement.
            </p>
          </Reveal>

          <Stagger className="consult-options-grid" staggerInterval={80}>
            {consultOptions.map((opt, idx) => (
              <div key={idx} className="consult-option-card" data-cursor="card">
                <div className="consult-option-card__content">
                  <div className="consult-option-icon">
                    {opt.icon}
                  </div>
                  <h3 className="consult-option-title">{opt.title}</h3>
                  <p className="consult-option-desc">{opt.desc}</p>
                </div>
                <div className="consult-option-card__bottom">
                  <div className="consult-option-price">
                    {opt.price}
                  </div>
                  <Link href={opt.link} className="btn btn--pill-primary btn--full-width" data-cursor="button" style={{ justifyContent: 'center' }}>
                    <span>{opt.cta}</span>
                    <span className="btn--pill-icon">↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

    </>
  );
}

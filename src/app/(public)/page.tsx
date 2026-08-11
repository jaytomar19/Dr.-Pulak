import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';
import CredentialsBlock from '@/components/public/CredentialsBlock';
import GoogleReviewsWidget from '@/components/public/GoogleReviewsWidget';
import YouTubeRecentVideos from '@/components/public/YouTubeRecentVideos';
import InstagramReelsWidget from '@/components/public/InstagramReelsWidget';
import OnlineConsultExplainer from '@/components/public/OnlineConsultExplainer';
import LocationMapContact from '@/components/public/LocationMapContact';
import ConditionHubCards from '@/components/public/ConditionHubCards';

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
      
      {/* 1. HERO SECTION (Split Editorial Composition) */}
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__left">
              <span className="eyebrow">SENIOR ORTHOPAEDIC SURGEON | SOUTH DELHI</span>
              <h1 className="hero__title">
                Evidence-Based Knee Care & Precision Joint Surgery
              </h1>
              <p className="hero__subtitle">
                Specialized in knee preservation, ACL reconstruction, and robotic joint replacement at StepUp Joints, Lajpat Nagar. Committed to patient education and non-surgical management first.
              </p>
              
              <div className="hero__ctas">
                <Link href="/consult/" className="btn btn--primary btn--lg">
                  Book Consultation
                </Link>
                <Link href="/knee-check/" className="btn btn--ghost btn--lg">
                  Take Free Knee Check
                </Link>
              </div>

              <div className="hero__trust-strip">
                <div className="hero__trust-item">
                  <span className="hero__trust-icon">📍</span>
                  <span>StepUp Joints, Lajpat Nagar</span>
                </div>
                <div className="hero__trust-item">
                  <span className="hero__trust-icon">⚖️</span>
                  <span>Conservative-First Approach</span>
                </div>
                <div className="hero__trust-item">
                  <span className="hero__trust-icon">🎓</span>
                  <span>Fellowship Trained</span>
                </div>
              </div>
            </div>

            <div className="hero__right">
              <div className="hero__portrait-frame">
                <div className="hero__portrait-badge">
                  <span className="hero__portrait-initials">PV</span>
                  <span className="hero__portrait-label">Dr. Pulak Vatsya</span>
                  <span className="hero__portrait-sub">MS Orthopaedics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALIZED KNEE CARE */}
      <section className="conditions-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">SPECIALIZATION HUBS</span>
            <h2>Focused Expertise in Knee Health</h2>
            <p>Comprehensive diagnostic, conservative, and surgical care tailored to your joint condition.</p>
          </div>
          <ConditionHubCards />
        </div>
      </section>

      {/* 3. PRACTICE PHILOSOPHY */}
      <CredentialsBlock />

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
          <div className="section-header text-center">
            <span className="eyebrow">APPOINTMENTS & SERVICES</span>
            <h2>Select Your Consultation Preference</h2>
            <p>Flexible ways to consult Dr. Pulak Vatsya based on your location and clinical requirement.</p>
          </div>

          <div className="consult-options-grid">
            {consultOptions.map((opt, idx) => (
              <div key={idx} className="consult-option-card">
                <h3 className="consult-option-title">{opt.title}</h3>
                <p className="consult-option-desc">{opt.desc}</p>
                <Link href={opt.link} className="btn btn--ghost btn--sm btn--full-width">
                  {opt.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

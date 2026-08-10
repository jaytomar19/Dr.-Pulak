import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';
import CredentialsBlock from '@/components/public/CredentialsBlock';
import GoogleReviewsWidget from '@/components/public/GoogleReviewsWidget';
import YouTubeRecentVideos from '@/components/public/YouTubeRecentVideos';
import OnlineConsultExplainer from '@/components/public/OnlineConsultExplainer';
import LocationMapContact from '@/components/public/LocationMapContact';
import ConditionHubCards from '@/components/public/ConditionHubCards';

export const metadata = {
  title: 'Dr. Pulak Vatsya — Orthopaedic Knee Surgeon, South Delhi',
  description: 'Dr. Pulak Vatsya is an orthopaedic knee surgeon practicing at StepUp Joints, Lajpat Nagar, South Delhi. Consult for knee pain, ACL injuries, and knee replacement.',
};

export default function HomePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        name: 'Dr. Pulak Vatsya',
        jobTitle: 'Orthopaedic Surgeon',
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
      {
        '@type': 'LocalBusiness',
        name: 'Dr. Pulak Vatsya - StepUp Joints',
        image: 'https://drpulakvatsya.com/images/dr-pulak.jpg',
        '@id': 'https://drpulakvatsya.com',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="hero">
        <div className="hero__content">
          <h1>Dedicated Orthopaedic Knee Care in South Delhi</h1>
          <p>
            Dr. Pulak Vatsya provides evidence-based care for knee pain, ACL injuries, and joint replacement at StepUp Joints, Lajpat Nagar. Focus on patient education, non-surgical options, and advanced surgical interventions when necessary.
          </p>
          <div className="hero__ctas">
            <Link href="/consult/" className="btn btn--primary">
              Book Consultation
            </Link>
            <Link href="/knee-check/" className="btn btn--secondary">
              Take Free Knee Check
            </Link>
          </div>
          <p className="hero__location">
            📍 StepUp Joints, Lajpat Nagar, South Delhi | 📞 +91-XXXXXXXXXX
          </p>
        </div>
      </section>

      <section className="conditions-section">
        <div className="container">
          <h2>Specialized Knee Care</h2>
          <ConditionHubCards />
        </div>
      </section>

      <CredentialsBlock />
      <GoogleReviewsWidget />
      <YouTubeRecentVideos />
      <OnlineConsultExplainer />
      <LocationMapContact />
    </>
  );
}

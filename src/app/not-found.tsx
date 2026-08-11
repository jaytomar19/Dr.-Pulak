import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Dr. Pulak Vatsya',
  description: 'The requested page could not be found on Dr. Pulak Vatsya orthopaedic specialist practice website.',
};

export default function NotFound() {
  return (
    <div className="not-found-page section-padding text-center" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <span className="eyebrow" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>404 ERROR</span>
        <h1 className="hero__title" style={{ fontSize: '2.5rem', margin: '1rem 0' }}>Page Not Found</h1>
        <p className="hero__subtitle" style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          The page or resource you requested could not be located. You can navigate back to the home page or take our free 90-second knee health assessment.
        </p>

        <div className="cta-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn--primary">
            Return to Homepage
          </Link>
          <Link href="/knee-check/" className="btn btn--ghost">
            Take Free Knee Check
          </Link>
        </div>
      </div>
    </div>
  );
}

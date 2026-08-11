'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error captured by boundary:', error);
  }, [error]);

  return (
    <div className="error-boundary-page section-padding text-center" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <span className="eyebrow" style={{ color: 'var(--color-error)' }}>SYSTEM NOTICE</span>
        <h2 className="hero__title" style={{ fontSize: '2rem', margin: '1rem 0' }}>Something Went Wrong</h2>
        <p className="hero__subtitle" style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          An unexpected application error occurred while processing your request. Please retry or contact clinic support if the problem persists.
        </p>

        <div className="cta-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => reset()} className="btn btn--primary">
            Try Again
          </button>
          <Link href="/" className="btn btn--ghost">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

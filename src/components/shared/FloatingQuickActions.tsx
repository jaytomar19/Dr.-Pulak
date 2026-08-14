'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingQuickActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="floating-quick-actions" aria-label="Quick Actions">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`floating-btn floating-btn--scroll ${showScrollTop ? 'floating-btn--visible' : ''}`}
        aria-label="Scroll to top of page"
        data-cursor="button"
        title="Scroll to top"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Floating Appointment Quick Link */}
      <Link
        href="/consult/"
        className="floating-btn floating-btn--appointment"
        data-cursor="button"
        aria-label="Book Clinical Appointment"
        title="Book Appointment"
      >
        <span className="floating-btn__pulse" aria-hidden="true" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="floating-btn__label">Book OPD</span>
      </Link>
    </aside>
  );
}

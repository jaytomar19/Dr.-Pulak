'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/shared/Magnetic';
import { useAssessmentModal } from '@/context/AssessmentModalContext';

interface NavItem {
  href: string;
  label: string;
}

// Exactly the 8 required navigation links in exact order
const NAV_ITEMS: NavItem[] = [
  { href: '/treatments/knee-replacement/', label: 'Knee Replacement' },
  { href: '/treatments/hip-replacement/', label: 'Hip Replacement' },
  { href: '/treatments/acl-surgery/', label: 'ACL Surgery' },
  { href: '/treatments/knee-pain/', label: 'Knee Pain' },
  { href: '/knee-reset/rehab/', label: 'Knee Rehab' },
  { href: '/consult/', label: 'Consultation' },
  { href: '/about/', label: 'About' },
  { href: '/insights/', label: 'Insights' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openAssessmentModal } = useAssessmentModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* LEFT — FIXED BRAND */}
        <Link href="/" className="header__brand" data-cursor="link" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="header__logo-name">Dr. Pulak Vatsya</span>
          <span className="header__logo-title">Orthopaedic & Knee Specialist</span>
        </Link>

        {/* MIDDLE — AUTO-SCROLLING HORIZONTAL STRIP (DESKTOP) */}
        <nav className="header__marquee" aria-label="Main Navigation">
          <div className="header__marquee-track">
            {/* Primary Navigation Set */}
            <div className="header__marquee-group">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={`nav-1-${item.href}`}
                  href={item.href}
                  className={`header__nav-link ${
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'header__nav-link--active'
                      : ''
                  }`}
                  data-cursor="link"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Duplicate Navigation Set for Seamless Continuous Infinite Loop */}
            <div className="header__marquee-group" aria-hidden="true">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={`nav-2-${item.href}`}
                  href={item.href}
                  tabIndex={-1}
                  className={`header__nav-link ${
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'header__nav-link--active'
                      : ''
                  }`}
                  data-cursor="link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* RIGHT — FIXED STATIC ACTION CTAS */}
        <div className="header__actions">
          <button
            type="button"
            onClick={openAssessmentModal}
            className="btn btn--ghost btn--sm header__btn-secondary"
            data-cursor="button"
          >
            Free Knee Check
          </button>
          <Magnetic strength={5} maxOffset={6}>
            <Link href="/consult/" className="btn btn--pill-primary header__btn-primary" data-cursor="button">
              <span>Book Appointment</span>
              <span className="btn--pill-icon">↗</span>
            </Link>
          </Magnetic>
          <button
            className="header__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            data-cursor="button"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ACCESSIBLE MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="header__mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <nav className="header__mobile-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={`header__mobile-link ${
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'header__mobile-link--active'
                    : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="header__mobile-ctas">
              <Link href="/consult/" className="btn btn--primary btn--full-width" onClick={() => setIsMobileMenuOpen(false)}>
                Book Appointment
              </Link>
              <button
                type="button"
                className="btn btn--secondary btn--full-width"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAssessmentModal();
                }}
              >
                Free Knee Check
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

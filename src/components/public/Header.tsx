'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link href="/" className="header__brand">
          <span className="header__logo-name">Dr. Pulak Vatsya</span>
          <span className="header__logo-title">Orthopaedic & Knee Specialist</span>
        </Link>
        
        <nav className="header__nav" aria-label="Main Navigation">
          <Link href="/knee-replacement/" className="header__nav-link">Knee Replacement</Link>
          <Link href="/acl/" className="header__nav-link">ACL Surgery</Link>
          <Link href="/knee-pain/" className="header__nav-link">Knee Pain</Link>
          <Link href="/consult/" className="header__nav-link">Consultation</Link>
          <Link href="/about/" className="header__nav-link">About</Link>
          <Link href="/blog/" className="header__nav-link">Insights</Link>
        </nav>

        <div className="header__actions">
          <Link href="/knee-check/" className="btn btn--ghost btn--sm header__btn-secondary">
            Free Knee Check
          </Link>
          <Link href="/consult/" className="btn btn--primary btn--sm header__btn-primary">
            Book Consult
          </Link>
          <button 
            className="header__hamburger" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav">
            <Link href="/knee-replacement/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Replacement</Link>
            <Link href="/acl/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>ACL Surgery</Link>
            <Link href="/knee-pain/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Pain</Link>
            <Link href="/consult/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Consultation</Link>
            <Link href="/about/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About Dr. Vatsya</Link>
            <Link href="/blog/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Insights & Blog</Link>
            
            <div className="header__mobile-ctas">
              <Link href="/consult/" className="btn btn--primary btn--full-width" onClick={() => setIsMobileMenuOpen(false)}>
                Book Consultation
              </Link>
              <Link href="/knee-check/" className="btn btn--secondary btn--full-width" onClick={() => setIsMobileMenuOpen(false)}>
                Take Free Knee Check
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/shared/Magnetic';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/knee-replacement/', label: 'Knee Replacement' },
    { href: '/acl/', label: 'ACL Surgery' },
    { href: '/knee-pain/', label: 'Knee Pain' },
    { href: '/consult/', label: 'Consultation' },
    { href: '/about/', label: 'About' },
    { href: '/blog/', label: 'Insights' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link href="/" className="header__brand" data-cursor="link">
          <span className="header__logo-name">Dr. Pulak Vatsya</span>
          <span className="header__logo-title">Orthopaedic & Knee Specialist</span>
        </Link>
        
        <nav className="header__nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.replace(/\/$/, '')));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}
                data-cursor="link"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="header__actions">
          <Link href="/knee-check/" className="btn btn--ghost btn--sm header__btn-secondary" data-cursor="button">
            Free Knee Check
          </Link>
          <Magnetic strength={5} maxOffset={6}>
            <Link href="/consult/" className="btn btn--pill-primary header__btn-primary" data-cursor="button">
              <span>Book Appointment</span>
              <span className="btn--pill-icon">↗</span>
            </Link>
          </Magnetic>
          <button 
            className="header__hamburger" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            data-cursor="button"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            
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

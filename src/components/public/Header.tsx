'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link href="/" className="header__logo">
          Dr. Pulak Vatsya
        </Link>
        
        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <Link href="/knee-replacement/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Replacement</Link>
          <Link href="/acl/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>ACL</Link>
          <Link href="/knee-pain/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Pain</Link>
          <Link href="/consult/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Consult</Link>
          <Link href="/about/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/blog/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          
          <div className="header__mobile-cta">
            <Link href="/knee-check/" className="header__cta" onClick={() => setIsMobileMenuOpen(false)}>Free Knee Check</Link>
          </div>
        </nav>

        <div className="header__desktop-cta">
          <Link href="/knee-check/" className="header__cta">Free Knee Check</Link>
        </div>

        <button 
          className="header__hamburger" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <Link href="/knee-replacement/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Replacement</Link>
          <Link href="/acl/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>ACL</Link>
          <Link href="/knee-pain/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Knee Pain</Link>
          <Link href="/consult/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Consult</Link>
          <Link href="/about/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/blog/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
        </div>
      )}
    </header>
  );
}

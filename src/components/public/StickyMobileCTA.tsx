'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StickyMobileCTAProps {
  primaryAction: 'assessment' | 'call' | 'whatsapp';
  showOnDesktop?: boolean;
}

export default function StickyMobileCTA({ primaryAction, showOnDesktop = false }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const wrapperClass = `sticky-cta ${!isVisible ? 'sticky-cta--hidden' : ''} ${showOnDesktop ? 'sticky-cta--desktop' : ''}`;

  return (
    <div className={wrapperClass}>
      <Link href="/knee-check/" className="sticky-cta__button sticky-cta__button--primary">
        Take Free Knee Check
      </Link>
      <a href="tel:+91XXXXXXXXXX" className="sticky-cta__button sticky-cta__button--secondary">
        Call Now
      </a>
    </div>
  );
}

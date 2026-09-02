'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAssessmentModal } from '@/context/AssessmentModalContext';

interface StickyMobileCTAProps {
  primaryAction?: 'assessment' | 'call' | 'whatsapp';
  showOnDesktop?: boolean;
}

export default function StickyMobileCTA({
  showOnDesktop = false
}: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { openAssessmentModal } = useAssessmentModal();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true);  // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`sticky-cta ${!isVisible ? 'sticky-cta--hidden' : ''} ${showOnDesktop ? 'sticky-cta--desktop' : ''}`}>
      <div className="sticky-cta__container">
        <Link href="/consult/" className="sticky-cta__button sticky-cta__button--primary">
          Book Consultation
        </Link>
        <button
          type="button"
          onClick={openAssessmentModal}
          className="sticky-cta__button sticky-cta__button--secondary"
        >
          Free Knee Check
        </button>
      </div>
    </div>
  );
}


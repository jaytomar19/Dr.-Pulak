'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface GalleryPhoto {
  src: string;
  fallbackSrc: string;
  alt: string;
  objectFit?: 'contain' | 'cover';
  objectPosition?: string;
}

const DOCTOR_PHOTOS: GalleryPhoto[] = [
  {
    src: '/images/hero/dr-pulak-hero.jpg',
    fallbackSrc: '/images/hero/dr-pulak-hero.jpg',
    alt: 'Dr. Pulak Vatsya - Senior Orthopaedic Knee Specialist',
    objectFit: 'contain',
    objectPosition: 'bottom center',
  },
  {
    src: '/images/hero/dr-pulak-hero-2.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-2.jpeg',
    alt: 'Dr. Pulak Vatsya - Operating Theater Surgical Precision',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  {
    src: '/images/hero/dr-pulak-hero-3.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-3.jpeg',
    alt: 'Dr. Pulak Vatsya - Joint Reconstruction & Clinical Care',
    objectFit: 'cover',
    objectPosition: 'center 20%',
  },
  {
    src: '/images/hero/dr-pulak-hero-4.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-4.jpeg',
    alt: 'Dr. Pulak Vatsya - Outpatient OPD Patient Consultation',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  {
    src: '/images/hero/dr-pulak-hero-5.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-5.jpeg',
    alt: 'Dr. Pulak Vatsya - Robotic Knee Specialist',
    objectFit: 'cover',
    objectPosition: 'center 15%',
  },
  {
    src: '/images/hero/dr-pulak-hero-6.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-6.jpeg',
    alt: 'Dr. Pulak Vatsya - Clinical Excellence & Orthopaedic Care',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  {
    src: '/images/hero/dr-pulak-hero-7.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-7.jpeg',
    alt: 'Dr. Pulak Vatsya - Academic & International Orthopaedic Presenter',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  {
    src: '/images/hero/dr-pulak-hero-8.jpeg',
    fallbackSrc: '/images/hero/dr-pulak-hero-8.jpeg',
    alt: 'Dr. Pulak Vatsya - Patient-Centred Knee Care Specialist',
    objectFit: 'cover',
    objectPosition: 'center 20%',
  },
];

// Slideshow configuration interval: exactly 1.7 seconds per photo
const SLIDESHOW_INTERVAL_MS = 1700;

export default function HeroDoctorGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedSources, setFailedSources] = useState<Record<number, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Automatic, continuous slideshow timer (completely independent of cursor hover)
  useEffect(() => {
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % DOCTOR_PHOTOS.length);
    }, SLIDESHOW_INTERVAL_MS);

    // Clean up timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Mobile / Touch tap support (manual advance on touch devices)
  const handleTouchOrClick = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % DOCTOR_PHOTOS.length);
    }
  };

  const handleImageError = (index: number) => {
    setFailedSources((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className="hero__center-portrait hero__gallery-wrapper"
      onClick={handleTouchOrClick}
      aria-label="Dr. Pulak Vatsya photo gallery - slideshow"
      role="region"
      style={{
        position: 'relative',
        width: '100%',
        height: '560px',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {DOCTOR_PHOTOS.map((photo, index) => {
        const isCurrent = activeIndex === index;
        const srcToUse = failedSources[index] ? photo.fallbackSrc : photo.src;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isCurrent ? 1 : 0,
              transform: isCurrent ? 'scale(1) translateY(0)' : 'scale(1.015) translateY(-2px)',
              transition: prefersReducedMotion
                ? 'opacity 0.3s ease'
                : 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isCurrent ? 'auto' : 'none',
              zIndex: isCurrent ? 2 : 1,
              willChange: 'opacity, transform',
            }}
          >
            <Image
              src={srcToUse}
              alt={photo.alt}
              fill
              priority={index === 0 || index === 1}
              sizes="(max-width: 768px) 100vw, 500px"
              className="hero__center-img"
              style={{
                borderRadius: '24px',
                objectFit: photo.objectFit || 'contain',
                objectPosition: photo.objectPosition || 'bottom center',
              }}
              onError={() => handleImageError(index)}
            />
          </div>
        );
      })}

      {/* Subtle indicator dots */}
      <div
        className="hero__gallery-dots"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
          opacity: 0.8,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '9999px',
        }}
      >
        {DOCTOR_PHOTOS.map((_, index) => (
          <span
            key={index}
            style={{
              width: activeIndex === index ? '16px' : '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: activeIndex === index ? 'var(--color-primary, #0284c7)' : 'rgba(255, 255, 255, 0.6)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

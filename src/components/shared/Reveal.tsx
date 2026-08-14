'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-in'
  | 'scale-up'
  | 'slide-left'
  | 'slide-right'
  | 'clip-up'
  | 'clip-right';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // in ms
  duration?: number; // in ms
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.12,
  className = '',
  style = {},
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    // Trigger immediate animation for elements in viewport on initial page load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, isVisible]);

  return (
    <Component
      ref={ref}
      className={`reveal reveal--${variant} ${isVisible ? 'reveal--visible' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </Component>
  );
}

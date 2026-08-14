'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StaggerProps {
  children: React.ReactNode;
  staggerInterval?: number; // ms between each child reveal (default: 80ms)
  baseDelay?: number; // initial delay in ms
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  itemClassName?: string;
  as?: React.ElementType;
}

export default function Stagger({
  children,
  staggerInterval = 90,
  baseDelay = 0,
  threshold = 0.1,
  className = '',
  style = {},
  itemClassName = '',
  as: Component = 'div',
}: StaggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const el = containerRef.current;
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

  const childArray = React.Children.toArray(children);

  return (
    <Component ref={containerRef} className={`stagger-container ${className}`} style={style}>
      {childArray.map((child, index) => {
        const delay = baseDelay + index * staggerInterval;
        return (
          <div
            key={index}
            className={`stagger-item ${isVisible ? 'stagger-item--visible' : ''} ${itemClassName}`}
            style={{
              transitionDelay: `${delay}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </Component>
  );
}

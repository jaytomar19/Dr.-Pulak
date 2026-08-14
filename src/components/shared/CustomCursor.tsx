'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCursor } from './CursorContext';

export default function CustomCursor() {
  const { cursorType, cursorText } = useCursor();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Position references for smooth 60fps lerping without React state re-renders
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check for touch / coarse pointer or reduced motion preference
    const checkTouch = () => {
      const hasTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsTouchDevice(hasTouch || prefersReducedMotion);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instantly position center dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for the outer ring
    const renderLoop = () => {
      const ease = 0.18; // smooth spring-like responsiveness
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice) return null;

  const isExpanded = cursorType !== 'default';
  const hasText = Boolean(cursorText);

  return (
    <div
      className={`custom-cursor-container ${isVisible ? 'custom-cursor--visible' : ''} custom-cursor--${cursorType}`}
      aria-hidden="true"
    >
      {/* Central Precision Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isExpanded ? 'custom-cursor-dot--hidden' : ''}`}
      />

      {/* Outer Magnetic Ring / Indicator */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isExpanded ? 'custom-cursor-ring--expanded' : ''} ${
          hasText ? 'custom-cursor-ring--with-text' : ''
        }`}
      >
        {hasText && <span className="custom-cursor-text">{cursorText}</span>}
      </div>
    </div>
  );
}

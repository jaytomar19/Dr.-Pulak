'use client';

import React, { useRef, useState, useEffect } from 'react';

interface MagneticProps {
  children: React.ReactElement<{ style?: React.CSSProperties; className?: string }>;
  strength?: number; // Distance divisor, higher = less movement (default 4)
  maxOffset?: number; // Max translation in pixels (default 8px)
  className?: string;
}

export default function Magnetic({
  children,
  strength = 4,
  maxOffset = 8,
  className = '',
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const checkTouch = () => {
      const touch =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsTouch(touch);
    };
    checkTouch();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) / strength;
    const deltaY = (e.clientY - centerY) / strength;

    // Clamp within maxOffset to preserve clinical restraint
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (isTouch) {
    return children;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrap ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0
          ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'inline-block',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'navy' | 'white' | 'accent';
  label?: string;
  center?: boolean;
  className?: string;
}

export default function Loader({
  size = 'md',
  color = 'primary',
  label,
  center = false,
  className = '',
}: LoaderProps) {
  const sizeClass = `dot-spinner--${size}`;
  const colorClass = `dot-spinner--${color}`;
  const containerClass = `dot-spinner-wrapper ${center ? 'dot-spinner-wrapper--center' : ''} ${className}`.trim();

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={`dot-spinner ${sizeClass} ${colorClass}`}>
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
        <div className="dot-spinner__dot" />
      </div>
      {label ? (
        <span className="dot-spinner__label">{label}</span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
}

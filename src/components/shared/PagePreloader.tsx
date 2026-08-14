"use client";

import React, { useEffect, useState } from 'react';

export default function PagePreloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500); // 500ms fade transition
      return () => clearTimeout(removeTimer);
    }, 700); // 700ms splash duration

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B192C',
        color: '#FFFFFF',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Animated Pulse Ring */}
      <div style={{ position: 'relative', width: 84, height: 84, marginBottom: 24 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(19, 142, 142, 0.4)',
            animation: 'preloader-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0A6E6E 0%, #139E9E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 24,
            color: '#FFFFFF',
            boxShadow: '0 0 24px rgba(19, 142, 142, 0.6)',
          }}
        >
          PV
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em', color: '#FFFFFF', margin: '0 0 6px 0' }}>
        DR. PULAK VATSYA
      </h2>
      <p style={{ fontSize: '0.8125rem', color: '#D4A853', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
        StepUp Joints • South Delhi
      </p>

      {/* Sleek Progress Bar */}
      <div style={{ width: 140, height: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, marginTop: 24, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            backgroundColor: '#139E9E',
            borderRadius: 4,
            animation: 'preloader-bar 0.7s ease-out forwards',
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes preloader-ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes preloader-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

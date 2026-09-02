'use client';

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import Magnetic from '@/components/shared/Magnetic';

export default function OnlineConsultExplainer() {
  const steps = [
    {
      num: '01',
      title: 'Understand',
      desc: 'Comprehensive history taking to evaluate symptoms, activity levels, and daily impact.',
      color: '#2563EB',
      bg: '#EFF6FF',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Diagnose',
      desc: 'Physical examination and advanced imaging review (X-Rays / MRI) for diagnostic clarity.',
      color: '#7C3AED',
      bg: '#F3E8FF',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <circle cx="11" cy="11" r="3" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Plan',
      desc: 'Collaborative development of a personalized care pathway—conservative or surgical.',
      color: '#EC4899',
      bg: '#FCE7F3',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Treat',
      desc: 'Execution of evidence-based non-surgical protocols or precision surgical intervention.',
      color: '#F97316',
      bg: '#FFEDD5',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      num: '05',
      title: 'Recover',
      desc: 'Structured rehabilitation and ongoing follow-up monitoring to restore full mobility.',
      color: '#10B981',
      bg: '#D1FAE5',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="M10 22v-6l-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4l-2 2v6" />
        </svg>
      ),
    },
  ];

  return (
    <section className="journey-section">
      <div className="container">
        <Reveal variant="fade-up" className="journey-header">
          <span className="eyebrow eyebrow--gold">CARE PATHWAY</span>
          <h2 className="journey-title">Your Patient Care Journey</h2>
          <p className="journey-subtitle">
            A structured, transparent clinical approach ensuring you are supported at every phase from initial evaluation to complete recovery.
          </p>
        </Reveal>

        {/* Connecting Progress Line (Desktop) */}
        <div className="journey-progress-wrap" aria-hidden="true">
          <div className="journey-progress-line" />
          <div className="journey-progress-nodes">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="journey-progress-node"
                style={{ color: step.color } as React.CSSProperties}
              >
                <div className="journey-progress-node__dot" style={{ backgroundColor: step.color, boxShadow: `0 0 0 4px ${step.bg}` }} />
              </div>
            ))}
          </div>
        </div>

        {/* 5 Equal Cards */}
        <Stagger className="journey-timeline" staggerInterval={100}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="journey-step"
              data-cursor="card"
              style={{ '--step-color': step.color, '--step-bg': step.bg } as React.CSSProperties}
            >
              <div className="journey-step__icon-wrap" style={{ backgroundColor: step.bg, color: step.color }}>
                {step.icon}
              </div>

              <div className="journey-step__badge" style={{ backgroundColor: step.color }}>
                <span className="journey-step__num">{step.num}</span>
              </div>

              <h3 className="journey-step__title">{step.title}</h3>
              <p className="journey-step__desc">{step.desc}</p>

              <div className="journey-step__accent-bar" style={{ backgroundColor: step.color }} />
            </div>
          ))}
        </Stagger>

        <div className="journey-cta">
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--secondary btn--lg" data-cursor="button">
              Start Your Consultation Journey <span className="btn-arrow">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

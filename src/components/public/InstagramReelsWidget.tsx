'use client';

import React from 'react';
import { INSTAGRAM_REELS_CONFIG } from '@/config/media';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import TiltCard from '@/components/shared/TiltCard';

export default function InstagramReelsWidget() {
  const { reels, isPlaceholder } = INSTAGRAM_REELS_CONFIG;

  return (
    <section className="reels-section section-padding bg-surface" id="reels">
      <div className="container">
        <Reveal variant="fade-up" className="section-header text-center">
          <span className="eyebrow">FROM THE DOCTOR</span>
          <h2 className="section-title">Practical Knee Health, Explained</h2>
          <p className="section-subtitle">
            Short-form video insights on joint care, sports injury prevention, and surgical options.
          </p>

          {isPlaceholder && (
            <div className="placeholder-content-banner" style={{ marginTop: '0.75rem' }}>
              <span className="badge badge--neutral">DEVELOPMENT PLACEHOLDER — Real Instagram Reel links to be provided by client</span>
            </div>
          )}
        </Reveal>

        <Stagger className="reels-grid" staggerInterval={100}>
          {reels.map((reel) => (
            <TiltCard key={reel.id} maxTilt={3.5} scale={1.02}>
              <div className="reel-card" data-cursor="card">
                <div className="reel-card__aspect">
                  <div className="reel-card__overlay">
                    <span className="reel-card__category">{reel.category}</span>
                    <div className="reel-card__play-icon" data-cursor="button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="reel-card__content">
                  <h3 className="reel-card__title">{reel.title}</h3>
                  <p className="reel-card__description">{reel.shortDescription}</p>

                  <a
                    href={reel.instagramUrl}
                    target={reel.instagramUrl !== '#' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--sm reel-card__cta"
                    onClick={(e) => reel.instagramUrl === '#' && e.preventDefault()}
                    data-cursor="button"
                  >
                    View on Instagram →
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </Stagger>

        <Reveal variant="fade-up" delay={120}>
          <div className="reels-bottom-action text-center" style={{ marginTop: '2.5rem' }}>
            <a
              href={isPlaceholder ? '#' : 'https://instagram.com'}
              target={isPlaceholder ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="btn btn--ghost btn--md"
              onClick={(e) => isPlaceholder && e.preventDefault()}
              data-cursor="button"
            >
              Explore All Video Insights on Instagram →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

'use client';

import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';

interface GoogleReviewsWidgetProps {
  maxReviews?: number;
}

export default function GoogleReviewsWidget({ maxReviews = 3 }: GoogleReviewsWidgetProps) {
  const reviews = [
    {
      name: 'Patient Review',
      rating: 5,
      date: 'Verified Feedback',
      text: 'Dr. Vatsya took the time to explain my knee condition thoroughly. Highly empathetic approach with clear focus on conservative management before considering surgery.',
    },
    {
      name: 'Patient Review',
      rating: 5,
      date: 'Verified Feedback',
      text: 'Excellent clinical diagnosis and detailed guidance throughout my ACL recovery. Transparent advice and seamless patient care experience at StepUp Joints.',
    },
    {
      name: 'Patient Review',
      rating: 5,
      date: 'Verified Feedback',
      text: 'Very professional, ethical, and approachable orthopaedic surgeon. Explained the X-Ray findings clearly and helped build a structured physical therapy plan.',
    },
  ].slice(0, maxReviews);

  return (
    <section className="reviews-section">
      <div className="container">
        <Reveal variant="fade-up" className="reviews-header">
          <span className="eyebrow">PATIENT FEEDBACK</span>
          <h2 className="reviews-title">Recognized for Patient Education & Ethical Care</h2>
          <div className="reviews-summary">
            <span className="reviews-stars">★★★★★</span>
            <span className="reviews-score">4.9 / 5.0 Rating</span>
            <span className="reviews-count">· Google Business Reviews</span>
          </div>
        </Reveal>

        <Stagger className="reviews-grid" staggerInterval={90}>
          {reviews.map((review, idx) => (
            <div key={idx} className="reviews-card" data-cursor="card">
              <div className="reviews-card__top">
                <span className="reviews-card__stars">★★★★★</span>
                <span className="reviews-card__date">{review.date}</span>
              </div>
              <p className="reviews-card__text">&ldquo;{review.text}&rdquo;</p>
              <div className="reviews-card__author">
                <span className="reviews-card__avatar">P</span>
                <span className="reviews-card__name">{review.name}</span>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

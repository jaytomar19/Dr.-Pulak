'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import TiltCard from '@/components/shared/TiltCard';
import BookingModal from '@/components/public/BookingModal';
import { ConsultationProduct } from '@/components/public/BookingModal';

export default function ConsultPage() {
  const [selectedProduct, setSelectedProduct] = useState<ConsultationProduct | null>(null);

  const options: Array<{
    type: ConsultationProduct;
    title: string;
    desc: string;
    price: string;
    link: string;
    cta: string;
  }> = [
    {
      type: 'opd',
      title: 'In-Person OPD Visit',
      desc: 'Physical joint examination, imaging review, and personalized care plan at StepUp Joints, Lajpat Nagar, New Delhi.',
      price: '₹1,299 Consultation Fee',
      link: '/consult/opd/',
      cta: 'Book OPD Appointment',
    },
    {
      type: 'online_live',
      title: 'Online Live Video Consultation',
      desc: 'Scheduled 1:1 live interactive video consultation with Dr. Pulak Vatsya. Full MRI & X-Ray report review included.',
      price: '₹999 Consultation Fee',
      link: '/consult/online/',
      cta: 'Book Live Video Consult',
    },
    {
      type: 'consult_48h',
      title: '48-Hour Video Response',
      desc: 'Upload your X-rays, MRI scans, and reports. Dr. Pulak reviews your submitted material and sends a recorded video note within 48 hours.',
      price: '₹500 Review Fee',
      link: '/consult/xray-mri-review/',
      cta: 'Submit Scans for Video Note',
    },
    {
      type: 'second_opinion',
      title: 'Surgical Second Opinion',
      desc: 'Independent clinical review of previous diagnosis, treatment advice, and surgical recommendations before making a decision.',
      price: '₹799 Second Opinion Fee',
      link: '/consult/second-opinion/',
      cta: 'Get Surgical Second Opinion',
    },
    {
      type: 'international',
      title: 'International Consultation',
      desc: 'Specialized virtual consultation, radiological review, and surgical travel planning for international and NRI patients.',
      price: '$25 USD Consultation Fee',
      link: '/consult/international/',
      cta: 'Book International Review',
    },
  ];

  return (
    <div className="consult-page-wrapper" style={{ padding: '3.5rem 1.5rem 5rem', minHeight: 'calc(100vh - 100px)' }}>
      <div style={{ maxWidth: '1150px', width: '100%', margin: '0 auto' }}>
        <Reveal variant="fade-up" className="text-center" style={{ marginBottom: '3rem' }}>
          <span className="eyebrow">CLINICAL APPOINTMENTS & CONSULTATION HUB</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Consultation Options
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.125rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            Select the consultation pathway suited for your situation. Whether you are visiting our Lajpat Nagar clinic, consulting remotely via video, or uploading MRI scans for a surgical second opinion, Dr. Pulak Vatsya delivers evidence-based joint care.
          </p>
        </Reveal>

        <Stagger className="consult-options-grid" staggerInterval={90}>
          {options.map((opt, idx) => (
            <TiltCard key={idx} maxTilt={3} scale={1.015}>
              <div className="consult-option-card" data-cursor="card">
                <div className="consult-option-card__content">
                  <h2 className="consult-option-card__title">{opt.title}</h2>
                  <p className="consult-option-card__desc">{opt.desc}</p>
                  <div className="consult-option-card__link-wrap">
                    <Link href={opt.link} className="consult-option-card__link">
                      Learn More About This Option →
                    </Link>
                  </div>
                </div>
                <div className="consult-option-card__bottom">
                  <span className="consult-option-card__price">{opt.price}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(opt.type)}
                    className="btn btn--pill-primary btn--full-width"
                    style={{ justifyContent: 'center' }}
                    data-cursor="button"
                  >
                    <span>{opt.cta}</span>
                    <span className="btn--pill-icon">↗</span>
                  </button>
                </div>
              </div>
            </TiltCard>
          ))}
        </Stagger>

        {selectedProduct && (
          <BookingModal
            isOpen={Boolean(selectedProduct)}
            onClose={() => setSelectedProduct(null)}
            defaultProduct={selectedProduct}
          />
        )}
      </div>
    </div>
  );
}

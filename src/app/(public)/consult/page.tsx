'use client';

import React, { useState } from 'react';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import TiltCard from '@/components/shared/TiltCard';
import BookingModal from '@/components/public/BookingModal';

export default function ConsultPage() {
  const [selectedProduct, setSelectedProduct] = useState<'opd' | 'online_live' | 'imaging_review' | 'second_opinion' | null>(null);

  const options: Array<{
    type: 'opd' | 'online_live' | 'imaging_review' | 'second_opinion';
    title: string;
    desc: string;
    price: string;
    link: string;
    cta: string;
  }> = [
    {
      type: 'opd',
      title: 'OPD Visit',
      desc: 'In-person clinical examination and digital imaging review at StepUp Joints, Lajpat Nagar.',
      price: '₹1,000 Consultation Fee',
      link: '/consult/opd/',
      cta: 'Book OPD Appointment',
    },
    {
      type: 'online_live',
      title: 'Online Video Consultation',
      desc: 'Secure live video consultation for remote patients, second opinions, and preliminary evaluation.',
      price: '₹1,000 Virtual Consult Fee',
      link: '/consult/online/',
      cta: 'Book Live Video Consult',
    },
    {
      type: 'imaging_review',
      title: 'Imaging & MRI Review',
      desc: 'Comprehensive radiological assessment of your existing X-rays, CT scans, or MRI reports.',
      price: '₹1,500 Report Analysis Fee',
      link: '/consult/imaging-review/',
      cta: 'Request Imaging Review',
    },
    {
      type: 'second_opinion',
      title: 'Surgical Second Opinion',
      desc: 'Thorough clinical audit before deciding on joint replacement or ligament surgery.',
      price: '₹2,000 Second Opinion Fee',
      link: '/consult/second-opinion/',
      cta: 'Get Second Opinion',
    },
  ];

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Reveal variant="fade-up" className="text-center" style={{ marginBottom: '3rem' }}>
        <span className="eyebrow">CLINICAL APPOINTMENTS</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Consult with Dr. Pulak Vatsya</h1>
        <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
          Choose the consultation method that best fits your needs. 
          Whether you prefer an in-person visit, an online video consultation, or need an expert second opinion, we are here to help.
        </p>
      </Reveal>

      <Stagger className="consult-options-grid" staggerInterval={90}>
        {options.map((opt, idx) => (
          <TiltCard key={idx} maxTilt={3} scale={1.015}>
            <div className="consult-option-card" data-cursor="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
              <div>
                <h2 style={{ fontSize: '1.375rem', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>{opt.title}</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>{opt.desc}</p>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  {opt.price}
                </span>
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
  );
}

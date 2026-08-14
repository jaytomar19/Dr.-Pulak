'use client';

import React, { useState } from 'react';
import RazorpayCheckoutButton from '@/components/public/RazorpayCheckoutButton';

export type ConsultationProduct = 'opd' | 'online_live' | 'imaging_review' | 'second_opinion' | 'consult_48h' | 'international';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: ConsultationProduct;
}

const PRODUCT_LABELS: Record<string, { title: string; price: string }> = {
  consult_48h: { title: '48-Hour Video Response Consultation', price: '₹500' },
  online_live: { title: 'Online Video Consultation (Includes MRI/X-Ray Review)', price: '₹1,000' },
  second_opinion: { title: 'Surgical Second Opinion', price: '₹800' },
  international: { title: 'International Consultation', price: '$25 USD' },
  opd: { title: 'In-Person OPD Consultation', price: '₹1,000' },
  imaging_review: { title: 'Online Video Consultation (Includes MRI/X-Ray Review)', price: '₹1,000' },
};

export default function BookingModal({
  isOpen,
  onClose,
  defaultProduct = 'opd',
}: BookingModalProps) {
  const [product, setProduct] = useState<ConsultationProduct>(defaultProduct);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [slotDate, setSlotDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slotTime, setSlotTime] = useState('11:00');

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Validate inputs
      if (!name.trim() || name.length < 2) {
        throw new Error('Please enter a valid patient name.');
      }

      const cleanPhone = phone.trim().replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        throw new Error('Please enter a valid mobile number.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.trim() && !emailRegex.test(email.trim())) {
        throw new Error('Please enter a valid email address (e.g. name@example.com) or leave it empty.');
      }

      // 1. Create Lead
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`,
          email: email.trim(),
          consent_service: true,
          consent_marketing: true,
          consent_text_version: 'v1.0_booking',
        }),
      });

      if (!leadRes.ok) {
        const leadErr = await leadRes.json().catch(() => ({}));
        throw new Error(leadErr.error || 'Failed to register patient details');
      }

      const leadData = await leadRes.json();
      const leadId = leadData.lead_id;

      // 2. Create Booking
      const slotDatetimeISO = new Date(`${slotDate}T${slotTime}:00+05:30`).toISOString();

      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          product,
          slot_datetime: slotDatetimeISO,
        }),
      });

      if (!bookingRes.ok) {
        const bookingErr = await bookingRes.json().catch(() => ({}));
        throw new Error(bookingErr.error || 'Failed to reserve appointment slot');
      }

      const bookingData = await bookingRes.json();
      setCreatedBookingId(bookingData.booking_id);
      setStep('payment');

    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'An error occurred during reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {step === 'details' && (
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>RESERVE CONSULTATION</span>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--color-navy)', margin: '0.25rem 0 1.25rem 0' }}>Book Consultation with Dr. Pulak Vatsya</h2>

            {errorMsg && (
              <div style={{ padding: '0.75rem 1rem', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Select Consultation Service</label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value as ConsultationProduct)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', fontSize: '0.95rem', color: 'var(--color-navy)' }}
                >
                  <option value="consult_48h">48-Hour Video Response Consultation (₹500)</option>
                  <option value="online_live">Online Video Consultation (₹1,000 — Includes MRI/X-Ray Review)</option>
                  <option value="second_opinion">Surgical Second Opinion (₹800)</option>
                  <option value="international">International Consultation ($25 USD)</option>
                  <option value="opd">In-Person OPD Visit (₹1,000)</option>
                </select>
              </div>

              {/* Service Guidance Banner */}
              {product === 'consult_48h' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(10, 110, 110, 0.08)', border: '1px solid rgba(10, 110, 110, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🎥 <strong>48-Hour Consultation Flow</strong>: Provide details of your medical reports and X-rays below. Dr. Pulak Vatsya will review your submitted materials and send you a personalized <strong>VIDEO RESPONSE within 48 hours</strong>. <em>(Note: This is not a live video call).</em>
                </div>
              )}

              {product === 'second_opinion' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  📋 <strong>Second Opinion Requirement</strong>: Please provide one report from another doctor along with the advice/opinion/diagnosis given by that physician below.
                </div>
              )}

              {product === 'online_live' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🩺 <strong>Imaging Review Included</strong>: Comprehensive radiological, X-ray, and MRI report evaluation is fully included under your ₹1,000 Online Video Consultation.
                </div>
              )}

              {product === 'international' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🌍 <strong>International Patient Consult</strong>: Billed securely in $25 USD. Includes digital report review and video consultation session.
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Patient Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit Mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                  {product === 'consult_48h'
                    ? 'Medical Reports & X-Ray Details / Links (Optional)'
                    : product === 'second_opinion'
                    ? 'Previous Doctor\'s Report & Advice / Diagnosis Details (Optional)'
                    : 'Symptoms / Medical Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    product === 'consult_48h'
                      ? 'Describe your knee condition, X-ray findings, or paste secure drive link...'
                      : product === 'second_opinion'
                      ? 'Enter details of previous doctor\'s diagnosis, recommended surgery, or report findings...'
                      : 'Briefly describe your joint pain, symptoms, or medical history...'
                  }
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Appointment Date</label>
                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Preferred Time Slot</label>
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:30">05:30 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--pill-primary btn--lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
              >
                <span>{isSubmitting ? 'Reserving Slot...' : 'Proceed to Secure Payment'}</span>
                <span className="btn--pill-icon">↗</span>
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && createdBookingId && (
          <div style={{ textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>STEP 2 OF 2 — PAYMENT</span>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--color-navy)', margin: '0.25rem 0 0.5rem 0' }}>Complete Consultation Payment</h2>

            <div style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.25rem', margin: '1.25rem 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Patient Name:</span>
                <strong style={{ color: 'var(--color-navy)' }}>{name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Consultation:</span>
                <strong style={{ color: 'var(--color-navy)' }}>{PRODUCT_LABELS[product]?.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Appointment Slot:</span>
                <strong style={{ color: 'var(--color-navy)' }}>{slotDate} at {slotTime}</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Total Payable:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{PRODUCT_LABELS[product]?.price}</strong>
              </div>
            </div>

            <RazorpayCheckoutButton
              bookingId={createdBookingId}
              product={product}
              patientName={name}
              patientEmail={email}
              patientPhone={phone}
              onSuccess={() => setStep('success')}
              onError={(err) => setErrorMsg(err)}
            />

            <button
              onClick={() => setStep('details')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Edit Patient or Slot Details
            </button>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '64px', height: '64px', background: '#DCFCE7', border: '2px solid #86EFAC', borderRadius: '50%', color: '#16A34A', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Your consultation request with Dr. Pulak Vatsya has been confirmed and verified.
            </p>

            <div style={{ background: 'var(--color-bg-base)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Booking Reference:</strong> <code>{createdBookingId}</code></p>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Service:</strong> {PRODUCT_LABELS[product]?.title}</p>
              <p style={{ margin: 0 }}><strong>Appointment Time:</strong> {slotDate} at {slotTime}</p>
            </div>

            <button
              onClick={onClose}
              className="btn btn--pill-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              Close & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

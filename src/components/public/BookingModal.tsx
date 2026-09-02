'use client';

import React, { useState, useEffect } from 'react';
import RazorpayCheckoutButton from '@/components/public/RazorpayCheckoutButton';

export type ConsultationProduct = 'opd' | 'online_live' | 'imaging_review' | 'second_opinion' | 'consult_48h' | 'international';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: ConsultationProduct;
}

interface SlotInfo {
  time: string;
  datetimeISO: string;
  status: 'available' | 'booked' | 'blocked';
  reason?: string;
}

const PRODUCT_LABELS: Record<string, { title: string; price: string }> = {
  consult_48h: { title: '48-Hour Video Response', price: '₹500' },
  online_live: { title: 'Online Live Video Consultation', price: '₹999' },
  second_opinion: { title: 'Surgical Second Opinion', price: '₹799' },
  international: { title: 'International Consultation', price: '₹2,199' },
  opd: { title: 'In-Person OPD Visit', price: '₹1,299' },
  imaging_review: { title: '48-Hour Video Response', price: '₹500' },
};

export default function BookingModal({
  isOpen,
  onClose,
  defaultProduct = 'opd',
}: BookingModalProps) {
  const [product, setProduct] = useState<ConsultationProduct>(defaultProduct);
  const isAsyncService = product === 'consult_48h' || product === 'imaging_review';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [slotDate, setSlotDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotTime, setSlotTime] = useState('');

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Fetch real-time available doctor slots when slotDate changes (for scheduled services)
  useEffect(() => {
    if (!isOpen || !slotDate || isAsyncService) return;
    let cancelled = false;

    fetch(`/api/availability?date=${slotDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.slots) {
          const avail = data.slots.filter((s: SlotInfo) => s.status === 'available');
          setAvailableSlots(avail);
          if (avail.length > 0) {
            setSlotTime(avail[0].time);
          } else {
            setSlotTime('');
          }
        }
      })
      .catch((err) => console.error('[BOOKING] Slot fetch error:', err))
      .finally(() => {
        if (!cancelled) setIsLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, slotDate, isAsyncService]);


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
      const effectiveTime = isAsyncService ? '10:00' : slotTime;
      const slotDatetimeISO = new Date(`${slotDate}T${effectiveTime}:00+05:30`).toISOString();

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
        throw new Error(bookingErr.error || 'Failed to reserve consultation request');
      }

      const bookingData = await bookingRes.json();
      const bookingId = bookingData.booking_id;
      setCreatedBookingId(bookingId);

      // 3. Upload Medical Document (if selected)
      if (selectedFile) {
        setUploadStatus('Uploading medical document securely...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lead_id', leadId);
        formData.append('booking_id', bookingId);
        if (medicalNotes.trim()) {
          formData.append('notes', medicalNotes.trim());
        }

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json().catch(() => ({}));
          console.warn('[BOOKING] File upload warning:', uploadErr.error);
        }
      }

      setStep('payment');

    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'An error occurred during reservation');
    } finally {
      setIsSubmitting(false);
      setUploadStatus(null);
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
                  <option value="consult_48h">48-Hour Video Response (₹500)</option>
                  <option value="online_live">Online Live Video Consultation (₹999)</option>
                  <option value="second_opinion">Surgical Second Opinion (₹799)</option>
                  <option value="international">International Consultation (₹2,199)</option>
                  <option value="opd">In-Person OPD Visit (₹1,299)</option>
                </select>
              </div>

              {/* Service Guidance Banner */}
              {isAsyncService && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(10, 110, 110, 0.08)', border: '1px solid rgba(10, 110, 110, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🎥 <strong>48-Hour Video Response</strong>: Upload your X-rays, MRI scans, and reports. Dr. Pulak Vatsya will review your submitted material and send you a recorded video response within 48 hours. <em>(Asynchronous service — no live appointment calendar needed).</em>
                </div>
              )}

              {product === 'second_opinion' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  📋 <strong>Surgical Second Opinion</strong>: Independent clinical review for patients advised to undergo surgery. Include previous diagnosis, advice, and scans below.
                </div>
              )}

              {product === 'online_live' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🩺 <strong>Online Live Video Consultation</strong>: Scheduled 1:1 live video call with Dr. Pulak Vatsya. Full MRI & X-Ray report review included.
                </div>
              )}

              {product === 'international' && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: '1.5' }}>
                  🌍 <strong>International Consultation</strong>: Specialized virtual consultation and radiological review for international and NRI patients.
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

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                  📁 Upload Medical Reports / X-Rays / MRI Scans (Optional)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'var(--color-bg-base)', border: '1.5px dashed var(--color-border)', borderRadius: '12px' }}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.dcm,.zip"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    style={{ fontSize: '0.85rem', color: 'var(--color-navy)', width: '100%' }}
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Supported formats: PDF, JPG, PNG, WEBP, DICOM, ZIP (Max 15MB)
                </span>
              </div>

              {!isAsyncService && (
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
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.35rem' }}>Available Time Slot</label>
                    {isLoadingSlots ? (
                      <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Loading slots...</div>
                    ) : availableSlots.length === 0 ? (
                      <div style={{ padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#991B1B', background: '#FEE2E2', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
                        No available slots on this date
                      </div>
                    ) : (
                      <select
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
                      >
                        {availableSlots.map((s) => {
                          const [h, m] = s.time.split(':').map(Number);
                          const ampm = h >= 12 ? 'PM' : 'AM';
                          const displayH = h % 12 || 12;
                          const formattedLabel = `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
                          return (
                            <option key={s.time} value={s.time}>
                              {formattedLabel}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (!isAsyncService && (isLoadingSlots || availableSlots.length === 0 || !slotTime))}
                className="btn btn--pill-primary btn--lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
              >
                <span>{isSubmitting ? (uploadStatus || 'Processing Request...') : 'Proceed to Secure Payment'}</span>
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
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  {isAsyncService ? 'Service Type:' : 'Appointment Slot:'}
                </span>
                <strong style={{ color: 'var(--color-navy)' }}>
                  {isAsyncService ? 'Asynchronous (Video response within 48h)' : `${slotDate} at ${slotTime}`}
                </strong>
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
              ← Edit Patient Details
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
              <p style={{ margin: 0 }}>
                <strong>{isAsyncService ? 'Turnaround:' : 'Appointment Time:'}</strong>{' '}
                {isAsyncService ? 'Video note delivered within 48 hours' : `${slotDate} at ${slotTime}`}
              </p>
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

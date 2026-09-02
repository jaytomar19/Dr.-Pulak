import type { Metadata } from 'next';
import Reveal from '@/components/shared/Reveal';
import LocationMapContact from '@/components/public/LocationMapContact';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata: Metadata = {
  title: 'Contact Clinic & Appointments | Dr. Pulak Vatsya',
  description: 'Get clinic location, contact numbers, email, and OPD timings for Dr. Pulak Vatsya at StepUp Joints, Lajpat Nagar 4, New Delhi.',
};

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1180px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">CLINIC LOCATION & CONTACT</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Contact & Location Details
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Find clinic address, consultation hours, direct phone numbers, and location map for StepUp Joints in Lajpat Nagar 4, New Delhi.
          </p>
        </div>
      </Reveal>

      {/* Main Location & Map Component */}
      <LocationMapContact />

      {/* Direct Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        <div style={{ padding: '2rem', background: 'var(--color-bg-surface)', borderRadius: '18px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>📞 Phone & OPD Enquiries</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Direct clinic helpline for appointment scheduling and OPD queries.
          </p>
          <a href={PRACTICE_CONFIG.phoneTel} className="btn btn--ghost btn--sm btn--full-width" style={{ justifyContent: 'center' }}>
            Call {PRACTICE_CONFIG.phone}
          </a>
        </div>

        <div style={{ padding: '2rem', background: 'var(--color-bg-surface)', borderRadius: '18px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>💬 WhatsApp Communication</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Message our patient coordinator on WhatsApp for quick assistance.
          </p>
          <a href={PRACTICE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm btn--full-width" style={{ justifyContent: 'center' }}>
            Message on WhatsApp
          </a>
        </div>

        <div style={{ padding: '2rem', background: 'var(--color-bg-surface)', borderRadius: '18px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>✉️ Email Enquiries</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            For detailed medical enquiries, second opinions, or document submissions.
          </p>
          <a href={`mailto:${PRACTICE_CONFIG.email}`} className="btn btn--ghost btn--sm btn--full-width" style={{ justifyContent: 'center' }}>
            Email {PRACTICE_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
}

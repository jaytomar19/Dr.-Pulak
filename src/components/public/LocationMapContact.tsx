import Link from 'next/link';
import { PRACTICE_CONFIG } from '@/config/practice';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import TiltCard from '@/components/shared/TiltCard';
import Magnetic from '@/components/shared/Magnetic';

export default function LocationMapContact() {
  return (
    <section className="location-section">
      <div className="container">
        <Reveal variant="fade-up" className="location-header">
          <span className="eyebrow">CONSULTATION LOCATIONS</span>
          <h2 className="location-title">In-Person & Virtual Consultation Options</h2>
        </Reveal>

        <Stagger className="location-grid" staggerInterval={120}>
          {/* Card 1: In-Person Clinic */}
          <TiltCard maxTilt={3} scale={1.015}>
            <div className="location-card" data-cursor="card">
              <div className="location-card__badge">IN-PERSON OPDS</div>
              <h3 className="location-card__title">{PRACTICE_CONFIG.clinicName} — New Delhi</h3>
              <p className="location-card__subtitle">Full-service orthopaedic consultation, physical examination, and digital imaging review.</p>
              
              <div className="location-card__details">
                <div className="location-detail">
                  <span className="location-detail__label">Address</span>
                  <span className="location-detail__value">{PRACTICE_CONFIG.fullAddress}</span>
                </div>
                <div className="location-detail">
                  <span className="location-detail__label">Direct Contact</span>
                  <span className="location-detail__value">
                    Phone: <a href={PRACTICE_CONFIG.phoneTel} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{PRACTICE_CONFIG.phone}</a> · Email: <a href={`mailto:${PRACTICE_CONFIG.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{PRACTICE_CONFIG.email}</a>
                  </span>
                </div>
              </div>

              <div className="location-card__footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Magnetic strength={5} maxOffset={6} className="w-full">
                  <Link href="/consult/opd/" className="btn btn--primary btn--full-width" data-cursor="button">
                    Book In-Person OPD Visit
                  </Link>
                </Magnetic>
                <a
                  href={PRACTICE_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--full-width"
                  style={{ borderRadius: '9999px', textAlign: 'center' }}
                  data-cursor="button"
                >
                  Get Directions on Google Maps ↗
                </a>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Online Consultation */}
          <TiltCard maxTilt={3} scale={1.015}>
            <div className="location-card location-card--highlight" data-cursor="card">
              <div className="location-card__badge location-card__badge--teal">VIRTUAL CONSULT</div>
              <h3 className="location-card__title">Online Video Consultation</h3>
              <p className="location-card__subtitle">Secure, high-definition video consultation for patients seeking expert guidance or second opinions remotely.</p>
              
              <div className="location-card__details">
                <div className="location-detail">
                  <span className="location-detail__label">Ideal For</span>
                  <span className="location-detail__value">Outstation patients, second opinions, report evaluations</span>
                </div>
                <div className="location-detail">
                  <span className="location-detail__label">Requirements</span>
                  <span className="location-detail__value">Prior upload of recent X-Rays, MRI, or clinical history</span>
                </div>
                <div className="location-detail">
                  <span className="location-detail__label">Process</span>
                  <span className="location-detail__value">Book Slot → Upload Reports → HD Video Discussion</span>
                </div>
              </div>

              <div className="location-card__footer">
                <Magnetic strength={5} maxOffset={6} className="w-full">
                  <Link href="/consult/online/" className="btn btn--secondary btn--full-width" data-cursor="button">
                    Book Online Video Consultation
                  </Link>
                </Magnetic>
              </div>
            </div>
          </TiltCard>
        </Stagger>
      </div>
    </section>
  );
}

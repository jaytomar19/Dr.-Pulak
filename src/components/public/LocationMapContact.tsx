import Link from 'next/link';

export default function LocationMapContact() {
  return (
    <section className="location-section">
      <div className="container">
        <div className="location-header">
          <span className="eyebrow">CONSULTATION LOCATIONS</span>
          <h2 className="location-title">In-Person & Virtual Consultation Options</h2>
        </div>

        <div className="location-grid">
          {/* Card 1: In-Person Clinic */}
          <div className="location-card">
            <div className="location-card__badge">IN-PERSON OPDS</div>
            <h3 className="location-card__title">StepUp Joints — South Delhi</h3>
            <p className="location-card__subtitle">Full-service orthopaedic consultation, physical examination, and digital imaging review.</p>
            
            <div className="location-card__details">
              <div className="location-detail">
                <span className="location-detail__label">Address</span>
                <span className="location-detail__value">StepUp Joints, Lajpat Nagar, New Delhi</span>
              </div>
              <div className="location-detail">
                <span className="location-detail__label">Consultation Hours</span>
                <span className="location-detail__value">Monday – Saturday: 10:00 AM – 6:00 PM</span>
              </div>
              <div className="location-detail">
                <span className="location-detail__label">Contact</span>
                <span className="location-detail__value">Phone: +91 XXXXXXXXXX · contact@drpulakvatsya.com</span>
              </div>
            </div>

            <div className="location-card__footer">
              <Link href="/consult/opd/" className="btn btn--primary btn--full-width">
                Book In-Person OPD Visit
              </Link>
            </div>
          </div>

          {/* Card 2: Online Consultation */}
          <div className="location-card location-card--highlight">
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
              <Link href="/consult/online/" className="btn btn--secondary btn--full-width">
                Book Online Video Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

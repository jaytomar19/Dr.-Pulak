import Link from 'next/link';

export default function OnlineConsultExplainer() {
  return (
    <div className="consult-explainer">
      <h2 className="consult-explainer__heading">How Online Consultation Works</h2>
      <div className="consult-explainer__steps">
        <div className="consult-explainer__step">
          <div className="consult-explainer__step-number">1</div>
          <div className="consult-explainer__step-icon">📅</div>
          <h3 className="consult-explainer__step-title">Book Online</h3>
          <p className="consult-explainer__step-desc">Choose a convenient slot and book your appointment easily.</p>
        </div>
        <div className="consult-explainer__step">
          <div className="consult-explainer__step-number">2</div>
          <div className="consult-explainer__step-icon">📁</div>
          <h3 className="consult-explainer__step-title">Share Reports</h3>
          <p className="consult-explainer__step-desc">Upload your X-Rays or MRI reports securely before the consult.</p>
        </div>
        <div className="consult-explainer__step">
          <div className="consult-explainer__step-number">3</div>
          <div className="consult-explainer__step-icon">💻</div>
          <h3 className="consult-explainer__step-title">Video Consultation</h3>
          <p className="consult-explainer__step-desc">Speak directly with Dr. Vatsya via a secure video link.</p>
        </div>
      </div>
      <Link href="/consult/online/" className="consult-explainer__cta">
        Book Online Consultation
      </Link>
    </div>
  );
}

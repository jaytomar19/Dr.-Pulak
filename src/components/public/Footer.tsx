import Link from 'next/link';
import { PRACTICE_CONFIG } from '@/config/practice';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* BRAND COLUMN */}
          <div className="footer__brand-col">
            <Link href="/" className="footer__brand">
              <span className="footer__brand-name">{PRACTICE_CONFIG.doctorName}</span>
              <span className="footer__brand-title">{PRACTICE_CONFIG.specialty}</span>
            </Link>
            <p className="footer__brand-desc">
              Dedicated orthopaedic surgeon practicing at {PRACTICE_CONFIG.clinicName}, {PRACTICE_CONFIG.location}. Specializing in evidence-based knee care, joint preservation, and robotic-assisted joint replacement.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link href="/about/" className="footer__link" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                About Dr. Pulak Vatsya →
              </Link>
            </div>
          </div>

          {/* TREATMENTS COLUMN */}
          <div className="footer__nav-col">
            <h4 className="footer__col-title">Treatments & Care</h4>
            <ul className="footer__links">
              <li><Link href="/treatments/knee-replacement/" className="footer__link">Knee Replacement</Link></li>
              <li><Link href="/treatments/hip-replacement/" className="footer__link">Hip Replacement (DAA)</Link></li>
              <li><Link href="/treatments/acl-surgery/" className="footer__link">ACL Surgery</Link></li>
              <li><Link href="/treatments/knee-pain/" className="footer__link">Knee Pain Care</Link></li>
              <li><Link href="/knee-reset/rehab/" className="footer__link">Knee Reset Rehab</Link></li>
            </ul>
          </div>

          {/* CONSULTATION COLUMN */}
          <div className="footer__nav-col">
            <h4 className="footer__col-title">Consultation Options</h4>
            <ul className="footer__links">
              <li><Link href="/consult/" className="footer__link">Consultation Hub</Link></li>
              <li><Link href="/consult/opd/" className="footer__link">Lajpat Nagar OPD Visit</Link></li>
              <li><Link href="/consult/online/" className="footer__link">Online Video Consult</Link></li>
              <li><Link href="/consult/xray-mri-review/" className="footer__link">48-Hour Video Response</Link></li>
              <li><Link href="/consult/second-opinion/" className="footer__link">Surgical Second Opinion</Link></li>
              <li><Link href="/consult/international/" className="footer__link">International Patients</Link></li>
            </ul>
          </div>

          {/* PRACTICE & CONTACT COLUMN */}
          <div className="footer__nav-col">
            <h4 className="footer__col-title">Clinic & Contact</h4>
            <ul className="footer__contact-info">
              <li>
                📍 <a href={PRACTICE_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="footer__link" style={{ display: 'inline' }}>
                  {PRACTICE_CONFIG.fullAddress}
                </a>
              </li>
              <li>
                📞 Phone: <a href={PRACTICE_CONFIG.phoneTel} className="footer__link" style={{ display: 'inline' }}>{PRACTICE_CONFIG.phone}</a>
              </li>
              <li>
                💬 WhatsApp: <a href={PRACTICE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer__link" style={{ display: 'inline' }}>{PRACTICE_CONFIG.phone}</a>
              </li>
              <li>
                ✉️ Email: <a href={`mailto:${PRACTICE_CONFIG.email}`} className="footer__link" style={{ display: 'inline' }}>{PRACTICE_CONFIG.email}</a>
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <Link href="/contact/" className="footer__link" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  View Full Contact Info & Map →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} {PRACTICE_CONFIG.doctorName}. All rights reserved. Medical Disclaimer: Information provided on this website is for patient educational purposes only and does not constitute formal medical diagnosis or advice.
          </p>
          <div className="footer__legal">
            <Link href="/privacy-policy/" className="footer__legal-link">Privacy Policy</Link>
            <span className="footer__legal-sep">·</span>
            <Link href="/terms/" className="footer__legal-link">Terms of Service</Link>
            <span className="footer__legal-sep">·</span>
            <Link href="/refund-policy/" className="footer__legal-link">Refund Policy</Link>
            <span className="footer__legal-sep">·</span>
            <Link href="/grievance/" className="footer__legal-link">Grievance Redressal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

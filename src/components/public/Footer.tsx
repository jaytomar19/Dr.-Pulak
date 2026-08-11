import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <Link href="/" className="footer__brand">
              <span className="footer__brand-name">Dr. Pulak Vatsya</span>
              <span className="footer__brand-title">Orthopaedic & Knee Specialist</span>
            </Link>
            <p className="footer__brand-desc">
              Dedicated orthopaedic surgeon practicing at StepUp Joints, Lajpat Nagar, South Delhi. Specializing in evidence-based knee care, joint preservation, and robotic-assisted surgeries.
            </p>
          </div>

          <div className="footer__nav-col">
            <h4 className="footer__col-title">Specializations</h4>
            <ul className="footer__links">
              <li><Link href="/knee-replacement/" className="footer__link">Robotic Knee Replacement</Link></li>
              <li><Link href="/acl/" className="footer__link">ACL Surgery & Arthroscopy</Link></li>
              <li><Link href="/knee-pain/" className="footer__link">Chronic Knee Pain Care</Link></li>
              <li><Link href="/knee-check/" className="footer__link">Knee Health Assessment</Link></li>
            </ul>
          </div>

          <div className="footer__nav-col">
            <h4 className="footer__col-title">Consultation</h4>
            <ul className="footer__links">
              <li><Link href="/consult/opd/" className="footer__link">In-Person OPD Visit</Link></li>
              <li><Link href="/consult/online/" className="footer__link">Online Video Consultation</Link></li>
              <li><Link href="/consult/imaging-review/" className="footer__link">Imaging & MRI Review</Link></li>
              <li><Link href="/consult/second-opinion/" className="footer__link">Surgical Second Opinion</Link></li>
              <li><Link href="/international-second-opinion/" className="footer__link">International Patients</Link></li>
            </ul>
          </div>

          <div className="footer__nav-col">
            <h4 className="footer__col-title">Clinic & Practice</h4>
            <ul className="footer__contact-info">
              <li>📍 StepUp Joints, Lajpat Nagar, New Delhi</li>
              <li>📞 Phone: +91 XXXXXXXXXX</li>
              <li>✉️ Email: contact@drpulakvatsya.com</li>
              <li>🕒 Mon – Sat: 10:00 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Dr. Pulak Vatsya. All rights reserved. Medical Disclaimer: Content on this site is for educational purposes and does not replace formal medical evaluation.
          </p>
          <div className="footer__legal">
            <Link href="/privacy-policy/" className="footer__legal-link">Privacy Policy</Link>
            <span className="footer__legal-sep">·</span>
            <Link href="/terms/" className="footer__legal-link">Terms of Service</Link>
            <span className="footer__legal-sep">·</span>
            <Link href="/grievance/" className="footer__legal-link">Grievance Redressal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

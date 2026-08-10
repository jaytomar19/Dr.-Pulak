import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__column">
          <h3 className="footer__heading">About</h3>
          <p>Dr. Pulak Vatsya is a Senior Orthopaedic Surgeon specializing in knee replacements and ACL surgeries, providing advanced, patient-centric care.</p>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__links">
            <li><Link href="/" className="footer__link">Home</Link></li>
            <li><Link href="/about/" className="footer__link">About</Link></li>
            <li><Link href="/blog/" className="footer__link">Blog</Link></li>
            <li><Link href="/consult/" className="footer__link">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__heading">Services</h3>
          <ul className="footer__links">
            <li><Link href="/knee-replacement/" className="footer__link">Knee Replacement</Link></li>
            <li><Link href="/acl/" className="footer__link">ACL Surgery</Link></li>
            <li><Link href="/knee-pain/" className="footer__link">Knee Pain Treatment</Link></li>
            <li><Link href="/consult/online/" className="footer__link">Online Consultation</Link></li>
          </ul>
        </div>
        
        <div className="footer__column">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__links">
            <li>StepUp Joints, Lajpat Nagar, New Delhi</li>
            <li>Phone: +91 XXXXXXXXXX</li>
            <li>Email: contact@drpulakvatsya.com</li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p className="footer__copyright">&copy; {new Date().getFullYear()} Dr. Pulak Vatsya. All rights reserved.</p>
        <div className="footer__legal">
          <Link href="/privacy-policy/" className="footer__link">Privacy Policy</Link>
          <span className="footer__separator">|</span>
          <Link href="/terms/" className="footer__link">Terms of Service</Link>
          <span className="footer__separator">|</span>
          <Link href="/grievance/" className="footer__link">Grievance Redressal</Link>
        </div>
      </div>
    </footer>
  );
}

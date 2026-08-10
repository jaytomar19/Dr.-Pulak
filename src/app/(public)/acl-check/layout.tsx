import type { Metadata } from 'next';
import Link from 'next/link';
import '../video-landing.css';

export const metadata: Metadata = {
  title: 'ACL Health Check | Dr. Pulak Vatsya',
  description: 'Worried about your ACL? Take our free 90-second check.',
};

export default function AclCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="video-landing-layout">
      <main>{children}</main>
      <footer className="video-landing__legal-footer">
        <div className="container">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

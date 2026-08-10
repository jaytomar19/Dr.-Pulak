import type { Metadata } from 'next';
import Link from 'next/link';
import '../video-landing.css';

export const metadata: Metadata = {
  title: 'Knee Health Check | Dr. Pulak Vatsya',
  description: 'Take our free 90-second knee health check to find out if your knee pain is something to worry about.',
};

export default function KneeCheckLayout({
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

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Dr. Pulak Vatsya — Orthopaedic Knee Surgeon, South Delhi',
    template: '%s | Dr. Pulak Vatsya',
  },
  description: 'Expert orthopaedic knee care by Dr. Pulak Vatsya at StepUp Joints, Lajpat Nagar, New Delhi. Robotic knee replacement, ACL surgery, knee pain treatment.',
  keywords: ['orthopaedic surgeon', 'knee replacement', 'knee surgeon delhi', 'robotic knee replacement', 'ACL surgery', 'Dr Pulak Vatsya', 'StepUp Joints'],
  authors: [{ name: 'Dr. Pulak Vatsya' }],
  creator: 'Dr. Pulak Vatsya',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Dr. Pulak Vatsya — StepUp Joints',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

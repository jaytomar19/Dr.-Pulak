import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Dr. Pulak Vatsya — Orthopaedic Knee Surgeon, South Delhi',
    template: '%s | Dr. Pulak Vatsya',
  },
  description: 'Expert orthopaedic knee care by Dr. Pulak Vatsya at StepUp Joints, Lajpat Nagar, New Delhi. Robotic knee replacement, ACL surgery, knee pain treatment. Book your consultation today.',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

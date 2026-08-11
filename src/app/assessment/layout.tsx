// Assessment micro-app layout — intentionally minimal.
// Per spec §5.3 and the /assessment-app directory structure in the spec,
// the assessment is a standalone funnel page with no public marketing
// Header, Footer, or StickyMobileCTA. Inheriting from the root layout
// (globals.css only) is correct.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Knee Health Check | Dr. Pulak Vatsya',
  description: 'Answer 9 quick questions to understand your knee health. Free, confidential assessment by Dr. Pulak Vatsya — Orthopaedic Knee Surgeon, South Delhi.',
  robots: {
    // Prevent search engines from indexing mid-funnel assessment steps
    index: false,
    follow: false,
  },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

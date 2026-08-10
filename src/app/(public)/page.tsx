import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Dr. Pulak Vatsya',
};

export default function HomePage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>Dr. Pulak Vatsya — Orthopaedic Knee Surgeon</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        Welcome to the StepUp Joints clinic. This homepage will be built out in Phase 2.
      </p>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'Second Opinion on Knee Surgery | Dr. Pulak Vatsya',
  description: 'Request a comprehensive review and second opinion for knee surgery or complex cases.',
};

export default function SecondOpinionPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Second Opinion on Knee Surgery</h1>
      
      <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
        Making a decision about knee surgery is significant. A second opinion can provide clarity, explore alternative options, and give you confidence in your treatment path.
      </p>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>When to Seek a Second Opinion</h2>
        <ul style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>You have been advised to undergo knee replacement or ACL surgery.</li>
          <li>Your symptoms have not improved with current treatments.</li>
          <li>You want to explore less invasive or alternative options.</li>
          <li>You have a complex or recurrent condition.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What&apos;s Included</h2>
        <ul style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>In-depth review of your complete medical history and all imaging.</li>
          <li>Detailed discussion of your diagnosis.</li>
          <li>Exploration of all viable treatment options (surgical and non-surgical).</li>
          <li>A comprehensive written summary of the recommendations.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Consultation Fee</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹XXX</p>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Link href="#" passHref legacyBehavior>
          <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Request Second Opinion</Button>
        </Link>
      </div>
    </div>
  );
}

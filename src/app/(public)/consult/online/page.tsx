import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'Online Video Consultation | Dr. Pulak Vatsya',
  description: 'Book an online video consultation with Dr. Pulak Vatsya from the comfort of your home.',
};

export default function OnlineConsultPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Online Video Consultation with Dr. Pulak Vatsya</h1>
      
      <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
        Get expert orthopedic advice without leaving your home. Our online video consultation provides a convenient way to discuss your symptoms, review reports, and explore treatment options.
      </p>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it Works</h2>
        <ol style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li><strong>Book your slot:</strong> Select a convenient time and complete the payment.</li>
          <li><strong>Share reports:</strong> Upload any previous X-rays, MRIs, or medical records securely.</li>
          <li><strong>Connect:</strong> Join the secure video link sent to your email at the scheduled time.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What's Included</h2>
        <ul style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>15-minute video call with Dr. Pulak Vatsya</li>
          <li>Review of your medical history and imaging</li>
          <li>Digital prescription and care plan</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Consultation Fee</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹XXX</p>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Link href="#" passHref legacyBehavior>
          <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Book Online Consultation</Button>
        </Link>
      </div>
    </div>
  );
}

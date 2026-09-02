import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'International Second Opinion | Dr. Pulak Vatsya',
  description: 'Expert orthopedic review for international patients seeking a second opinion.',
};

export default function InternationalSecondOpinionPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>International Second Opinion — Dr. Pulak Vatsya</h1>
      
      <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
        For patients outside India seeking expert guidance, we offer specialized international second opinion services. 
        Get professional insights into your diagnosis and proposed treatment plans from a globally experienced specialist.
      </p>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it Works</h2>
        <ol style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li><strong>Submit Records:</strong> Securely upload your complete medical history, high-resolution MRI/X-ray scans, and current physician reports.</li>
          <li><strong>Schedule:</strong> Book a video consultation slot. We accommodate various global time zones for your convenience.</li>
          <li><strong>Consult:</strong> Discuss your case directly with Dr. Vatsya via a secure video link.</li>
          <li><strong>Detailed Report:</strong> Receive a comprehensive written opinion and treatment recommendation plan.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Timezone Accommodation</h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          We understand the challenges of coordinating across time zones. Our team will work with you to find a mutually convenient time for your consultation, typically within 48-72 hours of receiving your medical records.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>International Consultation Fee</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹2,199</p>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Link href="#" passHref legacyBehavior>
          <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Request International Review</Button>
        </Link>
      </div>
    </div>
  );
}

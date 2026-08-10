import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'In-Person Consultation | Dr. Pulak Vatsya',
  description: 'Book an in-person consultation at StepUp Joints, Lajpat Nagar.',
};

export default function OPDConsultPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>In-Person Consultation — StepUp Joints, Lajpat Nagar</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What to Expect</h2>
        <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
          An in-person visit allows for a comprehensive physical examination and direct discussion of your symptoms and treatment options. 
          Dr. Vatsya will carefully assess your condition and recommend a personalized care plan.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What to Bring</h2>
        <ul style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Previous medical records and prescriptions</li>
          <li>Recent X-rays, MRIs, or other imaging reports</li>
          <li>A list of any current medications</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Location & Hours</h2>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}><strong>StepUp Joints</strong></p>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>Lajpat Nagar, New Delhi</p>
        <p style={{ color: '#4b5563', marginBottom: '1rem' }}>Monday - Saturday: 10:00 AM - 6:00 PM</p>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Link href="#" passHref legacyBehavior>
          <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Book OPD Visit</Button>
        </Link>
      </div>
    </div>
  );
}

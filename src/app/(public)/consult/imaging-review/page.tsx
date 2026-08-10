import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'Imaging Review | Dr. Pulak Vatsya',
  description: 'Get an expert analysis of your X-ray or MRI scans by Dr. Pulak Vatsya.',
};

export default function ImagingReviewPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Get Your X-Ray or MRI Reviewed by Dr. Vatsya</h1>
      
      <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
        Already have your scans but want an expert to interpret them? Submit your X-rays, MRIs, or CT scans for a detailed review and professional insight into your condition.
      </p>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it Works</h2>
        <ol style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li><strong>Upload Scans:</strong> Securely upload your digital imaging files (DICOM or high-quality images).</li>
          <li><strong>Provide Details:</strong> Briefly describe your symptoms and medical history.</li>
          <li><strong>Receive Report:</strong> Get a detailed written review and recommendation plan.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Turnaround Time</h2>
        <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
          You will receive your comprehensive review report within <strong>24-48 business hours</strong> of successful submission.
        </p>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Review Fee</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹XXX</p>
      </section>

      <div style={{ marginTop: '3rem' }}>
        <Link href="#" passHref legacyBehavior>
          <Button variant="primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>Submit for Review</Button>
        </Link>
      </div>
    </div>
  );
}

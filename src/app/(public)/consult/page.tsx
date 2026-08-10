import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/shared/Button';

export const metadata: Metadata = {
  title: 'Consult with Dr. Pulak Vatsya',
  description: 'Explore consultation options with Dr. Pulak Vatsya including OPD, Online, and Second Opinions.',
};

export default function ConsultPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Consult with Dr. Pulak Vatsya</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem', color: '#4b5563' }}>
        Choose the consultation method that best fits your needs. 
        Whether you prefer an in-person visit, an online video consultation, or need an expert second opinion, we are here to help.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>OPD Visit</h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', flex: 1 }}>In-person consultation at StepUp Joints, Lajpat Nagar.</p>
          <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Starting from ₹XXX</p>
          <Link href="/consult/opd" passHref legacyBehavior>
            <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
          </Link>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Online Consultation</h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', flex: 1 }}>Live video call from the comfort of your home.</p>
          <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Starting from ₹XXX</p>
          <Link href="/consult/online" passHref legacyBehavior>
            <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
          </Link>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Imaging Review</h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', flex: 1 }}>Expert analysis of your X-ray or MRI scans.</p>
          <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Starting from ₹XXX</p>
          <Link href="/consult/imaging-review" passHref legacyBehavior>
            <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
          </Link>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Second Opinion</h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', flex: 1 }}>Comprehensive review and second opinion on knee surgery.</p>
          <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Starting from ₹XXX</p>
          <Link href="/consult/second-opinion" passHref legacyBehavior>
            <Button variant="primary" style={{ width: '100%' }}>View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

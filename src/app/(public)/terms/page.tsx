import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Dr. Pulak Vatsya',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms of Service</h1>
      
      <div style={{ color: '#4b5563', lineHeight: '1.7' }}>
        <p style={{ marginBottom: '1.5rem' }}><strong>Last Updated:</strong> [Date]</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>2. Services</h2>
          <p>The website provides information regarding medical services, health assessments, and consultation booking facilities.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>3. Medical Disclaimer</h2>
          <p>The content on this website, including text, graphics, images, and tools like the knee assessment, are for informational purposes only. They are not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>4. Limitation of Liability</h2>
          <p>Dr. Pulak Vatsya and associated entities shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the website or services.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.</p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dr. Pulak Vatsya',
  robots: 'noindex, nofollow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
      
      <div style={{ color: '#4b5563', lineHeight: '1.7' }}>
        <p style={{ marginBottom: '1.5rem' }}><strong>Last Updated:</strong> [Date]</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>1. Information We Collect</h2>
          <p>We may collect personal information such as your name, contact details, medical history, and health data when you use our services or submit a consultation request.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>2. How We Use Your Information</h2>
          <p>Your information is used strictly to provide medical advice, facilitate consultations, and improve our services. Consent is obtained specifically for the purposes intended.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>3. Data Storage and Security</h2>
          <p>All Personally Identifiable Information (PII) is encrypted. Data residency is maintained strictly within India in compliance with local regulations.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>4. Data Retention</h2>
          <p>We retain your personal data for a period of 24 months from your last interaction, after which it is securely deleted, unless required longer by law.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>5. Third Parties</h2>
          <p>We do not sell or share your data with third parties for marketing purposes. Data may be shared with healthcare partners solely for the purpose of your treatment, with your explicit consent.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>6. Cookies</h2>
          <p>We use cookies to improve website functionality and analyze traffic. You can manage your cookie preferences through your browser settings.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>7. Your Rights</h2>
          <p>You have the right to access, correct, or request deletion of your personal data. Please contact us to exercise these rights.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>8. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at [Email Address].</p>
        </section>
      </div>
    </div>
  );
}

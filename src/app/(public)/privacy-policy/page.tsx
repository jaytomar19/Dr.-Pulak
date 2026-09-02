import type { Metadata } from 'next';
import { PRACTICE_CONFIG } from '@/config/practice';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dr. Pulak Vatsya',
  robots: 'noindex, nofollow',
};

/* CLIENT/LEGAL INPUT REQUIRED: Formal legal review recommended for specific statutory DPDP disclosures prior to final production deployment. */

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-navy)' }}>Privacy Policy</h1>
      
      <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75' }}>
        <p style={{ marginBottom: '1.5rem' }}><strong>Last Updated:</strong> 25 August 2026</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>1. Information We Collect</h2>
          <p>We collect personal and medical information necessary to facilitate clinical consultations and assessments, including your name, mobile/WhatsApp number, email address, clinical assessment answers, submitted medical records, and diagnostic scans (X-rays/MRI).</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>2. How We Use Your Information</h2>
          <p>Your information is used strictly to provide orthopaedic clinical evaluations, schedule in-person OPD or online consultations, process medical reviews, and send transactional appointment notifications. Consent is obtained specifically for the clinical services requested.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>3. Data Storage and Security</h2>
          <p>All Personally Identifiable Information (PII) and submitted medical documents are encrypted in transit and at rest. Primary data storage is hosted on secure cloud infrastructure located within India.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>4. Data Retention</h2>
          <p>We retain your personal data and assessment records for a period of 24 months from your last clinical interaction, after which records are securely archived or deleted unless longer retention is required for legal or medical record-keeping compliance.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>5. Third-Party Service Processors</h2>
          <p style={{ marginBottom: '1rem' }}>We do not sell or trade your personal data to third parties for marketing purposes. To deliver our online consultation services, data is processed through trusted infrastructure providers strictly for service fulfillment:</p>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
            <li><strong>Payment Gateway:</strong> Online consultation payments are securely processed by Razorpay. Card, UPI, and banking credentials are handled directly by Razorpay and are not stored on our servers.</li>
            <li><strong>Email Communications:</strong> Transactional booking receipts and email notifications are transmitted via Postmark.</li>
            <li><strong>WhatsApp Communications:</strong> Transactional appointment updates and reminder notifications are transmitted via Meta Cloud API / Aisensy.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>6. Cookies & Analytics</h2>
          <p>We use essential functional cookies and privacy-focused analytics to evaluate website performance and improve patient navigation experience.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>7. Your Patient Rights</h2>
          <p>You have the right to request access to, correction of, or deletion of your personal contact records. Please contact our practice coordinator to exercise these rights.</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>8. Contact Us</h2>
          <p>If you have questions regarding this Privacy Policy or your data, please contact our clinic at <a href={`mailto:${PRACTICE_CONFIG.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{PRACTICE_CONFIG.email}</a> or phone <a href={PRACTICE_CONFIG.phoneTel} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{PRACTICE_CONFIG.phone}</a>.</p>
        </section>
      </div>
    </div>
  );
}

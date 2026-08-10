import type { Metadata } from 'next';
import CredentialsBlock from '@/components/public/CredentialsBlock';

export const metadata: Metadata = {
  title: 'About Dr. Pulak Vatsya | Knee Specialist',
  description: 'Learn about Dr. Pulak Vatsya, his qualifications, experience, and philosophy of care.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Dr. Pulak Vatsya</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
          Dr. Pulak Vatsya is a dedicated orthopedic specialist with a focus on knee health and joint preservation. 
          [Placeholder for comprehensive bio detailing early education, specialized training, and commitment to patient outcomes.]
        </p>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.7' }}>
          He believes in empowering patients with knowledge about their condition, ensuring they are active participants in their treatment journey.
        </p>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Qualifications & Experience</h2>
        <ul style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>MBBS, MS Orthopaedics [Placeholder]</li>
          <li>Fellowship in Joint Replacement [Placeholder]</li>
          <li>Over X years of specialized experience in knee surgeries and non-invasive treatments.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Philosophy of Care</h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.7' }}>
          "Every patient's pain and lifestyle goals are unique. My approach centers on a thorough assessment and open communication. Whether a condition requires surgical intervention or can be managed through conservative methods, my goal is to provide the most effective and appropriate care."
        </p>
      </section>

      <section style={{ marginTop: '4rem' }}>
        <CredentialsBlock />
      </section>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grievance Redressal | Dr. Pulak Vatsya',
};

export default function GrievancePage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Grievance Redressal</h1>
      
      <p style={{ color: '#4b5563', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
        We are committed to providing the highest quality of care and service. If you have any concerns or complaints regarding our services, data handling, or support, please follow our grievance redressal process below.
      </p>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Grievance Officer</h2>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}><strong>Name:</strong> [PENDING CLIENT INPUT]</p>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}><strong>Email:</strong> [PENDING CLIENT INPUT]</p>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}><strong>Phone:</strong> [PENDING CLIENT INPUT]</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Process for Filing a Grievance</h2>
        <ol style={{ color: '#4b5563', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Contact our Grievance Officer via the email or phone number provided above.</li>
          <li>Provide a detailed description of your issue along with any relevant documentation or patient ID.</li>
          <li>You will receive an acknowledgment of your grievance within 24-48 hours.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Timelines for Resolution</h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          We aim to resolve all grievances within a maximum of 30 days from the date of receipt. 
          Complex cases may require additional time, in which case you will be kept informed of the progress.
        </p>
      </section>
    </div>
  );
}

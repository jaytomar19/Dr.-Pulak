import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';

export default function CredentialsBlock() {
  const pillars = [
    {
      step: '01',
      title: 'Patient Education First',
      desc: 'We believe informed patients achieve better outcomes. Every consultation includes detailed visual explanations of your joint anatomy, diagnosis, and options.',
    },
    {
      step: '02',
      title: 'Conservative Non-Surgical Focus',
      desc: 'Surgery is recommended only when conservative protocols—physiotherapy, lifestyle modification, and targeted therapies—have been thoroughly explored.',
    },
    {
      step: '03',
      title: 'Fellowship-Trained Precision',
      desc: 'Sub-specialized surgical expertise in joint replacement and arthroscopy at StepUp Joints, Lajpat Nagar, utilizing evidence-based protocols.',
    },
    {
      step: '04',
      title: 'Transparent Ethical Guidance',
      desc: 'Clear, honest recommendations with zero pressure. Patients receive realistic timelines, risk assessments, and recovery expectations.',
    },
  ];

  return (
    <section className="philosophy-section">
      {/* Background depth glow */}
      <div className="philosophy-bg-glow" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Reveal variant="fade-up" className="philosophy-header">
          <span className="eyebrow" style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'block', textAlign: 'center', marginBottom: '0.5rem' }}>
            PRACTICE PHILOSOPHY
          </span>
          <h2 className="philosophy-title">Patient-Centered Knee Care Founded on Clinical Integrity</h2>
          <p className="philosophy-subtitle">
            Providing evidence-based orthopaedic care in South Delhi with a steadfast commitment to patient education and non-surgical preservation.
          </p>
        </Reveal>

        <Stagger className="philosophy-grid" staggerInterval={100}>
          {pillars.map((pillar, idx) => (
            <div key={idx} className="philosophy-card" data-cursor="card">
              <div className="philosophy-card__num-badge">
                <span>{pillar.step}</span>
              </div>
              <h3 className="philosophy-card__title">{pillar.title}</h3>
              <p className="philosophy-card__desc">{pillar.desc}</p>
              <div className="philosophy-card__accent-bar" />
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

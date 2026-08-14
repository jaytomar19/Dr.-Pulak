import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import Magnetic from '@/components/shared/Magnetic';

export default function OnlineConsultExplainer() {
  const steps = [
    {
      num: '01',
      title: 'Understand',
      desc: 'Comprehensive history taking to evaluate symptoms, activity levels, and daily impact.',
    },
    {
      num: '02',
      title: 'Diagnose',
      desc: 'Physical examination and advanced imaging review (X-Rays / MRI) for diagnostic clarity.',
    },
    {
      num: '03',
      title: 'Plan',
      desc: 'Collaborative development of a personalized care pathway—conservative or surgical.',
    },
    {
      num: '04',
      title: 'Treat',
      desc: 'Execution of evidence-based non-surgical protocols or precision surgical intervention.',
    },
    {
      num: '05',
      title: 'Recover',
      desc: 'Structured rehabilitation and ongoing follow-up monitoring to restore full mobility.',
    },
  ];

  return (
    <section className="journey-section">
      <div className="container">
        <Reveal variant="fade-up" className="journey-header">
          <span className="eyebrow eyebrow--gold">CARE PATHWAY</span>
          <h2 className="journey-title">Your Patient Care Journey</h2>
          <p className="journey-subtitle">
            A structured, transparent clinical approach ensuring you are supported at every phase from initial evaluation to complete recovery.
          </p>
        </Reveal>

        <Stagger className="journey-timeline" staggerInterval={100}>
          {steps.map((step, idx) => (
            <div key={idx} className="journey-step" data-cursor="card">
              <div className="journey-step__badge">
                <span className="journey-step__num">{step.num}</span>
              </div>
              <h3 className="journey-step__title">{step.title}</h3>
              <p className="journey-step__desc">{step.desc}</p>
            </div>
          ))}
        </Stagger>

        <div className="journey-cta">
          <Magnetic strength={5} maxOffset={8}>
            <Link href="/consult/" className="btn btn--secondary btn--lg" data-cursor="button">
              Start Your Consultation Journey <span className="btn-arrow">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

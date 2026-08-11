import Link from 'next/link';

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
        <div className="journey-header">
          <span className="eyebrow eyebrow--gold">CARE PATHWAY</span>
          <h2 className="journey-title">Your Patient Care Journey</h2>
          <p className="journey-subtitle">
            A structured, transparent clinical approach ensuring you are supported at every phase from initial evaluation to complete recovery.
          </p>
        </div>

        <div className="journey-timeline">
          {steps.map((step, idx) => (
            <div key={idx} className="journey-step">
              <div className="journey-step__badge">
                <span className="journey-step__num">{step.num}</span>
              </div>
              <h3 className="journey-step__title">{step.title}</h3>
              <p className="journey-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="journey-cta">
          <Link href="/consult/" className="btn btn--secondary btn--lg">
            Start Your Consultation Journey
          </Link>
        </div>
      </div>
    </section>
  );
}

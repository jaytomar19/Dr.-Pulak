'use client';

import Reveal from '@/components/shared/Reveal';
import Magnetic from '@/components/shared/Magnetic';
import { useAssessmentModal } from '@/context/AssessmentModalContext';

interface AssessmentCTAProps {
  variant?: 'inline' | 'sticky' | 'hero';
  heading?: string;
  subheading?: string;
  buttonText?: string;
  className?: string;
}

export default function AssessmentCTA({
  variant = 'inline',
  heading = 'Unsure About Your Knee Pain?',
  subheading = 'Complete our 90-Second Knee Health Assessment to understand your symptoms and receive structured recommendations.',
  buttonText = 'Start Free Knee Check',
  className = ''
}: AssessmentCTAProps) {
  const { openAssessmentModal } = useAssessmentModal();

  return (
    <section className={`assessment-banner assessment-banner--${variant} ${className}`}>
      <div className="container">
        <Reveal variant="scale-up">
          <div className="assessment-banner__box" data-cursor="card">
            <div className="assessment-banner__content">
              <span className="eyebrow eyebrow--gold">FREE ONLINE SCREENING</span>
              <h2 className="assessment-banner__heading">{heading}</h2>
              <p className="assessment-banner__subheading">{subheading}</p>
            </div>
            <div className="assessment-banner__action">
              <Magnetic strength={5} maxOffset={8}>
                <button
                  type="button"
                  onClick={openAssessmentModal}
                  className="btn btn--secondary btn--lg assessment-banner__btn"
                  data-cursor="button"
                >
                  {buttonText} <span className="btn-arrow">→</span>
                </button>
              </Magnetic>
              <span className="assessment-banner__hint">Takes 90 seconds · Confidential</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


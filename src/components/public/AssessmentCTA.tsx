import Link from 'next/link';

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
  return (
    <section className={`assessment-banner assessment-banner--${variant} ${className}`}>
      <div className="container">
        <div className="assessment-banner__box">
          <div className="assessment-banner__content">
            <span className="eyebrow eyebrow--gold">FREE ONLINE SCREENING</span>
            <h2 className="assessment-banner__heading">{heading}</h2>
            <p className="assessment-banner__subheading">{subheading}</p>
          </div>
          <div className="assessment-banner__action">
            <Link href="/knee-check/" className="btn btn--secondary btn--lg assessment-banner__btn">
              {buttonText} →
            </Link>
            <span className="assessment-banner__hint">Takes 90 seconds · Confidential</span>
          </div>
        </div>
      </div>
    </section>
  );
}

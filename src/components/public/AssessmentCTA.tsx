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
  heading = 'Wondering if you need a knee replacement?',
  subheading = 'Take our 2-minute free knee check to find out.',
  buttonText = 'Take Free Knee Check',
  className = ''
}: AssessmentCTAProps) {
  return (
    <div className={`assessment-cta assessment-cta--${variant} ${className}`}>
      {(heading || subheading) && (
        <div className="assessment-cta__content">
          {heading && <h3 className="assessment-cta__heading">{heading}</h3>}
          {subheading && <p className="assessment-cta__subheading">{subheading}</p>}
        </div>
      )}
      <Link href="/knee-check/" className="assessment-cta__button">
        {buttonText}
      </Link>
    </div>
  );
}

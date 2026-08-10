import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';

export const metadata = {
  title: 'ACL Injury & Surgery — Complete Guide | Dr. Pulak Vatsya',
  description: 'Comprehensive guide on ACL injuries, symptoms, surgery vs no surgery, recovery timeline, and when to see a specialist.',
};

export default function ACLPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        name: 'ACL Injury & Surgery — Complete Guide',
        description: 'Detailed information about ACL injuries, recovery, and treatments.',
        specialty: 'Orthopaedic Surgery',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I know if I tore my ACL?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Symptoms often include a popping sound, severe pain, rapid swelling, and a feeling of instability in the knee.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is surgery always required for an ACL tear?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not necessarily. Non-surgical treatment may be an option for individuals with low activity levels or those willing to modify their lifestyle.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long is the recovery from ACL surgery?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Full recovery and return to sports typically take 9 to 12 months, depending on rehabilitation progress.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I walk with a torn ACL?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, after initial swelling subsides, many people can walk in straight lines, but pivoting or twisting motions may cause instability.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is ACL reconstruction?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ACL reconstruction involves replacing the torn ligament with a tissue graft, usually taken from another part of your body.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://drpulakvatsya.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'ACL',
            item: 'https://drpulakvatsya.com/acl/',
          },
        ],
      },
    ],
  };

  return (
    <article className="condition-hub">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container">
        <h1>ACL Injury & Surgery — Complete Guide</h1>
        <p className="condition-hub__intro">
          The anterior cruciate ligament (ACL) is a crucial stabilizing ligament in the knee. ACL injuries are common in sports that involve sudden stops or changes in direction.
        </p>

        <nav className="condition-hub__toc">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#what-is">What is an ACL Injury?</a></li>
            <li><a href="#symptoms">Symptoms</a></li>
            <li><a href="#treatment">Surgery vs No Surgery</a></li>
            <li><a href="#recovery">ACL Recovery Timeline</a></li>
            <li><a href="#return-to-sport">Return to Sport</a></li>
            <li><a href="#specialist">When to See a Specialist</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
          </ul>
        </nav>

        <section id="what-is" className="condition-hub__section">
          <h2>What is an ACL Injury?</h2>
          <p>An ACL injury is a sprain or tear of the anterior cruciate ligament. It can range from a mild sprain to a complete tear of the ligament.</p>
        </section>

        <section id="symptoms" className="condition-hub__section">
          <h2>Symptoms</h2>
          <p>Common symptoms include a loud &ldquo;pop&rdquo; at the time of injury, severe pain and inability to continue activity, rapid swelling, and a feeling of instability.</p>
        </section>

        <AssessmentCTA />

        <section id="treatment" className="condition-hub__section">
          <h2>Surgery vs No Surgery</h2>
          <p>Treatment depends on your activity level and the severity of the injury. Non-surgical options include physical therapy and bracing. Surgery may be recommended for athletes or individuals with significant instability.</p>
        </section>

        <AssessmentCTA />

        <section id="recovery" className="condition-hub__section">
          <h2>ACL Recovery Timeline</h2>
          <p>Recovery after ACL surgery is a gradual process. The initial phases focus on reducing swelling and restoring range of motion, followed by strengthening and sport-specific training.</p>
        </section>

        <section id="return-to-sport" className="condition-hub__section">
          <h2>Return to Sport</h2>
          <p>Returning to sports usually requires 9 to 12 months of dedicated rehabilitation and passing specific physical assessments to ensure the knee is ready.</p>
        </section>

        <section id="specialist" className="condition-hub__section">
          <h2>When to See a Specialist</h2>
          <p>You should consult a specialist if you experience sudden knee pain, swelling after an injury, or if your knee feels like it gives way.</p>
        </section>

        <section id="faq" className="condition-hub__section condition-hub__faq">
          <h2>Frequently Asked Questions</h2>
          <details>
            <summary>How do I know if I tore my ACL?</summary>
            <p>Symptoms often include a popping sound, severe pain, rapid swelling, and a feeling of instability in the knee.</p>
          </details>
          <details>
            <summary>Is surgery always required for an ACL tear?</summary>
            <p>Not necessarily. Non-surgical treatment may be an option for individuals with low activity levels or those willing to modify their lifestyle.</p>
          </details>
          <details>
            <summary>How long is the recovery from ACL surgery?</summary>
            <p>Full recovery and return to sports typically take 9 to 12 months, depending on rehabilitation progress.</p>
          </details>
          <details>
            <summary>Can I walk with a torn ACL?</summary>
            <p>Yes, after initial swelling subsides, many people can walk in straight lines, but pivoting or twisting motions may cause instability.</p>
          </details>
          <details>
            <summary>What is ACL reconstruction?</summary>
            <p>ACL reconstruction involves replacing the torn ligament with a tissue graft, usually taken from another part of your body.</p>
          </details>
        </section>

        <AssessmentCTA />

        <section className="condition-hub__related">
          <h2>Related Articles</h2>
          <ul>
            <li><Link href="/knee-replacement/">Knee Replacement</Link></li>
            <li><Link href="/knee-pain/">Understanding Knee Pain</Link></li>
          </ul>
        </section>
      </div>
    </article>
  );
}

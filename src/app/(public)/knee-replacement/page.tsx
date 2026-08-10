import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';
import YouTubeEmbed from '@/components/public/YouTubeEmbed';

export const metadata = {
  title: 'Knee Replacement Surgery in Delhi — Dr. Pulak Vatsya',
  description: 'Learn about knee replacement surgery, symptoms, diagnosis, treatment options, robotic knee replacement, and recovery timeline.',
};

export default function KneeReplacementPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        name: 'Knee Replacement Surgery in Delhi — What You Need to Know',
        description: 'Comprehensive guide on knee replacement surgery.',
        specialty: 'Orthopaedic Surgery',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does a knee replacement last?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A knee replacement may last 15 to 20 years or more, depending on individual factors like activity level and weight.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is knee replacement surgery painful?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pain is managed with modern pain relief protocols. Patients may experience some discomfort during recovery, but the goal is long-term pain relief.',
            },
          },
          {
            '@type': 'Question',
            name: 'When can I walk after surgery?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most patients are encouraged to walk with the help of a walker or crutches on the same day or the day after surgery.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the risks of knee replacement?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Possible risks include infection, blood clots, and implant loosening. Consult your doctor to understand your specific risks.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need physical therapy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, physical therapy is crucial for regaining strength and mobility after knee replacement surgery.',
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
            name: 'Knee Replacement',
            item: 'https://drpulakvatsya.com/knee-replacement/',
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
        <h1>Knee Replacement Surgery in Delhi — What You Need to Know</h1>
        <p className="condition-hub__intro">
          Knee replacement surgery is a common procedure designed to relieve pain and restore function in severely damaged knee joints. It may be an option when non-surgical treatments no longer provide adequate relief.
        </p>

        <nav className="condition-hub__toc">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#what-is">What is Knee Replacement?</a></li>
            <li><a href="#symptoms">Symptoms That May Indicate You Need Surgery</a></li>
            <li><a href="#diagnosis">Diagnosis Process</a></li>
            <li><a href="#treatment">Treatment Options</a></li>
            <li><a href="#robotic">Robotic Knee Replacement</a></li>
            <li><a href="#recovery">Recovery Timeline</a></li>
            <li><a href="#decision">How to Decide If Surgery Is Right for You</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
          </ul>
        </nav>

        <section id="what-is" className="condition-hub__section">
          <h2>What is Knee Replacement?</h2>
          <p>Knee replacement, also known as knee arthroplasty, involves replacing the damaged cartilage and bone of the knee joint with artificial components.</p>
        </section>

        <section id="symptoms" className="condition-hub__section">
          <h2>Symptoms That May Indicate You Need Surgery</h2>
          <p>Severe knee pain that limits everyday activities, pain while resting, and chronic knee inflammation are some symptoms that may suggest a need for evaluation.</p>
        </section>

        <AssessmentCTA />

        <section id="diagnosis" className="condition-hub__section">
          <h2>Diagnosis Process</h2>
          <p>A diagnosis typically involves a physical examination, review of medical history, and X-rays to assess the extent of joint damage.</p>
        </section>

        <section id="treatment" className="condition-hub__section">
          <h2>Treatment Options</h2>
          <p>Treatment always starts with non-surgical options, such as medications, physical therapy, and watchful waiting. Surgery is considered when these methods fail to provide relief.</p>
        </section>

        <AssessmentCTA />

        <section id="robotic" className="condition-hub__section">
          <h2>Robotic Knee Replacement</h2>
          <p>Advanced robotic-assisted technology may offer increased precision in implant placement, potentially leading to better outcomes for some patients.</p>
        </section>

        <section id="recovery" className="condition-hub__section">
          <h2>Recovery Timeline</h2>
          <p>Recovery times vary. Most patients can resume normal activities within 3 to 6 weeks, though full recovery may take several months.</p>
        </section>

        <section id="decision" className="condition-hub__section">
          <h2>How to Decide If Surgery Is Right for You</h2>
          <p>This is a shared decision between you and your surgeon, based on the severity of your pain, the impact on your quality of life, and your overall health.</p>
        </section>

        <div className="condition-hub__video">
          <YouTubeEmbed videoId="dQw4w9WgXcQ" title="Understanding Knee Replacement" />
        </div>

        <section id="faq" className="condition-hub__section condition-hub__faq">
          <h2>Frequently Asked Questions</h2>
          <details>
            <summary>How long does a knee replacement last?</summary>
            <p>A knee replacement may last 15 to 20 years or more, depending on individual factors like activity level and weight.</p>
          </details>
          <details>
            <summary>Is knee replacement surgery painful?</summary>
            <p>Pain is managed with modern pain relief protocols. Patients may experience some discomfort during recovery, but the goal is long-term pain relief.</p>
          </details>
          <details>
            <summary>When can I walk after surgery?</summary>
            <p>Most patients are encouraged to walk with the help of a walker or crutches on the same day or the day after surgery.</p>
          </details>
          <details>
            <summary>What are the risks of knee replacement?</summary>
            <p>Possible risks include infection, blood clots, and implant loosening. Consult your doctor to understand your specific risks.</p>
          </details>
          <details>
            <summary>Do I need physical therapy?</summary>
            <p>Yes, physical therapy is crucial for regaining strength and mobility after knee replacement surgery.</p>
          </details>
        </section>

        <AssessmentCTA />

        <section className="condition-hub__related">
          <h2>Related Articles</h2>
          <ul>
            <li><Link href="/knee-pain/">Understanding Knee Pain</Link></li>
            <li><Link href="/acl/">ACL Injuries</Link></li>
          </ul>
        </section>
      </div>
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import AssessmentCTA from '@/components/public/AssessmentCTA';

export const metadata = {
  title: 'Understanding Knee Pain — Causes & Treatment | Dr. Pulak Vatsya',
  description: 'Learn about common causes of knee pain, such as chondromalacia patellae and runner\'s knee, and explore non-surgical treatment options.',
};

export default function KneePainPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        name: 'Understanding Knee Pain — Causes, Diagnosis & Treatment',
        description: 'Learn about common causes of knee pain and explore treatment options.',
        specialty: 'Orthopaedic Surgery',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Why does my knee hurt when going down stairs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pain when going down stairs is often related to patellofemoral pain syndrome or chondromalacia patellae, where the kneecap does not track smoothly.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is runner\'s knee?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Runner\'s knee is a broad term describing pain around or behind the kneecap, common in active individuals.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can knee pain be treated without surgery?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, many causes of knee pain can be managed with physical therapy, activity modification, weight management, and medications.',
            },
          },
          {
            '@type': 'Question',
            name: 'When should I see a doctor for knee pain?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You should see a doctor if you have severe pain, significant swelling, inability to bear weight, or if the pain persists despite rest.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does icing help knee pain?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Icing may help reduce acute swelling and numb the pain. It is often recommended as part of initial care for knee injuries.',
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
            name: 'Knee Pain',
            item: 'https://drpulakvatsya.com/knee-pain/',
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
        <h1>Understanding Knee Pain — Causes, Diagnosis & Treatment</h1>
        <p className="condition-hub__intro">
          Knee pain is a frequent complaint that affects people of all ages. Understanding the underlying cause is the first step toward finding effective relief and restoring mobility.
        </p>

        <nav className="condition-hub__toc">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#causes">Common Causes</a></li>
            <li><a href="#chondromalacia">Chondromalacia Patellae</a></li>
            <li><a href="#runners-knee">Runner's Knee</a></li>
            <li><a href="#stairs">Pain Going Down Stairs</a></li>
            <li><a href="#when-to-seek-help">When to Seek Help</a></li>
            <li><a href="#treatment">Non-Surgical Treatment Options</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
          </ul>
        </nav>

        <section id="causes" className="condition-hub__section">
          <h2>Common Causes</h2>
          <p>Knee pain can result from injuries, mechanical problems, types of arthritis, or other issues. It is important to have persistent pain properly evaluated.</p>
        </section>

        <section id="chondromalacia" className="condition-hub__section">
          <h2>Chondromalacia Patellae</h2>
          <p>This condition involves the softening and breakdown of the cartilage on the underside of the kneecap. It may cause a dull, aching pain.</p>
        </section>

        <AssessmentCTA />

        <section id="runners-knee" className="condition-hub__section">
          <h2>Runner's Knee</h2>
          <p>Also known as patellofemoral pain syndrome, this causes pain in the front of the knee and around the patella, often aggravated by running or sitting for long periods.</p>
        </section>

        <section id="stairs" className="condition-hub__section">
          <h2>Pain Going Down Stairs</h2>
          <p>Experiencing pain specifically when descending stairs is a common symptom of kneecap-related issues, as this action places increased stress on the patellofemoral joint.</p>
        </section>

        <section id="when-to-seek-help" className="condition-hub__section">
          <h2>When to Seek Help</h2>
          <p>If you experience sudden swelling, severe pain, instability, or if pain prevents you from performing daily activities, it's time to consult a doctor.</p>
        </section>

        <section id="treatment" className="condition-hub__section">
          <h2>Non-Surgical Treatment Options</h2>
          <p>Many forms of knee pain respond well to non-surgical treatments such as rest, physical therapy, targeted exercises, and anti-inflammatory medications.</p>
        </section>

        <AssessmentCTA />

        <section id="faq" className="condition-hub__section condition-hub__faq">
          <h2>Frequently Asked Questions</h2>
          <details>
            <summary>Why does my knee hurt when going down stairs?</summary>
            <p>Pain when going down stairs is often related to patellofemoral pain syndrome or chondromalacia patellae, where the kneecap does not track smoothly.</p>
          </details>
          <details>
            <summary>What is runner's knee?</summary>
            <p>Runner's knee is a broad term describing pain around or behind the kneecap, common in active individuals.</p>
          </details>
          <details>
            <summary>Can knee pain be treated without surgery?</summary>
            <p>Yes, many causes of knee pain can be managed with physical therapy, activity modification, weight management, and medications.</p>
          </details>
          <details>
            <summary>When should I see a doctor for knee pain?</summary>
            <p>You should see a doctor if you have severe pain, significant swelling, inability to bear weight, or if the pain persists despite rest.</p>
          </details>
          <details>
            <summary>Does icing help knee pain?</summary>
            <p>Icing may help reduce acute swelling and numb the pain. It is often recommended as part of initial care for knee injuries.</p>
          </details>
        </section>

        <AssessmentCTA />

        <section className="condition-hub__related">
          <h2>Related Articles</h2>
          <ul>
            <li><Link href="/knee-replacement/">Knee Replacement</Link></li>
            <li><Link href="/acl/">ACL Injuries</Link></li>
          </ul>
        </section>
      </div>
    </article>
  );
}

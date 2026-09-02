import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';

export const metadata: Metadata = {
  title: 'Knee & Joint Care Insights | Dr. Pulak Vatsya',
  description: 'Evidence-based articles, patient education guides, and clinical insights on knee health, robotic surgery, ACL recovery, and arthritis management.',
};

interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    slug: 'signs-your-acl-needs-evaluation',
    title: '5 Signs Your ACL Tear Requires Clinical Evaluation',
    category: 'SPORTS MEDICINE',
    excerpt: 'Understanding key symptoms of anterior cruciate ligament injury, joint stability testing, and when non-operative vs surgical reconstruction is advised.',
    readTime: '4 min read',
  },
  {
    slug: 'robotic-vs-conventional-knee-replacement',
    title: 'Robotic-Assisted vs Conventional Knee Replacement',
    category: 'JOINT REPLACEMENT',
    excerpt: 'An objective analysis of 3D CT mapping, sub-millimeter implant alignment, soft tissue balancing, and recovery timelines in modern arthroplasty.',
    readTime: '6 min read',
  },
  {
    slug: 'non-surgical-joint-preservation-guide',
    title: 'When is Non-Surgical Joint Preservation Suitable?',
    category: 'KNEE PRESERVATION',
    excerpt: 'Exploring structured physical therapy, weight management, hyaluronic acid injections, and activity modification for early-stage knee osteoarthritis.',
    readTime: '5 min read',
  },
  {
    slug: 'early-signs-knee-osteoarthritis',
    title: 'Understanding Early Signs of Knee Osteoarthritis',
    category: 'OSTEOARTHRITIS',
    excerpt: 'Recognize early symptoms of cartilage wear, joint stiffness, and evidence-based clinical steps to slow progression.',
    readTime: '5 min read',
  },
];

export default function InsightsPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1140px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">PATIENT EDUCATION & CLINICAL ARTICLES</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Orthopaedic Insights & Guides
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Clear, doctor-approved guidance to help you understand joint conditions, treatment pathways, and post-operative recovery.
          </p>
        </div>
      </Reveal>

      <Stagger className="hub-cards__grid" staggerInterval={90}>
        {ARTICLES.map((article) => (
          <div key={article.slug} className="hub-cards__wrapper">
            <div className="hub-cards__card" style={{ padding: '2rem' }}>
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-category">{article.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{article.readTime}</span>
              </div>
              <div className="hub-cards__card-body" style={{ margin: '1.25rem 0' }}>
                <h2 className="hub-cards__card-title" style={{ fontSize: '1.35rem' }}>{article.title}</h2>
                <p className="hub-cards__card-desc">{article.excerpt}</p>
              </div>
              <div className="hub-cards__card-footer">
                <span className="hub-cards__card-link">
                  <span>Read Full Guide</span>
                  <span className="hub-cards__arrow">→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </Stagger>

      <section style={{ marginTop: '5rem', textAlign: 'center', padding: '3rem 2rem', background: 'var(--color-bg-surface)', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>Have Questions About Your Joint Symptoms?</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Take our 90-second Knee Reset Assessment to receive instant clinical categorization.
        </p>
        <Link href="/knee-reset/assessment/" className="btn btn--primary btn--lg">
          Take Knee Reset Assessment
        </Link>
      </section>
    </div>
  );
}

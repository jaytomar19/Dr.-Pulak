import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';

export interface FeaturedArticle {
  id: string;
  slug: string;
  link: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  objectFit: 'cover' | 'contain';
  objectPosition: string;
  readTime: string;
}

export const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    id: 'article-1',
    slug: 'signs-your-acl-needs-evaluation',
    link: '/treatments/acl-surgery',
    title: '5 Signs Your ACL Tear Requires Clinical Evaluation',
    category: 'SPORTS MEDICINE',
    excerpt: 'Understanding key symptoms of ACL injury, joint stability testing, and when non-operative physical therapy vs surgical reconstruction is advised.',
    image: '/images/clinic/dr-pulak-surgery-centered.jpg',
    imageAlt: 'Dr. Pulak Vatsya in operating theater during knee procedure',
    objectFit: 'cover',
    objectPosition: 'center top',
    readTime: '4 min read',
  },
  {
    id: 'article-2',
    slug: 'robotic-vs-conventional-knee-replacement',
    link: '/treatments/knee-replacement',
    title: 'Robotic-Assisted vs Conventional Knee Replacement',
    category: 'JOINT REPLACEMENT',
    excerpt: 'An objective analysis of 3D CT mapping, sub-millimeter implant alignment, soft tissue balancing, and recovery timelines.',
    image: '/images/clinic/dr-pulak-fortis-centered.jpg',
    imageAlt: 'Dr. Pulak Vatsya conducting OPD patient consultation',
    objectFit: 'cover',
    objectPosition: 'center 20%',
    readTime: '6 min read',
  },
  {
    id: 'article-3',
    slug: 'non-surgical-joint-preservation-guide',
    link: '/knee-pain',
    title: 'When is Non-Surgical Joint Preservation Suitable?',
    category: 'KNEE PRESERVATION',
    excerpt: 'Exploring structured physical therapy, weight management, hyaluronic acid injections, and activity modification for early knee care.',
    image: '/images/hero/dr-pulak-hero-3.jpeg',
    imageAlt: 'Dr. Pulak Vatsya senior knee specialist at StepUp Joints clinic',
    objectFit: 'cover',
    objectPosition: 'center 20%',
    readTime: '5 min read',
  },
  {
    id: 'article-4',
    slug: 'early-signs-knee-osteoarthritis',
    link: '/insights',
    title: 'Understanding Early Signs of Knee Osteoarthritis',
    category: 'OSTEOARTHRITIS',
    excerpt: 'Recognize early symptoms of cartilage wear, joint stiffness, and evidence-based clinical steps to slow progression.',
    image: '/images/hero/dr-pulak-hero-7.jpeg',
    imageAlt: 'Dr. Pulak Vatsya orthopaedic specialist presenting insights',
    objectFit: 'cover',
    objectPosition: 'center 15%',
    readTime: '5 min read',
  },
];

export default function FeaturedBlogSection() {
  return (
    <section className="featured-blog-section">
      <div className="container">
        {/* Center-aligned section header */}
        <Reveal variant="fade-up">
          <div className="featured-blog__header">
            <span className="eyebrow">PATIENT EDUCATION</span>
            <h2 className="featured-blog__title">Expert Insights on Knee & Joint Health</h2>
            <p className="featured-blog__subtitle">
              Practical, evidence-based guidance to help you understand your condition, treatment options, recovery, and long-term joint health.
            </p>
          </div>
        </Reveal>

        {/* 4 featured blog cards in a responsive grid */}
        <Stagger className="featured-blog__grid" staggerInterval={80}>
          {FEATURED_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={article.link}
              className="featured-blog-card"
              data-cursor="card"
              aria-label={`Read article: ${article.title}`}
            >
              {/* Card Image container with custom per-image cropping */}
              <div className="featured-blog-card__image-wrap">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 25vw"
                  className="featured-blog-card__image"
                  style={{
                    objectFit: article.objectFit,
                    objectPosition: article.objectPosition,
                  }}
                />
              </div>

              {/* Card Content Area */}
              <div className="featured-blog-card__body">
                <div className="featured-blog-card__meta">
                  <span className="featured-blog-card__category">{article.category}</span>
                  <span className="featured-blog-card__read-time">{article.readTime}</span>
                </div>

                <h3 className="featured-blog-card__title">{article.title}</h3>

                <p className="featured-blog-card__excerpt">{article.excerpt}</p>

                <div className="featured-blog-card__footer">
                  <span className="featured-blog-card__cta">
                    <span>Read Article</span>
                    <span className="featured-blog-card__arrow">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

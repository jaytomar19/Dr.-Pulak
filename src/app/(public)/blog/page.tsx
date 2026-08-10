import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Articles & Insights | Dr. Pulak Vatsya',
  description: 'Read the latest insights and articles on knee health and orthopedic care.',
};

export default function BlogPage() {
  const placeholderPosts = [
    {
      id: 1,
      title: 'Understanding Early Signs of Knee Osteoarthritis',
      excerpt: 'Learn to recognize the early symptoms of knee osteoarthritis and when to seek medical advice.',
      date: 'October 15, 2023',
      slug: '#'
    },
    {
      id: 2,
      title: 'Recovery Timelines After ACL Reconstruction',
      excerpt: 'A comprehensive guide to what you can expect during the months following an ACL repair surgery.',
      date: 'September 28, 2023',
      slug: '#'
    },
    {
      id: 3,
      title: 'Non-Surgical Options for Knee Pain Management',
      excerpt: 'Explore various conservative treatments that may help alleviate knee pain without the need for surgery.',
      date: 'August 10, 2023',
      slug: '#'
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Health Articles & Insights</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {placeholderPosts.map(post => (
          <article key={post.id} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              <Link href={post.slug} style={{ color: '#111827', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{post.date}</p>
            <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '1rem' }}>{post.excerpt}</p>
            <Link href={post.slug} style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

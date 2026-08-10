import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://drpulakvatsya.com';

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/knee-replacement/', priority: 0.9 },
    { url: '/acl/', priority: 0.9 },
    { url: '/knee-pain/', priority: 0.9 },
    { url: '/knee-check/', priority: 0.8 },
    { url: '/acl-check/', priority: 0.7 },
    { url: '/consult/', priority: 0.8 },
    { url: '/consult/opd/', priority: 0.7 },
    { url: '/consult/online/', priority: 0.7 },
    { url: '/consult/imaging-review/', priority: 0.6 },
    { url: '/consult/second-opinion/', priority: 0.6 },
    { url: '/international-second-opinion/', priority: 0.5 },
    { url: '/about/', priority: 0.6 },
    { url: '/blog/', priority: 0.5 },
    { url: '/privacy-policy/', priority: 0.2 },
    { url: '/terms/', priority: 0.2 },
    { url: '/grievance/', priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: (route.changeFrequency as any) || 'monthly',
    priority: route.priority,
  }));
}

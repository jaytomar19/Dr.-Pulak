import React from 'react';

const defaultBaseUrl = 'https://drpulakvatsya.com';

export function generatePhysicianSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Dr. Pulak Vatsya',
    medicalSpecialty: 'Orthopaedic Surgery',
    practiceLocation: {
      '@type': 'MedicalClinic',
      name: 'StepUp Joints',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lajpat Nagar',
        addressRegion: 'New Delhi',
        addressCountry: 'IN',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      addressCountry: 'IN',
    },
    telephone: '+91-0000000000', // placeholder
    url: defaultBaseUrl,
    sameAs: [
      'https://www.linkedin.com/in/drpulakvatsya/', // placeholder
    ],
  };
}

export function generateMedicalClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'StepUp Joints',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      addressCountry: 'IN',
    },
    telephone: '+91-0000000000', // placeholder
    openingHours: 'Mo-Sa 09:00-18:00', // placeholder
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.5684', // placeholder
      longitude: '77.2435', // placeholder
    },
    url: defaultBaseUrl,
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'StepUp Joints',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      addressCountry: 'IN',
    },
    telephone: '+91-0000000000',
    openingHours: 'Mo-Sa 09:00-18:00',
    priceRange: '₹₹',
    image: `${defaultBaseUrl}/placeholder.jpg`, // placeholder
  };
}

export function generateMedicalWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'StepUp Joints',
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(title: string, description: string, url: string, datePublished: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: 'Dr. Pulak Vatsya',
    },
    publisher: {
      '@type': 'Organization',
      name: 'StepUp Joints',
    },
  };
}

export function SchemaScript({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

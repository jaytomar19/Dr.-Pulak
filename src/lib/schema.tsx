import React from 'react';
import { PRACTICE_CONFIG } from '@/config/practice';

const defaultBaseUrl = 'https://drpulakvatsya.com';

export function generatePhysicianSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: PRACTICE_CONFIG.doctorName,
    medicalSpecialty: PRACTICE_CONFIG.specialty,
    practiceLocation: {
      '@type': 'MedicalClinic',
      name: PRACTICE_CONFIG.clinicName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: PRACTICE_CONFIG.fullAddress,
        addressLocality: 'Lajpat Nagar',
        addressRegion: 'New Delhi',
        postalCode: '110024',
        addressCountry: 'IN',
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: PRACTICE_CONFIG.fullAddress,
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      postalCode: '110024',
      addressCountry: 'IN',
    },
    telephone: PRACTICE_CONFIG.phone,
    email: PRACTICE_CONFIG.email,
    url: defaultBaseUrl,
    sameAs: [
      'https://www.youtube.com/@drpulakvatsyaortho',
      'https://www.instagram.com/dr.pulakvatsya/',
    ],
  };
}

export function generateMedicalClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: PRACTICE_CONFIG.clinicName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: PRACTICE_CONFIG.fullAddress,
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      postalCode: '110024',
      addressCountry: 'IN',
    },
    telephone: PRACTICE_CONFIG.phone,
    email: PRACTICE_CONFIG.email,
    url: defaultBaseUrl,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.5684',
      longitude: '77.2435',
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: PRACTICE_CONFIG.clinicName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: PRACTICE_CONFIG.fullAddress,
      addressLocality: 'Lajpat Nagar',
      addressRegion: 'New Delhi',
      postalCode: '110024',
      addressCountry: 'IN',
    },
    telephone: PRACTICE_CONFIG.phone,
    email: PRACTICE_CONFIG.email,
    priceRange: '₹₹',
    image: `${defaultBaseUrl}/images/hero/dr-pulak-hero.jpg`,
    url: defaultBaseUrl,
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
      name: PRACTICE_CONFIG.clinicName,
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
      name: PRACTICE_CONFIG.doctorName,
    },
    publisher: {
      '@type': 'Organization',
      name: PRACTICE_CONFIG.clinicName,
    },
  };
}

export function SchemaScript({ schema }: { schema: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

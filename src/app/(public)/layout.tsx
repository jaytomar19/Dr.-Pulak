"use client";

import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StickyMobileCTA from '@/components/public/StickyMobileCTA';
import { usePathname } from 'next/navigation';
import '@/styles/public.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCampaignLanding = pathname === '/knee-check' || pathname === '/acl-check';

  if (isCampaignLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyMobileCTA primaryAction="assessment" />
    </>
  );
}

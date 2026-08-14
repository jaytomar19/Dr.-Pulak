"use client";

import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StickyMobileCTA from '@/components/public/StickyMobileCTA';
import CustomCursor from '@/components/shared/CustomCursor';
import { CursorProvider } from '@/components/shared/CursorContext';
import FloatingQuickActions from '@/components/shared/FloatingQuickActions';
import ScrollProgressBar from '@/components/shared/ScrollProgressBar';
import { usePathname } from 'next/navigation';
import '@/styles/public.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCampaignLanding = pathname === '/knee-check' || pathname === '/acl-check';

  if (isCampaignLanding) {
    return (
      <CursorProvider>
        <ScrollProgressBar />
        <CustomCursor />
        {children}
      </CursorProvider>
    );
  }

  return (
    <CursorProvider>
      <ScrollProgressBar />
      <CustomCursor />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingQuickActions />
      <StickyMobileCTA primaryAction="assessment" />
    </CursorProvider>
  );
}

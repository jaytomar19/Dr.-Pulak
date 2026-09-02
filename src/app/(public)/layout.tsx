"use client";

import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StickyMobileCTA from '@/components/public/StickyMobileCTA';
import CustomCursor from '@/components/shared/CustomCursor';
import { CursorProvider } from '@/components/shared/CursorContext';
import FloatingQuickActions from '@/components/shared/FloatingQuickActions';
import ScrollProgressBar from '@/components/shared/ScrollProgressBar';
import { AssessmentModalProvider, useAssessmentModal } from '@/context/AssessmentModalContext';
import KneeAssessmentModal from '@/components/public/KneeAssessmentModal';
import { usePathname } from 'next/navigation';
import '@/styles/public.css';

function AssessmentModalRenderer() {
  const { isAssessmentOpen, closeAssessmentModal } = useAssessmentModal();
  return <KneeAssessmentModal isOpen={isAssessmentOpen} onClose={closeAssessmentModal} />;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCampaignLanding = pathname === '/knee-check' || pathname === '/acl-check';

  if (isCampaignLanding) {
    return (
      <AssessmentModalProvider>
        <CursorProvider>
          <ScrollProgressBar />
          <CustomCursor />
          {children}
          <AssessmentModalRenderer />
        </CursorProvider>
      </AssessmentModalProvider>
    );
  }

  return (
    <AssessmentModalProvider>
      <CursorProvider>
        <ScrollProgressBar />
        <CustomCursor />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingQuickActions />
        <StickyMobileCTA primaryAction="assessment" />
        <AssessmentModalRenderer />
      </CursorProvider>
    </AssessmentModalProvider>
  );
}


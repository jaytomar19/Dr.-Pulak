import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import StickyMobileCTA from '@/components/public/StickyMobileCTA';
import '@/styles/public.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyMobileCTA primaryAction="assessment" />
    </>
  );
}

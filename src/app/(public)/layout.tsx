import '@/styles/public.css';
import React from 'react';

// Placeholder for StickyMobileCTA
function StickyMobileCTA() {
  return (
    <div className="sticky-mobile-cta">
      <a href="#book">Book Consultation</a>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container">
          <div className="logo">Dr. Pulak Vatsya</div>
          <nav>
            <a href="/">Home</a>
            <a href="/assessment">Assessment</a>
          </nav>
        </div>
      </header>
      
      <main className="public-main">
        {children}
      </main>
      
      <footer className="public-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Dr. Pulak Vatsya. All rights reserved.</p>
        </div>
      </footer>
      
      <StickyMobileCTA />
    </div>
  );
}

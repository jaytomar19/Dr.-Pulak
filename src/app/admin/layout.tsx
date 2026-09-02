'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import '@/styles/admin.css';

function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return null;
  }

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/assessments', label: 'Assessments' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/availability', label: 'Availability' },
    { href: '/admin/assessment-config', label: 'Config' },

    { href: '/admin/alerts', label: 'Alerts' },
    { href: '/admin/delivery', label: 'Delivery' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
      </div>
      <nav className="admin-nav">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="admin-main-wrapper">
        <header className="admin-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="header-right">
            <span className="user-info">
              {session?.user?.name || 'Admin'} <span className="badge badge--neutral" style={{ textTransform: 'capitalize', marginLeft: '0.5rem' }}>{session?.user?.role || 'Staff'}</span>
            </span>
            <button className="logout-btn" onClick={() => signOut()}>Logout</button>
          </div>
        </header>
        
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

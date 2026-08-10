import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--background, #f9fafb)',
      color: 'var(--foreground, #1f2937)'
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: 'bold',
        color: 'var(--primary, #0f766e)',
        marginBottom: '1rem',
        lineHeight: 1
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '1.125rem',
        color: 'var(--muted, #4b5563)',
        marginBottom: '2rem',
        maxWidth: '400px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Link 
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary, #0f766e)',
            color: 'white',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'opacity 0.2s'
          }}
        >
          Go Home
        </Link>
        <Link 
          href="/knee-check/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--primary, #0f766e)',
            border: '2px solid var(--primary, #0f766e)',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Take Free Knee Check
        </Link>
      </div>
    </div>
  );
}

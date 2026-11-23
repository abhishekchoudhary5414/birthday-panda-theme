import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      background: '#FFF9EF',
      color: '#294B35',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 12px' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 16px' }}>Page Not Found in the Bamboo Grove</h2>
      <p style={{ maxWidth: '420px', color: '#6E7E73', margin: '0 0 24px', lineHeight: 1.5 }}>
        Oops! The page you were looking for doesn&apos;t seem to exist. Let&apos;s get you back to Our birthday celebration!
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#294B35',
          color: '#ffffff',
          padding: '12px 28px',
          borderRadius: '9999px',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Return to Party
      </Link>
    </div>
  );
}

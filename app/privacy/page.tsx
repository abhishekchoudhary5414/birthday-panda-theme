import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Birthday Website Platform (JOHOVO)',
  description: 'Public Privacy Policy for JOHOVO Birthday Website Platform and Google Drive integration.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--soft-cream, #FFF9EF)' }}>
      <FloatingLeaves />
      <Navbar />

      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--deep-forest-green, #294B35)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px 36px',
            border: '1px solid #E1ECE0',
            boxShadow: '0 10px 35px rgba(41, 75, 53, 0.05)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EDF6EA', color: '#294B35', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px' }}>
            <ShieldCheck size={16} color="#789B63" />
            <span>Public Privacy Policy</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--deep-forest-green, #294B35)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#6e7e73', fontSize: '0.9rem', marginBottom: '32px' }}>
            Last Updated: November 22, 2026 &bull; JOHOVO Birthday Website Platform
          </p>

          <div style={{ color: '#334437', lineHeight: 1.7, fontSize: '0.98rem', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                1. Overview &amp; Commitment
              </h2>
              <p style={{ margin: 0 }}>
                Welcome to <strong>JOHOVO Birthday Website Platform</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;platform&rdquo;). We respect your privacy and are committed to protecting the personal information of hosts, guests, and families celebrating milestone events. This Privacy Policy explains how our service collects, uses, and safeguards your information when you use our website and connected integrations.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                2. Information We Collect
              </h2>
              <ul style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>RSVP and Guest Details:</strong> Guest names, email addresses, phone numbers, attendance status, and meal/dietary notes submitted via the RSVP form.</li>
                <li><strong>Wishes and Guestbook Messages:</strong> Messages, relationship to birthday star, and photos shared on the public Wish Wall.</li>
                <li><strong>Google Account Information:</strong> When an event host connects their Google account, we collect the host&rsquo;s email address and profile name via Google OAuth to verify identity and link storage.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                3. Google Drive Integration &amp; Limited Use Disclosure
              </h2>
              <p style={{ margin: '0 0 12px' }}>
                Our application integrates with Google Drive via the minimum necessary scope: <code>https://www.googleapis.com/auth/drive.file</code>.
              </p>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Dedicated Media Folder:</strong> We only create and access a designated folder named <em>&ldquo;Birthday Website Media&rdquo;</em> in your Google Drive.</li>
                <li><strong>No Access to Personal Files:</strong> We do NOT read, browse, scan, modify, or delete any personal files, documents, or spreadsheets outside of the files uploaded through our platform.</li>
                <li><strong>Token Security:</strong> OAuth refresh tokens are encrypted at rest using AES-256-GCM encryption and stored securely on our servers. Tokens are never exposed to browser clients or third parties.</li>
                <li><strong>Google API Services User Data Policy:</strong> Our platform&rsquo;s use and transfer of information received from Google APIs adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#294B35', fontWeight: 700 }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                4. Data Sharing &amp; Third-Party Services
              </h2>
              <p style={{ margin: 0 }}>
                We do not sell, rent, or trade your personal information. Data is only processed through trusted infrastructure providers (Neon PostgreSQL, Google Drive API) solely for the purpose of operating the birthday celebration website.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                5. Account Disconnection &amp; Data Deletion
              </h2>
              <p style={{ margin: 0 }}>
                Event organizers can disconnect Google Drive at any time from the dashboard. Upon disconnection, our system immediately revokes OAuth tokens and clears authentication data from our database. Your uploaded photos remain safely stored in your own Google Drive.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                6. Contact Us
              </h2>
              <p style={{ margin: 0 }}>
                If you have any questions or privacy concerns regarding this policy, please contact our support team at <strong style={{ color: '#294B35' }}>johovo65@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

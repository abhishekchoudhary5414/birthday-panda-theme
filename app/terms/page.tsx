import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Birthday Website Platform (JOHOVO)',
  description: 'Public Terms of Service for JOHOVO Birthday Website Platform.',
};

export default function TermsOfServicePage() {
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
            <FileText size={16} color="#789B63" />
            <span>Public Terms of Service</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--deep-forest-green, #294B35)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#6e7e73', fontSize: '0.9rem', marginBottom: '32px' }}>
            Last Updated: November 22, 2026 &bull; JOHOVO Birthday Website Platform
          </p>

          <div style={{ color: '#334437', lineHeight: 1.7, fontSize: '0.98rem', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ margin: 0 }}>
                By accessing or using the <strong>JOHOVO Birthday Website Platform</strong> (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform or connected services.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                2. Use of Service &amp; Customer Accounts
              </h2>
              <p style={{ margin: 0 }}>
                Our platform provides personalized celebration websites, digital RSVP management, interactive wish walls, live stream hubs, and cloud photo albums. Event hosts are responsible for maintaining the confidentiality of their dashboard credentials and managing guest interactions respectfully.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                3. Google Drive Integration &amp; Storage Quotas
              </h2>
              <ul style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Event hosts connect their personal or organization Google Drive account to store celebration photos and videos.</li>
                <li>Uploaded media files utilize the host&rsquo;s own Google Drive storage quota.</li>
                <li>Users retain full ownership, copyrights, and intellectual property rights over all images, videos, and content uploaded to their connected Google Drive.</li>
                <li>We do not claim any ownership of your family celebration media.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                4. Acceptable Content &amp; Conduct
              </h2>
              <p style={{ margin: 0 }}>
                Users agree not to upload, post, or transmit any content that is unlawful, harmful, defamatory, obscene, infringing, or violating third-party rights. We reserve the right to remove inappropriate guest submissions or terminate service for violations of these terms.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                5. Limitation of Liability
              </h2>
              <p style={{ margin: 0 }}>
                The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. In no event shall JOHOVO or its developers be liable for indirect, incidental, special, or consequential damages resulting from your use of the platform or Google Drive services.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#294B35', margin: '0 0 10px' }}>
                6. Contact Information
              </h2>
              <p style={{ margin: 0 }}>
                For inquiries regarding these Terms of Service, please reach out to <strong style={{ color: '#294B35' }}>johovo65@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

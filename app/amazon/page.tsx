import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { AmazonProductFetcher } from '@/components/AmazonProductFetcher';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Amazon Product & Review Fetcher • Birthday Star Birthday Store',
  description: 'Paste any Amazon product URL to extract live images, pricing, ratings, and reviews.',
};

export default function AmazonProductPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', flexDirection: 'column' }}>
      <FloatingLeaves />

      {/* Top Navbar */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Amazon Product Fetcher</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="#f59e0b" /> Live Price, Images &amp; Reviews
              </div>
            </div>
          </div>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px 20px 80px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Amazon Product Details Extractor
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Test extracting live product images, prices, star ratings, and review numbers from any Amazon URL or ASIN.
          </p>
        </div>

        <AmazonProductFetcher
          initialUrl="https://www.amazon.com/Bose-QuietComfort-Bluetooth-Headphones-Cancelling/dp/B0DZHR44J9/ref=sr_1_1?_encoding=UTF8&sr=8-1"
        />
      </div>

      <Footer />
    </main>
  );
}

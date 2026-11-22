import React from 'react';
import type { Metadata } from 'next';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { GiftRegistry } from '@/components/GiftRegistry';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

export const metadata: Metadata = {
  title: "Ditvi's 1st Birthday Gift Registry | Wishlist & Keepsakes",
  description: "Browse all curated gift wishlist ideas and keepsakes for Ditvi's 1st birthday celebration.",
};

export default function GiftPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FFFFFF', position: 'relative' }}>
      {/* Floating bamboo leaves particle background */}
      <FloatingLeaves />

      {/* Navigation */}
      <Navbar />

      <div style={{ paddingTop: '100px' }}>
        {/* Full Gift Registry with all products */}
        <GiftRegistry />
      </div>

      {/* Footer & Audio Player */}
      <Footer />
      <MusicPlayer />
    </main>
  );
}

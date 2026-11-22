import React from 'react';
import type { Metadata } from 'next';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { Gallery } from '@/components/Gallery';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

export const metadata: Metadata = {
  title: "Ditvi's Birthday Photo & Video Gallery | Panda Celebration",
  description: "Browse all precious photo and video memories from Ditvi's 1st birthday celebration.",
};

export default function GalleryPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FFFFFF', position: 'relative' }}>
      {/* Floating bamboo leaves particle background */}
      <FloatingLeaves />

      {/* Navigation */}
      <Navbar />

      <div style={{ paddingTop: '100px' }}>
        {/* Full Gallery Section */}
        <Gallery />
      </div>

      {/* Footer & Audio Player */}
      <Footer />
      <MusicPlayer />
    </main>
  );
}

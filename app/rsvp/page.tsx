import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

export const metadata: Metadata = {
  title: "RSVP • Ditvi's 1st Birthday Celebration",
  description: "Confirm your presence for Ditvi's 1st Birthday Party in the Bamboo Grove.",
};

export default function RsvpPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FloatingLeaves />
      <Navbar />
      <div style={{ flex: 1, paddingTop: '40px', paddingBottom: '60px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#294B35' }}>Loading RSVP...</div>}>
          <RSVP />
        </Suspense>
      </div>
      <Footer />
      <MusicPlayer />
    </main>
  );
}

import styles from './page.module.css';
import React from 'react';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Timeline } from '@/components/Timeline';
import { Gallery } from '@/components/Gallery';
import { RSVP } from '@/components/RSVP';
import { GiftRegistry } from '@/components/GiftRegistry';
import { Games } from '@/components/Games';
import { FortuneJar } from '@/components/FortuneJar';
import { WishWall } from '@/components/WishWall';
import { LiveStreaming } from '@/components/LiveStreaming';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

export default function HomePage() {
  return (
    <main className={styles['panda-birthday-app']}>
      {/* Gentle Floating Bamboo Leaves Particle Ambient Layer */}
      <FloatingLeaves />

      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Hero Welcome Section */}
      <Hero />

      {/* About Birthday Star Section */}
      <About />

      {/* 5 Milestone Moments Timeline */}
      <Timeline />

      {/* Photo & Video Gallery with Lightbox */}
      <Gallery />

      {/* Invitation & Interactive RSVP Form */}
      <RSVP />

      {/* Curated Gift Registry Section */}
      <GiftRegistry />

      {/* 4 Playable Interactive Games (Memory Match, Bamboo Catch, Quiz, Find Panda) */}
      <Games />

      {/* Interactive Bamboo Fortune Jar */}
      <FortuneJar />

      {/* Digital Birthday Wish Wall */}
      <WishWall />

      {/* Virtual Live Streaming Section */}
      <LiveStreaming />

      {/* Contact & Venue Location Section with Map */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Floating Panda Music Player */}
      <MusicPlayer />
    </main>
  );
}

'use client';

import styles from './page.module.css';
import React, { useState, useEffect } from 'react';
import { BirthdayPageLoader } from '@/components/BirthdayPageLoader';
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
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { LiveStreamModal } from '@/components/LiveStreamModal';

export default function HomePage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [childName, setChildName] = useState('Birthday Star');

  useEffect(() => {
    let isMounted = true;

    // Check database settings & photos content readiness
    const loadInitialData = async () => {
      try {
        const [eventRes, photosRes] = await Promise.all([
          fetch('/api/event').then((r) => r.json()).catch(() => null),
          fetch('/api/photos').then((r) => r.json()).catch(() => null),
        ]);

        if (!isMounted) return;

        if (eventRes?.event?.childName) {
          setChildName(eventRes.event.childName);
        }

        // If there's a child photo, pre-load the image so it's fully cached in browser before loader fades
        const childPhotoUrl = eventRes?.event?.childPhotoUrl || 
          photosRes?.photos?.find((p: any) => p.targetSection === 'child_photo')?.proxyUrl ||
          photosRes?.photos?.find((p: any) => p.targetSection === 'child_photo')?.directUrl;

        if (childPhotoUrl) {
          const img = new Image();
          img.src = childPhotoUrl;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            // Max 2.5s wait for image to avoid stalling on slow networks
            setTimeout(resolve, 2500);
          });
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      } finally {
        if (isMounted) {
          // Small delay for smooth entry experience
          setTimeout(() => {
            setIsDataLoaded(true);
          }, 350);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles['panda-birthday-app']}>
      {/* Festive Birthday Animation Loader (Floating Balloon Panda & Bamboo Progress) */}
      <BirthdayPageLoader childName={childName} isReady={isDataLoaded} />

      {/* Gentle Floating Bamboo Leaves Particle Ambient Layer */}
      <FloatingLeaves />

      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Live Stream Popup if today is the birthday celebration date */}
      <LiveStreamModal />

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

      {/* Curated Gift Registry Section - Showing 4 items with Show More link */}
      <GiftRegistry limit={4} showAllLink={true} />

      {/* 4 Playable Interactive Games (Memory Match, Bamboo Catch, Quiz, Find Panda) */}
      <Games />

      {/* Interactive Bamboo Fortune Jar */}
      <FortuneJar />

      {/* Digital Birthday Wish Wall */}
      <WishWall />

      {/* Contact & Venue Location Section with Map */}
      <Contact />

      {/* Footer */}
      <Footer />

      {/* Floating Panda Music Player */}
      <MusicPlayer />
    </main>
  );
}

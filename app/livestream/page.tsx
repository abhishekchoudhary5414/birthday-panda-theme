'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import styles from './livestream.module.css';
import {
  Radio,
  Clock,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle,
  Calendar,
  Gift,
  Heart,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';

export default function LiveStreamPage() {
  const [streamState, setStreamState] = useState<'standby' | 'live' | 'ended'>('standby');
  const [isPlayingPlaceholder, setIsPlayingPlaceholder] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [eventData, setEventData] = useState({
    childName: 'Birthday Star',
    eventDate: 'Saturday, December 12, 2026',
    eventTime: '4:00 PM CST',
  });

  // Default placeholder stream (Giant Panda live cam / celebration stream)
  const youtubeEmbedUrl = 'https://www.youtube-nocookie.com/embed/3szkFHfr6Cg?autoplay=1';

  useEffect(() => {
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data?.event) {
          setEventData({
            childName: data.event.childName || 'Birthday Star',
            eventDate: data.event.eventDate || 'Saturday, December 12, 2026',
            eventTime: data.event.eventTime || '4:00 PM CST',
          });
        }
      })
      .catch((err) => console.error('Fetch event details error:', err));
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className={styles.livestreamPageWrapper}>
      <FloatingLeaves />
      <Navbar />

      <main className={styles.livestreamMain}>
        {/* Top Header Badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.badgePill}>
            <Radio size={16} color="#E53935" className={streamState === 'live' ? 'animate-pulse' : ''} />
            <span>Virtual Panda Celebration &bull; Live From Austin</span>
          </div>
        </div>

        <h1 className={styles.pageTitle}>
          {eventData.childName}&apos;s Birthday Live Stream
        </h1>
        <p className={styles.pageSubtitle}>
          Can&apos;t make it to Austin in person? Watch the cake cutting, celebration songs, and magical smiles live from anywhere around the globe!
        </p>

        {/* Stream & Details Grid */}
        <div className={styles.streamGrid}>
          {/* Main Video Stream Card */}
          <div className={styles.videoCard}>
            {/* Status Bar */}
            <div className={styles.statusBar}>
              <div className={styles.statusIndicator}>
                <span className={`${styles.statusDot} ${styles[streamState]}`} />
                <span className={styles.statusText}>
                  {streamState === 'standby' && `Stream Scheduled • ${eventData.eventDate} @ ${eventData.eventTime}`}
                  {streamState === 'live' && `LIVE NOW • ${eventData.childName}'s 1st Birthday Celebration`}
                  {streamState === 'ended' && 'Broadcast Concluded • Replay Available Below'}
                </span>
              </div>

              {/* Mode switch for interactive demo */}
              <div className={styles.modeToggles}>
                <span className={styles.modeToggleLabel}>Status:</span>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${streamState === 'standby' ? styles.active : ''}`}
                  onClick={() => {
                    setStreamState('standby');
                    setIsPlayingPlaceholder(false);
                  }}
                >
                  Standby
                </button>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${streamState === 'live' ? styles.active : ''}`}
                  onClick={() => {
                    setStreamState('live');
                    setIsPlayingPlaceholder(true);
                  }}
                >
                  Go Live
                </button>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${streamState === 'ended' ? styles.active : ''}`}
                  onClick={() => setStreamState('ended')}
                >
                  Ended
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className={styles.videoContainer}>
              {streamState === 'live' || isPlayingPlaceholder ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${eventData.childName}'s Birthday Celebration Stream`}
                  className={styles.videoIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : streamState === 'standby' ? (
                <div className={styles.standbyScreen}>
                  <div className={styles.standbyContent}>
                    <div className={styles.standbyIcon}>🐼🎂</div>
                    <h3 className={styles.standbyTitle}>Live Broadcast Starting Soon!</h3>
                    <p className={styles.standbyDesc}>
                      The celebration will stream live on <strong>{eventData.eventDate}</strong> at <strong>{eventData.eventTime}</strong> with {eventData.childName}&apos;s grand entrance, musical bamboo games, and cake smashing!
                    </p>

                    <div className={styles.timePill}>
                      <Clock size={16} />
                      <span>Starts: {eventData.eventDate} ({eventData.eventTime})</span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setStreamState('live');
                          setIsPlayingPlaceholder(true);
                        }}
                        className={styles.playLiveBtn}
                      >
                        <Play size={18} fill="#FFFFFF" />
                        <span>Preview Live Feed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.endedScreen}>
                  <div className={styles.standbyContent}>
                    <CheckCircle size={54} color="#789B63" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <h3 className={styles.standbyTitle}>Thank You For Joining!</h3>
                    <p className={styles.standbyDesc}>
                      {eventData.childName}&apos;s birthday live broadcast has concluded. High-resolution photos and memorable clips are available in the photos album!
                    </p>
                    <Link
                      href="/photos"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#789B63',
                        color: '#FFFFFF',
                        padding: '10px 22px',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                      }}
                    >
                      <ImageIcon size={16} />
                      <span>View Celebration Photos</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Video Footer Info */}
            <div className={styles.videoBottomBar}>
              <div className={styles.bottomTip}>
                <Sparkles size={16} color="#D9B66F" />
                <span>
                  Tip: Share your blessings on the <strong>Wish Wall</strong> while streaming!
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#EDF6EA',
                    border: '1px solid #D5E5D1',
                    color: '#294B35',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  <Share2 size={14} />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Stream'}</span>
                </button>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.youtubeLink}
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className={styles.sidebar}>
            {/* Celebration Schedule Card */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarIconCircle}>
                  <Calendar size={18} />
                </div>
                <h2 className={styles.sidebarTitle}>Broadcast Program</h2>
              </div>

              <ul className={styles.scheduleList}>
                <li className={styles.scheduleItem}>
                  <span className={styles.scheduleTime}>4:00 PM</span>
                  <div className={styles.scheduleDetails}>
                    <p className={styles.scheduleName}>Grand Panda Entrance</p>
                    <p className={styles.scheduleDesc}>Welcoming {eventData.childName} and guests to the party</p>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <span className={styles.scheduleTime}>4:45 PM</span>
                  <div className={styles.scheduleDetails}>
                    <p className={styles.scheduleName}>Bamboo Games &amp; Fun</p>
                    <p className={styles.scheduleDesc}>Music, nursery rhymes, and kids performances</p>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <span className={styles.scheduleTime}>5:30 PM</span>
                  <div className={styles.scheduleDetails}>
                    <p className={styles.scheduleName}>Cake Cutting Ceremony</p>
                    <p className={styles.scheduleDesc}>Singing Happy Birthday &amp; smash cake fun</p>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <span className={styles.scheduleTime}>6:15 PM</span>
                  <div className={styles.scheduleDetails}>
                    <p className={styles.scheduleName}>Wishes &amp; Group Cheers</p>
                    <p className={styles.scheduleDesc}>Sharing blessings with family &amp; friends online</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarIconCircle}>
                  <Sparkles size={18} />
                </div>
                <h2 className={styles.sidebarTitle}>Party Quick Links</h2>
              </div>

              <div className={styles.quickActionsGrid}>
                <Link href="/#wishes" className={styles.quickActionBtn}>
                  <Heart size={20} color="#e53935" />
                  <span className={styles.quickActionLabel}>Send a Wish</span>
                </Link>

                <Link href="/gift" className={styles.quickActionBtn}>
                  <Gift size={20} color="#789b63" />
                  <span className={styles.quickActionLabel}>Gift Registry</span>
                </Link>

                <Link href="/photos" className={styles.quickActionBtn}>
                  <ImageIcon size={20} color="#294b35" />
                  <span className={styles.quickActionLabel}>Photo Gallery</span>
                </Link>

                <Link href="/#games" className={styles.quickActionBtn}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>🎮</span>
                  <span className={styles.quickActionLabel}>Play Games</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

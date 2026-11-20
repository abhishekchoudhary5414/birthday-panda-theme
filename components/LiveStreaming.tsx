'use client';

import styles from './LiveStreaming.module.css';


import React, { useState } from 'react';
import { Video, Radio, Clock, Sparkles, ExternalLink, Play, CheckCircle } from 'lucide-react';

export const LiveStreaming: React.FC = () => {
  const [streamState, setStreamState] = useState<'standby' | 'live' | 'ended'>('standby');
  const [isPlayingPlaceholder, setIsPlayingPlaceholder] = useState<boolean>(false);

  // Default placeholder stream (Giant Panda live cam / celebration stream)
  const youtubeEmbedUrl = 'https://www.youtube-nocookie.com/embed/3szkFHfr6Cg?autoplay=1';

  return (
    <section id="stream" className={`section-wrapper ${styles['stream-section'] || 'stream-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Radio size={16} className={styles['pulsing-radio']} />
            <span>Virtual Celebration</span>
          </div>
          <h2 className="section-title">Birthday Live Stream</h2>
          <p className="section-subtitle">
            Can&apos;t make it to Austin in person? Join Liam&apos;s cake cutting and birthday songs from anywhere across the globe!
          </p>
        </div>

        <div className={`${styles['stream-card-wrapper'] || 'stream-card-wrapper'} card-bamboo`}>
          {/* Stream Status Bar */}
          <div className={styles['stream-status-bar']}>
            <div className={styles['status-indicator-group']}>
              <span className={`${styles['status-dot'] || 'status-dot'} ${streamState}`} />
              <span className={styles['status-label']}>
                {streamState === 'standby' && 'Stream Scheduled &bull; Saturday Dec 12 @ 4:00 PM CST'}
                {streamState === 'live' && 'LIVE NOW &bull; Liam’s 1st Birthday Celebration'}
                {streamState === 'ended' && 'Broadcast Ended &bull; Replay Available'}
              </span>
            </div>

            {/* Simulated Stream Mode Switcher for demo */}
            <div className={styles['stream-mode-toggle']}>
              <span className={styles['demo-toggle-label']}>Demo Status:</span>
              <button
                type="button"
                className={`${styles['toggle-chip'] || 'toggle-chip'} ${styles['standby'] || 'standby'} ${styles['active'] || 'active'}`}
                onClick={() => {
                  setStreamState('standby');
                  setIsPlayingPlaceholder(false);
                }}
              >
                Standby
              </button>
              <button
                type="button"
                className={`${styles['toggle-chip'] || 'toggle-chip'} ${styles['live'] || 'live'} ${styles['active'] || 'active'}`}
                onClick={() => {
                  setStreamState('live');
                  setIsPlayingPlaceholder(true);
                }}
              >
                Go Live
              </button>
              <button
                type="button"
                className={`${styles['toggle-chip'] || 'toggle-chip'} ${styles['ended'] || 'ended'} ${styles['active'] || 'active'}`}
                onClick={() => setStreamState('ended')}
              >
                Concluded
              </button>
            </div>
          </div>

          {/* Main Video Frame */}
          <div className={styles['video-player-container']}>
            {streamState === 'live' || isPlayingPlaceholder ? (
              <iframe
                src={youtubeEmbedUrl}
                title="Liam’s Birthday Celebration Stream"
                className={styles['stream-iframe']}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : streamState === 'standby' ? (
              <div className={styles['stream-placeholder-screen']}>
                <div className={styles['placeholder-content']}>
                  <div className={styles['placeholder-panda-icon']}>🐼</div>
                  <h3 className={styles['placeholder-title']}>Live Broadcast Starting Soon!</h3>
                  <p className={styles['placeholder-text']}>
                    The ceremony will begin Saturday, December 12 at <strong>4:00 PM CST</strong> with Liam&apos;s big entrance, musical games, and bamboo cake smashing!
                  </p>

                  <div className={styles['placeholder-time-pill']}>
                    <Clock size={16} />
                    <span>Countdown: Dec 12, 4:00 PM CST</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStreamState('live');
                      setIsPlayingPlaceholder(true);
                    }}
                    className={`btn-primary ${styles['mt-3'] || 'mt-3'}`}
                  >
                    <Play size={18} fill="#FFFFFF" />
                    <span>Preview Live Stream Feed</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${styles['stream-placeholder-screen'] || 'stream-placeholder-screen'} ${styles['ended'] || 'ended'}`}>
                <div className={styles['placeholder-content']}>
                  <CheckCircle size={48} color="var(--bamboo-green)" />
                  <h3 className={styles['placeholder-title']}>Thank You For Watching!</h3>
                  <p className={styles['placeholder-text']}>
                    Liam&apos;s 1st Birthday live stream has concluded. Full recorded highlights and ceremony photos are saved in the gallery above!
                  </p>
                  <a href="#gallery" className={`btn-secondary ${styles['mt-2'] || 'mt-2'}`}>
                    Browse Gallery Highlights
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Stream Footer Notes */}
          <div className={styles['stream-footer-info']}>
            <div className={styles['footer-tip']}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span>
                Tip: Leave a warm message on the <strong>Wish Wall</strong> while enjoying the stream!
              </span>
            </div>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['open-youtube-link']}
            >
              <span>Watch on YouTube</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import styles from './About.module.css';
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Smile, Star, Footprints, Music } from 'lucide-react';
import { WavingPanda, PeekingPanda } from './PandaIllustrations';

export const About: React.FC = () => {
  const [childName, setChildName] = useState<string>('Birthday Star');
  const [childPhotoUrl, setChildPhotoUrl] = useState<string>('');

  useEffect(() => {
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data?.event?.childName) {
          setChildName(data.event.childName);
        }
        if (data?.event?.childPhotoUrl) {
          setChildPhotoUrl(data.event.childPhotoUrl);
        }
      })
      .catch((err) => console.error('Failed to load event data in About:', err));
  }, []);

  return (
    <section id="about" className={`section-wrapper ${styles['about-section'] || 'about-section'}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Meet the Birthday Star</span>
          </div>
          <h2 className="section-title">Our Little Panda Cub {childName}</h2>
          <p className="section-subtitle">
            365 days of endless cuddles, cheerful giggles, bamboo toy stacks, and pure unconditional joy.
          </p>
        </div>

        {/* Main Grid */}
        <div className={styles['about-grid']}>
          {/* Left Column: Portrait & Fun Stats */}
          <div className={styles['about-portrait-card']}>
            <div className={styles['peeking-panda-wrapper']}>
              <PeekingPanda size={120} />
            </div>

            <div className={styles['portrait-frame']}>
              {childPhotoUrl ? (
                <img
                  src={childPhotoUrl}
                  alt={`${childName} laughing with panda toys`}
                  className={styles['portrait-image']}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle, #f4f8f1 0%, #e2eedb 100%)',
                  padding: '24px'
                }}>
                  <WavingPanda size={160} />
                  <span style={{
                    marginTop: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#294b35',
                    background: 'rgba(255,255,255,0.85)',
                    padding: '4px 14px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {childName}&apos;s First Year
                  </span>
                </div>
              )}
              <div className={styles['portrait-badge']}>
                <Heart size={16} fill="var(--blush-pink)" color="var(--blush-pink)" />
                <span>One Year of Magic</span>
              </div>
            </div>

            {/* Quick Favorites Badges */}
            <div className={styles['fun-stats-grid']}>
              <div className={styles['fun-stat-box']}>
                <Smile className={styles['stat-icon']} size={20} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-val']}>Favorite Food</span>
                  <span className={styles['stat-desc']}>Sweet Potato &amp; Avocado Mash</span>
                </div>
              </div>

              <div className={styles['fun-stat-box']}>
                <Star className={styles['stat-icon']} size={20} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-val']}>Favorite Game</span>
                  <span className={styles['stat-desc']}>Peek-a-Boo Behind Bamboo Pillows</span>
                </div>
              </div>

              <div className={styles['fun-stat-box']}>
                <Footprints className={styles['stat-icon']} size={20} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-val']}>Super Power</span>
                  <span className={styles['stat-desc']}>Speed Crawling &amp; 4 Cute Teeth!</span>
                </div>
              </div>

              <div className={styles['fun-stat-box']}>
                <Music className={styles['stat-icon']} size={20} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-val']}>Favorite Lullaby</span>
                  <span className={styles['stat-desc']}>Twinkle Little Panda Star</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Birthday Star Story & Parents' Message */}
          <div className={styles['about-story-col']}>
            <div className={`card-bamboo ${styles['story-card'] || 'story-card'}`}>
              <h3 className={styles['story-title']}>
                Growing Up in Our Cozy Bamboo Grove 🌿
              </h3>
              <p className={styles['story-paragraph']}>
                From the moment {childName} opened bright curious eyes, our entire world transformed into a wondrous playground. Our little star has the sweetest contagious laugh, loves soft panda plushies more than anything, and waves enthusiastically at everyone.
              </p>
              <p className={styles['story-paragraph']}>
                Whether discovering how to roll, stacking bamboo-colored rings, or tasting yummy treats with messy panda-level enthusiasm, {childName} turns ordinary moments into heartwarming adventures.
              </p>

              {/* Parents' Section */}
              <div className={styles['parents-note-box']}>
                <div className={styles['parents-avatar-group']}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#eef5ea',
                    border: '2px solid #789b63',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    boxShadow: '0 4px 10px rgba(41, 75, 53, 0.12)'
                  }}>
                    👨‍👩‍👧
                  </div>
                </div>
                <div className={styles['parents-text']}>
                  <h4 className={styles['parents-label']}>A Letter From Parents</h4>
                  <p className={styles['parents-quote']}>
                    &ldquo;{childName}, you are our greatest blessing, our joyful little bear cub, and the brightest sunshine in our home. Thank you for filling this first year with infinite laughter and pure warmth. We love you always.&rdquo;
                  </p>
                  <span className={styles['parents-signature']}>&mdash; With Forever Love, Mommy &amp; Daddy</span>
                </div>
              </div>
            </div>

            {/* Waving Panda Deco */}
            <div className={styles['about-deco-panda']}>
              <WavingPanda size={140} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

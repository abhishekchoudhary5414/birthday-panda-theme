'use client';

import styles from './About.module.css';


import React from 'react';
import { Heart, Sparkles, Smile, Star, Footprints, Music } from 'lucide-react';
import { WavingPanda, PeekingPanda } from './PandaIllustrations';

export const About: React.FC = () => {
  return (
    <section id="about" className={`section-wrapper ${styles['about-section'] || 'about-section'}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Meet the Birthday Star</span>
          </div>
          <h2 className="section-title">Our Little Panda Cub Liam</h2>
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
              <img
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                alt="Liam laughing with his panda toy"
                className={styles['portrait-image']}
              />
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

          {/* Right Column: Liam's Story & Parents' Message */}
          <div className={styles['about-story-col']}>
            <div className={`card-bamboo ${styles['story-card'] || 'story-card'}`}>
              <h3 className={styles['story-title']}>
                Growing Up in Our Cozy Bamboo Grove 🌿
              </h3>
              <p className={styles['story-paragraph']}>
                From the moment Liam opened his bright curious eyes, our entire world transformed into a wondrous playground. He has the sweetest contagious laugh, loves soft panda plushies more than anything, and waves enthusiastically at everyone he meets.
              </p>
              <p className={styles['story-paragraph']}>
                Whether he is discovering how to roll, stacking bamboo-colored rings, or tasting mashed banana with messy panda-level enthusiasm, Liam turns ordinary moments into heartwarming adventures.
              </p>

              {/* Parents' Section */}
              <div className={styles['parents-note-box']}>
                <div className={styles['parents-avatar-group']}>
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
                    alt="Daddy Eric"
                    className={styles['parent-img']}
                    title="Daddy Eric"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Mommy Sarah"
                    className={`${styles['parent-img'] || 'parent-img'} ${styles['overlap'] || 'overlap'}`}
                    title="Mommy Sarah"
                  />
                </div>
                <div className={styles['parents-text']}>
                  <h4 className={styles['parents-label']}>A Letter From Mommy &amp; Daddy</h4>
                  <p className={styles['parents-quote']}>
                    &ldquo;Liam, you are our greatest blessing, our joyful little bear cub, and the brightest sunshine in our home. Thank you for filling this first year with infinite laughter and pure warmth. We love you always.&rdquo;
                  </p>
                  <span className={styles['parents-signature']}>&mdash; Sarah &amp; Eric Chen</span>
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

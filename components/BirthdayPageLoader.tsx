'use client';

import React from 'react';
import styles from './BirthdayPageLoader.module.css';
import { FloatingPandaWithBalloons } from './PandaIllustrations';

interface BirthdayPageLoaderProps {
  childName?: string;
  isReady: boolean;
}

export const BirthdayPageLoader: React.FC<BirthdayPageLoaderProps> = ({
  childName = 'Birthday Star',
  isReady,
}) => {
  return (
    <div
      className={`${styles.pageLoaderOverlay} ${isReady ? styles.fadeOut : ''}`}
      aria-hidden={isReady}
    >
      {/* Background Animated Floating Balloons */}
      <div className={styles.balloonCluster}>
        <div className={`${styles.bgBalloon} ${styles.balloon1}`} />
        <div className={`${styles.bgBalloon} ${styles.balloon2}`} />
        <div className={`${styles.bgBalloon} ${styles.balloon3}`} />
        <div className={`${styles.bgBalloon} ${styles.balloon4}`} />
      </div>

      <div className={styles.loaderContent}>
        {/* Floating Balloon Panda Centerpiece */}
        <div className={styles.pandaContainer}>
          <div className={styles.pandaShadow} />
          <FloatingPandaWithBalloons size={190} />
          
          {/* Twinkling Confetti Dots */}
          <div className={styles.sparkleRing}>
            <span className={`${styles.sparkleDot} ${styles.dot1}`} />
            <span className={`${styles.sparkleDot} ${styles.dot2}`} />
            <span className={`${styles.sparkleDot} ${styles.dot3}`} />
            <span className={`${styles.sparkleDot} ${styles.dot4}`} />
          </div>
        </div>

        {/* Text Group */}
        <div className={styles.loaderTitleGroup}>
          <div className={styles.partyBadge}>
            <span>🎋 1st Birthday Celebration</span>
          </div>
          <h2 className={styles.loaderTitle}>
            Loading For Birthday Celebration
          </h2>
          <p className={styles.loaderSubtitle}>
            Gathering bamboo treats, photo albums, and joyous smiles
          </p>
        </div>

        {/* Bamboo Progress Slide */}
        <div className={styles.progressTrack} role="progressbar" aria-label="Loading party celebration">
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

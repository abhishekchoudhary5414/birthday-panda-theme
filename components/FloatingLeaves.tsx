'use client';

import styles from './FloatingLeaves.module.css';


import React, { useEffect, useState } from 'react';
import { BambooStalkDecoration, PartyPanda } from './PandaIllustrations';

interface Leaf {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayDelay: number;
  rotation: number;
  opacity: number;
}

interface PawDecoration {
  id: number;
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
  pulseDelay: number;
}

const PawPrint: React.FC<{ className: string; style: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 64 58" fill="currentColor">
    {/* Main pad */}
    <ellipse cx="32" cy="40" rx="19" ry="14" />
    {/* Toe pads */}
    <ellipse cx="9" cy="22" rx="7" ry="9" transform="rotate(-24 9 22)" />
    <ellipse cx="23" cy="11" rx="7" ry="9" transform="rotate(-8 23 11)" />
    <ellipse cx="41" cy="11" rx="7" ry="9" transform="rotate(8 41 11)" />
    <ellipse cx="55" cy="22" rx="7" ry="9" transform="rotate(24 55 22)" />
  </svg>
);

export const FloatingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [paws, setPaws] = useState<PawDecoration[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Generate gentle bamboo leaf particles (12 particles is plenty for soft ambient feel and smooth 60fps)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const leafCount = isMobile ? 8 : 14;
    const generated: Leaf[] = Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      left: Math.random() * 95,
      size: 16 + Math.random() * 18,
      duration: 14 + Math.random() * 12,
      delay: Math.random() * 8,
      swayDelay: Math.random() * 3,
      rotation: Math.random() * 360,
      opacity: 0.35 + Math.random() * 0.45,
    }));
    setLeaves(generated);

    // Decorative panda paw prints wandering across background (subtle and lightweight)
    const pawPositions = isMobile 
      ? [
          { left: 4, top: 18, size: 24, rotation: 30 },
          { left: 88, top: 35, size: 24, rotation: -25 },
          { left: 8, top: 65, size: 26, rotation: 35 },
          { left: 86, top: 85, size: 24, rotation: -20 },
        ]
      : [
          { left: 3, top: 12, size: 28, rotation: 25 },
          { left: 91, top: 15, size: 30, rotation: -20 },
          { left: 12, top: 38, size: 32, rotation: 15 },
          { left: 84, top: 42, size: 26, rotation: -15 },
          { left: 5, top: 68, size: 34, rotation: 40 },
          { left: 90, top: 72, size: 30, rotation: -25 },
        ];

    setPaws(
      pawPositions.map((pos, id) => ({
        id,
        left: pos.left,
        top: pos.top,
        size: pos.size,
        rotation: pos.rotation,
        opacity: 0.14 + (id % 3) * 0.04,
        pulseDelay: (id * 0.8) % 4,
      }))
    );
  }, []);

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className={styles['leaves-toggle']}
        title="Enable Falling Leaves"
        aria-label="Enable falling leaves animation"
      >
        🍃
      </button>
    );
  }

  return (
    <>
      <div className={styles['ambient-background']} aria-hidden="true">
        <div className={`${styles['ambient-bamboo'] || 'ambient-bamboo'} ${styles['ambient-bamboo-left'] || 'ambient-bamboo-left'}`}>
          <BambooStalkDecoration height={520} />
        </div>
        <div className={`${styles['ambient-bamboo'] || 'ambient-bamboo'} ${styles['ambient-bamboo-right'] || 'ambient-bamboo-right'}`}>
          <BambooStalkDecoration height={460} />
        </div>
        <div className={`${styles['ambient-panda'] || 'ambient-panda'} ${styles['ambient-panda-top'] || 'ambient-panda-top'}`}>
          <PartyPanda size={110} />
        </div>
        <div className={`${styles['ambient-panda'] || 'ambient-panda'} ${styles['ambient-panda-bottom'] || 'ambient-panda-bottom'}`}>
          <PartyPanda size={130} />
        </div>
        <div className={`${styles['ambient-panda'] || 'ambient-panda'} ${styles['ambient-panda-mid-left'] || 'ambient-panda-mid-left'}`}>
          <PartyPanda size={100} />
        </div>
        <div className={`${styles['ambient-panda'] || 'ambient-panda'} ${styles['ambient-panda-mid-right'] || 'ambient-panda-mid-right'}`}>
          <PartyPanda size={90} />
        </div>
        {paws.map((paw) => (
          <PawPrint
            key={paw.id}
            className={styles['ambient-paw']}
            style={{
              left: `${paw.left}%`,
              top: `${paw.top}%`,
              width: `${paw.size}px`,
              opacity: paw.opacity,
              transform: `rotate(${paw.rotation}deg)`,
              animationDelay: `${paw.pulseDelay}s`,
            }}
          />
        ))}
      </div>
      <div className={styles['floating-leaves-container']} aria-hidden="true">
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <linearGradient id="sharedLeafGrad" x1="0" y1="0" x2="24" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A3C58E" />
              <stop offset="1" stopColor="#5D8049" />
            </linearGradient>
          </defs>
        </svg>
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className={styles['floating-leaf-item']}
            style={{
              left: `${leaf.left}%`,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              opacity: leaf.opacity,
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size * 1.6}
              viewBox="0 0 24 38"
              fill="none"
              style={{
                transform: `rotate(${leaf.rotation}deg)`,
                animation: `gentleSway 3s ease-in-out infinite alternate ${leaf.swayDelay}s`,
              }}
            >
              <path
                d="M12 0 C1 12 1 26 12 38 C23 26 23 12 12 0 Z"
                fill="url(#sharedLeafGrad)"
              />
              <path
                d="M12 2 L12 36"
                stroke="#5D8049"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
};

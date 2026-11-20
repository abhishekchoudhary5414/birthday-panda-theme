'use client';

import styles from './FortuneJar.module.css';


import React, { useState } from 'react';
import { Sparkles, RotateCcw, Share2, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Fortune {
  id: number;
  text: string;
  theme: string;
  emoji: string;
}

const fortunesList: Fortune[] = [
  {
    id: 1,
    text: 'A magical day full of happiness and laughter is waiting for you!',
    theme: 'Joy & Wonder',
    emoji: '✨',
  },
  {
    id: 2,
    text: 'You are as special, adorable, and treasured as our little panda cub!',
    theme: 'Warmth',
    emoji: '🐼',
  },
  {
    id: 3,
    text: 'May your life always be filled with bamboo-sized happiness and towering success!',
    theme: 'Prosperity',
    emoji: '🎋',
  },
  {
    id: 4,
    text: 'A sweet, joyful surprise is quietly making its way towards your path today!',
    theme: 'Good Tidings',
    emoji: '🎁',
  },
  {
    id: 5,
    text: 'Keep smiling and spreading happiness — your warmth brightens every room you enter!',
    theme: 'Sunshine',
    emoji: '☀️',
  },
  {
    id: 6,
    text: 'Great things grow steadily from tiny beginnings, just like a bamboo shoot in the spring!',
    theme: 'Growth',
    emoji: '🌱',
  },
  {
    id: 7,
    text: 'An abundance of laughter, sweet cake, and memorable adventures awaits you this year!',
    theme: 'Celebration',
    emoji: '🎂',
  },
  {
    id: 8,
    text: 'Your kind heart is a lucky charm for everyone around you. Cherish today!',
    theme: 'Blessing',
    emoji: '💚',
  },
];

export const FortuneJar: React.FC = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [revealedFortune, setRevealedFortune] = useState<Fortune | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePickFortune = () => {
    if (isShaking) return;
    setIsShaking(true);
    setRevealedFortune(null);
    setCopied(false);

    // Shake animation for 1.2s then reveal
    setTimeout(() => {
      setIsShaking(false);
      const randomIndex = Math.floor(Math.random() * fortunesList.length);
      const chosen = fortunesList[randomIndex];
      setRevealedFortune(chosen);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D9B66F', '#789B63', '#FFF9EF', '#FFB8B8'],
      });
    }, 1200);
  };

  const handleCopy = () => {
    if (!revealedFortune || typeof window === 'undefined') return;
    const text = `"${revealedFortune.text}" — Liam's Panda Birthday Fortune 🎋`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="fortune" className={`section-wrapper ${styles['fortune-section'] || 'fortune-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Interactive Panda Blessing</span>
          </div>
          <h2 className="section-title">The Bamboo Fortune Jar</h2>
          <p className="section-subtitle">
            Draw a bamboo fortune stick from Liam&apos;s magical jar to reveal an uplifting birthday blessing or wisdom for your day!
          </p>
        </div>

        <div className={styles['fortune-container']}>
          {/* Animated Bamboo Fortune Jar */}
          <div className={`${styles['fortune-jar-visual'] || 'fortune-jar-visual'} ${isShaking ? (styles['shaking'] || 'shaking') : ''}`}>
            {/* Fortune Sticks sticking out of the jar */}
            <div className={styles['fortune-sticks-bundle']}>
              <div className={`${styles['stick'] || 'stick'} ${styles['s-1'] || 's-1'}`} />
              <div className={`${styles['stick'] || 'stick'} ${styles['s-2'] || 's-2'}`} />
              <div className={`${styles['stick'] || 'stick'} ${styles['s-3'] || 's-3'} ${styles['active-draw'] || 'active-draw'}`} />
              <div className={`${styles['stick'] || 'stick'} ${styles['s-4'] || 's-4'}`} />
              <div className={`${styles['stick'] || 'stick'} ${styles['s-5'] || 's-5'}`} />
            </div>

            {/* Bamboo Cylinder Pot */}
            <div className={styles['bamboo-cylinder']}>
              <div className={styles['bamboo-rim']} />
              <div className={`${styles['bamboo-knot'] || 'bamboo-knot'} ${styles['k-1'] || 'k-1'}`} />
              <div className={`${styles['bamboo-knot'] || 'bamboo-knot'} ${styles['k-2'] || 'k-2'}`} />
              <div className={styles['jar-emblem']}>
                <span className={styles['emblem-char']}>福</span>
                <span className={styles['emblem-text']}>Fortune &amp; Joy</span>
              </div>
              <div className={styles['jar-base']} />
            </div>

            {/* Shadow under jar */}
            <div className={styles['jar-ground-shadow']} />
          </div>

          {/* Trigger Button */}
          {!revealedFortune && (
            <div className={styles['fortune-controls']}>
              <button
                type="button"
                onClick={handlePickFortune}
                disabled={isShaking}
                className={`btn-gold ${styles['pick-btn'] || 'pick-btn'}`}
              >
                <Sparkles size={20} />
                <span>{isShaking ? 'Shaking the Bamboo Jar...' : 'Pick Your Fortune!'}</span>
              </button>
              <p className={styles['draw-hint']}>Click the button to shake the jar and draw your bamboo stick</p>
            </div>
          )}

          {/* Revealed Fortune Card */}
          {revealedFortune && (
            <div className={`${styles['fortune-reveal-card'] || 'fortune-reveal-card'} card-bamboo`}>
              <div className={styles['card-ornament-top']}>
                <span className={styles['bamboo-leaf-icon']}>🎋</span>
                <span className={styles['fortune-theme-badge']}>{revealedFortune.theme}</span>
                <span className={styles['bamboo-leaf-icon']}>🎋</span>
              </div>

              <div className={styles['fortune-emoji-circle']}>
                <span>{revealedFortune.emoji}</span>
              </div>

              <blockquote className={styles['fortune-message-text']}>
                &ldquo;{revealedFortune.text}&rdquo;
              </blockquote>

              <p className={styles['fortune-signature']}>
                &mdash; Liam&apos;s 1st Birthday Bamboo Blessing
              </p>

              <div className={styles['fortune-card-actions']}>
                <button
                  type="button"
                  onClick={handlePickFortune}
                  className="btn-primary"
                >
                  <RotateCcw size={16} />
                  <span>Pick Another Fortune</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-secondary"
                  title="Copy Fortune"
                >
                  {copied ? <Check size={16} color="var(--bamboo-green)" /> : <Share2 size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Blessing'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

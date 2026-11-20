'use client';

import styles from './Countdown.module.css';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, PartyPopper } from 'lucide-react';

interface CountdownProps {
  targetDate?: string; // ISO string or parsable date
  endDate?: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  isEnded: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({
  // Default party date: 14 days from now or fixed memorable date
  targetDate = '2026-12-12T15:30:00',
  endDate = '2026-12-12T19:30:00',
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false,
    isEnded: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTime = () => {
      const now = new Date().getTime();
      const start = new Date(targetDate).getTime();
      const end = new Date(endDate).getTime();

      if (now >= end) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isStarted: true,
          isEnded: true,
        });
        return;
      }

      if (now >= start && now < end) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isStarted: true,
          isEnded: false,
        });
        return;
      }

      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isStarted: false,
        isEnded: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, endDate]);

  if (!mounted) {
    return (
      <div className={`${styles['countdown-placeholder'] || 'countdown-placeholder'} ${className}`}>
        <div className={styles['countdown-pill']}>Loading Party Countdown...</div>
      </div>
    );
  }

  if (timeLeft.isEnded) {
    return (
      <div className={`${styles['countdown-state-card'] || 'countdown-state-card'} ${styles['ended'] || 'ended'} ${className}`}>
        <div className={styles['state-badge']}>
          <PartyPopper size={20} color="var(--accent-gold)" />
          <span>Event Concluded</span>
        </div>
        <h4 className={styles['state-title']}>Thank You For Making It Magical!</h4>
        <p className={styles['state-subtitle']}>
          Liam&apos;s 1st Panda Birthday celebration was filled with love, laughter, and bamboo memories!
        </p>
      </div>
    );
  }

  if (timeLeft.isStarted) {
    return (
      <div className={`${styles['countdown-state-card'] || 'countdown-state-card'} ${styles['active-party'] || 'active-party'} ${className}`}>
        <div className={styles['party-badge']}>
          <Sparkles size={20} className={styles['spinning-sparkle']} />
          <span>Party is Live!</span>
        </div>
        <h4 className={styles['state-title']}>Yay! The Panda Party Has Started!</h4>
        <p className={styles['state-subtitle']}>
          Join the fun at the Bamboo Pavilion or watch our live stream below!
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles['countdown-wrapper'] || 'countdown-wrapper'} ${className}`}>
      <div className={styles['countdown-header']}>
        <span className={styles['countdown-icon']}>
          <Clock size={16} />
        </span>
        <span className={styles['countdown-label']}>The Panda Adventure Begins In</span>
      </div>

      <div className={styles['countdown-grid']}>
        <div className={styles['time-block']}>
          <div className={styles['time-number-card']}>
            <span className={styles['time-number']}>{String(timeLeft.days).padStart(2, '0')}</span>
          </div>
          <span className={styles['time-tag']}>Days</span>
        </div>

        <div className={styles['time-separator']}>:</div>

        <div className={styles['time-block']}>
          <div className={styles['time-number-card']}>
            <span className={styles['time-number']}>{String(timeLeft.hours).padStart(2, '0')}</span>
          </div>
          <span className={styles['time-tag']}>Hours</span>
        </div>

        <div className={styles['time-separator']}>:</div>

        <div className={styles['time-block']}>
          <div className={styles['time-number-card']}>
            <span className={styles['time-number']}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          </div>
          <span className={styles['time-tag']}>Minutes</span>
        </div>

        <div className={styles['time-separator']}>:</div>

        <div className={styles['time-block']}>
          <div className={`${styles['time-number-card'] || 'time-number-card'} ${styles['accent'] || 'accent'}`}>
            <span className={styles['time-number']}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <span className={styles['time-tag']}>Seconds</span>
        </div>
      </div>
    </div>
  );
};

'use client';

import styles from './Footer.module.css';


import React, { useState } from 'react';
import { Heart, Share2, Copy, Check, ArrowUp, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.9 },
      colors: ['#789B63', '#D9B66F', '#FFB8B8'],
    });
  };

  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const text = encodeURIComponent("You're invited to Ditvi's 1st Birthday Panda Celebration! 🐼🎋 Check out the website & RSVP here: " + window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = () => {
    if (typeof window === 'undefined') return;
    if (navigator?.share) {
      navigator.share({
        title: "Ditvi's 1st Birthday - Panda & Bamboo Celebration",
        text: "Celebrate Ditvi's 1st Birthday with us! 🐼🎋",
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <footer className={styles['website-footer']}>
      <div className={`container ${styles['footer-container'] || 'footer-container'}`}>
        {/* Top Decorative Banner */}
        <div className={styles['footer-top-row']}>
          <div className={styles['footer-brand']}>
            <span className={styles['footer-panda-logo']}>🐼</span>
            <div className={styles['footer-brand-text']}>
              <h3 className={styles['footer-title']}>Ditvi&apos;s 1st Birthday</h3>
              <p className={styles['footer-date']}>Saturday, December 12, 2026 &bull; Austin, Texas</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className={styles['footer-social-shares']}>
            <span className={styles['share-label']}>Share the Invitation:</span>
            <button
              type="button"
              className={styles['share-btn']}
              onClick={handleCopyLink}
              title="Copy Page Link"
            >
              {copied ? <Check size={16} color="var(--bamboo-green)" /> : <Copy size={16} />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              className={`${styles['share-btn'] || 'share-btn'} ${styles['whatsapp'] || 'whatsapp'}`}
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              className={styles['share-btn']}
              onClick={handleNativeShare}
              title="Share Celebration"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Quick Links & Hashtags */}
        <div className={styles['footer-middle-row']}>
          <nav className={styles['footer-nav']} aria-label="Footer Navigation">
            <a href="#home" className={styles['footer-link']}>Home</a>
            <a href="#about" className={styles['footer-link']}>About Ditvi</a>
            <a href="#timeline" className={styles['footer-link']}>Milestones</a>
            <a href="#gallery" className={styles['footer-link']}>Gallery</a>
            <a href="#rsvp" className={styles['footer-link']}>RSVP</a>
            <a href="#gifts" className={styles['footer-link']}>Gifts</a>
            <a href="#games" className={styles['footer-link']}>Games</a>
            <a href="#fortune" className={styles['footer-link']}>Fortune Jar</a>
            <a href="#wishes" className={styles['footer-link']}>Wish Wall</a>
            <a href="#stream" className={styles['footer-link']}>Live Stream</a>
            <a href="#contact" className={styles['footer-link']}>Venue</a>
            <a href="/admin/login" className={styles['footer-link']} style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
              🔐 Admin
            </a>
          </nav>

          <div className={styles['footer-hashtags']}>
            <span className={styles['hashtag-chip']}>#DitviTurnsOne</span>
            <span className={styles['hashtag-chip']}>#PandaParty2026</span>
            <span className={styles['hashtag-chip']}>#BambooGroveCelebration</span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className={styles['footer-bottom-row']}>
          <p className={styles['footer-love-text']}>
            Made with Love, Happiness &amp; a Little Panda Magic! 🌿
          </p>

          <p className={styles['footer-copyright']}>
            &copy; 2026 The Chen Family. Designed for Ditvi&apos;s Birthday Guests. &bull;{' '}
            <a href="/admin/login" style={{ color: 'var(--accent-gold)', textDecoration: 'underline', fontSize: '0.8rem' }}>
              Admin Console
            </a>
          </p>

          <button
            type="button"
            className={styles['scroll-top-btn']}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to Top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

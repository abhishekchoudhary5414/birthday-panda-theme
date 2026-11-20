'use client';

import styles from './WishWall.module.css';


import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface Wish {
  id: string;
  name: string;
  message: string;
  avatar: string;
  date: string;
  likes: number;
  isUserAdded?: boolean;
}

const defaultWishes: Wish[] = [
  {
    id: 'w-1',
    name: 'Grandma Mei & Grandpa Bo',
    message: 'Happy 1st Birthday to our sweetest little panda grandson Liam! May your days always be filled with joy, peace, and giant bear hugs.',
    avatar: '🐼',
    date: 'Just now',
    likes: 8,
  },
  {
    id: 'w-2',
    name: 'Auntie Clara & Uncle Kevin',
    message: 'We can’t believe a whole year has passed! Keep flashing those cute four teeth and exploring the world. We love you so much!',
    avatar: '🎋',
    date: '2 hours ago',
    likes: 5,
  },
  {
    id: 'w-3',
    name: 'The Robinson Family',
    message: 'Wishing Liam the happiest 1st birthday! Excited for the bamboo cake smash and panda party games this weekend!',
    avatar: '🎂',
    date: '5 hours ago',
    likes: 3,
  },
  {
    id: 'w-4',
    name: 'Cousin Maya (Age 5)',
    message: 'I drew a picture of three pandas eating ice cream for you Liam! Happy birthday baby cousin!',
    avatar: '🎈',
    date: '1 day ago',
    likes: 6,
  },
  {
    id: 'w-5',
    name: 'Dr. Evelyn & Lucas',
    message: 'May Liam grow as strong, resilient, and graceful as green bamboo. Sending all our warmest blessings to Sarah and Eric!',
    avatar: '🌿',
    date: '1 day ago',
    likes: 4,
  },
];

const avatarStickers = ['🐼', '🎋', '🎂', '🎈', '🥑', '🌟', '🍼', '🌿'];

export const WishWall: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>(defaultWishes);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐼');
  const [error, setError] = useState('');
  const [isSubmittedNotice, setIsSubmittedNotice] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeWishIndex, setActiveWishIndex] = useState(0);
  const carouselWishes = wishes.slice(0, 5);

  // Load user added wishes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('panda_birthday_wishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishes([...parsed, ...defaultWishes]);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (carouselWishes.length < 2) return;

    const carouselTimer = window.setInterval(() => {
      setActiveWishIndex((current) => (current + 1) % carouselWishes.length);
    }, 4500);

    return () => window.clearInterval(carouselTimer);
  }, [carouselWishes.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!message.trim()) {
      setError('Please write a birthday message.');
      return;
    }

    const newWish: Wish = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      avatar: selectedAvatar,
      date: 'Just now',
      likes: 1,
      isUserAdded: true,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    setActiveWishIndex(0);

    // Save only user-added wishes to localStorage
    try {
      const existingStored = localStorage.getItem('panda_birthday_wishes');
      const prev = existingStored ? JSON.parse(existingStored) : [];
      localStorage.setItem('panda_birthday_wishes', JSON.stringify([newWish, ...prev]));
    } catch {
      // ignore
    }

    setName('');
    setMessage('');
    setError('');
    setIsSubmittedNotice(true);
    setTimeout(() => setIsSubmittedNotice(false), 4000);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#789B63', '#D9B66F', '#FFB8B8'],
    });
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedIds.includes(id);
    const newLiked = isLiked ? likedIds.filter((x) => x !== id) : [...likedIds, id];
    setLikedIds(newLiked);

    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: w.likes + (isLiked ? -1 : 1) } : w))
    );
  };

  const activeWish = carouselWishes[activeWishIndex % carouselWishes.length];
  const isActiveWishLiked = activeWish ? likedIds.includes(activeWish.id) : false;

  return (
    <section id="wishes" className={`section-wrapper ${styles['wishwall-section'] || 'wishwall-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-panda-peek" aria-hidden="true">
            <PeekingPanda size={88} />
          </div>
          <div className="section-badge">
            <MessageCircle size={16} />
            <span>Guestbook of Love</span>
          </div>
          <h2 className="section-title">Liam&apos;s Birthday Wish Wall</h2>
          <p className="section-subtitle">
            Leave a digital birthday blessing, heartfelt prayer, or funny note for Liam&apos;s first birthday memory keepsake!
          </p>
        </div>

        <div className={styles['wishwall-grid']}>
          {/* Left Column: Form */}
          <div className={`${styles['wish-form-card'] || 'wish-form-card'} card-bamboo`}>
            <h3 className={styles['form-card-title']}>Send a Warm Birthday Wish 🎋</h3>
            <p className={styles['form-card-subtitle']}>Choose a panda avatar sticker and leave your note below!</p>

            <form onSubmit={handleSubmit} className={styles['wish-form']} noValidate>
              {error && <div className={styles['wish-error-pill']}>{error}</div>}

              {isSubmittedNotice && (
                <div className={styles['wish-success-pill']}>
                  🎉 Your sweet wish has been posted to the wall!
                </div>
              )}

              {/* Avatar Picker */}
              <div className={styles['avatar-picker-group']}>
                <span className={styles['field-label']}>Choose Avatar Sticker:</span>
                <div className={styles['stickers-row']}>
                  {avatarStickers.map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      className={`${styles['sticker-btn'] || 'sticker-btn'} ${styles['stk'] || 'stk'} ${styles['selected'] || 'selected'}`}
                      onClick={() => setSelectedAvatar(stk)}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className={styles['form-group']}>
                <label htmlFor="wishName" className={styles['field-label']}>
                  Your Name / Family
                </label>
                <input
                  id="wishName"
                  type="text"
                  className={styles['form-input']}
                  placeholder="e.g. Auntie Emma & Uncle Leo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className={styles['form-group']}>
                <label htmlFor="wishMsg" className={styles['field-label']}>
                  Your Birthday Message
                </label>
                <textarea
                  id="wishMsg"
                  rows={4}
                  className={`${styles['form-input'] || 'form-input'} ${styles['form-textarea'] || 'form-textarea'}`}
                  placeholder="Dear Liam, happy 1st birthday! May you always smile as bright as the sun..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Notice */}
              <div className={styles['wish-demo-notice']}>
                <AlertCircle size={15} />
                <span>
                  Demo Mode: Wishes are saved to your local browser storage for interactive demonstration.
                </span>
              </div>

              {/* Submit Button */}
              <button type="submit" className={`btn-primary ${styles['w-full'] || 'w-full'}`} style={{ width: '100%' }}>
                <Send size={18} />
                <span>Post Birthday Wish</span>
              </button>
            </form>
          </div>

          {/* Right Column: Wall of Wishes */}
          <div className={styles['wishes-display-column']} role="region" aria-label="Birthday wishes carousel" aria-roledescription="carousel">
            <div className={styles['wishes-meta-bar']}>
              <span className={styles['wishes-counter']}>
                {carouselWishes.length} Warm Wishes
              </span>
              <span className={styles['carousel-position']}>
                Wish {activeWishIndex + 1} of {carouselWishes.length}
              </span>
            </div>

            <div className={styles['wishes-cards-masonry']}>
              {activeWish && (
                <div
                  key={activeWish.id}
                  className={styles['wish-bubble-card'] || 'wish-bubble-card'}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Wish ${activeWishIndex + 1} of ${carouselWishes.length}`}
                >
                  <div className={styles['wish-bubble-header']}>
                    <div className={styles['wish-author-info']}>
                      <span className={styles['wish-avatar-badge']}>{activeWish.avatar}</span>
                      <div>
                        <h4 className={styles['wish-author-name']}>{activeWish.name}</h4>
                        <span className={styles['wish-time']}>{activeWish.date}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLike(activeWish.id)}
                      className={`${styles['btn-like'] || 'btn-like'} ${isActiveWishLiked ? (styles['liked'] || 'liked') : ''}`}
                      aria-label={`Send love to ${activeWish.name}`}
                    >
                      <Heart
                        size={15}
                        fill={isActiveWishLiked ? '#FF6B6B' : 'transparent'}
                        color={isActiveWishLiked ? '#FF6B6B' : 'var(--text-muted)'}
                      />
                      <span>{activeWish.likes}</span>
                    </button>
                  </div>

                  <p className={styles['wish-message-body']}>&ldquo;{activeWish.message}&rdquo;</p>
                </div>
              )}
            </div>

            <div className={styles['carousel-controls']} role="group" aria-label="Wish carousel controls">
              <button
                type="button"
                className={styles['carousel-arrow']}
                onClick={() => setActiveWishIndex((current) => (current - 1 + carouselWishes.length) % carouselWishes.length)}
                aria-label="Previous wish"
              >
                <ChevronLeft size={18} />
              </button>
              <div className={styles['carousel-dots']}>
                {carouselWishes.map((wish, index) => (
                  <button
                    key={wish.id}
                    type="button"
                    className={`${styles['carousel-dot'] || 'carousel-dot'} ${styles['activeWishIndex'] || 'activeWishIndex'} ${styles['active'] || 'active'}`}
                    onClick={() => setActiveWishIndex(index)}
                    aria-label={`Show wish ${index + 1}`}
                    aria-current={index === activeWishIndex ? 'true' : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                className={styles['carousel-arrow']}
                onClick={() => setActiveWishIndex((current) => (current + 1) % carouselWishes.length)}
                aria-label="Next wish"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

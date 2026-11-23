'use client';

import styles from './WishWall.module.css';

import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageCircle, AlertCircle, ChevronLeft, ChevronRight, User, Phone, Sparkles } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface Wish {
  id: string | number;
  name: string;
  relation?: string;
  phone?: string;
  message: string;
  avatar: string;
  date?: string;
  created_at?: string;
  likes: number;
}

const avatarStickers = ['🐼', '🎋', '🎂', '🎈', '🥑', '🌟', '🍼', '🌿'];

const relationOptions = [
  'Grandparent',
  'Aunt / Uncle',
  'Cousin',
  'Family Friend',
  'Friend',
  'Neighbor',
  'Godparent',
  'Well-Wisher',
];

export const WishWall: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [childName, setChildName] = useState<string>('the Birthday Star');
  const [loadingWishes, setLoadingWishes] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐼');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedNotice, setIsSubmittedNotice] = useState(false);
  const [likedIds, setLikedIds] = useState<(string | number)[]>([]);
  const [activeWishIndex, setActiveWishIndex] = useState(0);

  // Fetch live wishes from database
  const fetchWishes = async () => {
    try {
      setLoadingWishes(true);
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      }
    } catch (err) {
      console.error('Failed to load wishes from database:', err);
    } finally {
      setLoadingWishes(false);
    }
  };

  useEffect(() => {
    fetchWishes();
    fetch('/api/event').then(r => r.json()).then(d => { if (d?.event?.childName) setChildName(d.event.childName); }).catch(() => {});
    try {
      const savedLikes = localStorage.getItem('birthday_liked_wishes');
      if (savedLikes) {
        setLikedIds(JSON.parse(savedLikes));
      }
    } catch {
      // ignore
    }
  }, []);

  const carouselWishes = wishes.slice(0, 10);

  useEffect(() => {
    if (carouselWishes.length < 2) return;

    const carouselTimer = window.setInterval(() => {
      setActiveWishIndex((current) => (current + 1) % carouselWishes.length);
    }, 4800);

    return () => window.clearInterval(carouselTimer);
  }, [carouselWishes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name or family name.');
      return;
    }
    if (!message.trim()) {
      setError('`Please write a heartfelt birthday message for ${childName}.`');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relation: relation.trim() || undefined,
          phone: phone.trim() || undefined,
          message: message.trim(),
          avatar: selectedAvatar,
        }),
      });

      const data = await res.json();

      if (res.ok && data.wish) {
        setWishes((prev) => [data.wish, ...prev]);
        setActiveWishIndex(0);
        setName('');
        setRelation('');
        setPhone('');
        setMessage('');
        setIsSubmittedNotice(true);
        setTimeout(() => setIsSubmittedNotice(false), 4500);

        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#789B63', '#D9B66F', '#FFB8B8', '#DCE8D2'],
        });
      } else {
        setError(data.error || 'Failed to submit wish. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting wish:', err);
      setError('A network error occurred. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (id: string | number) => {
    const isLiked = likedIds.includes(id);
    const newLiked = isLiked ? likedIds.filter((x) => x !== id) : [...likedIds, id];
    setLikedIds(newLiked);

    try {
      localStorage.setItem('birthday_liked_wishes', JSON.stringify(newLiked));
    } catch {
      // ignore
    }

    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: Math.max(0, w.likes + (isLiked ? -1 : 1)) } : w))
    );

    try {
      const res = await fetch('/api/wishes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: isLiked ? 'unlike' : 'like' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === 'number') {
          setWishes((prev) =>
            prev.map((w) => (w.id === id ? { ...w, likes: data.likes } : w))
          );
        }
      }
    } catch (err) {
      console.error('Error updating like in database:', err);
    }
  };

  const activeWish = carouselWishes[activeWishIndex % carouselWishes.length];
  const isActiveWishLiked = activeWish ? likedIds.includes(activeWish.id) : false;

  const formatWishDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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
          <h2 className="section-title">{childName}&apos;s Birthday Wish Wall</h2>
          <p className="section-subtitle">
            Leave a digital birthday blessing, heartfelt prayer, or funny note for {childName}&apos;s first birthday memory keepsake! Saved directly to our family memory book.
          </p>
        </div>

        <div className={styles['wishwall-grid']}>
          {/* Left Column: Form */}
          <div className={`${styles['wish-form-card'] || 'wish-form-card'} card-bamboo`}>
            <h3 className={styles['form-card-title']}>Send a Warm Birthday Wish 🎋</h3>
            <p className={styles['form-card-subtitle']}>Pick a panda sticker, share your blessings, and sign the digital guestbook!</p>

            <form onSubmit={handleSubmit} className={styles['wish-form']} noValidate>
              {error && <div className={styles['wish-error-pill']}>{error}</div>}

              {isSubmittedNotice && (
                <div className={styles['wish-success-pill']}>
                  🎉 Your sweet wish has been saved to the memory book!
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
                      className={`${styles['sticker-btn'] || 'sticker-btn'} ${selectedAvatar === stk ? (styles['selected'] || 'selected') : ''}`}
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
                  Your Name / Family <span style={{ color: '#c62828' }}>*</span>
                </label>
                <input
                  id="wishName"
                  type="text"
                  className={styles['form-input']}
                  placeholder="e.g. Auntie Emma & Uncle Leo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Relation & Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className={styles['form-group']} style={{ marginBottom: 0 }}>
                  <label htmlFor="wishRelation" className={styles['field-label']}>
                    Relationship <span style={{ fontSize: '0.75rem', color: '#789B63' }}>(Optional)</span>
                  </label>
                  <select
                    id="wishRelation"
                    className={styles['form-input']}
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select relation...</option>
                    {relationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles['form-group']} style={{ marginBottom: 0 }}>
                  <label htmlFor="wishPhone" className={styles['field-label']}>
                    Phone Number <span style={{ fontSize: '0.75rem', color: '#789B63' }}>(Optional)</span>
                  </label>
                  <input
                    id="wishPhone"
                    type="tel"
                    className={styles['form-input']}
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Message */}
              <div className={styles['form-group']}>
                <label htmlFor="wishMsg" className={styles['field-label']}>
                  Your Birthday Message <span style={{ color: '#c62828' }}>*</span>
                </label>
                <textarea
                  id="wishMsg"
                  rows={4}
                  className={`${styles['form-input'] || 'form-input'} ${styles['form-textarea'] || 'form-textarea'}`}
                  placeholder={`Dear ${childName}, happy 1st birthday! May you always smile as bright as the sun...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Cloud Database Notice */}
              <div className={styles['wish-demo-notice']}>
                <Sparkles size={15} color="var(--bamboo-green)" />
                <span>
                  Permanent Keepsake: Wishes are saved directly to our database memory wall.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${styles['w-full'] || 'w-full'}`}
                style={{ width: '100%' }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Posting Wish...' : 'Post Birthday Wish'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Wall of Wishes */}
          <div className={styles['wishes-display-column']} role="region" aria-label="Birthday wishes carousel" aria-roledescription="carousel">
            <div className={styles['wishes-meta-bar']}>
              <span className={styles['wishes-counter']}>
                {loadingWishes ? 'Loading Wishes...' : `${wishes.length} Warm Wishes`}
              </span>
              {carouselWishes.length > 0 && (
                <span className={styles['carousel-position']}>
                  Wish {activeWishIndex + 1} of {carouselWishes.length}
                </span>
              )}
            </div>

            <div className={styles['wishes-cards-masonry']}>
              {activeWish ? (
                <div
                  key={activeWish.id}
                  className={styles['wish-bubble-card'] || 'wish-bubble-card'}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Wish ${activeWishIndex + 1} of ${carouselWishes.length}`}
                >
                  <div className={styles['wish-bubble-header']}>
                    <div className={styles['wish-author-info']}>
                      <span className={styles['wish-avatar-badge']}>{activeWish.avatar || '🐼'}</span>
                      <div>
                        <h4 className={styles['wish-author-name']}>{activeWish.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          {activeWish.relation && (
                            <span
                              style={{
                                fontSize: '0.72rem',
                                color: '#294B35',
                                background: '#E8F5E9',
                                padding: '2px 7px',
                                borderRadius: '10px',
                                fontWeight: 700,
                              }}
                            >
                              {activeWish.relation}
                            </span>
                          )}
                          <span className={styles['wish-time']}>
                            {formatWishDate(activeWish.created_at || activeWish.date)}
                          </span>
                        </div>
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
              ) : (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #DCE8D2' }}>
                  <span style={{ fontSize: '2.5rem' }}>🐼</span>
                  <p style={{ marginTop: '8px', color: '#555', fontWeight: 600 }}>
                    {loadingWishes ? 'Loading wishes from memory wall...' : `Be the first to leave a sweet birthday wish for ${childName}!`}
                  </p>
                </div>
              )}
            </div>

            {carouselWishes.length > 1 && (
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
                      className={`${styles['carousel-dot'] || 'carousel-dot'} ${index === activeWishIndex ? (styles['active'] || 'active') : ''}`}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './GiftRegistry.module.css';
import {
  Gift,
  ExternalLink,
  Check,
  Heart,
  Sparkles,
  AlertCircle,
  Info,
  ShoppingCart,
  Star,
  CheckCircle2,
  RefreshCw,
  Package,
  X,
  Lock,
  Mail,
  User,
  Phone,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import { AmazonProductFetcher } from './AmazonProductFetcher';
import confetti from 'canvas-confetti';

export interface GiftItem {
  id: number;
  asin?: string;
  title: string;
  category: string;
  price: string;
  list_price?: string;
  rating?: number;
  review_count?: string;
  image_url: string;
  purchase_url: string;
  description?: string;
  priority?: string;
  is_ordered: boolean;
  ordered_by?: string;
  ordered_email?: string;
  ordered_phone?: string;
  order_note?: string;
  ordered_at?: string;
}

export interface GiftRegistryProps {
  limit?: number;
  showAllLink?: boolean;
}

export const GiftRegistry: React.FC<GiftRegistryProps> = ({ limit, showAllLink = false }) => {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Popup modal state for registering a gift
  const [registeringGift, setRegisteringGift] = useState<GiftItem | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNote, setGuestNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Amazon lookup toggle
  const [showAmazonFetcher, setShowAmazonFetcher] = useState<boolean>(false);

  // Fetch gifts from database
  const fetchGifts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.gifts) {
        setGifts(data.gifts);
      }
    } catch (err) {
      console.error('Failed to fetch gifts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  // Open Registration Popup
  const handleOpenRegisterPopup = (gift: GiftItem) => {
    if (gift.is_ordered) return;
    setRegisteringGift(gift);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Submit Registration Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringGift) return;

    if (!guestName.trim()) {
      setErrorMessage('Please enter your full name or family name.');
      return;
    }

    if (!guestEmail.trim() || !guestEmail.includes('@') || !guestEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address to confirm this gift registration.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gifts/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: registeringGift.id,
          orderedBy: guestName.trim(),
          orderedEmail: guestEmail.trim(),
          orderedPhone: guestPhone.trim(),
          orderNote: guestNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register gift');
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D9B66F', '#789B63', '#FFB3B3', '#FFFFFF'],
      });

      // Update state: immediately mark product as UNAVAILABLE in UI
      setGifts((prev) =>
        prev.map((g) =>
          g.id === registeringGift.id
            ? {
                ...g,
                is_ordered: true,
                ordered_by: guestName.trim(),
                ordered_email: guestEmail.trim(),
                order_note: guestNote.trim(),
              }
            : g
        )
      );

      const purchaseUrl = registeringGift.purchase_url;

      setSuccessMessage(`🎉 Thank you, ${guestName.trim()}! Registered successfully. Redirecting you to Amazon...`);
      setTimeout(() => {
        setRegisteringGift(null);
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
        setGuestNote('');
        setSuccessMessage(null);

        // Automatic redirect to Amazon
        if (purchaseUrl) {
          window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
        }
      }, 1600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error registering gift';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueCategories = Array.from(new Set(gifts.map((g) => g.category || 'toys')));

  // Filter gifts by category and sort so UNAVAILABLE items are always at the last
  const sortedGifts = [...gifts]
    .filter((g) => {
      if (activeCategory === 'all') return true;
      return g.category === activeCategory;
    })
    .sort((a, b) => {
      if (a.is_ordered === b.is_ordered) return 0;
      return a.is_ordered ? 1 : -1; // available (false) comes first, unavailable (true) comes at the last
    });

  const displayedGifts = limit ? sortedGifts.slice(0, limit) : sortedGifts;

  return (
    <section id="gifts" className={`section-wrapper ${styles['gifts-section'] || 'gifts-section'}`} style={{ width: '100%', maxWidth: '100%' }}>
      <div className={styles['gifts-fullwidth-container'] || 'container'} style={{ width: '100%', maxWidth: '100%' }}>
        {/* Header */}
        <div className="section-header">
          <div className="section-panda-peek" aria-hidden="true">
            <PeekingPanda size={88} />
          </div>
          <div className="section-badge">
            <Gift size={16} />
            <span>Curated Gift Ideas</span>
          </div>
          <h2 className="section-title">Ditvi&apos;s 1st Birthday Gift Registry</h2>
          <p className="section-subtitle">
            Your presence at Ditvi&apos;s party is truly the greatest gift of all! If you wish to bless him with a special keepsake, browse the wishlist below. Once registered, items are marked unavailable to prevent duplicates.
          </p>
        </div>

        {/* Category Filters */}
        {uniqueCategories.length > 1 && (
          <div className={styles['filter-pills-row']}>
            <button
              type="button"
              className={`${styles['filter-pill'] || 'filter-pill'} ${activeCategory === 'all' ? (styles['active'] || 'active') : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Gifts ({gifts.length})
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles['filter-pill'] || 'filter-pill'} ${activeCategory === cat ? (styles['active'] || 'active') : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={{ textTransform: 'capitalize' }}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#294B35' }}>
            <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading Ditvi&apos;s Gift Registry...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && gifts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px dashed #cbe3c6', maxWidth: '600px', margin: '0 auto 40px' }}>
            <Package size={52} color="#789B63" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#294B35', marginBottom: '8px' }}>
              No Wishlist Items Added Yet
            </h3>
            <p style={{ color: '#6e7e73', fontSize: '0.94rem', lineHeight: 1.5, margin: 0 }}>
              The family has not added any specific gift registry products yet. Your presence, warm blessings, and love are the sweetest gifts of all!
            </p>
          </div>
        )}

        {/* Gifts Grid */}
        {!isLoading && gifts.length > 0 && (
          <div>
            <div className={styles['gifts-grid']}>
              {displayedGifts.map((gift) => {
                const isUnavailable = gift.is_ordered;

                return (
                  <div
                    key={gift.id}
                    className={`${styles['gift-card'] || 'gift-card'} card-bamboo`}
                    style={{
                      opacity: isUnavailable ? 0.88 : 1,
                      borderColor: isUnavailable ? '#e2e8f0' : 'rgba(120, 155, 99, 0.22)',
                      padding: '16px',
                    }}
                  >
                    <div className={styles['gift-image-box']} style={{ height: '170px', marginBottom: '12px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gift.image_url}
                        alt={gift.title}
                        className={styles['gift-img']}
                        style={{ filter: isUnavailable ? 'grayscale(25%)' : 'none' }}
                      />

                      {/* Status Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: isUnavailable ? '#fee2e2' : '#ecfdf5',
                          color: isUnavailable ? '#b91c1c' : '#047857',
                          border: `1px solid ${isUnavailable ? '#fca5a5' : '#a7f3d0'}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        }}
                      >
                        {isUnavailable ? (
                          <>
                            <Lock size={11} />
                            <span>Unavailable</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={11} />
                            <span>Available</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className={styles['gift-body']}>
                      {/* Price & Rating Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#294B35' }}>
                          {gift.price}
                        </span>
                        {gift.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', color: '#f59e0b', fontWeight: 700 }}>
                            <Star size={13} fill="#f59e0b" color="#f59e0b" />
                            <span>{gift.rating}</span>
                            {gift.review_count && (
                              <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>({gift.review_count})</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 1-Line Product Title */}
                      <h3 className={styles['gift-title']} title={gift.title} style={{ marginBottom: '14px' }}>
                        <a
                          href={gift.purchase_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {gift.title}
                        </a>
                      </h3>
                    </div>

                    {/* Footer Actions */}
                    <div className={styles['gift-footer']} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 'auto' }}>
                      {isUnavailable ? (
                        /* When product is already registered: Disabled button showing unavailable */
                        <button
                          type="button"
                          disabled
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            border: '1px solid #e2e8f0',
                            background: '#f1f5f9',
                            color: '#94a3b8',
                            cursor: 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Lock size={14} />
                          <span>Unavailable • Claimed</span>
                        </button>
                      ) : (
                        /* When available: Only ONE button to register & auto-redirect */
                        <button
                          type="button"
                          onClick={() => handleOpenRegisterPopup(gift)}
                          style={{
                            width: '100%',
                            padding: '11px 18px',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            background: 'linear-gradient(135deg, #294B35 0%, #789B63 100%)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(41, 75, 53, 0.2)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Gift size={15} />
                          <span>Register &amp; Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Gifts Button (Redirect to /gift) */}
            {(showAllLink || (limit && sortedGifts.length > limit)) && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '38px' }}>
                <a
                  href="/gift"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #294B35 0%, #1a3323 100%)',
                    color: '#ffffff',
                    padding: '13px 34px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    textDecoration: 'none',
                    boxShadow: '0 6px 18px rgba(41, 75, 53, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Gift size={18} />
                  <span>Show More Gifts ({sortedGifts.length} Total)</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Register Gift Popup Modal */}
      {registeringGift && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 25, 18, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setRegisteringGift(null)}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setRegisteringGift(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.15s ease',
              }}
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#edf6ea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#294B35' }}>
                <Gift size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#294B35', fontWeight: 800 }}>
                  Register Ditvi&apos;s Gift
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#6e7e73' }}>
                  Provide your email to claim this gift and mark it unavailable.
                </p>
              </div>
            </div>

            {/* Selected Product Summary Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8faf7', border: '1px solid #e1e7de', padding: '14px', borderRadius: '16px', marginBottom: '22px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={registeringGift.image_url}
                alt={registeringGift.title}
                style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#fff', borderRadius: '10px', padding: '4px', border: '1px solid #e2ede0' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#252525', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {registeringGift.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#294B35' }}>
                    {registeringGift.price}
                  </span>
                  <a
                    href={registeringGift.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                  >
                    <span>Open on Amazon</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>
                  Your Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#789B63" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uncle Rohan Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbe3c6',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>
                  Your Email Address * (Used for Verification)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#789B63" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohan.sharma@gmail.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbe3c6',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6e7e73', marginTop: '4px' }}>
                  We match your email to confirm registration and prevent duplicate gifts.
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>
                  Phone / WhatsApp Number (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#789B63" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2831"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbe3c6',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Informative notice */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.8rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#b45309" style={{ flexShrink: 0 }} />
                <span>
                  Confirming this popup marks this item as <strong>Unavailable</strong> immediately on the website so no other guest buys it.
                </span>
              </div>

              {errorMessage && (
                <div style={{ color: '#dc2626', fontSize: '0.88rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div style={{ color: '#16a34a', fontSize: '0.9rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <CheckCircle2 size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRegisteringGift(null)}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '9999px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '11px 26px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #294B35 0%, #789B63 100%)',
                    color: '#ffffff',
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(41, 75, 53, 0.22)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      <span>Confirm &amp; Register Gift</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

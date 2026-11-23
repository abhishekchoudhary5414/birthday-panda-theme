'use client';

import styles from './RSVP.module.css';


import React, { useState, useEffect } from 'react';
import { Heart, Send, CheckCircle2, AlertCircle, Users, Calendar, MapPin, Clock, Phone, Mail, Sparkles } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface RSVPFormData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
  attending: 'yes' | 'no' | '';
  guestsCount: number;
  dietary: string;
  allergies: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  attending?: string;
}

export const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    title: 'Mr.',
    fullName: '',
    phone: '',
    email: '',
    attending: 'yes',
    guestsCount: 1,
    dietary: '',
    allergies: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRSVP, setSubmittedRSVP] = useState<RSVPFormData | null>(null);

  // Existing RSVP notification banner state with 3-second auto-transition to form
  const [existingStatusBanner, setExistingStatusBanner] = useState<{
    attending: 'yes' | 'no';
    fullName: string;
    email: string;
    guestsCount?: number;
    message: string;
  } | null>(null);
  const [showCountdown, setShowCountdown] = useState<number>(3);

  const [eventData, setEventData] = useState<{
    eventTitle?: string;
    childName?: string;
    turningAge?: string;
    eventDate?: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
    venueCity?: string;
    dressCode?: string;
  }>({
    eventTitle: "1st Birthday Party",
    childName: 'Birthday Star',
    turningAge: '1',
    eventDate: 'Saturday, December 12, 2026',
    eventTime: '3:30 PM – 7:30 PM (Cake cutting at 5:00 PM)',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    dressCode: 'Pastel forest tones, sage, cream, or your cutest panda-inspired accents!',
  });

  // Fetch dynamic event settings
  useEffect(() => {
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.event) {
          setEventData(data.event);
        }
      })
      .catch((err) => {
        console.error('Failed to load event details in RSVP component:', err);
      });
  }, []);

  // Check URL query parameters for pre-filling name, number, and email, and check if already in DB
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const search = window.location.search;
      let params = new URLSearchParams(search);
      
      // If query is inside hash (e.g. /#rsvp?name=...), parse hash query string as fallback
      if (!params.has('name') && !params.has('phone') && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) params = new URLSearchParams(hashQuery);
      }

      const titleParam = params.get('title');
      const nameParam = params.get('name') || params.get('fullName');
      const phoneParam = params.get('phone') || params.get('mobile') || params.get('number');
      const emailParam = params.get('email');

      if (titleParam || nameParam || phoneParam || emailParam) {
        // If a new personalized link is opened, clear old local storage submission so they see the pre-filled form directly
        setSubmittedRSVP(null);

        const cleanTitle = titleParam ? decodeURIComponent(titleParam).trim() : '';
        const cleanEmail = emailParam ? decodeURIComponent(emailParam).trim() : '';
        const cleanName = nameParam ? decodeURIComponent(nameParam).trim() : '';
        const cleanPhone = phoneParam ? decodeURIComponent(phoneParam).trim() : '';

        setFormData((prev) => ({
          ...prev,
          title: cleanTitle || prev.title,
          fullName: cleanName || prev.fullName,
          phone: cleanPhone || prev.phone,
          email: cleanEmail || prev.email,
        }));

        // If email was provided in URL query, check if an RSVP already exists in the database
        if (cleanEmail) {
          fetch(`/api/rsvp?email=${encodeURIComponent(cleanEmail)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data && data.exists && data.rsvp) {
                const isAttending = data.rsvp.attending === 'yes';
                setExistingStatusBanner({
                  attending: isAttending ? 'yes' : 'no',
                  fullName: data.rsvp.full_name || cleanName || 'Dear Guest',
                  email: cleanEmail,
                  guestsCount: data.rsvp.guests_count || 1,
                  message: isAttending
                    ? `Warmest greetings, ${data.rsvp.full_name}! You are already confirmed IN for the party (${data.rsvp.guests_count || 1} guest). We can't wait to welcome you to the birthday celebration!`
                    : `Warmest greetings, ${data.rsvp.full_name}! We previously recorded your response that you are unable to attend. We will miss you dearly and appreciate your love!`,
                });
              }
            })
            .catch((err) => console.error('RSVP email lookup error:', err));
        }
      }
    } catch (err) {
      console.error('Error parsing RSVP prefill query params:', err);
    }
  }, []);

  // 3-second countdown timer to transition from existing RSVP notification to RSVP form
  useEffect(() => {
    if (!existingStatusBanner) return;

    setShowCountdown(3);
    const interval = setInterval(() => {
      setShowCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExistingStatusBanner(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [existingStatusBanner]);

  // Check if previously submitted locally (only if no query params were provided)
  useEffect(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (params && (params.get('name') || params.get('phone') || params.get('email'))) {
        return; // Don't block prefill with previous visitor's submission
      }
      const saved = localStorage.getItem('panda_birthday_rsvp');
      if (saved) {
        setSubmittedRSVP(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your mobile phone number.';
    } else if (!/^[0-9+\s\-()]{7,18}$/.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.attending) {
      errs.attending = 'Please let us know if you can attend.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isDuplicateEmail) {
          const isAttending = data.attending === 'yes';
          setExistingStatusBanner({
            attending: isAttending ? 'yes' : 'no',
            fullName: data.fullName || formData.fullName,
            email: formData.email,
            guestsCount: data.guestsCount,
            message: data.error || (isAttending
              ? `Warm greetings! You are already confirmed IN on our guest list! We are so excited to celebrate with you.`
              : `Thank you! An RSVP was already received letting us know you are unable to attend. We send you our warmest love!`),
          });
          return;
        }
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setSubmittedRSVP(formData);
      try {
        localStorage.setItem('panda_birthday_rsvp', JSON.stringify(formData));
      } catch {
        // ignore
      }

      // Confetti celebration
      if (formData.attending === 'yes') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#789B63', '#294B35', '#D9B66F', '#FFB8B8', '#DCE8D2'],
        });
      }
    } catch (err: unknown) {
      console.error('RSVP submission error:', err);
      setSubmitError((err as Error).message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRSVP(null);
    try {
      localStorage.removeItem('panda_birthday_rsvp');
    } catch {
      // ignore
    }
    setFormData({
      title: 'Mr.',
      fullName: '',
      phone: '',
      email: '',
      attending: 'yes',
      guestsCount: 1,
      dietary: '',
      allergies: '',
      message: '',
    });
  };

  return (
    <section id="rsvp" className={`section-wrapper ${styles['rsvp-section'] || 'rsvp-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-panda-peek" aria-hidden="true">
            <PeekingPanda size={88} />
          </div>
          <div className="section-badge">
            <Heart size={16} fill="var(--bamboo-green)" color="var(--bamboo-green)" />
            <span>Celebrate With Us</span>
          </div>
          <h2 className="section-title">Birthday Invitation &amp; RSVP</h2>
          <p className="section-subtitle">
            We would be so honored to have you share this special milestone with {eventData.childName || 'Birthday Star'} and our family!
          </p>
        </div>

        <div className={styles['rsvp-grid']}>
          {/* Left Column: Official Invitation Card */}
          <div className={`${styles['invitation-card'] || 'invitation-card'} card-bamboo`}>
            <div className={styles['invitation-top-decor']}>
              <span className={styles['invitation-ornament']}>🌿</span>
              <span className={styles['invitation-subtag']}>Official Birthday Invitation</span>
              <span className={styles['invitation-ornament']}>🌿</span>
            </div>

            <h3 className={styles['invitation-headline']}>{eventData.childName || 'Birthday Star'}&apos;s {eventData.turningAge || '1'}st Birthday</h3>
            <p className={styles['invitation-intro']}>
              &ldquo;Join our panda party in the bamboo grove for cake, cheerful laughter, and unforgettable celebration!&rdquo;
            </p>

            <div className={styles['invitation-details-list']}>
              <div className={styles['invitation-item']}>
                <Calendar className={styles['inv-icon']} size={22} />
                <div>
                  <h4 className={styles['inv-title']}>Date</h4>
                  <p className={styles['inv-val']}>{eventData.eventDate || 'Saturday, December 12, 2026'}</p>
                </div>
              </div>

              <div className={styles['invitation-item']}>
                <Clock className={styles['inv-icon']} size={22} />
                <div>
                  <h4 className={styles['inv-title']}>Event Timing</h4>
                  <p className={styles['inv-val']}>{eventData.eventTime || '3:30 PM – 7:30 PM (Cake cutting at 5:00 PM)'}</p>
                </div>
              </div>

              <div className={styles['invitation-item']}>
                <MapPin className={styles['inv-icon']} size={22} />
                <div>
                  <h4 className={styles['inv-title']}>Party Venue</h4>
                  <p className={styles['inv-val']}>
                    {eventData.venueName || 'To Be Announced Soon'}
                  </p>
                  <p className={styles['inv-sub']}>
                    {[eventData.venueAddress, eventData.venueCity].filter(Boolean).join(', ') || 'Hosts will confirm venue location shortly'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dress code & special note */}
            <div className={styles['invitation-dress-code']}>
              <span className={styles['dress-code-title']}>Theme &amp; Dress Code:</span>
              <p className={styles['dress-code-text']}>
                {eventData.dressCode || 'Pastel forest tones, sage, cream, or your cutest panda-inspired accents!'}
              </p>
            </div>
          </div>

          {/* Right Column: RSVP Interactive Form */}
          <div className={`${styles['rsvp-form-container'] || 'rsvp-form-container'} card-bamboo`}>
            {/* Polite Existing RSVP Notification Modal/State with 3-second auto-transition to form */}
            {existingStatusBanner ? (
              <div
                style={{
                  padding: '36px 24px',
                  textAlign: 'center',
                  background: existingStatusBanner.attending === 'yes' ? 'linear-gradient(135deg, #f0fdf4 0%, #eefbf1 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
                  borderRadius: '20px',
                  border: `2px solid ${existingStatusBanner.attending === 'yes' ? '#bbf7d0' : '#fed7aa'}`,
                  boxShadow: '0 8px 24px rgba(41, 75, 53, 0.08)',
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: existingStatusBanner.attending === 'yes' ? '#dcfce7' : '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  }}
                >
                  {existingStatusBanner.attending === 'yes' ? (
                    <CheckCircle2 size={38} color="#16a34a" />
                  ) : (
                    <Heart size={38} color="#ea580c" fill="#ea580c" />
                  )}
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: existingStatusBanner.attending === 'yes' ? '#16a34a' : '#ea580c',
                    color: '#ffffff',
                    marginBottom: '10px',
                  }}
                >
                  {existingStatusBanner.attending === 'yes' ? '✓ You Are Confirmed IN' : '♡ You Are OUT (Regrets Received)'}
                </div>

                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#294B35',
                    margin: '6px 0 10px',
                  }}
                >
                  {existingStatusBanner.attending === 'yes'
                    ? `You're Already on the Guest List!`
                    : `Your Response Was Received!`}
                </h3>

                <p
                  style={{
                    fontSize: '0.94rem',
                    lineHeight: 1.6,
                    color: '#475569',
                    maxWidth: '440px',
                    margin: '0 auto 20px',
                  }}
                >
                  {existingStatusBanner.message}
                </p>

                {/* 3-Second Countdown Progress Bar */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.84rem',
                    color: '#64748b',
                    fontWeight: 600,
                  }}
                >
                  <Sparkles size={16} color="#789B63" />
                  <span>Loading RSVP form in <strong>{showCountdown} second{showCountdown === 1 ? '' : 's'}</strong>...</span>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setExistingStatusBanner(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#294B35',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Open RSVP form right now →
                  </button>
                </div>
              </div>
            ) : submittedRSVP ? (
              <div className={styles['rsvp-success-state']}>
                <div className={styles['success-icon-wrap']}>
                  <CheckCircle2 size={54} color="var(--bamboo-green)" />
                </div>
                <h3 className={styles['success-title']}>
                  {submittedRSVP.attending === 'yes'
                    ? 'Yay! We Can’t Wait to See You!'
                    : 'Thank You For Letting Us Know!'}
                </h3>
                <p className={styles['success-desc']}>
                  {submittedRSVP.attending === 'yes'
                    ? `Thank you, ${submittedRSVP.fullName}! Your RSVP for ${submittedRSVP.guestsCount} guest(s) has been recorded.`
                    : `We will miss you, ${submittedRSVP.fullName}! Thank you for sending your love and warm wishes.`}
                </p>

                {/* Local Demo Disclaimer Note */}
                <div className={styles['local-demo-badge']}>
                  <AlertCircle size={16} />
                  <span>
                    Notice: This is a front-end guest demo. Your submission is saved in local browser storage and is not transmitted to an external server.
                  </span>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles['rsvp-form']} noValidate>
                <div className={styles['form-header-badge']}>
                  <Sparkles size={16} />
                  <span>Birthday Celebration: {eventData.eventDate || 'Saturday, December 12, 2026'}</span>
                </div>

                {/* Full Name with Title Select (including Dr) */}
                <div className={styles['form-group']}>
                  <label htmlFor="fullName" className={styles['form-label']}>
                    Your Name <span className={styles['req']}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 120px) 1fr', gap: '10px' }}>
                    <select
                      id="title"
                      aria-label="Title"
                      className={styles['form-input']}
                      style={{ fontWeight: 700, cursor: 'pointer', background: '#fafcfa' }}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr.">Dr.</option>
                    </select>

                    <input
                      id="fullName"
                      type="text"
                      className={`${styles['form-input'] || 'form-input'} ${errors.fullName ? (styles['has-error'] || 'has-error') : ''}`}
                      placeholder="e.g. Jessica Miller"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  {errors.fullName && <span className={styles['error-text']}>{errors.fullName}</span>}
                </div>

                {/* Phone & Email Row */}
                <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                    <label htmlFor="phone" className={styles['form-label']}>
                      Mobile Number <span className={styles['req']}>*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`${styles['form-input'] || 'form-input'} ${errors.phone ? (styles['has-error'] || 'has-error') : ''}`}
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {errors.phone && <span className={styles['error-text']}>{errors.phone}</span>}
                  </div>

                  <div className={styles['form-group']}>
                    <label htmlFor="email" className={styles['form-label']}>
                      Email Address <span className={styles['req']}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`${styles['form-input'] || 'form-input'} ${errors.email ? (styles['has-error'] || 'has-error') : ''}`}
                      placeholder="jessica@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <span className={styles['error-text']}>{errors.email}</span>}
                  </div>
                </div>

                {/* Attendance Radio */}
                <div className={styles['form-group']}>
                  <label className={styles['form-label']}>
                    Will You Attend? <span className={styles['req']}>*</span>
                  </label>
                  <div className={styles['attendance-options']}>
                    <label
                      className={`${styles['attend-option'] || 'attend-option'} ${styles['yes'] || 'yes'} ${styles['selected'] || 'selected'}`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={formData.attending === 'yes'}
                        onChange={() => setFormData({ ...formData, attending: 'yes' })}
                      />
                      <span>🎉 Yes, Joyfully Attending!</span>
                    </label>

                    <label
                      className={`${styles['attend-option'] || 'attend-option'} ${styles['no'] || 'no'} ${styles['selected'] || 'selected'}`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={formData.attending === 'no'}
                        onChange={() => setFormData({ ...formData, attending: 'no' })}
                      />
                      <span>💌 Sadly Cannot Make It</span>
                    </label>
                  </div>
                </div>

                {/* Number of Guests (if attending) */}
                {formData.attending === 'yes' && (
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label htmlFor="guestsCount" className={styles['form-label']}>
                        Total Guests (Including Yourself)
                      </label>
                      <select
                        id="guestsCount"
                        className={`${styles['form-input'] || 'form-input'} ${styles['form-select'] || 'form-select'}`}
                        value={formData.guestsCount}
                        onChange={(e) =>
                          setFormData({ ...formData, guestsCount: parseInt(e.target.value, 10) })
                        }
                      >
                        <option value={1}>1 Guest (Just Me)</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={5}>5+ Family Members</option>
                      </select>
                    </div>

                    <div className={styles['form-group']}>
                      <label htmlFor="dietary" className={styles['form-label']}>
                        Dietary Preference
                      </label>
                      <select
                        id="dietary"
                        className={`${styles['form-input'] || 'form-input'} ${styles['form-select'] || 'form-select'}`}
                        value={formData.dietary}
                        onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                      >
                        <option value="">Select a preference</option>
                        <option value="Veg">Veg</option>
                        <option value="Non Veg">Non Veg</option>
                      </select>
                    </div>
                  </div>
                )}

          

            

                {submitError && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#fde8e8',
                    color: '#9b1c1c',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    border: '1px solid #f8b4b4',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary ${styles['w-full'] || 'w-full'}`}
                  style={{ width: '100%' }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Submitting RSVP...' : 'Confirm RSVP'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

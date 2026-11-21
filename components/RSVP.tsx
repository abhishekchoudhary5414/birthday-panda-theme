'use client';

import styles from './RSVP.module.css';


import React, { useState, useEffect } from 'react';
import { Heart, Send, CheckCircle2, AlertCircle, Users, Calendar, MapPin, Clock, Phone, Mail, Sparkles } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface RSVPFormData {
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
  attending?: string;
}

export const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
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
    eventTitle: "Ditvi's 1st Birthday Party",
    childName: 'Ditvi',
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

  // Check URL query parameters for pre-filling name, number, and email
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

      const nameParam = params.get('name') || params.get('fullName');
      const phoneParam = params.get('phone') || params.get('mobile') || params.get('number');
      const emailParam = params.get('email');

      if (nameParam || phoneParam || emailParam) {
        // If a new personalized link is opened, clear old local storage submission so they see the pre-filled form directly
        setSubmittedRSVP(null);

        setFormData((prev) => ({
          ...prev,
          fullName: nameParam ? decodeURIComponent(nameParam).trim() : prev.fullName,
          phone: phoneParam ? decodeURIComponent(phoneParam).trim() : prev.phone,
          email: emailParam ? decodeURIComponent(emailParam).trim() : prev.email,
        }));
      }
    } catch (err) {
      console.error('Error parsing RSVP prefill query params:', err);
    }
  }, []);

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
            We would be so honored to have you share this special milestone with {eventData.childName || 'Ditvi'} and our family!
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

            <h3 className={styles['invitation-headline']}>{eventData.childName || 'Ditvi'}&apos;s {eventData.turningAge || '1'}st Birthday</h3>
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
            {submittedRSVP ? (
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

                <div className={styles['success-actions']}>
                  <button type="button" onClick={handleReset} className="btn-secondary">
                    Edit or Submit Another RSVP
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles['rsvp-form']} noValidate>
                <div className={styles['form-header-badge']}>
                  <Sparkles size={16} />
                  <span>Kindly RSVP by November 30, 2026</span>
                </div>

                {/* Full Name */}
                <div className={styles['form-group']}>
                  <label htmlFor="fullName" className={styles['form-label']}>
                    Your Full Name <span className={styles['req']}>*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={`${styles['form-input'] || 'form-input'} ${errors.fullName ? (styles['has-error'] || 'has-error') : ''}`}
                    placeholder="e.g. Jessica Miller"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
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
                      Email Address <span className={styles['opt']}>(Optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles['form-input']}
                      placeholder="jessica@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
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

                {formData.attending === 'yes' && (
                  <div className={styles['form-group']}>
                    <label htmlFor="allergies" className={styles['form-label']}>
                      Allergies (Optional)
                    </label>
                    <input
                      id="allergies"
                      type="text"
                      className={styles['form-input']}
                      placeholder="Let us know about any food allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    />
                  </div>
                )}

                {/* Personal Wish / Message */}
                <div className={styles['form-group']}>
                  <label htmlFor="message" className={styles['form-label']}>
                    Optional Birthday Wish for {eventData.childName || 'Ditvi'}
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    className={`${styles['form-input'] || 'form-input'} ${styles['form-textarea'] || 'form-textarea'}`}
                    placeholder={`Write a sweet note or birthday blessing for ${eventData.childName || 'Ditvi'}...`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

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

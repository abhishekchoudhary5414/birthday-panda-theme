'use client';

import styles from './Hero.module.css';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Heart, Sparkles, Star } from 'lucide-react';
import { PartyPanda, FloatingPandaWithBalloons, BambooStalkDecoration } from './PandaIllustrations';
import { Countdown } from './Countdown';

interface EventData {
  eventTitle?: string;
  childName?: string;
  turningAge?: string;
  eventDate?: string;
  eventDateIso?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
}

export const Hero: React.FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    eventTitle: "Ditvi's 1st Birthday Party",
    childName: 'Ditvi',
    turningAge: '1',
    eventDate: 'Saturday, Dec 12, 2026',
    eventDateIso: '2026-12-12',
    eventTime: '3:30 PM – 7:30 PM CST',
    venueName: '',
    venueAddress: '',
    venueCity: '',
  });

  useEffect(() => {
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.event) {
          setEventData(data.event);
        }
      })
      .catch((err) => {
        console.error('Failed to load event details in Hero component:', err);
      });
  }, []);

  const handleScrollToRSVP = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('rsvp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCalendar = () => {
    const child = eventData.childName || 'Ditvi';
    const title = encodeURIComponent(`${child}'s 1st Birthday - Panda & Bamboo Celebration`);
    const details = encodeURIComponent(`Join us for ${child}'s 1st Birthday party with panda games, bamboo treats, and unforgettable fun!`);
    const venue = [eventData.venueName, eventData.venueAddress, eventData.venueCity].filter(Boolean).join(', ') || 'Venue to be announced';
    const location = encodeURIComponent(venue);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261212T203000Z/20261213T003000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <section id="home" className={styles['hero-section']}>
      {/* Decorative Natural Bamboo Borders */}
      <div className={styles['bamboo-stalk-left']} aria-hidden="true">
        <BambooStalkDecoration height={500} />
      </div>
      <div className={styles['bamboo-stalk-right']} aria-hidden="true">
        <BambooStalkDecoration height={500} />
      </div>

      <div className={`container ${styles['hero-container'] || 'hero-container'}`}>
        {/* Floating Clouds & Nature Ambience */}
        <div className={`${styles['cloud'] || 'cloud'} ${styles['cloud-1'] || 'cloud-1'}`} aria-hidden="true" />
        <div className={`${styles['cloud'] || 'cloud'} ${styles['cloud-2'] || 'cloud-2'}`} aria-hidden="true" />

        <div className={styles['hero-grid']}>
          {/* Left Column: Greeting, Event Details, CTA & Countdown */}
          <div className={styles['hero-content']}>
            <div className={styles['hero-badge']}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span>Celebrating {eventData.turningAge || '1'} Wonderful Year of Smiles</span>
            </div>

            <h1 className={styles['hero-title']}>
              Welcome to Our Little {eventData.childName || 'Ditvi'}&apos;s Birthday Party!
            </h1>

            <p className={styles['hero-subtitle']}>
              Let&apos;s celebrate a day filled with happiness, laughter, bamboo and unforgettable memories as <strong className={styles['child-name']}>{eventData.childName || 'Ditvi'}</strong> turns <strong>{eventData.turningAge || '1'}</strong>!
            </p>

            {/* Quick Event Summary Pills */}
            <div className={styles['event-pills-row']}>
              <div className={styles['event-pill']}>
                <Calendar size={18} className={styles['pill-icon']} />
                <div className={styles['pill-text']}>
                  <span className={styles['pill-label']}>Date</span>
                  <span className={styles['pill-val']}>{eventData.eventDate || 'Saturday, Dec 12, 2026'}</span>
                </div>
              </div>

              <div className={styles['event-pill']}>
                <Clock size={18} className={styles['pill-icon']} />
                <div className={styles['pill-text']}>
                  <span className={styles['pill-label']}>Time</span>
                  <span className={styles['pill-val']}>{eventData.eventTime || '3:30 PM – 7:30 PM CST'}</span>
                </div>
              </div>

              {eventData.venueName ? (
                <div className={styles['event-pill']}>
                  <MapPin size={18} className={styles['pill-icon']} />
                  <div className={styles['pill-text']}>
                    <span className={styles['pill-label']}>Venue</span>
                    <span className={styles['pill-val']}>{eventData.venueName}</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Countdown Timer */}
            <div className={styles['hero-countdown-box']}>
              <Countdown targetDate="2026-12-12T15:30:00" endDate="2026-12-12T19:30:00" />
            </div>

            {/* Call to Actions */}
            <div className={styles['hero-actions']}>
              <a href="#rsvp" onClick={handleScrollToRSVP} className="btn-primary">
                <Heart size={18} fill="#FFFFFF" />
                <span>RSVP to the Party</span>
              </a>

              <button
                type="button"
                onClick={handleAddToCalendar}
                className="btn-secondary"
                title="Add to Google Calendar"
              >
                <Calendar size={18} />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual with Large Featured Baby Photo & Animated Panda Friends */}
          <div className={styles['hero-visual']}>
            <div className={styles['panda-stage']}>
              {/* Outer Bamboo & Gold Halo */}
              <div className={styles['bamboo-halo']} />

              {/* Floating Balloon Panda floating top right */}
              <div className={styles['floating-balloon-panda']}>
                <FloatingPandaWithBalloons size={150} />
              </div>

              {/* Prominent Centerpiece: Large Baby Ditvi Photo Frame */}
              <div className={`${styles['baby-featured-showcase'] || 'baby-featured-showcase'} floating-panda`}>
                {/* Decorative Panda Ears on Photo Frame */}
                <div className={styles['photo-panda-ears']} aria-hidden="true">
                  <div className={`${styles['ear'] || 'ear'} ${styles['ear-left'] || 'ear-left'}`} />
                  <div className={`${styles['ear'] || 'ear'} ${styles['ear-right'] || 'ear-right'}`} />
                  {/* Mini Party Crown / Hat between ears */}
                  <div className={styles['photo-crown']}>👑</div>
                </div>

                <div className={styles['baby-photo-large-frame']}>
                  <img
                    src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=85"
                    alt={`Birthday Girl ${eventData.childName || 'Ditvi'}`}
                    className={styles['baby-photo-large-img']}
                  />
                  <div className={styles['photo-inner-sparkle']}>
                    <Sparkles size={18} color="#FFD700" />
                  </div>
                </div>

                {/* Prominent Name & Age Ribbon Badge */}
                <div className={styles['baby-showcase-badge']}>
                  <div className={styles['badge-star-icon']}>
                    <Star size={15} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  </div>
                  <div className={styles['badge-text-group']}>
                    <span className={styles['badge-name']}>{eventData.childName || 'Ditvi'}</span>
                    <span className={styles['badge-age']}>Turning {eventData.turningAge || '1'} Year Old! 🎂</span>
                  </div>
                </div>
              </div>

              {/* Party Panda Mascot sitting beside the photo */}
              <div className={styles['side-party-panda']}>
                <PartyPanda size={190} />
              </div>

              {/* Floating celebratory party tags */}
              <div className={`${styles['floating-pill'] || 'floating-pill'} ${styles['pill-party'] || 'pill-party'}`}>
                <span>🎂 Bamboo Cake Smash!</span>
              </div>
              <div className={`${styles['floating-pill'] || 'floating-pill'} ${styles['pill-games'] || 'pill-games'}`}>
                <span>🎈 Games &amp; Joy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

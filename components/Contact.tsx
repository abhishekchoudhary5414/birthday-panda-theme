'use client';

import styles from './Contact.module.css';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Mail, Clock, Car, Sparkles } from 'lucide-react';

interface EventData {
  eventTitle?: string;
  childName?: string;
  turningAge?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueMapUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  dressCode?: string;
}

export const Contact: React.FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    eventTitle: "1st Birthday Party",
    childName: 'Birthday Star',
    turningAge: '1',
    eventDate: 'Saturday, December 12, 2026',
    eventTime: '3:30 PM – 7:30 PM CST',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueMapUrl: '',
    contactPhone: '+1 (555) 019-2831',
    contactEmail: 'family@birthday.com',
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
        console.error('Failed to load event details in Contact component:', err);
      });
  }, []);

  const hasVenue = Boolean(eventData.venueName && eventData.venueName.trim());
  const fullAddress = [eventData.venueName, eventData.venueAddress, eventData.venueCity].filter(Boolean).join(', ');
  const googleMapsUrl = eventData.venueMapUrl || (fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : '#');

  return (
    <section id="contact" className={`section-wrapper ${styles['contact-section'] || 'contact-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <MapPin size={16} />
            <span>Finding the Bamboo Grove</span>
          </div>
          <h2 className="section-title">Party Venue &amp; Contact Info</h2>
          <p className="section-subtitle">
            Everything you need to find the venue, park conveniently, and reach {eventData.childName || 'Birthday Star'}&apos;s parents on party day.
          </p>
        </div>

        <div className={styles['contact-grid']}>
          {/* Left Column: Venue & Host Contact Cards */}
          <div className={styles['contact-info-col']}>
            <div className={`card-bamboo ${styles['venue-detail-card'] || 'venue-detail-card'}`}>
              <div className={styles['venue-title-row']}>
                <div className={styles['venue-icon-circle']}>
                  <span>🎋</span>
                </div>
                <div>
                  <span className={styles['venue-badge']}>Party Venue</span>
                  <h3 className={styles['venue-name']}>
                    {hasVenue ? eventData.venueName : 'Venue to be Announced Soon'}
                  </h3>
                  <p className={styles['venue-sub']}>
                    {hasVenue ? (eventData.venueCity || 'Official Celebration Location') : 'Our hosts will update the venue details shortly'}
                  </p>
                </div>
              </div>

              <div className={styles['venue-info-list']}>
                <div className={styles['venue-info-item']}>
                  <MapPin className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Address</h4>
                    <p className={styles['info-desc']}>
                      {hasVenue
                        ? [eventData.venueAddress, eventData.venueCity].filter(Boolean).join(', ')
                        : "Venue location details will be announced soon by the host family!"}
                    </p>
                  </div>
                </div>

                <div className={styles['venue-info-item']}>
                  <Clock className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Celebration Hours</h4>
                    <p className={styles['info-desc']}>
                      {eventData.eventTime || '3:30 PM – 7:30 PM CST (Cake cutting at 5:00 PM)'}
                    </p>
                  </div>
                </div>

                <div className={styles['venue-info-item']}>
                  <Car className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Parking &amp; Strollers</h4>
                    <p className={styles['info-desc']}>
                      Complimentary guest parking and fully paved stroller-friendly ramps to the celebration area.
                    </p>
                  </div>
                </div>
              </div>

              {hasVenue && (
                <div className={styles['venue-actions']}>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Navigation size={18} />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              )}
            </div>

            {/* Host Emergency Contacts */}
            <div className={`${styles['hosts-contact-card'] || 'hosts-contact-card'} card-bamboo`}>
              <h4 className={styles['hosts-card-title']}>Host Family Contacts</h4>
              <p className={styles['hosts-card-desc']}>Have questions or running late? Call, text, or email anytime!</p>

              <div className={styles['hosts-contacts-grid']}>
                <a href={`tel:${(eventData.contactPhone || '+15550192831').replace(/[^0-9+]/g, '')}`} className={styles['host-phone-pill']}>
                  <Phone size={16} />
                  <div>
                    <span className={styles['host-name']}>{eventData.childName || 'Birthday Star'}&apos;s Family</span>
                    <span className={styles['host-number']}>{eventData.contactPhone || '+1 (555) 019-2831'}</span>
                  </div>
                </a>

                {eventData.contactEmail && (
                  <a href={`mailto:${eventData.contactEmail}`} className={styles['host-phone-pill']}>
                    <Mail size={16} />
                    <div>
                      <span className={styles['host-name']}>RSVP &amp; Event Email</span>
                      <span className={styles['host-number']}>{eventData.contactEmail}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps or Announcement Card */}
          <div className={`${styles['map-card-container'] || 'map-card-container'} card-bamboo`}>
            {hasVenue && eventData.venueMapUrl && eventData.venueMapUrl.includes('google.com/maps/embed') ? (
              <div className={styles['map-bamboo-frame']}>
                <iframe
                  title="Party Venue Map"
                  src={eventData.venueMapUrl}
                  className={styles['map-iframe']}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : hasVenue ? (
              <div style={{ padding: '36px 24px', textAlign: 'center', background: '#F8FAF7', borderRadius: '14px', border: '1px solid #DCE8D2', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '3rem', marginBottom: '12px' }}>📍</span>
                <h3 style={{ color: '#294B35', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  {eventData.venueName}
                </h3>
                <p style={{ color: '#4A6B52', maxWidth: '340px', fontSize: '0.92rem', marginBottom: '20px' }}>
                  {[eventData.venueAddress, eventData.venueCity].filter(Boolean).join(', ')}
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Navigation size={18} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            ) : (
              <div style={{ padding: '40px 24px', textAlign: 'center', background: '#F8FAF7', borderRadius: '14px', border: '1.5px dashed #DCE8D2', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '3.2rem', marginBottom: '12px' }}>🎋🐼</span>
                <h3 style={{ color: '#294B35', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                  Venue to be Announced
                </h3>
                <p style={{ color: '#5D7963', maxWidth: '340px', fontSize: '0.92rem', lineHeight: '1.5' }}>
                  The celebration venue is being finalized by the host parents and will be updated here soon! Stay tuned!
                </p>
              </div>
            )}

            <div className={styles['map-caption-bar']}>
              <div className={styles['map-badge']}>
                <Sparkles size={16} color="var(--accent-gold)" />
                <span>Follow the green panda balloons at the entrance on party day!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
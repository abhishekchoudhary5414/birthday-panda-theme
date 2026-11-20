'use client';

import styles from './Contact.module.css';


import React from 'react';
import { MapPin, Navigation, Phone, Mail, Clock, Car, Sparkles, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const venueAddress = "The Bamboo Pavilion at Whispering Pines Gardens, 4280 Forest View Way, Austin, TX 78704";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

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
            Everything you need to find the venue, park conveniently, and reach Liam&apos;s parents on party day.
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
                  <h3 className={styles['venue-name']}>The Bamboo Pavilion</h3>
                  <p className={styles['venue-sub']}>Whispering Pines Botanical Gardens</p>
                </div>
              </div>

              <div className={styles['venue-info-list']}>
                <div className={styles['venue-info-item']}>
                  <MapPin className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Address</h4>
                    <p className={styles['info-desc']}>4280 Forest View Way, Austin, TX 78704</p>
                  </div>
                </div>

                <div className={styles['venue-info-item']}>
                  <Clock className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Celebration Hours</h4>
                    <p className={styles['info-desc']}>3:30 PM &ndash; 7:30 PM (Cake cutting at 5:00 PM)</p>
                  </div>
                </div>

                <div className={styles['venue-info-item']}>
                  <Car className={styles['item-icon']} size={20} />
                  <div>
                    <h4 className={styles['info-title']}>Parking &amp; Strollers</h4>
                    <p className={styles['info-desc']}>
                      Complimentary valet and guest parking in Lot B. Fully paved stroller-friendly ramps to the pavilion.
                    </p>
                  </div>
                </div>
              </div>

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
            </div>

            {/* Host Emergency Contacts */}
            <div className={`${styles['hosts-contact-card'] || 'hosts-contact-card'} card-bamboo`}>
              <h4 className={styles['hosts-card-title']}>Host Family Contacts</h4>
              <p className={styles['hosts-card-desc']}>Have questions or running late? Call or text anytime!</p>

              <div className={styles['hosts-contacts-grid']}>
                <a href="tel:+15550192831" className={styles['host-phone-pill']}>
                  <Phone size={16} />
                  <div>
                    <span className={styles['host-name']}>Sarah Chen (Mommy)</span>
                    <span className={styles['host-number']}>+1 (555) 019-2831</span>
                  </div>
                </a>

                <a href="tel:+15550192832" className={styles['host-phone-pill']}>
                  <Phone size={16} />
                  <div>
                    <span className={styles['host-name']}>Eric Chen (Daddy)</span>
                    <span className={styles['host-number']}>+1 (555) 019-2832</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed Card with Bamboo Frame */}
          <div className={`${styles['map-card-container'] || 'map-card-container'} card-bamboo`}>
            <div className={styles['map-bamboo-frame']}>
              <iframe
                title="Bamboo Pavilion Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110292.83696582455!2d-97.82287236531393!3d30.267153018282124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
                className={styles['map-iframe']}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className={styles['map-caption-bar']}>
              <div className={styles['map-badge']}>
                <Sparkles size={16} color="var(--accent-gold)" />
                <span>Follow the green panda balloons from the main garden gate!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

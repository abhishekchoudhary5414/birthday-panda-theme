'use client';

import styles from './Timeline.module.css';


import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Sparkles, Star } from 'lucide-react';

interface TimelineMoment {
  id: number;
  month: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  tag: string;
}

const defaultMoments: TimelineMoment[] = [
  {
    id: 1,
    month: 'Month 1',
    date: 'December 2025',
    title: 'Hello World, Little Panda!',
    description: 'Arrived on a serene winter morning, weighing 7 lbs 4 oz. Wrapped in a fluffy panda swaddle, immediately stole all our hearts.',
    tag: 'Arrival Day',
  },
  {
    id: 2,
    month: 'Month 3',
    date: 'March 2026',
    title: 'The First Real Giggle',
    description: 'Playing peek-a-boo behind a green bamboo towel, burst into an irresistible baby laugh that echoed through the whole house.',
    tag: 'Pure Giggles',
  },
  {
    id: 3,
    month: 'Month 6',
    date: 'June 2026',
    title: 'First Taste of Solid Treats',
    description: 'Tasted mashed avocado and sweet potato with a mini bamboo spoon. More went on cheeks and nose than tummy, with joyful clapping!',
    tag: 'Yummy Milestones',
  },
  {
    id: 4,
    month: 'Month 9',
    date: 'September 2026',
    title: 'Panda Crawling Champion',
    description: 'Suddenly no toy basket was safe! Mastered the speedy crawl, zooming across the living room rug chasing a rolling panda ball.',
    tag: 'On The Move',
  },
  {
    id: 5,
    month: 'Month 12',
    date: 'December 2026',
    title: 'First Wobbly Steps & Turning One!',
    description: 'Pulled up onto the coffee table, balanced with a huge grin, and took two wobbly steps towards outstretched arms. Ready to turn one!',
    tag: 'Happy 1st Birthday',
  },
];

export const Timeline: React.FC = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineMoment[]>(defaultMoments);
  const [childName, setChildName] = useState<string>('Birthday Star');

  useEffect(() => {
    // 1. Fetch event settings for child name
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data?.event?.childName) {
          setChildName(data.event.childName);
        }
      })
      .catch((err) => console.warn('Could not fetch event in Timeline:', err));

    // 2. Fetch Google Drive photos for timeline milestones
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.photos) && data.photos.length > 0) {
          const drivePhotos = data.photos;
          // Filter photos designated for timeline or child_photo
          const timelinePhotos = drivePhotos.filter((p: any) => p.targetSection === 'timeline' || p.targetSection === 'child_photo');
          
          if (timelinePhotos.length > 0) {
            setTimelineItems((prev) =>
              prev.map((item, idx) => {
                // Check if there is an exact milestone match
                const matched = timelinePhotos.find((p: any) => p.milestoneIndex === idx + 1);
                if (matched) {
                  return {
                    ...item,
                    imageUrl: matched.proxyUrl || matched.directUrl || matched.thumbnailLink || item.imageUrl,
                    title: matched.caption || item.title,
                  };
                }
                // Or fallback to assigned timeline photos by index
                const fallbackPhoto = timelinePhotos[idx % timelinePhotos.length];
                if (fallbackPhoto) {
                  return {
                    ...item,
                    imageUrl: fallbackPhoto.proxyUrl || fallbackPhoto.directUrl || fallbackPhoto.thumbnailLink || item.imageUrl,
                    title: fallbackPhoto.caption || item.title,
                  };
                }
                return item;
              })
            );
          }
        }
      })
      .catch((err) => console.warn('Could not fetch Drive photos in Timeline:', err));
  }, []);
  return (
    <section id="timeline" className={`section-wrapper ${styles['timeline-section'] || 'timeline-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Growth Journey</span>
          </div>
          <h2 className="section-title">{childName}&apos;s 5 Precious Milestones</h2>
          <p className="section-subtitle">
            A delightful walk down memory lane tracing our little panda&apos;s most magical moments over the first 365 days.
          </p>
        </div>

        {/* Timeline Bamboo Tree Path */}
        <div className={styles['timeline-container']}>
          {/* Central Bamboo Stalk Line */}
          <div className={styles['bamboo-spine']} aria-hidden="true" />

          {timelineItems.map((item, index) => {
            const isRight = index % 2 === 1;
            return (
              <div
                key={item.id}
                className={`${styles['timeline-item'] || 'timeline-item'} ${isRight ? (styles['right'] || 'right') : (styles['left'] || 'left')}`}
              >
                {/* Bamboo Joint Node */}
                <div className={styles['bamboo-node']} aria-hidden="true">
                  <div className={styles['bamboo-node-inner']}>
                    <span className={styles['node-number']}>{index + 1}</span>
                  </div>
                  {/* Decorative Bamboo Leaves on the Node */}
                  <div className={styles['node-leaf']} />
                </div>

                {/* Timeline Card Content */}
                <div className={`${styles['timeline-content-card'] || 'timeline-content-card'} card-bamboo`}>
                  <div className={styles['card-top-row']}>
                    <span className={styles['timeline-tag']}>{item.tag}</span>
                    <div className={styles['timeline-date']}>
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {item.imageUrl ? (
                    <div className={styles['timeline-img-box']}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className={styles['timeline-img']}
                      />
                      <div className={styles['timeline-badge-month']}>{item.month}</div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(220, 232, 210, 0.35)',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      marginBottom: '14px',
                      border: '1px dashed #c8dbbe'
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294b35' }}>
                        🎋 {item.month} Growth Stage
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#688265', fontWeight: 600 }}>
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <h3 className={styles['timeline-item-title']}>{item.title}</h3>
                  <p className={styles['timeline-item-desc']}>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

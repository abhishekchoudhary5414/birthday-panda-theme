'use client';

import styles from './Timeline.module.css';


import React from 'react';
import { Calendar, Heart, Sparkles, Star } from 'lucide-react';

interface TimelineMoment {
  id: number;
  month: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
}

const moments: TimelineMoment[] = [
  {
    id: 1,
    month: 'Month 1',
    date: 'December 2025',
    title: 'Hello World, Little Panda!',
    description: 'Liam arrived on a serene winter morning, weighing 7 lbs 4 oz. Wrapped in his very first fluffy panda swaddle, he immediately stole our hearts.',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=500&q=80',
    tag: 'Arrival Day',
  },
  {
    id: 2,
    month: 'Month 3',
    date: 'March 2026',
    title: 'The First Real Giggle',
    description: 'While Daddy was playing peek-a-boo behind a green bamboo towel, Liam burst into an irresistible baby laugh that echoed through the whole house.',
    imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=500&q=80',
    tag: 'Pure Giggles',
  },
  {
    id: 3,
    month: 'Month 6',
    date: 'June 2026',
    title: 'First Taste of Solid Treats',
    description: 'Liam tasted mashed avocado and sweet potato with his mini bamboo spoon. More went on his cheeks and nose than his tummy, but he approved with joyful clapping!',
    imageUrl: 'https://images.unsplash.com/photo-1566004100631-35d015d4799c?auto=format&fit=crop&w=500&q=80',
    tag: 'Yummy Milestones',
  },
  {
    id: 4,
    month: 'Month 9',
    date: 'September 2026',
    title: 'Panda Crawling Champion',
    description: 'Suddenly no toy basket was safe! Liam mastered the speedy crawl, zooming across the living room rug chasing his rolling panda ball.',
    imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=500&q=80',
    tag: 'On The Move',
  },
  {
    id: 5,
    month: 'Month 12',
    date: 'December 2026',
    title: 'First Wobbly Steps & Turning One!',
    description: 'Pulled himself up onto the coffee table, balanced with a huge grin, and took two wobbly steps towards Mommy’s outstretched arms. Ready for his 1st Birthday Bash!',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80',
    tag: 'Happy 1st Birthday',
  },
];

export const Timeline: React.FC = () => {
  return (
    <section id="timeline" className={`section-wrapper ${styles['timeline-section'] || 'timeline-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Growth Journey</span>
          </div>
          <h2 className="section-title">Liam&apos;s 5 Precious Milestones</h2>
          <p className="section-subtitle">
            A delightful walk down memory lane tracing our little panda&apos;s most magical moments over his first 365 days.
          </p>
        </div>

        {/* Timeline Bamboo Tree Path */}
        <div className={styles['timeline-container']}>
          {/* Central Bamboo Stalk Line */}
          <div className={styles['bamboo-spine']} aria-hidden="true" />

          {moments.map((item, index) => {
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

                  <div className={styles['timeline-img-box']}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={styles['timeline-img']}
                    />
                    <div className={styles['timeline-badge-month']}>{item.month}</div>
                  </div>

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

'use client';

import styles from './GiftRegistry.module.css';


import React, { useState, useEffect } from 'react';
import { Gift, ExternalLink, Check, Heart, Sparkles, AlertCircle, Info } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';
import confetti from 'canvas-confetti';

interface GiftItem {
  id: number;
  category: 'wooden' | 'books' | 'soft' | 'essentials';
  title: string;
  description: string;
  ageRecommendation: string;
  priceEstimate: string;
  imageUrl: string;
  purchaseUrl: string;
  isInitialReserved?: boolean;
}

const registryData: GiftItem[] = [
  {
    id: 1,
    category: 'wooden',
    title: 'Natural Bamboo Stacking Rings & Panda Topper',
    description: 'Eco-friendly wooden rings that develop hand-eye coordination, fine motor skills, and color recognition.',
    ageRecommendation: '12+ Months',
    priceEstimate: '$24.99',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.amazon.com/dp/B08X9PANDA',
  },
  {
    id: 2,
    category: 'soft',
    title: 'Giant Huggable Organic Panda Plushie',
    description: 'Ultra-soft, hypoallergenic GOTS certified cotton panda friend for bedtime cuddles and nursery reading corners.',
    ageRecommendation: 'All Ages',
    priceEstimate: '$34.00',
    imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.target.com/p/panda-plush',
    isInitialReserved: true,
  },
  {
    id: 3,
    category: 'books',
    title: 'The Little Bamboo Grove: Sensory Board Book Set',
    description: 'Interactive lift-the-flap and touch-and-feel baby board books featuring animal friends in the bamboo forest.',
    ageRecommendation: '6–24 Months',
    priceEstimate: '$19.50',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.barnesandnoble.com',
  },
  {
    id: 4,
    category: 'wooden',
    title: 'Montessori Wooden Balance Walker & Cart',
    description: 'Sturdy wooden push walker weighted for steady steps, with quiet rubberized wheels and storage for wooden toys.',
    ageRecommendation: '10–18 Months',
    priceEstimate: '$68.00',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.potterybarnkids.com',
  },
  {
    id: 5,
    category: 'essentials',
    title: 'Organic Bamboo Baby Dinnerware Set with Panda Suction Bowl',
    description: '100% natural bamboo bowl with silicone suction base, bamboo spoon, and leak-proof trainer sippy cup.',
    ageRecommendation: '6–36 Months',
    priceEstimate: '$28.00',
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.amazon.com',
  },
  {
    id: 6,
    category: 'essentials',
    title: 'Bamboo Muslin Swaddle Blankets (Panda & Leaf Print)',
    description: 'Silky soft, breathable double-layer organic bamboo swaddles for sweet naps and sunny stroller walks.',
    ageRecommendation: '0–24 Months',
    priceEstimate: '$32.00',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    purchaseUrl: 'https://www.target.com',
  },
];

type CategoryFilter = 'all' | 'wooden' | 'books' | 'soft' | 'essentials';

export const GiftRegistry: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [reservedIds, setReservedIds] = useState<number[]>([]);
  const [selectedGiftDetail, setSelectedGiftDetail] = useState<GiftItem | null>(null);

  // Initialize reserved state from local storage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('panda_reserved_gifts');
      if (stored) {
        setReservedIds(JSON.parse(stored));
      } else {
        const defaults = registryData.filter((g) => g.isInitialReserved).map((g) => g.id);
        setReservedIds(defaults);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleReserve = (gift: GiftItem) => {
    const isCurrentlyReserved = reservedIds.includes(gift.id);
    let updated: number[];

    if (isCurrentlyReserved) {
      updated = reservedIds.filter((id) => id !== gift.id);
    } else {
      updated = [...reservedIds, gift.id];
      // Celebrate reservation
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D9B66F', '#789B63', '#FFFFFF'],
      });
    }

    setReservedIds(updated);
    try {
      localStorage.setItem('panda_reserved_gifts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredGifts = registryData.filter((g) => {
    if (activeCategory === 'all') return true;
    return g.category === activeCategory;
  });

  return (
    <section id="gifts" className={`section-wrapper ${styles['gifts-section'] || 'gifts-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-panda-peek" aria-hidden="true">
            <PeekingPanda size={88} />
          </div>
          <div className="section-badge">
            <Gift size={16} />
            <span>Curated Gift Ideas</span>
          </div>
          <h2 className="section-title">Little Panda Gift Registry</h2>
          <p className="section-subtitle">
            Your presence at Ditvi&apos;s party is truly the greatest gift of all! If you wish to bless him with a keepsake, here are some toys and essentials he will love.
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className={styles['registry-demo-banner']}>
          <AlertCircle size={18} className={styles['banner-icon']} />
          <p>
            <strong>Guest Demo Mode:</strong> Selecting &ldquo;Reserve Gift&rdquo; updates your local browser view for interactive planning. Reservations are not permanently saved to an external server or sent to the host.
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles['filter-pills-row']}>
          <button
            type="button"
            className={`${styles['filter-pill'] || 'filter-pill'} ${styles['all'] || 'all'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveCategory('all')}
          >
            All Gifts ({registryData.length})
          </button>
          <button
            type="button"
            className={`${styles['filter-pill'] || 'filter-pill'} ${styles['wooden'] || 'wooden'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveCategory('wooden')}
          >
            Wooden &amp; Montessori
          </button>
          <button
            type="button"
            className={`${styles['filter-pill'] || 'filter-pill'} ${styles['books'] || 'books'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveCategory('books')}
          >
            Books &amp; Learning
          </button>
          <button
            type="button"
            className={`${styles['filter-pill'] || 'filter-pill'} ${styles['soft'] || 'soft'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveCategory('soft')}
          >
            Plushies &amp; Comfort
          </button>
          <button
            type="button"
            className={`${styles['filter-pill'] || 'filter-pill'} ${styles['essentials'] || 'essentials'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveCategory('essentials')}
          >
            Bamboo Essentials
          </button>
        </div>

        {/* Gifts Grid */}
        <div className={styles['gifts-grid']}>
          {filteredGifts.map((gift) => {
            const isReserved = reservedIds.includes(gift.id);
            return (
              <div key={gift.id} className={`${styles['gift-card'] || 'gift-card'} card-bamboo`}>
                <div className={styles['gift-image-box']}>
                  <img src={gift.imageUrl} alt={gift.title} className={styles['gift-img']} />
                  <span className={`${styles['gift-status-badge'] || 'gift-status-badge'} ${styles['reserved'] || 'reserved'} ${styles['available'] || 'available'}`}>
                    {isReserved ? 'Reserved' : 'Available'}
                  </span>
                  <span className={styles['gift-price-tag']}>{gift.priceEstimate}</span>
                </div>

                <div className={styles['gift-body']}>
                  <div className={styles['gift-age-tag']}>Age: {gift.ageRecommendation}</div>
                  <h3 className={styles['gift-title']}>{gift.title}</h3>
                  <p className={styles['gift-desc']}>{gift.description}</p>
                </div>

                <div className={styles['gift-footer']}>
                  <button
                    type="button"
                    onClick={() => handleToggleReserve(gift)}
                    className={`${styles['btn-reserve'] || 'btn-reserve'} ${styles['is-reserved'] || 'is-reserved'}`}
                  >
                    {isReserved ? (
                      <>
                        <Check size={16} />
                        <span>Reserved (Click to Cancel)</span>
                      </>
                    ) : (
                      <>
                        <Heart size={16} />
                        <span>Reserve This Gift</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGiftDetail(gift)}
                    className={styles['btn-details']}
                    title="View Details"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gift Details Modal */}
      {selectedGiftDetail && (
        <div className={styles['modal-overlay']} onClick={() => setSelectedGiftDetail(null)}>
          <div className={styles['modal-dialog']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3 className={styles['modal-title']}>{selectedGiftDetail.title}</h3>
              <button
                type="button"
                className={styles['modal-close-btn']}
                onClick={() => setSelectedGiftDetail(null)}
              >
                &times;
              </button>
            </div>

            <div className={styles['modal-body']}>
              <div className={styles['modal-img-box']}>
                <img
                  src={selectedGiftDetail.imageUrl}
                  alt={selectedGiftDetail.title}
                  className={styles['modal-img']}
                />
              </div>

              <div className={styles['modal-info']}>
                <div className={styles['modal-meta-row']}>
                  <span className={styles['modal-price']}>{selectedGiftDetail.priceEstimate}</span>
                  <span className={styles['modal-age']}>Recommended: {selectedGiftDetail.ageRecommendation}</span>
                </div>
                <p className={styles['modal-desc']}>{selectedGiftDetail.description}</p>

                <div className={styles['modal-actions']}>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleReserve(selectedGiftDetail);
                    }}
                    className={`btn-primary btn-gold`}
                    style={{ flex: 1 }}
                  >
                    {reservedIds.includes(selectedGiftDetail.id) ? 'Reserved (Toggle Off)' : 'Reserve Gift (Demo)'}
                  </button>

                  <a
                    href={selectedGiftDetail.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <span>Browse Retailer</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

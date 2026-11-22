'use client';

import styles from './Gallery.module.css';


import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';

interface GalleryItem {
  id: number;
  type: 'photo' | 'video';
  album: 'milestones' | 'photoshoot' | 'family' | 'celebration';
  title: string;
  caption: string;
  thumbnail: string;
  mediaUrl: string;
  duration?: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    type: 'photo',
    album: 'photoshoot',
    title: 'Ditvi in his Fluffy Panda Suit',
    caption: 'Looking cozy, cute, and ready to feast on bamboo cookies!',
    thumbnail: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 2,
    type: 'photo',
    album: 'milestones',
    title: 'First Autumn In The Forest',
    caption: 'Ditvi marveling at golden leaves and gentle breezes.',
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 3,
    type: 'video',
    album: 'celebration',
    title: 'Ditvi’s First Birthday Cake Smash Teaser',
    caption: 'Tasting the bamboo-topped cream cupcake for the very first time!',
    thumbnail: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:45',
  },
  {
    id: 4,
    type: 'photo',
    album: 'family',
    title: 'Panda Hugs with Mommy',
    caption: 'Warm morning snuggles before starting the birthday festivities.',
    thumbnail: 'https://images.unsplash.com/photo-1566004100631-35d015d4799c?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1566004100631-35d015d4799c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 5,
    type: 'photo',
    album: 'photoshoot',
    title: 'Panda Cub Stacking Wooden Blocks',
    caption: 'Master architect at work building his bamboo castle.',
    thumbnail: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 6,
    type: 'video',
    album: 'milestones',
    title: 'Wobbly First Steps Montage',
    caption: 'From crawling in the grass to walking into daddy’s arms.',
    thumbnail: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    duration: '1:12',
  },
  {
    id: 7,
    type: 'photo',
    album: 'family',
    title: 'Daddy’s Shoulder Ride at the Botanical Park',
    caption: 'Seeing the world from up high, smiling from ear to ear.',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 8,
    type: 'photo',
    album: 'celebration',
    title: 'Birthday Invitations & Panda Decor Prep',
    caption: 'Balloons inflated, bamboo garlands hung, everything ready!',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
  },
];

type AlbumTab = 'all' | 'milestones' | 'photoshoot' | 'family' | 'celebration' | 'videos';

export const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AlbumTab>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = galleryData.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'videos') return item.type === 'video';
    return item.album === activeTab;
  });

  const handleOpenLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery" className={`section-wrapper ${styles['gallery-section'] || 'gallery-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-panda-peek" aria-hidden="true">
            <PeekingPanda size={88} />
          </div>
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Memories in the Bamboo Forest</span>
          </div>
          <h2 className="section-title">Photo &amp; Video Gallery</h2>
          <p className="section-subtitle">
            Explore precious snapshots and captured laughter from Ditvi&apos;s first incredible year.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
            <a
              href="/upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, var(--deep-forest-green, #294B35) 0%, var(--bamboo-green, #789B63) 100%)',
                color: '#FFFFFF',
                padding: '10px 22px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(41, 75, 53, 0.18)',
                transition: 'all 0.2s ease',
              }}
            >
              <UploadCloud size={18} />
              <span>Upload &amp; View Live Party Snaps on Google Drive</span>
            </a>
          </div>
        </div>

        {/* Album Filter Tabs */}
        <div className={styles['album-tabs-container']}>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['all'] || 'all'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('all')}
          >
            All Memories ({galleryData.length})
          </button>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['photoshoot'] || 'photoshoot'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('photoshoot')}
          >
            Panda Photoshoot
          </button>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['milestones'] || 'milestones'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('milestones')}
          >
            Baby Milestones
          </button>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['family'] || 'family'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('family')}
          >
            Family Smiles
          </button>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['celebration'] || 'celebration'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('celebration')}
          >
            Celebration
          </button>
          <button
            type="button"
            className={`${styles['album-tab'] || 'album-tab'} ${styles['video-tab'] || 'video-tab'} ${styles['videos'] || 'videos'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveTab('videos')}
          >
            <Film size={15} />
            <span>Videos</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className={styles['gallery-grid']}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={styles['gallery-card']}
              onClick={() => handleOpenLightbox(index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenLightbox(index);
                }
              }}
            >
              <div className={styles['gallery-media-wrapper']}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles['gallery-thumbnail']}
                  loading="lazy"
                />

                {item.type === 'video' && (
                  <div className={styles['video-play-indicator']}>
                    <Play size={22} fill="#FFFFFF" color="#FFFFFF" />
                    {item.duration && <span className={styles['video-duration']}>{item.duration}</span>}
                  </div>
                )}

                <div className={styles['gallery-overlay']}>
                  <div className={styles['overlay-content']}>
                    <span className={styles['overlay-badge']}>
                      {item.type === 'video' ? 'Play Video' : 'View Fullscreen'}
                    </span>
                    <h4 className={styles['overlay-title']}>{item.title}</h4>
                    <p className={styles['overlay-caption']}>{item.caption}</p>
                  </div>
                  <div className={styles['overlay-expand-btn']}>
                    <Maximize2 size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div className={styles['lightbox-overlay']} onClick={handleCloseLightbox}>
          <div className={styles['lightbox-dialog']} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles['lightbox-close-btn']}
              onClick={handleCloseLightbox}
              aria-label="Close Lightbox"
            >
              <X size={26} />
            </button>

            <button
              type="button"
              className={`${styles['lightbox-nav-btn'] || 'lightbox-nav-btn'} ${styles['prev'] || 'prev'}`}
              onClick={handlePrevLightbox}
              aria-label="Previous Media"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              type="button"
              className={`${styles['lightbox-nav-btn'] || 'lightbox-nav-btn'} ${styles['next'] || 'next'}`}
              onClick={handleNextLightbox}
              aria-label="Next Media"
            >
              <ChevronRight size={32} />
            </button>

            <div className={styles['lightbox-media-container']}>
              {currentItem.type === 'video' ? (
                <video
                  src={currentItem.mediaUrl}
                  controls
                  autoPlay
                  className={styles['lightbox-media-element']}
                  poster={currentItem.thumbnail}
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <img
                  src={currentItem.mediaUrl}
                  alt={currentItem.title}
                  className={styles['lightbox-media-element']}
                />
              )}
            </div>

            <div className={styles['lightbox-info-bar']}>
              <div>
                <h3 className={styles['lightbox-title']}>{currentItem.title}</h3>
                <p className={styles['lightbox-desc']}>{currentItem.caption}</p>
              </div>
              <div className={styles['lightbox-counter']}>
                {(activeLightboxIndex ?? 0) + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

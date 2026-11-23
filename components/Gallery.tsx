'use client';

import styles from './Gallery.module.css';


import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { PeekingPanda } from './PandaIllustrations';

interface GalleryItem {
  id: number | string;
  type: 'photo' | 'video';
  title: string;
  caption: string;
  thumbnail: string;
  mediaUrl: string;
  duration?: string;
}

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [childName, setChildName] = useState<string>('Birthday Star');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fetch child name
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data?.event?.childName) {
          setChildName(data.event.childName);
        }
      })
      .catch((err) => console.warn('Could not fetch event in Gallery:', err));

    // 2. Fetch Google Drive Photos uploaded by admin
    fetch('/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.photos)) {
          // Display only photos explicitly assigned to 'gallery'
          const driveGalleryItems: GalleryItem[] = data.photos
            .filter((p: any) => p.targetSection === 'gallery')
            .map((p: any, i: number) => {
              const isVid = p.mediaType === 'video' || p.mimeType?.startsWith('video/');
              const src = p.proxyUrl || p.directUrl || p.thumbnailLink;
              return {
                id: p.id || `drive-${i}`,
                type: isVid ? 'video' : 'photo',
                title: p.caption || p.name?.replace(/^birthday-.*?-(.+)/, '$1') || `${childName} Birthday Photo`,
                caption: p.caption || `Google Drive upload by ${p.uploaderName || 'Admin'}`,
                thumbnail: src,
                mediaUrl: src,
              };
            });

          setItems(driveGalleryItems);
        }
      })
      .catch((err) => console.warn('Could not fetch Drive photos in Gallery:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % items.length);
    }
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + items.length) % items.length);
    }
  };

  const currentItem = activeLightboxIndex !== null ? items[activeLightboxIndex] : null;

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
            Explore precious snapshots and captured laughter from {childName}&apos;s first incredible year.
          </p>
        </div>

        {/* Gallery Grid or Empty State */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#789b63' }}>
            <Sparkles size={32} className="animate-spin" />
            <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>Loading precious gallery moments...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '24px',
            border: '2px dashed #dce8d2',
            maxWidth: '540px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🐼📸</div>
            <h3 style={{ fontSize: '1.25rem', color: '#294b35', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              Memories Coming Soon!
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#688265', margin: 0, lineHeight: 1.5 }}>
              The host family will be uploading captured moments and smiles directly to Google Drive. Check back soon or visit the full photos page!
            </p>
          </div>
        ) : (
          <div className={styles['gallery-grid']}>
            {items.map((item, index) => (
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
        )}
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
                {(activeLightboxIndex ?? 0) + 1} / {items.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

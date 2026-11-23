'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Heart,
  Sparkles,
  Search,
  RefreshCw,
  ExternalLink,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Film,
  Play,
  ArrowLeft,
  UploadCloud
} from 'lucide-react';
import styles from './photos.module.css';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { PeekingPanda } from '@/components/PandaIllustrations';
import { SkeletonLoader } from '@/components/SkeletonLoader';

interface PhotoItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  proxyUrl: string;
  directUrl: string;
  caption?: string;
  uploaderName?: string;
  createdAt?: string;
}

export default function PhotosGalleryPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photos' | 'videos'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch Google Drive photos and videos on mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos]);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setWarningMessage(null);
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
      if (data.warning) {
        setWarningMessage(data.warning);
      }
    } catch (err: unknown) {
      console.error('Fetch Google Drive photos error:', err);
      setWarningMessage('Failed to load photos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      // Type filter
      if (mediaFilter === 'photos' && !p.mimeType.startsWith('image/')) return false;
      if (mediaFilter === 'videos' && !p.mimeType.startsWith('video/')) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.uploaderName && p.uploaderName.toLowerCase().includes(q))
      );
    });
  }, [photos, searchQuery, mediaFilter]);

  const currentLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleNextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className={styles.uploadPageWrapper}>
      <FloatingLeaves />
      <Navbar />

      <main className={styles.uploadMain} style={{ paddingTop: '100px', width: '100%', maxWidth: '1400px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#edf6ea', color: '#294B35', padding: '6px 18px', borderRadius: '30px', fontSize: '0.86rem', fontWeight: 700, marginBottom: '14px' }}>
            <Sparkles size={16} color="#789B63" />
            <span>Official Google Drive Album</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#294B35', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Ditvi&apos;s Celebration Photos &amp; Videos
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#6e7e73', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Browse, view in high resolution, or download all beautiful photos and clips uploaded directly to Ditvi&apos;s Google Drive cloud album.
          </p>
        </div>

        {/* Gallery Controls & Media Tabs */}
        <section className={styles.gallerySection} style={{ width: '100%' }}>
          <div className={styles.galleryHeaderRow} style={{ flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMediaFilter('all')}
                style={{
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  border: '1px solid #cbe3c6',
                  background: mediaFilter === 'all' ? '#294B35' : '#ffffff',
                  color: mediaFilter === 'all' ? '#ffffff' : '#294B35',
                  transition: 'all 0.2s ease',
                }}
              >
                All Media ({photos.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter('photos')}
                style={{
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  border: '1px solid #cbe3c6',
                  background: mediaFilter === 'photos' ? '#294B35' : '#ffffff',
                  color: mediaFilter === 'photos' ? '#ffffff' : '#294B35',
                  transition: 'all 0.2s ease',
                }}
              >
                Photos ({photos.filter((p) => p.mimeType.startsWith('image/')).length})
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter('videos')}
                style={{
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  border: '1px solid #cbe3c6',
                  background: mediaFilter === 'videos' ? '#294B35' : '#ffffff',
                  color: mediaFilter === 'videos' ? '#ffffff' : '#294B35',
                  transition: 'all 0.2s ease',
                }}
              >
                Videos ({photos.filter((p) => p.mimeType.startsWith('video/')).length})
              </button>
            </div>

            <div className={styles.galleryControls}>
              <div className={styles.searchInputWrap}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search photos, videos, tags..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={fetchPhotos}
                className={styles.refreshBtn}
                title="Refresh Google Drive photos"
              >
                <RefreshCw size={15} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Skeleton Loading State */}
          {isLoading && (
            <div style={{ width: '100%', padding: '10px 0 40px' }}>
              <SkeletonLoader variant="photo" count={8} />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPhotos.length === 0 && (
            <div className={styles.emptyStateCard}>
              <PeekingPanda size={160} />
              <div className={styles.emptyTitle}>
                {searchQuery ? 'No matching photos or videos found' : 'No photos in Google Drive folder yet'}
              </div>
              <div className={styles.emptySubtitle}>
                {searchQuery
                  ? `No photos match "${searchQuery}". Try a different keyword.`
                  : 'Photos and videos uploaded by Admin will automatically show up here!'}
              </div>
            </div>
          )}

          {/* Photo & Video Grid */}
          {!isLoading && filteredPhotos.length > 0 && (
            <div className={styles.photoGrid}>
              {filteredPhotos.map((photo, index) => {
                const isVideo = photo.mimeType.startsWith('video/');
                const dateStr = photo.createdTime
                  ? new Date(photo.createdTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <div key={photo.id} className={styles.photoCard}>
                    <div
                      className={styles.photoThumbnailWrap}
                      onClick={() => setLightboxIndex(index)}
                      title="Click to view full size"
                      style={{ cursor: 'pointer' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.directUrl || photo.proxyUrl || photo.thumbnailLink}
                        alt={photo.caption || photo.name}
                        loading="lazy"
                        className={styles.photoImg}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== photo.proxyUrl) {
                            target.src = photo.proxyUrl;
                          } else if (photo.thumbnailLink && target.src !== photo.thumbnailLink) {
                            target.src = photo.thumbnailLink;
                          }
                        }}
                      />

                      {/* Video badge */}
                      {isVideo && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Play size={16} fill="#fff" />
                        </div>
                      )}

                      <div className={styles.photoOverlay}>
                        <button
                          type="button"
                          className={styles.overlayActionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(index);
                          }}
                          title="Open Fullscreen View"
                        >
                          <Maximize2 size={16} />
                        </button>
                        <a
                          href={photo.proxyUrl || photo.directUrl}
                          download={photo.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.overlayActionBtn}
                          onClick={(e) => e.stopPropagation()}
                          title="Download photo"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>

                    <div className={styles.photoCardContent}>
                      <p className={styles.photoCaption}>
                        {photo.caption || photo.name.replace(/ditvi-birthday-.*?-(.+)/, '$1')}
                      </p>

                      <div className={styles.photoMetaRow}>
                        <span>{dateStr}</span>
                      </div>

                      {/* View & Download Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #edf4ea' }}>
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          style={{
                            flex: 1,
                            padding: '7px',
                            borderRadius: '8px',
                            border: '1px solid #cbe3c6',
                            background: '#f8faf7',
                            color: '#294B35',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          <Maximize2 size={13} />
                          <span>View</span>
                        </button>

                        <a
                          href={photo.proxyUrl || photo.directUrl}
                          download={photo.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: '7px',
                            borderRadius: '8px',
                            border: '1px solid #294B35',
                            background: '#294B35',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            textDecoration: 'none',
                          }}
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Lightbox Fullscreen Modal */}
      {currentLightboxPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxIndex(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <div className={styles.lightboxTitle}>
                {currentLightboxPhoto.caption || currentLightboxPhoto.name}
              </div>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setLightboxIndex(null)}
                title="Close (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.lightboxImgContainer}>
              {/* Prev / Next buttons */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                    onClick={handlePrevPhoto}
                    title="Previous (Left Arrow)"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                    onClick={handleNextPhoto}
                    title="Next (Right Arrow)"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Check if video or image */}
              {currentLightboxPhoto.mimeType.startsWith('video/') ? (
                <video
                  src={currentLightboxPhoto.proxyUrl || currentLightboxPhoto.directUrl}
                  controls
                  autoPlay
                  style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: '12px' }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentLightboxPhoto.directUrl || currentLightboxPhoto.proxyUrl || currentLightboxPhoto.thumbnailLink}
                  alt={currentLightboxPhoto.caption || currentLightboxPhoto.name}
                  className={styles.lightboxFullImg}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== currentLightboxPhoto.proxyUrl) {
                      target.src = currentLightboxPhoto.proxyUrl;
                    }
                  }}
                />
              )}
            </div>

            <div className={styles.lightboxFooter}>
              <div style={{ fontSize: '0.88rem', color: '#576b5c' }}>
                {currentLightboxPhoto.createdTime && (
                  <span>
                    📅 {new Date(currentLightboxPhoto.createdTime).toLocaleString()}
                  </span>
                )}
              </div>

              <div className={styles.lightboxActions}>
                <a
                  href={currentLightboxPhoto.proxyUrl || currentLightboxPhoto.directUrl}
                  download={currentLightboxPhoto.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.lightboxActionLink}
                  style={{ background: '#294B35', color: '#ffffff' }}
                >
                  <Download size={14} />
                  <span>Download File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MusicPlayer />
    </div>
  );
}

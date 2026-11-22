'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
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
  AlertCircle,
  CheckCircle2,
  User,
  MessageSquare,
  ShieldCheck,
  FolderHeart,
  ArrowLeft,
  Film
} from 'lucide-react';
import styles from './upload.module.css';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { PartyPanda, PeekingPanda, FloatingPandaWithBalloons } from '@/components/PandaIllustrations';

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

export default function UploadPhotosPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Upload Form State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploaderName, setUploaderName] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Gallery Filter & Lightbox State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch photos on mount
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
      console.error('Failed to load photos:', err);
      setWarningMessage('Could not reach Google Drive. Please ensure credentials are active.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length === 0) {
      setUploadError('Please select valid image or video files.');
      return;
    }

    setUploadError(null);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemovePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadError('Please choose at least one photo to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaderName', uploaderName.trim() || 'Ditvi Guest');
      formData.append('caption', caption.trim());

      try {
        const res = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          successCount++;
        } else {
          errors.push(data.error || `Failed to upload ${file.name}`);
        }
      } catch (err: unknown) {
        errors.push(`Network error uploading ${file.name}`);
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#789B63', '#294B35', '#D9B66F', '#FFB3B3', '#FFFFFF'],
      });

      setUploadSuccess(`🎉 Yay! Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''} to Ditvi's Google Drive album!`);
      // Clean up previews
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCaption('');

      // Refresh gallery list
      fetchPhotos();
    }

    if (errors.length > 0) {
      setUploadError(errors.join('. '));
    }
  };

  // Filtered photos based on search
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;
    const q = searchQuery.toLowerCase();
    return photos.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.uploaderName && p.uploaderName.toLowerCase().includes(q))
    );
  }, [photos, searchQuery]);

  // Lightbox Navigation
  const handlePrevPhoto = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredPhotos.length - 1));
  };

  const handleNextPhoto = () => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev! < filteredPhotos.length - 1 ? prev! + 1 : 0));
  };

  const currentLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className={styles.uploadPageWrapper}>
      <FloatingLeaves />

      {/* Ambient background glows */}
      <div className={styles.backgroundDecorations} aria-hidden="true">
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
        <div className={styles.bgCircle3} />
      </div>

      {/* Top Navbar */}
      <header className={styles.headerNav}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.brandLink}>
            <div style={{ width: 34, height: 34 }}>
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
                <circle cx="28" cy="28" r="16" fill="#252525" />
                <circle cx="72" cy="28" r="16" fill="#252525" />
                <circle cx="50" cy="55" r="38" fill="#FFFFFF" stroke="#DCE8D2" strokeWidth="2" />
                <ellipse cx="36" cy="50" rx="10" ry="13" transform="rotate(-15 36 50)" fill="#252525" />
                <ellipse cx="64" cy="50" rx="10" ry="13" transform="rotate(15 64 50)" fill="#252525" />
                <circle cx="37" cy="49" r="3.5" fill="#FFFFFF" />
                <circle cx="63" cy="49" r="3.5" fill="#FFFFFF" />
                <circle cx="26" cy="62" r="5" fill="#FFB8B8" opacity="0.8" />
                <circle cx="74" cy="62" r="5" fill="#FFB8B8" opacity="0.8" />
                <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#252525" />
                <path d="M47 64 Q50 67 53 64" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className={styles.brandTextTitle}>Ditvi Turns One</div>
              <div className={styles.brandTextSub}>
                <Sparkles size={12} color="var(--accent-gold)" />
                <span>Google Drive Photo Memories</span>
              </div>
            </div>
          </Link>

          <div className={styles.headerActions}>
            <Link href="/" className={styles.navHomeBtn}>
              <ArrowLeft size={16} />
              <span>Back to Celebration</span>
            </Link>
            <Link href="/admin" className={styles.navAdminBtn}>
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div>
            <div className={styles.heroTagBadge}>
              <FolderHeart size={16} />
              <span>Ditvi&apos;s 1st Birthday Photo Vault</span>
            </div>
            <h1 className={styles.heroTitle}>
              Upload &amp; Cherish <br />
              <span className={styles.heroTitleHighlight}>Every Precious Moment</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Help us capture every smile, giggle, and playful panda memory! Snap photos at Ditvi&apos;s 1st birthday party and upload them directly to our high-resolution Google Drive album.
            </p>

            <div className={styles.heroPills}>
              <span className={styles.heroPill}>
                <ShieldCheck size={16} color="#789B63" />
                <span>Saved Directly to Google Drive</span>
              </span>
              <span className={styles.heroPill}>
                <Sparkles size={16} color="#D9B66F" />
                <span>Full Resolution Quality</span>
              </span>
              <span className={styles.heroPill}>
                <Heart size={16} color="#FFB3B3" fill="#FFB3B3" />
                <span>{photos.length} Photo{photos.length === 1 ? '' : 's'} Uploaded</span>
              </span>
            </div>
          </div>

          <div className={styles.heroMascot}>
            <PartyPanda size={220} />
          </div>
        </section>

        {/* Warning Banner if Drive credentials need update */}
        {warningMessage && (
          <div className={styles.noticeBanner}>
            <AlertCircle size={20} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Google Drive Sync Notice:</strong> {warningMessage}
              <div style={{ fontSize: '0.82rem', marginTop: 4, color: '#92400e' }}>
                If you are the admin, you can verify or refresh your OAuth token in the Admin Dashboard under Media &amp; Photo Albums.
              </div>
            </div>
          </div>
        )}

        {/* Upload Form Card */}
        <section className={`${styles.uploadCard} ${isDragOver ? styles.dragOver : ''}`}>
          <div className={styles.uploadCardHeader}>
            <div className={styles.uploadIconBubble}>
              <UploadCloud size={28} />
            </div>
            <div>
              <h2 className={styles.uploadCardTitle}>Share Your Birthday Snaps</h2>
              <p className={styles.uploadCardDesc}>
                Select or drag &amp; drop photos from your phone or camera to upload directly to Google Drive.
              </p>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={styles.dropzoneArea}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileSelect(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className={styles.hiddenFileInput}
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div className={styles.dropzoneIcon}>
              <ImageIcon size={44} />
            </div>
            <div className={styles.dropzonePrompt}>
              Click to choose photos or drag and drop here
            </div>
            <div className={styles.dropzoneHint}>
              Supports PNG, JPG, WEBP, HEIC up to 15MB each
            </div>
          </div>

          {/* Selected File Thumbnails */}
          {previewUrls.length > 0 && (
            <div className={styles.previewsContainer}>
              <div className={styles.previewsHeader}>
                <span>Selected Photos ({previewUrls.length})</span>
                <button
                  type="button"
                  onClick={() => {
                    previewUrls.forEach((u) => URL.revokeObjectURL(u));
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Clear All
                </button>
              </div>
              <div className={styles.previewsGrid}>
                {previewUrls.map((url, idx) => (
                  <div key={idx} className={styles.previewThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${idx + 1}`} className={styles.previewImg} />
                    <button
                      type="button"
                      className={styles.removeThumbBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePreview(idx);
                      }}
                      title="Remove this photo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Inputs */}
          <form onSubmit={handleUploadSubmit}>
            <div className={styles.uploadInputsGrid}>
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>
                  <User size={15} color="#789B63" />
                  <span>Your Name / Relation</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uncle Amit, Grandparents, or Friend"
                  className={styles.textInput}
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                />
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>
                  <MessageSquare size={15} color="#789B63" />
                  <span>Photo Note or Wish for Ditvi (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ditvi tasting the birthday cake! 🎂"
                  className={styles.textInput}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div style={{ marginTop: 16, color: '#dc2626', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div style={{ marginTop: 16, color: '#2e7d32', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <CheckCircle2 size={18} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className={styles.uploadSubmitRow}>
              <button
                type="submit"
                disabled={isUploading || selectedFiles.length === 0}
                className={styles.uploadSubmitBtn}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Uploading to Google Drive...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    <span>
                      Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Photo
                      {selectedFiles.length > 1 ? 's' : ''} to Drive
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Gallery of Uploaded Photos */}
        <section className={styles.gallerySection}>
          <div className={styles.galleryHeaderRow}>
            <div className={styles.galleryTitleWrap}>
              <h2 className={styles.gallerySectionTitle}>
                <span>Celebration Photos &amp; Memories</span>
                <span className={styles.galleryCountBadge}>{filteredPhotos.length}</span>
              </h2>
              <p className={styles.gallerySubtitle}>
                Browsing all photos uploaded directly to Ditvi&apos;s Google Drive album.
              </p>
            </div>

            <div className={styles.galleryControls}>
              <div className={styles.searchInputWrap}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search photos, captions, guests..."
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

          {/* Loading Indicator */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#294B35' }}>
              <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>Loading Ditvi&apos;s Google Drive Photos...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPhotos.length === 0 && (
            <div className={styles.emptyStateCard}>
              <PeekingPanda size={160} />
              <div className={styles.emptyTitle}>
                {searchQuery ? 'No matching photos found' : 'No photos uploaded to Google Drive yet'}
              </div>
              <div className={styles.emptySubtitle}>
                {searchQuery
                  ? `No photos match "${searchQuery}". Try a different keyword or clear search.`
                  : 'Be the first one to snap a lovely celebration photo and upload it above!'}
              </div>
            </div>
          )}

          {/* Photo Grid */}
          {!isLoading && filteredPhotos.length > 0 && (
            <div className={styles.photoGrid}>
              {filteredPhotos.map((photo, index) => {
                // Format timestamp
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
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.proxyUrl || photo.directUrl}
                        alt={photo.caption || photo.name}
                        loading="lazy"
                        className={styles.photoImg}
                        onError={(e) => {
                          // Fallback to direct googleusercontent if proxy fails
                          (e.target as HTMLImageElement).src = photo.directUrl;
                        }}
                      />
                      <div className={styles.photoOverlay}>
                        <button
                          type="button"
                          className={styles.overlayActionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(index);
                          }}
                          title="Open Fullscreen"
                        >
                          <Maximize2 size={16} />
                        </button>
                        {photo.webViewLink && (
                          <a
                            href={photo.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.overlayActionBtn}
                            onClick={(e) => e.stopPropagation()}
                            title="Open in Google Drive"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className={styles.photoCardContent}>
                      <p className={styles.photoCaption}>
                        {photo.caption || photo.name.replace(/ditvi-birthday-.*?-(.+)/, '$1')}
                      </p>

                      <div className={styles.photoMetaRow}>
                        <span className={styles.uploaderTag}>
                          <Heart size={12} fill="#789B63" color="#789B63" />
                          <span>{photo.uploaderName || 'Ditvi Guest'}</span>
                        </span>
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Lightbox Modal */}
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
                    title="Previous Photo (Left Arrow)"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                    onClick={handleNextPhoto}
                    title="Next Photo (Right Arrow)"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentLightboxPhoto.proxyUrl || currentLightboxPhoto.directUrl}
                alt={currentLightboxPhoto.caption || currentLightboxPhoto.name}
                className={styles.lightboxFullImg}
              />
            </div>

            <div className={styles.lightboxFooter}>
              <div style={{ fontSize: '0.88rem', color: '#576b5c' }}>
                Uploaded by <strong>{currentLightboxPhoto.uploaderName || 'Ditvi Guest'}</strong>
                {currentLightboxPhoto.createdTime && (
                  <span>
                    {' '}• {new Date(currentLightboxPhoto.createdTime).toLocaleString()}
                  </span>
                )}
              </div>

              <div className={styles.lightboxActions}>
                {currentLightboxPhoto.webViewLink && (
                  <a
                    href={currentLightboxPhoto.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.lightboxActionLink}
                  >
                    <ExternalLink size={14} />
                    <span>Google Drive</span>
                  </a>
                )}

                <a
                  href={currentLightboxPhoto.proxyUrl || currentLightboxPhoto.directUrl}
                  download={currentLightboxPhoto.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.lightboxActionLink}
                >
                  <Download size={14} />
                  <span>Download</span>
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

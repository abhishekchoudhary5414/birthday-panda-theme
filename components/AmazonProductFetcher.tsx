'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Star,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  X,
  Sparkles,
  CheckCircle2,
  Tag,
  PackageCheck,
  Share2
} from 'lucide-react';
import styles from './AmazonProductFetcher.module.css';
import type { AmazonProductData } from '@/app/api/amazon-product/route';

interface AmazonProductFetcherProps {
  initialUrl?: string;
  onProductFetched?: (product: AmazonProductData) => void;
  className?: string;
}

const DEFAULT_EXAMPLE_URL =
  'https://www.amazon.com/Bose-QuietComfort-Bluetooth-Headphones-Cancelling/dp/B0DZHR44J9/ref=sr_1_1?_encoding=UTF8&sr=8-1';

export const AmazonProductFetcher: React.FC<AmazonProductFetcherProps> = ({
  initialUrl = '',
  onProductFetched,
  className = '',
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [product, setProduct] = useState<AmazonProductData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Auto-fetch if initialUrl is provided
  useEffect(() => {
    if (initialUrl) {
      handleFetch(initialUrl);
    }
  }, [initialUrl]);

  const handleFetch = async (targetUrl: string) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setError('Please paste an Amazon product URL.');
      return;
    }

    if (!trimmed.includes('amazon.') && !trimmed.includes('amzn.')) {
      setError('Please provide a valid Amazon URL (e.g. amazon.com, amazon.in, amzn.to).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/amazon-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch Amazon product details.');
      }

      setProduct(data.product);
      setSelectedImageIndex(0);
      if (onProductFetched) {
        onProductFetched(data.product);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while fetching product';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetch(url);
  };

  const handleCopyLink = () => {
    if (!product) return;
    navigator.clipboard.writeText(product.productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper to render star rating with precision
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // Full star
        stars.push(
          <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
        );
      } else if (rating >= i - 0.5) {
        // Half star
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-block', width: 18, height: 18 }}>
            <Star size={18} color="#e2e8f0" fill="#e2e8f0" style={{ position: 'absolute', top: 0, left: 0 }} />
            <span style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
            </span>
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <Star key={i} size={18} color="#cbd5e1" fill="none" />
        );
      }
    }
    return stars;
  };

  return (
    <div className={`${styles.fetcherContainer} ${className}`}>
      {/* Search & URL Input Card */}
      <div className={styles.inputCard}>
        <div className={styles.inputCardHeader}>
          <div className={styles.amazonIconBubble}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h3 className={styles.inputCardTitle}>Amazon Product Preview &amp; Review Fetcher</h3>
            <p className={styles.inputCardSubtitle}>
              Paste any Amazon product link to instantly extract high-res images, live pricing, star ratings, and verified review counts.
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.urlForm}>
          <div className={styles.inputRow}>
            <div className={styles.inputWrap}>
              <Search size={18} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="https://www.amazon.com/dp/B0DZHR44J9 or paste any Amazon URL..."
                className={styles.urlInput}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {url && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setUrl('')}
                  title="Clear input"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={styles.fetchBtn}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <PackageCheck size={18} />
                  <span>Fetch Product</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Examples */}
          <div className={styles.examplesRow}>
            <span className={styles.examplesLabel}>Quick Try:</span>
            <button
              type="button"
              className={styles.exampleChip}
              onClick={() => {
                setUrl(DEFAULT_EXAMPLE_URL);
                handleFetch(DEFAULT_EXAMPLE_URL);
              }}
            >
              <Sparkles size={13} color="#ea580c" />
              <span>Bose QuietComfort (Twilight Blue)</span>
            </button>
            <button
              type="button"
              className={styles.exampleChip}
              onClick={() => {
                const sample = 'https://www.amazon.com/dp/B0CCZ26B5V';
                setUrl(sample);
                handleFetch(sample);
              }}
            >
              <span>Bose QuietComfort (Black)</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonImg} />
          <div className={styles.skeletonDetails}>
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
            <div className={styles.skeletonLine} style={{ width: '90%', height: 26 }} />
            <div className={styles.skeletonLine} style={{ width: '75%', height: 26 }} />
            <div className={styles.skeletonLine} style={{ width: '50%' }} />
            <div className={styles.skeletonLine} style={{ width: '35%', height: 36, marginTop: 10 }} />
            <div className={styles.skeletonLine} style={{ width: '100%', height: 60 }} />
          </div>
        </div>
      )}

      {/* Product Display Card */}
      {!isLoading && product && (
        <div className={styles.productCard}>
          {/* Gallery / Images Column */}
          <div className={styles.galleryColumn}>
            <div className={styles.mainImageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[selectedImageIndex] || product.mainImage}
                alt={product.title}
                className={styles.mainProductImg}
              />
            </div>

            {/* Thumbnail switcher if multiple images found */}
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnailsRow}>
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.thumbBtn} ${selectedImageIndex === idx ? styles.activeThumb : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    title={`View photo ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className={styles.detailsColumn}>
            {/* Badges Row */}
            <div className={styles.badgesRow}>
              {product.brand && (
                <span className={styles.brandBadge}>
                  <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {product.brand}
                </span>
              )}
              <span className={styles.asinBadge}>ASIN: {product.asin}</span>
            </div>

            {/* Title */}
            <h2 className={styles.productTitle}>
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open on Amazon"
              >
                {product.title}
              </a>
            </h2>

            {/* Rating & Reviews */}
            <div className={styles.ratingRow}>
              <div className={styles.starsGroup}>{renderStars(product.rating)}</div>
              <span className={styles.ratingScore}>{product.rating}</span>
              <span className={styles.reviewCountBadge}>
                <CheckCircle2 size={13} color="#059669" />
                <span>{product.reviewCount}</span>
              </span>
            </div>

            {/* Price & Availability Box */}
            <div className={styles.priceBox}>
              <span className={styles.mainPrice}>{product.price}</span>
              {product.listPrice && product.listPrice !== product.price && (
                <span className={styles.listPrice}>{product.listPrice}</span>
              )}
              {product.discount && (
                <span className={styles.discountBadge}>{product.discount} OFF</span>
              )}
              <span
                className={`${styles.availabilityBadge} ${
                  product.inStock ? styles.inStock : styles.outOfStock
                }`}
              >
                {product.inStock ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{product.availability}</span>
              </span>
            </div>

            {/* Feature Bullets */}
            {product.features && product.features.length > 0 && (
              <div className={styles.featuresWrap}>
                <div className={styles.featuresTitle}>Highlights &amp; Overview</div>
                <ul className={styles.featuresList}>
                  {product.features.slice(0, 4).map((bullet, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.featureBullet}>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions Row */}
            <div className={styles.actionsRow}>
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyAmazonBtn}
              >
                <span>View on Amazon</span>
                <ExternalLink size={16} />
              </a>

              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={handleCopyLink}
                title="Copy clean Amazon link"
              >
                {copiedLink ? <Check size={15} color="#059669" /> : <Copy size={15} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

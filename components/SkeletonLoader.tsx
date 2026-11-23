import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonProps {
  variant?: 'card' | 'photo' | 'text' | 'circle' | 'table-row';
  count?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  variant = 'card',
  count = 1,
  width,
  height,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'photo') {
    return (
      <div className={styles.skeletonGrid}>
        {items.map((_, i) => (
          <div key={i} className={styles.photoSkeletonCard}>
            <div className={styles.photoSkeletonThumb} />
            <div className={styles.photoSkeletonContent}>
              <div className={styles.skeletonLine} style={{ width: '75%', height: '18px' }} />
              <div className={styles.skeletonLine} style={{ width: '45%', height: '14px' }} />
              <div className={styles.skeletonActionRow}>
                <div className={styles.skeletonBtn} />
                <div className={styles.skeletonBtn} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={styles.skeletonCardGrid}>
        {items.map((_, i) => (
          <div key={i} className={styles.skeletonBox}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonCircle} />
              <div style={{ flex: 1 }}>
                <div className={styles.skeletonLine} style={{ width: '60%', height: '16px' }} />
                <div className={styles.skeletonLine} style={{ width: '35%', height: '12px', marginTop: '6px' }} />
              </div>
            </div>
            <div className={styles.skeletonLine} style={{ width: '100%', height: '14px', marginTop: '12px' }} />
            <div className={styles.skeletonLine} style={{ width: '80%', height: '14px', marginTop: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={styles.skeletonTableWrap}>
        {items.map((_, i) => (
          <div key={i} className={styles.skeletonTableRow}>
            <div className={styles.skeletonBoxSmall} style={{ width: '24px', height: '24px' }} />
            <div className={styles.skeletonLine} style={{ width: '140px' }} />
            <div className={styles.skeletonLine} style={{ width: '180px' }} />
            <div className={styles.skeletonLine} style={{ width: '80px' }} />
            <div className={styles.skeletonLine} style={{ width: '60px', marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeletonBase} ${className}`}
      style={{ width: width || '100%', height: height || '20px' }}
    />
  );
};

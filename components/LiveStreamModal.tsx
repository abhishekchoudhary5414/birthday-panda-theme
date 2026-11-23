'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Video, Sparkles, ExternalLink, X } from 'lucide-react';

interface EventDetails {
  childName?: string;
  eventDate?: string;
  eventDateIso?: string;
  eventTime?: string;
}

export const LiveStreamModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState<EventDetails | null>(null);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('livestream_popup_dismissed');
    if (dismissed === 'true') {
      return;
    }

    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data?.event) {
          setEventData(data.event);
          const isoDate = data.event.eventDateIso; // e.g. "2026-12-12"
          
          let isToday = false;
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

          if (isoDate) {
            isToday = isoDate === todayStr;
          } else if (data.event.eventDate) {
            // Fallback parse if ISO not available
            const parsed = new Date(data.event.eventDate);
            if (!isNaN(parsed.getTime())) {
              isToday = parsed.toISOString().split('T')[0] === todayStr;
            }
          }

          // In dev/demo mode, if url param ?livestream_popup=1 is present, also trigger
          if (typeof window !== 'undefined' && window.location.search.includes('livestream_popup=1')) {
            isToday = true;
          }

          if (isToday) {
            // Small polite delay before appearing
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 1200);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch event date for stream modal:', err));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('livestream_popup_dismissed', 'true');
  };

  if (!isOpen) return null;

  const childName = eventData?.childName || 'Birthday Star';

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 36, 26, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(145deg, #FFFDF8 0%, #F5F9F2 100%)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 20px 45px rgba(20, 36, 26, 0.3), 0 0 0 2px rgba(120, 155, 99, 0.25)',
          border: '1px solid #E2EDE0',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close Live Stream Popup"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(41, 75, 53, 0.08)',
            color: '#294B35',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Live Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffeded',
            border: '1px solid #ffd0d0',
            color: '#dc2626',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            marginBottom: '16px',
          }}
        >
          <Radio size={16} className="animate-pulse" />
          <span>TODAY IS BIRTHDAY CELEBRATION!</span>
        </div>

        {/* Panda Icon / Graphic */}
        <div style={{ fontSize: '3rem', margin: '0 auto 8px', lineHeight: 1 }}>
          🐼🎂
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#294B35',
            margin: '0 0 8px',
            letterSpacing: '-0.5px',
          }}
        >
          {childName}&apos;s Live Stream is Active!
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.98rem',
            color: '#55685a',
            lineHeight: 1.55,
            margin: '0 0 22px',
          }}
        >
          Today is {childName}&apos;s special birthday! Can&apos;t make it in person? Join our live stream right now for the cake cutting, songs, and celebrations!
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/livestream"
            onClick={handleClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #294B35 0%, #3e6b4d 100%)',
              color: '#ffffff',
              padding: '13px 24px',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(41, 75, 53, 0.28)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <Video size={18} />
            <span>Join Live Celebration Stream</span>
            <ExternalLink size={16} />
          </Link>

          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6e7e73',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

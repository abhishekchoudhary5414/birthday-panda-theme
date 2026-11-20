'use client';

import styles from './MusicPlayer.module.css';


import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Gift, Heart, Minimize2 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  melody: number[]; // frequencies in Hz
  tempo: number; // ms per note
}

// Gentle birthday acoustic / lullaby tracks synthesized gracefully via Web Audio API
const tracks: Track[] = [
  {
    title: 'Twinkle Little Panda Star',
    artist: 'Bamboo Grove Music Box',
    tempo: 380,
    melody: [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, 0,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63, 0,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, 0,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, 0,
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, 0,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63, 0
    ],
  },
  {
    title: 'Happy 1st Birthday Liam',
    artist: 'Panda Forest Kalimba',
    tempo: 420,
    melody: [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 0,
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23, 0,
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, 0,
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23, 0
    ],
  },
  {
    title: 'Whispering Bamboo Lullaby',
    artist: 'Panda Dreamland',
    tempo: 500,
    melody: [
      329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 0,
      293.66, 349.23, 392.00, 440.00, 392.00, 349.23, 293.66, 0,
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 0
    ],
  },
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.6);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteIdxRef = useRef<number>(0);

  const track = tracks[currentTrackIdx];

  // Initialize or resume audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playKalimbaNote = (freq: number) => {
    if (freq === 0 || isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Warm music box / sine chime timbre
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Volume envelope with gentle bell decay
      const now = ctx.currentTime;
      const effectiveVol = isMuted ? 0 : volume * 0.25;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(effectiveVol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const startPlayback = () => {
    stopPlayback();
    getAudioContext();
    setIsPlaying(true);

    const playNext = () => {
      const notes = tracks[currentTrackIdx].melody;
      const noteFreq = notes[currentNoteIdxRef.current % notes.length];
      playKalimbaNote(noteFreq);

      currentNoteIdxRef.current = (currentNoteIdxRef.current + 1) % notes.length;
      noteTimerRef.current = setTimeout(playNext, tracks[currentTrackIdx].tempo);
    };

    playNext();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (noteTimerRef.current) {
      clearTimeout(noteTimerRef.current);
      noteTimerRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % tracks.length;
    setCurrentTrackIdx(nextIdx);
    currentNoteIdxRef.current = 0;
    if (isPlaying) {
      setTimeout(startPlayback, 100);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
    setCurrentTrackIdx(prevIdx);
    currentNoteIdxRef.current = 0;
    if (isPlaying) {
      setTimeout(startPlayback, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    };
  }, []);

  const handleScrollToGifts = (e: React.MouseEvent) => {
    e.preventDefault();
    const giftsEl = document.getElementById('gifts');
    if (giftsEl) {
      giftsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles['floating-bottom-actions']}>
      {/* Gift Registry Floating Pill Button */}
      <a
        href="#gifts"
        onClick={handleScrollToGifts}
        className={styles['floating-gift-button']}
        aria-label="View Gift Registry"
      >
        <span className={styles['gift-shine-effect']} aria-hidden="true" />
        <div className={styles['gift-icon-container']}>
          <span className={styles['gift-emoji']}>🎁</span>
          <span className={`${styles['sparkle-dot'] || 'sparkle-dot'} ${styles['s-1'] || 's-1'}`} />
          <span className={`${styles['sparkle-dot'] || 'sparkle-dot'} ${styles['s-2'] || 's-2'}`} />
        </div>
        <div className={styles['gift-text-column']}>
          <div className={styles['gift-title-row']}>
            <span className={styles['gift-title']}>Gift Registry</span>
            <span className={styles['gift-tag']}>Ideas</span>
          </div>

        </div>
      </a>

      {/* Floating Music Player / Play Birthday Music Pill Button */}
      <aside className={styles['floating-music-widget']} aria-label="Panda Birthday Music Player">
      {isExpanded ? (
        <div className={`${styles['player-expanded-card'] || 'player-expanded-card'} card-bamboo`}>
          <div className={styles['player-top-header']}>
            <div className={styles['player-title-row']}>
              <span className={`${styles['player-vinyl-disc'] || 'player-vinyl-disc'} ${isPlaying ? (styles['spinning'] || 'spinning') : ''}`}>
                <span className={styles['disc-inner']}>🐼</span>
              </span>
              <div className={styles['track-info']}>
                <span className={styles['track-name']}>{track.title}</span>
                <span className={styles['track-artist']}>{track.artist}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles['player-minimize-btn']}
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize Music Player"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Controls Bar */}
          <div className={styles['player-controls-row']}>
            <button
              type="button"
              className={styles['control-icon-btn']}
              onClick={handlePrevTrack}
              aria-label="Previous Track"
            >
              <SkipBack size={18} />
            </button>

            <button
              type="button"
              className={styles['play-pause-btn']}
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? <Pause size={20} fill="#FFFFFF" /> : <Play size={20} fill="#FFFFFF" />}
            </button>

            <button
              type="button"
              className={styles['control-icon-btn']}
              onClick={handleNextTrack}
              aria-label="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume Control */}
          <div className={styles['volume-slider-row']}>
            <button
              type="button"
              className={styles['mute-btn']}
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className={styles['volume-range']}
              aria-label="Volume slider"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles['player-mini-pill'] || 'player-mini-pill'} ${isPlaying ? (styles['is-playing'] || 'is-playing') : ''}`}
          onClick={() => setIsExpanded(true)}
          aria-label="Open Birthday Music Player"
        >
          <div className={styles['mini-disc-icon']}>
            <span className={styles['mini-panda-face']}>🐼</span>
            {isPlaying && <span className={styles['music-note-float']}>🎵</span>}
          </div>
          <span className={styles['mini-track-title']}>{isPlaying ? track.title : 'Play Birthday Music'}</span>
          <span
            className={styles['mini-play-toggle']}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePlay();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                handleTogglePlay();
              }
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} fill="#252525" /> : <Play size={14} fill="#252525" />}
          </span>
        </button>
      )}
      </aside>
    </div>
  );
};

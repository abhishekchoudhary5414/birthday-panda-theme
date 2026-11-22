'use client';

import styles from './Navbar.module.css';


import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Sparkles } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Gifts', href: '#gifts' },
  { label: 'Games', href: '#games' },
  { label: 'Fortune Jar', href: '#fortune' },
  { label: 'Wish Wall', href: '#wishes' },
  { label: 'Live Stream', href: '#stream' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [eventData, setEventData] = useState({
    childName: 'Ditvi',
    turningAge: '1',
    eventTitle: "Ditvi's 1st Birthday Party",
  });

  // Fetch dynamic event settings from database
  useEffect(() => {
    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.event) {
          setEventData({
            childName: data.event.childName || 'Ditvi',
            turningAge: data.event.turningAge || '1',
            eventTitle: data.event.eventTitle || "Ditvi's 1st Birthday Party",
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch event details in Navbar:', err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // If on a sub-page (like /gift or /photos or /rsvp), navigate to /#hash
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      <header className={`${styles['navbar-header'] || 'navbar-header'} ${isScrolled ? (styles['scrolled'] || 'scrolled') : ''}`}>
        <div className={styles['navbar-container']}>
          {/* Logo with Cute Panda & Bamboo leaf */}
          <a
            href="#home"
            className={styles['navbar-logo']}
            onClick={(e) => handleLinkClick(e, '#home')}
          >
            <div className={styles['logo-panda-icon']}>
              <svg width="38" height="38" viewBox="0 0 100 100" fill="none">
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
                {/* Mini bamboo leaf on head */}
                <path d="M48 20 C42 12 36 10 32 10 C34 16 38 20 46 22 Z" fill="#789B63" />
                <path d="M52 20 C58 12 64 10 68 10 C66 16 62 20 54 22 Z" fill="#5D8049" />
              </svg>
            </div>
            <div className={styles['logo-text-wrap']}>
              <span className={styles['logo-name']}>
                {eventData.childName}&apos;s {eventData.turningAge === '1' ? '1st' : `${eventData.turningAge}th`} Birthday
              </span>
              <span className={styles['logo-tagline']}>Panda &amp; Bamboo Bash</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className={styles['desktop-nav']} aria-label="Main Navigation">
            <ul className={styles['nav-list']}>
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <li key={item.href} className={styles['nav-item']}>
                    <a
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className={`${styles['nav-link'] || 'nav-link'} ${isActive ? (styles['active'] || 'active') : ''}`}
                    >
                      {item.label}
                      {isActive && <span className={styles['active-dot']} />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Button & Mobile Menu Trigger */}
          <div className={styles['navbar-actions']}>
            <a
              href="#rsvp"
              onClick={(e) => handleLinkClick(e, '#rsvp')}
              className={styles['navbar-rsvp-btn']}
            >
              <Heart size={16} fill="#FFFFFF" />
              <span>RSVP Now</span>
            </a>

            <button
              type="button"
              className={styles['mobile-toggle-btn']}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`${styles['mobile-menu-overlay'] || 'mobile-menu-overlay'} ${isMobileMenuOpen ? (styles['open'] || 'open') : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`${styles['mobile-menu-drawer'] || 'mobile-menu-drawer'} ${isMobileMenuOpen ? (styles['open'] || 'open') : ''}`}>
        <div className={styles['mobile-drawer-header']}>
          <div className={styles['drawer-logo']}>
            <Sparkles size={20} color="var(--accent-gold)" />
            <span>Panda Celebration</span>
          </div>
          <button
            type="button"
            className={styles['drawer-close-btn']}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Navigation"
          >
            <X size={22} />
          </button>
        </div>

        <nav className={styles['mobile-nav-list']}>
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`${styles['mobile-nav-link'] || 'mobile-nav-link'} ${isActive ? (styles['active'] || 'active') : ''}`}
              >
                <span>{item.label}</span>
                {isActive && <span className={styles['mobile-active-pill']}>Here</span>}
              </a>
            );
          })}
        </nav>

        <div className={styles['mobile-drawer-footer']}>
          <a
            href="#rsvp"
            onClick={(e) => handleLinkClick(e, '#rsvp')}
            className={`btn-primary ${styles['w-full'] || 'w-full'}`}
            style={{ width: '100%' }}
          >
            <Heart size={18} fill="#FFFFFF" />
            <span>Join the Panda Party (RSVP)</span>
          </a>
        </div>
      </aside>
    </>
  );
};

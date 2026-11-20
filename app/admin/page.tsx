'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  RefreshCw,
  X,
  Users,
  Search,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Video,
  Hash,
  MessageSquare,
  Gamepad2,
  Image as ImageIcon,
  Send,
  FileText,
  LogOut,
  Gift,
  Download,
  PartyPopper,
  Clock,
  MapPin,
  KeyRound,
} from 'lucide-react';
import { PartyPanda, BambooStalkDecoration } from '@/components/PandaIllustrations';
import styles from './dashboard.module.css';

interface Guest {
  id: number;
  title?: string;
  name: string;
  mobile: string;
  email?: string;
  invite_code: string;
  rsvp_status: string;
  invited: boolean;
  notes?: string;
}

interface Stats {
  totalGuests: number;
  attending: number;
  pending: number;
  declined: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation tabs matching the screenshot
  const [activeTab, setActiveTab] = useState<string>('3');

  // Guest list state
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({ totalGuests: 0, attending: 0, pending: 0, declined: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // New guest form
  const [newTitle, setNewTitle] = useState('Mr.');
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected guest for eCard preview modal
  const [selectedEcardGuest, setSelectedEcardGuest] = useState<Guest | null>(null);

  // Load guests and stats
  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const [guestsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/guests?${params.toString()}`),
        fetch('/api/admin/stats'),
      ]);

      if (guestsRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      const guestsData = await guestsRes.json();
      const statsData = await statsRes.json();

      if (guestsData.guests) setGuests(guestsData.guests);
      if (statsData.stats) setStats(statsData.stats);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, router]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Handle single guest add
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          name: newName.trim(),
          mobile: newMobile.trim(),
          email: newEmail.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to add guest');
        return;
      }

      setNewTitle('Mr.');
      setNewName('');
      setNewMobile('');
      setNewEmail('');
      fetchGuests();
    } catch (err) {
      console.error('Add guest error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle guest delete
  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Are you sure you want to remove this guest?')) return;
    try {
      const res = await fetch(`/api/admin/guests?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchGuests();
      }
    } catch (err) {
      console.error('Delete guest error:', err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Helper to draw a cute panda mascot in HTML5 Canvas matching PartyPanda
  const drawCutePandaOnCanvas = (ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1.0) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Ground Shadow
    ctx.fillStyle = 'rgba(41, 75, 53, 0.1)';
    ctx.beginPath();
    ctx.ellipse(0, 95, 80, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Panda Ears
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(-55, -45, 26, 0, Math.PI * 2);
    ctx.arc(55, -45, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.arc(-55, -45, 15, 0, Math.PI * 2);
    ctx.arc(55, -45, 15, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(0, 52, 60, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Tummy
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 52, 38, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Paws
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(-48, 80, 18, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(48, 80, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.beginPath();
    ctx.ellipse(-52, 38, 18, 15, -0.3, 0, Math.PI * 2);
    ctx.ellipse(52, 38, 18, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Party Birthday Hat
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.moveTo(0, -100);
    ctx.lineTo(26, -42);
    ctx.lineTo(-26, -42);
    ctx.closePath();
    ctx.fill();

    // Hat Stripes
    ctx.strokeStyle = '#E91E63';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-16, -60);
    ctx.lineTo(16, -60);
    ctx.moveTo(-22, -48);
    ctx.lineTo(22, -48);
    ctx.stroke();

    // Hat Pom Pom
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(0, -103, 9, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 62, 54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#DCE8D2';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eye Patches
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(-28, -2, 18, 22, -0.25, 0, Math.PI * 2);
    ctx.ellipse(28, -2, 18, 22, 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (White + Pupil + Sparkle)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-26, -4, 7, 0, Math.PI * 2);
    ctx.arc(26, -4, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(-25, -4, 4, 0, Math.PI * 2);
    ctx.arc(25, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-23, -6, 2, 0, Math.PI * 2);
    ctx.arc(27, -6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute Cheeks
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-42, 14, 11, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(42, 14, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(0, 12, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 16, 12, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Bamboo Cupcake in hands
    ctx.fillStyle = '#D9B66F';
    ctx.beginPath();
    ctx.roundRect(-15, 42, 30, 20, [3]);
    ctx.fill();
    ctx.fillStyle = '#A3C58E';
    ctx.beginPath();
    ctx.arc(0, 42, 15, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(0, 26, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Helper to draw decorative bamboo stalks along the side
  const drawBambooSide = (ctx: CanvasRenderingContext2D, x: number, isRight = false) => {
    ctx.save();
    ctx.translate(x, 0);
    if (isRight) ctx.scale(-1, 1);

    // Stalk Segment
    ctx.fillStyle = '#A3C58E';
    ctx.strokeStyle = '#789B63';
    ctx.lineWidth = 3;

    const segments = [
      { y: 150, h: 180 },
      { y: 340, h: 200 },
      { y: 550, h: 220 },
      { y: 780, h: 220 },
      { y: 1010, h: 150 },
    ];

    segments.forEach((seg) => {
      ctx.beginPath();
      ctx.roundRect(15, seg.y, 16, seg.h, [6]);
      ctx.fill();
      ctx.stroke();

      // Node Ring
      ctx.fillStyle = '#5D8049';
      ctx.beginPath();
      ctx.roundRect(10, seg.y - 4, 26, 8, [4]);
      ctx.fill();

      // Leaf Branch
      ctx.fillStyle = '#789B63';
      ctx.beginPath();
      ctx.ellipse(45, seg.y + 40, 26, 8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(55, seg.y + 70, 24, 7, 0.35, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Handle eCard download as high-res PNG image matching the preview 1:1
  const handleDownloadEcard = (guest: Guest) => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Soft Warm Cream & Bamboo Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, 1200);
    grad.addColorStop(0, '#FFFDF8');
    grad.addColorStop(0.5, '#F5F9F2');
    grad.addColorStop(1, '#FFF9EB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 1200);

    // Subtle bamboo polka/texture dots
    ctx.fillStyle = 'rgba(220, 232, 210, 0.4)';
    for (let x = 60; x < 840; x += 40) {
      for (let y = 60; y < 1140; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Outer Luxury Golden Sand Border & Bamboo Green Inner Frame
    ctx.strokeStyle = '#E8DFCB';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.roundRect(25, 25, 850, 1150, [32]);
    ctx.stroke();

    ctx.strokeStyle = '#789B63';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(42, 42, 816, 1116, [24]);
    ctx.stroke();

    // Corner Accents
    ctx.strokeStyle = '#D9B66F';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(55, 55, 30, 30);
    ctx.strokeRect(815, 55, 30, 30);
    ctx.strokeRect(55, 1115, 30, 30);
    ctx.strokeRect(815, 1115, 30, 30);

    // 3. Side Bamboo Stalks
    drawBambooSide(ctx, 42, false);
    drawBambooSide(ctx, 858, true);

    // 4. Top VIP Badge Pill
    ctx.fillStyle = '#FFF2D1';
    ctx.beginPath();
    ctx.roundRect(240, 80, 420, 52, [26]);
    ctx.fill();
    ctx.strokeStyle = '#D9B66F';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#7A5712';
    ctx.textAlign = 'center';
    ctx.fillText('✨  OFFICIAL VIP BIRTHDAY INVITATION  ✨', 450, 113);

    // 5. Cute Party Mascot Illustration
    drawCutePandaOnCanvas(ctx, 450, 255, 1.35);

    // 6. Celebration Header Title
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#5D8049';
    ctx.fillText('CELEBRATING 1 WONDERFUL YEAR OF SMILES', 450, 400);

    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#294B35';
    ctx.fillText("Ditvi's 1st Birthday Bash", 450, 450);

    // 7. Guest Name Showcase Box
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(120, 485, 660, 120, [22]);
    ctx.fill();
    ctx.strokeStyle = '#789B63';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Guest greeting cursive
    ctx.font = 'italic 30px cursive, sans-serif';
    ctx.fillStyle = '#6C8E58';
    ctx.fillText('Dearest Cordially Invited:', 450, 530);

    // Guest full name
    ctx.font = 'bold 46px sans-serif';
    ctx.fillStyle = '#294B35';
    const fullName = `${guest.title ? guest.title + ' ' : ''}${guest.name}`;
    ctx.fillText(fullName, 450, 582);

    // 8. Invitation Heartfelt Verse
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#4A5B4E';
    ctx.fillText('You are warmly invited to celebrate 365 days of cute panda giggles,', 450, 645);
    ctx.fillText('wobbly baby steps, sweet treats, and bamboo forest adventures!', 450, 680);

    // 9. Party Details Box (matching UI)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(140, 715, 620, 270, [20]);
    ctx.fill();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#789B63';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    ctx.textAlign = 'center';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#294B35';
    ctx.fillText('📅  Saturday, December 12, 2026', 450, 775);
    ctx.fillText('⏰  3:30 PM – 7:30 PM CST', 450, 830);
    ctx.fillText('📍  The Bamboo Pavilion, Austin, TX', 450, 885);

    // Inner Pass Code Pill
    ctx.fillStyle = '#FFF4DC';
    ctx.beginPath();
    ctx.roundRect(280, 920, 340, 45, [10]);
    ctx.fill();
    ctx.strokeStyle = '#E4C882';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#8C6A1E';
    ctx.fillText(`VIP Pass: ${guest.invite_code}`, 450, 951);

    // 10. Footer Love & Signature
    ctx.font = 'italic 36px cursive, sans-serif';
    ctx.fillStyle = '#B58422';
    ctx.fillText('With Love & Happiness, Ditvi & Family 🌿', 450, 1040);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#839788';
    ctx.fillText('Please present this eCard at entrance for check-in', 450, 1090);

    // 11. Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Ditvi-1st-Birthday-eCard-${guest.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar with 12 sections matching the screenshot */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogoShield}>
            <Shield size={18} />
          </div>
          <span className={styles.sidebarTitle}>Event Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.navIcon}>📊</span>
            <span>Overview Dashboard</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '1' ? styles.active : ''}`}
            onClick={() => setActiveTab('1')}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span>1. Event Details</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '2' ? styles.active : ''}`}
            onClick={() => setActiveTab('2')}
          >
            <span className={styles.navIcon}>💌</span>
            <span>2. Invitations</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '3' ? styles.active : ''}`}
            onClick={() => setActiveTab('3')}
          >
            <span className={styles.navIcon}>👥</span>
            <span>3. Guest List</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '4' ? styles.active : ''}`}
            onClick={() => setActiveTab('4')}
          >
            <span className={styles.navIcon}>📥</span>
            <span>4. CSV Import</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '5' ? styles.active : ''}`}
            onClick={() => setActiveTab('5')}
          >
            <span className={styles.navIcon}>📋</span>
            <span>5. RSVP Management</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '6' ? styles.active : ''}`}
            onClick={() => setActiveTab('6')}
          >
            <span className={styles.navIcon}>🎁</span>
            <span>6. Gift Registry</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '7' ? styles.active : ''}`}
            onClick={() => setActiveTab('7')}
          >
            <span className={styles.navIcon}>📺</span>
            <span>7. Live Streaming</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '8' ? styles.active : ''}`}
            onClick={() => setActiveTab('8')}
          >
            <span className={styles.navIcon}>🏷️</span>
            <span>8. Hashtag</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '9' ? styles.active : ''}`}
            onClick={() => setActiveTab('9')}
          >
            <span className={styles.navIcon}>💬</span>
            <span>9. Wish Moderation</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '10' ? styles.active : ''}`}
            onClick={() => setActiveTab('10')}
          >
            <span className={styles.navIcon}>🎮</span>
            <span>10. Birthday Quiz</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '11' ? styles.active : ''}`}
            onClick={() => setActiveTab('11')}
          >
            <span className={styles.navIcon}>📷</span>
            <span>11. Media &amp; Albums</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '12' ? styles.active : ''}`}
            onClick={() => setActiveTab('12')}
          >
            <span className={styles.navIcon}>💖</span>
            <span>12. Thank You Cards</span>
          </button>
        </nav>
      </aside>

      {/* Main Console Content */}
      <main className={styles.mainContent}>
        {/* Top Header Row */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.consoleHeaderTitle}>Birthday Event Management Console</h1>
            <p className={styles.consoleSubtext}>Celebrating Ditvi&apos;s 1st Birthday Celebration</p>
          </div>

          <div className={styles.topActions}>
            <button type="button" onClick={fetchGuests} className={styles.topBtn}>
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`${styles.topBtn} ${styles.closeBtn}`}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Section 3: Guest List Management */}
        {activeTab === '3' && (
          <div>
            <div className={styles.sectionHeader}>
              <Users size={22} color="#3b2a59" />
              <span>Guest List Management ({stats.totalGuests} Guests)</span>
            </div>

            {/* Single Entry Add Form */}
            <div className={styles.addGuestBox}>
              <div className={styles.addGuestTitle}>
                <Plus size={16} />
                <span>Add Guest (Single Entry)</span>
              </div>

              <form onSubmit={handleAddGuest} className={styles.addGuestForm}>
                <select
                  className={styles.titleSelect}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  aria-label="Title"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Miss">Miss</option>
                </select>
                <input
                  type="text"
                  placeholder="Guest Name (e.g. jaya)"
                  className={styles.inputField}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile (e.g. 9691089759)"
                  className={styles.inputField}
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  className={styles.inputField}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button type="submit" disabled={isSubmitting} className={styles.btnAdd}>
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Filter and Search Bar */}
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name, mobile, email, or code..."
                  className={styles.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className={styles.selectFilter}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Guests</option>
                <option value="pending">Pending RSVP</option>
                <option value="confirmed">Confirmed / Attending</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Guest Table */}
            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>GUEST NAME</th>
                    <th className={styles.th}>MOBILE</th>
                    <th className={styles.th}>EMAIL</th>
                    <th className={styles.th}>INVITE CODE</th>
                    <th className={styles.th}>RSVP STATUS</th>
                    <th className={styles.th}>INVITED</th>
                    <th className={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🐼</div>
                        <p>{loading ? 'Loading guests...' : 'No guests found yet. Add your first guest above!'}</p>
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g.id} className={styles.tr}>
                        <td className={`${styles.td} ${styles.guestName}`}>
                          {g.title ? `${g.title} ` : ''}{g.name}
                        </td>
                        <td className={styles.td}>{g.mobile}</td>
                        <td className={styles.td}>{g.email || '—'}</td>
                        <td className={styles.td}>
                          <span className={styles.inviteCodePill}>{g.invite_code}</span>
                        </td>
                        <td className={styles.td}>
                          <span
                            className={`${styles.statusBadge} ${
                              g.rsvp_status === 'confirmed' || g.rsvp_status === 'attending'
                                ? styles.statusConfirmed
                                : g.rsvp_status === 'declined'
                                ? styles.statusDeclined
                                : styles.statusPending
                            }`}
                          >
                            {g.rsvp_status}
                          </span>
                        </td>
                        <td className={styles.td}>{g.invited ? 'Yes' : 'No'}</td>
                        <td className={styles.td}>
                          <div className={styles.actionsGroup}>
                            <button
                              type="button"
                              onClick={() => setSelectedEcardGuest(g)}
                              className={styles.ecardBtn}
                              title="Generate & View eCard"
                            >
                              <Sparkles size={14} />
                              <span>eCard</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGuest(g.id)}
                              className={styles.actionBtn}
                              title="Remove guest"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.sectionHeader}>
              <span>Event Overview &amp; Key Metrics</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Total Invited</span>
                <h3 style={{ fontSize: '1.8rem', color: '#294B35', marginTop: '4px' }}>{stats.totalGuests}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Attending</span>
                <h3 style={{ fontSize: '1.8rem', color: '#3C8D40', marginTop: '4px' }}>{stats.attending}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Pending</span>
                <h3 style={{ fontSize: '1.8rem', color: '#B58422', marginTop: '4px' }}>{stats.pending}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Declined</span>
                <h3 style={{ fontSize: '1.8rem', color: '#D32F2F', marginTop: '4px' }}>{stats.declined}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Other Sections Placeholder Tabs */}
        {activeTab !== '3' && activeTab !== 'overview' && (
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '12px', border: '1px solid #e1e7de', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🐼</span>
            <h3 style={{ marginTop: '12px', color: '#294B35' }}>Console Section Active</h3>
            <p style={{ color: '#6e7e73', marginTop: '4px' }}>This module is connected to the Neon database and ready for updates.</p>
          </div>
        )}
      </main>

      {/* eCard Preview & Download Modal */}
      {selectedEcardGuest && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEcardGuest(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <Sparkles size={18} color="var(--accent-gold)" />
                <span>Personalized Invitation eCard</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedEcardGuest(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.ecardFrame}>
                {/* Decorative Bamboo Stalks */}
                <div className={styles.ecardStalkLeft} aria-hidden="true">
                  <BambooStalkDecoration height={320} />
                </div>
                <div className={styles.ecardStalkRight} aria-hidden="true">
                  <BambooStalkDecoration height={320} />
                </div>

                {/* Top VIP Badge */}
                <div>
                  <span className={styles.ecardTopBadge}>
                    <Sparkles size={13} color="#B58422" />
                    <span>Official VIP Birthday Invitation</span>
                  </span>
                </div>

                {/* Cute Panda Mascot */}
                <div className={styles.ecardMascotWrap}>
                  <PartyPanda size={145} />
                </div>

                {/* Event Titles */}
                <div className={styles.ecardEventSubtitle}>Celebrating 1 Wonderful Year of Smiles</div>
                <h2 className={styles.ecardEventTitle}>
                  Ditvi&apos;s 1st Birthday <span>Bash</span>
                </h2>

                {/* Guest Box */}
                <div className={styles.ecardGuestBox}>
                  <span className={styles.ecardGuestGreeting}>Dearest Cordially Invited:</span>
                  <h3 className={styles.ecardGuestName}>
                    {selectedEcardGuest.title ? `${selectedEcardGuest.title} ` : ''}{selectedEcardGuest.name}
                  </h3>
                </div>

                <p className={styles.ecardInvitationText}>
                  You are warmly invited to celebrate 365 days of cute panda giggles, wobbly baby steps, sweet treats, and bamboo forest adventures!
                </p>

                {/* Party Details Card */}
                <div className={styles.ecardDetailsBox}>
                  <div className={styles.ecardDetailRow}>
                    <Calendar size={16} />
                    <span>Saturday, December 12, 2026</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <Clock size={16} />
                    <span>3:30 PM &ndash; 7:30 PM CST</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <MapPin size={16} />
                    <span>The Bamboo Pavilion, Austin, TX</span>
                  </div>
                  <div className={styles.ecardCodeRow}>
                    <KeyRound size={15} color="#8C6A1E" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6e7e73' }}>VIP Pass:</span>
                    <span className={styles.ecardCodePill}>{selectedEcardGuest.invite_code}</span>
                  </div>
                </div>

                <div className={styles.ecardFooterLove}>
                  With Love &amp; Happiness, Ditvi &amp; Family 🌿
                </div>
                <div className={styles.ecardFootnote}>
                  Please present this eCard at entrance for check-in
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.topBtn}
                onClick={() => setSelectedEcardGuest(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() => handleDownloadEcard(selectedEcardGuest)}
              >
                <Download size={16} />
                <span>Download eCard (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

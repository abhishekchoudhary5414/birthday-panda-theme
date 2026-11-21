'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VideocamIcon from '@mui/icons-material/Videocam';
import TagIcon from '@mui/icons-material/Tag';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LogoutIcon from '@mui/icons-material/Logout';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  // Selected guest for Thank You Card preview modal
  const [selectedThankYouGuest, setSelectedThankYouGuest] = useState<Guest | null>(null);
  // Guest being edited in edit modal
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editTitle, setEditTitle] = useState('Mr.');
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRsvpStatus, setEditRsvpStatus] = useState('pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const ecardRef = useRef<HTMLDivElement>(null);
  const thankYouCardRef = useRef<HTMLDivElement>(null);

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

  // Handle start guest edit
  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setEditTitle(guest.title || 'Mr.');
    setEditName(guest.name || '');
    setEditMobile(guest.mobile || '');
    setEditEmail(guest.email || '');
    setEditRsvpStatus(guest.rsvp_status || 'pending');
  };

  // Handle save guest edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !editName.trim() || !editMobile.trim()) return;

    try {
      setIsUpdating(true);
      const res = await fetch('/api/admin/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGuest.id,
          title: editTitle,
          name: editName.trim(),
          mobile: editMobile.trim(),
          email: editEmail.trim() || null,
          rsvp_status: editRsvpStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to update guest');
        return;
      }

      setEditingGuest(null);
      fetchGuests();
    } catch (err) {
      console.error('Update guest error:', err);
    } finally {
      setIsUpdating(false);
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

  // Helper to draw a panda paw print
  const drawPandaPawCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, size = 18, angle = 0, color = 'rgba(120, 155, 99, 0.35)') => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = color;

    // Main pad
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 Toes
    const toeR = size * 0.32;
    const toeOffsets = [
      { dx: -size * 0.8, dy: -size * 0.8 },
      { dx: -size * 0.3, dy: -size * 1.1 },
      { dx: size * 0.3, dy: -size * 1.1 },
      { dx: size * 0.8, dy: -size * 0.8 },
    ];
    toeOffsets.forEach((t) => {
      ctx.beginPath();
      ctx.arc(t.dx, t.dy, toeR, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Helper to draw festive colorful party balloons
  const drawBalloonsCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, isRight = false) => {
    ctx.save();
    ctx.translate(x, y);
    if (isRight) ctx.scale(-1, 1);

    const balloons = [
      { dx: 0, dy: 0, r: 28, color: '#789B63', knot: '#5D8049' },
      { dx: 34, dy: -20, r: 24, color: '#D9B66F', knot: '#B38D40' },
      { dx: -22, dy: -18, r: 22, color: '#FF9E9E', knot: '#E57373' },
    ];

    // Strings converging down
    balloons.forEach((b) => {
      ctx.strokeStyle = '#8E9E93';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(b.dx, b.dy + b.r);
      ctx.quadraticCurveTo(b.dx * 0.5, b.dy + b.r + 35, 10, 110);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Balloon bodies
    balloons.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(b.dx, b.dy, b.r * 0.85, b.r, 0, 0, Math.PI * 2);
      ctx.fill();

      // Knot
      ctx.fillStyle = b.knot;
      ctx.beginPath();
      ctx.moveTo(b.dx - 4, b.dy + b.r);
      ctx.lineTo(b.dx + 4, b.dy + b.r);
      ctx.lineTo(b.dx, b.dy + b.r + 6);
      ctx.closePath();
      ctx.fill();

      // Soft Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(b.dx - b.r * 0.35, b.dy - b.r * 0.35, b.r * 0.28, b.r * 0.16, -0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Helper to draw cute birthday gift boxes
  const drawGiftBoxCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number, boxW: number, boxH: number, boxColor: string, ribbonColor: string) => {
    ctx.save();
    ctx.translate(x, y);

    // Box Shadow
    ctx.fillStyle = 'rgba(41, 75, 53, 0.15)';
    ctx.beginPath();
    ctx.ellipse(boxW / 2, boxH + 4, boxW * 0.6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Box base
    ctx.fillStyle = boxColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, boxW, boxH, [6]);
    ctx.fill();

    // Box Lid
    const lidW = boxW + 8;
    const lidH = 12;
    ctx.beginPath();
    ctx.roundRect(-4, -4, lidW, lidH, [4]);
    ctx.fill();

    // Vertical Ribbon
    ctx.fillStyle = ribbonColor;
    ctx.fillRect(boxW / 2 - 4, -4, 8, boxH + 4);

    // Horizontal Ribbon
    ctx.fillRect(0, boxH / 2 - 3, boxW, 6);

    // Ribbon Bow
    ctx.beginPath();
    ctx.arc(boxW / 2 - 7, -8, 6, 0, Math.PI * 2);
    ctx.arc(boxW / 2 + 7, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(boxW / 2, -7, 4, 0, Math.PI * 2);
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

  // Direct DOM-to-PNG download ensuring exact 1:1 match with on-screen preview
  const handleDownloadEcard = async (guest: Guest) => {
    if (!ecardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      // Generate crystal-clear PNG directly from preview DOM element
      const dataUrl = await toPng(ecardRef.current, {
        pixelRatio: 2.5, // High resolution output
        cacheBust: true,
        backgroundColor: '#FFFFFF',
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Ditvi-1st-Birthday-Invitation-${guest.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export eCard image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct DOM-to-PNG download for Thank You Card
  const handleDownloadThankYouCard = async (guest: Guest) => {
    if (!thankYouCardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(thankYouCardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FFFFFF',
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Ditvi-Thank-You-Card-${guest.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export Thank You card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className={styles.mobileSidebarBackdrop}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar with 12 sections matching the screenshot */}
      <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''} ${isMobileSidebarOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>
            <div className={styles.sidebarLogoShield}>
              <ShieldIcon sx={{ fontSize: 22 }} />
            </div>
            <div className={styles.sidebarBrandText}>
              <span className={styles.sidebarTitle}>Event Admin</span>
              <span className={styles.sidebarSubtitle}>Birthday Console</span>
            </div>
          </div>
          <div className={styles.sidebarHeaderRight}>
            <span className={styles.sidebarPandaBadge}>🐼</span>
            <button
              type="button"
              className={styles.sidebarToggleBtn}
              onClick={() => {
                if (isMobileSidebarOpen) {
                  setIsMobileSidebarOpen(false);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              title={isMobileSidebarOpen ? 'Close sidebar' : isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle Sidebar"
            >
              {isMobileSidebarOpen ? (
                <CloseIcon sx={{ fontSize: 20 }} />
              ) : isSidebarCollapsed ? (
                <MenuIcon sx={{ fontSize: 18 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionTitle}>Analytics &amp; Main</div>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><DashboardIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>Overview Dashboard</span>
            </div>
            <span className={styles.navChevron}><ChevronRightIcon sx={{ fontSize: 16, opacity: 0.5 }} /></span>
          </button>

          <div className={styles.navSectionTitle}>Planning &amp; Guests</div>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '1' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('1');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><EventNoteIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>1. Event Details</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '2' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('2');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><MarkEmailReadIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>2. Invitations</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '3' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('3');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><PeopleIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>3. Guest List</span>
            </div>
            <span className={styles.navBadge}>{stats.totalGuests}</span>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '4' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('4');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><UploadFileIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>4. CSV Import</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '5' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('5');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><HowToRegIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>5. RSVP Management</span>
            </div>
          </button>

          <div className={styles.navSectionTitle}>Celebration &amp; Media</div>
          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '6' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('6');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><CardGiftcardIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>6. Gift Registry</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '7' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('7');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><VideocamIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>7. Live Streaming</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '8' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('8');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><TagIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>8. Hashtag</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '9' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('9');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><ChatBubbleOutlineIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>9. Wish Moderation</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '10' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('10');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><SportsEsportsIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>10. Birthday Quiz</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '11' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('11');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><PhotoLibraryIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>11. Media &amp; Albums</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === '12' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('12');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><VolunteerActivismIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>12. Thank You Cards</span>
            </div>
          </button>
        </nav>
      </aside>

      {/* Main Console Content */}
      <main className={styles.mainContent}>
        {/* Top Header Row */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.menuHamburgerBtn}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 900) {
                  setIsMobileSidebarOpen(!isMobileSidebarOpen);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
              title="Toggle Menu"
              aria-label="Toggle Navigation Menu"
            >
              <MenuIcon sx={{ fontSize: 22 }} />
            </button>
            <div>
              <h1 className={styles.consoleHeaderTitle}>Birthday Event Management Console</h1>
              <p className={styles.consoleSubtext}>Celebrating Ditvi&apos;s 1st Birthday Celebration</p>
            </div>
          </div>

          <div className={styles.topActions}>
            <button type="button" onClick={fetchGuests} className={styles.topBtn}>
              <RefreshIcon sx={{ fontSize: 16 }} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`${styles.topBtn} ${styles.closeBtn}`}
              title="Sign Out"
            >
              <LogoutIcon sx={{ fontSize: 16 }} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Section 3: Guest List Management */}
        {activeTab === '3' && (
          <div>
            <div className={styles.sectionHeader}>
              <PeopleIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Guest List Management ({stats.totalGuests} Guests)</span>
            </div>

            {/* Single Entry Add Form */}
            <div className={styles.addGuestBox}>
              <div className={styles.addGuestTitle}>
                <AddIcon sx={{ fontSize: 18 }} />
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
                <SearchIcon sx={{ fontSize: 18, color: '#6e7e73' }} className={styles.searchIcon} />
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
                    <th className={styles.th}>GENERATE ECARD</th>
                    <th className={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={styles.emptyState}>
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
                          <div className={styles.cardButtonGroup}>
                            <button
                              type="button"
                              onClick={() => setSelectedEcardGuest(g)}
                              className={styles.ecardBtn}
                              title="Generate & View eCard"
                            >
                              <AutoAwesomeIcon sx={{ fontSize: 15 }} />
                              <span>eCard</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedThankYouGuest(g)}
                              className={styles.thankYouBtn}
                              title="Generate & View Thank You Card"
                            >
                              <FavoriteIcon sx={{ fontSize: 15 }} />
                              <span>Thank You</span>
                            </button>
                          </div>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.actionsGroup}>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(g)}
                              className={styles.editBtn}
                              title="Edit guest"
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGuest(g.id)}
                              className={styles.actionBtn}
                              title="Delete guest"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
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
                <AutoAwesomeIcon sx={{ fontSize: 20, color: 'var(--accent-gold)' }} />
                <span>Personalized Invitation eCard</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedEcardGuest(null)}
                aria-label="Close"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div ref={ecardRef} className={styles.ecardFrame}>
                {/* Bamboo Trees on sides */}
                <div className={styles.ecardBambooTreeLeft} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>
                <div className={styles.ecardBambooTreeRight} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>

                {/* Background Panda Paws */}
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true">🐾</span>

                {/* Friendly Panda Mascot flanked by Balloon & Birthday Cake */}
                <div className={styles.ecardMascotWrap}>
                  <PartyPanda size={125} />
                </div>

                {/* Event Heading - Requested Wording & Styling */}
                <div className={styles.ecardInviteLead}>You Are Invited to</div>
                <h2 className={styles.ecardEventTitle}>
                  Ditvi&apos;s 1st Birthday <span>Party</span>
                </h2>

                {/* Guest Personalization */}
                <div className={styles.ecardGuestSection}>
                  <span className={styles.ecardGuestGreeting}>Invited Guest</span>
                  <h3 className={styles.ecardGuestName}>
                    {selectedEcardGuest.title ? `${selectedEcardGuest.title} ` : ''}{selectedEcardGuest.name}
                  </h3>
                </div>

                <p className={styles.ecardInvitationText}>
                  Please join us for a fun afternoon celebrating Ditvi&apos;s first birthday with family, friends, and treats!
                </p>

                {/* Clean Modern Event Details Card */}
                <div className={styles.ecardDetailsBox}>
                  <div className={styles.ecardDetailRow}>
                    <CalendarMonthIcon sx={{ fontSize: 20, color: '#789B63' }} />
                    <span>Saturday, December 12, 2026</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: '#789B63' }} />
                    <span>3:30 PM &ndash; 7:30 PM CST</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <PlaceIcon sx={{ fontSize: 20, color: '#789B63' }} />
                    <span>The Bamboo Pavilion &bull; Austin, TX</span>
                  </div>
                </div>

                <div className={styles.ecardFooterLove}>
                  Warmly, Ditvi &amp; Family 🌿
                </div>
                <div className={styles.ecardFootnote}>
                  Please present this invitation code at arrival
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
                disabled={isDownloading}
                className={styles.downloadBtn}
                onClick={() => handleDownloadEcard(selectedEcardGuest)}
              >
                <FileDownloadIcon sx={{ fontSize: 18 }} />
                <span>{isDownloading ? 'Generating Image...' : 'Download eCard (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Card Preview & Download Modal */}
      {selectedThankYouGuest && (
        <div className={styles.modalOverlay} onClick={() => setSelectedThankYouGuest(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <FavoriteIcon sx={{ fontSize: 20, color: '#D9B66F' }} />
                <span>Personalized Thank You Card</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedThankYouGuest(null)}
                aria-label="Close"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div ref={thankYouCardRef} className={styles.ecardFrame}>
                {/* Bamboo Trees on sides */}
                <div className={styles.ecardBambooTreeLeft} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>
                <div className={styles.ecardBambooTreeRight} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>

                {/* Background Panda Paws */}
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true">🐾</span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true">🐾</span>

                {/* Friendly Panda Mascot */}
                <div className={styles.ecardMascotWrap}>
                  <PartyPanda size={125} />
                </div>

                {/* Thank You Heading */}
                <div className={styles.ecardInviteLead}>With Sincere Gratitude</div>
                <h2 className={styles.ecardEventTitle}>
                  Thank You for <span>Celebrating!</span>
                </h2>

                {/* Guest Personalization */}
                <div className={styles.ecardGuestSection}>
                  <span className={styles.ecardGuestGreeting}>Dearest Guest</span>
                  <h3 className={styles.ecardGuestName}>
                    {selectedThankYouGuest.title ? `${selectedThankYouGuest.title} ` : ''}{selectedThankYouGuest.name}
                  </h3>
                </div>

                <p className={styles.ecardInvitationText}>
                  Thank you so much for joining us and making <strong>Ditvi&apos;s 1st Birthday</strong> so incredibly memorable, full of giggles, and joyous smiles! Your warm presence, sweet wishes, and love made the celebration complete.
                </p>

                <div className={styles.ecardFooterLove}>
                  Forever Grateful, Ditvi &amp; Family 🌿
                </div>
                <div className={styles.ecardFootnote}>
                  Thank you for being part of our special journey
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.topBtn}
                onClick={() => setSelectedThankYouGuest(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDownloading}
                className={styles.downloadBtn}
                style={{ background: '#8C6A1E' }}
                onClick={() => handleDownloadThankYouCard(selectedThankYouGuest)}
              >
                <FileDownloadIcon sx={{ fontSize: 18 }} />
                <span>{isDownloading ? 'Generating Image...' : 'Download Thank You Card (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {editingGuest && (
        <div className={styles.modalOverlay} onClick={() => setEditingGuest(null)}>
          <div className={styles.editModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <EditIcon sx={{ fontSize: 20, color: '#294B35' }} />
                <span>Edit Guest Details</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditingGuest(null)}
                aria-label="Close"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <select
                  className={styles.editSelect}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Miss">Miss</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guest Name</label>
                <input
                  type="text"
                  className={styles.editInput}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mobile Number</label>
                <input
                  type="text"
                  className={styles.editInput}
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address (Optional)</label>
                <input
                  type="email"
                  className={styles.editInput}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>RSVP Status</label>
                <select
                  className={styles.editSelect}
                  value={editRsvpStatus}
                  onChange={(e) => setEditRsvpStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed / Attending</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className={styles.modalFooter} style={{ padding: '16px 0 0', marginTop: '8px' }}>
                <button
                  type="button"
                  className={styles.topBtn}
                  onClick={() => setEditingGuest(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={styles.btnAdd}
                  style={{ minWidth: '120px' }}
                >
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

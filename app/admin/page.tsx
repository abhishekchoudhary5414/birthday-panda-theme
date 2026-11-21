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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BoltIcon from '@mui/icons-material/Bolt';
import ParkIcon from '@mui/icons-material/Park';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SpaIcon from '@mui/icons-material/Spa';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ForestIcon from '@mui/icons-material/Forest';
import StorageIcon from '@mui/icons-material/Storage';
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
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

interface AdminQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  orderNum?: number;
}

interface QuizAnswerDetail {
  question: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
}

interface QuizSubmission {
  id: number;
  player_name: string;
  score: number;
  total_questions: number;
  answers?: QuizAnswerDetail[];
  submitted_at: string;
}

interface Stats {
  totalGuests: number;
  attending: number;
  pending: number;
  declined: number;
}

interface AdminWish {
  id: number;
  name: string;
  relation?: string;
  phone?: string;
  message: string;
  avatar: string;
  likes: number;
  created_at: string;
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

  // CSV Bulk Import State
  const [guestAddMode, setGuestAddMode] = useState<'single' | 'csv'>('single');
  const [csvParsedGuests, setCsvParsedGuests] = useState<{ title: string; name: string; mobile: string; email: string }[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);
  const [csvUploadError, setCsvUploadError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const wishCardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingA4Pdf, setIsGeneratingA4Pdf] = useState(false);

  // Selected wish for card image preview & download modal
  const [selectedWishCard, setSelectedWishCard] = useState<AdminWish | null>(null);

  // Birthday Quiz Management State
  const [quizList, setQuizList] = useState<AdminQuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOptions, setNewQuizOptions] = useState<string[]>(['', '', '', '']);
  const [newQuizCorrectIndex, setNewQuizCorrectIndex] = useState(0);
  const [newQuizExplanation, setNewQuizExplanation] = useState('');
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  // Edit Quiz Question State
  const [editingQuiz, setEditingQuiz] = useState<AdminQuizQuestion | null>(null);
  const [editQuizQuestion, setEditQuizQuestion] = useState('');
  const [editQuizOptions, setEditQuizOptions] = useState<string[]>(['', '', '', '']);
  const [editQuizCorrectIndex, setEditQuizCorrectIndex] = useState(0);
  const [editQuizExplanation, setEditQuizExplanation] = useState('');
  const [isSavingQuizEdit, setIsSavingQuizEdit] = useState(false);

  // Quiz Submissions (Scores stored in DB)
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>([]);
  const [quizSubmissionsLoading, setQuizSubmissionsLoading] = useState(false);
  const [quizTabMode, setQuizTabMode] = useState<'questions' | 'submissions'>('questions');

  const [quizAlert, setQuizAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Event & Venue Settings State (loaded from /api/admin/event)
  const [eventSettings, setEventSettings] = useState({
    eventTitle: "Ditvi's 1st Birthday Party",
    childName: 'Ditvi',
    turningAge: '1',
    eventDate: 'Saturday, December 12, 2026',
    eventDateIso: '2026-12-12',
    eventTime: '3:30 PM - 7:30 PM CST',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueMapUrl: '',
    contactPhone: '+1 (555) 019-2831',
    contactEmail: 'family@ditvibirthday.com',
    dressCode: 'Pastel forest tones, sage, cream, or panda-inspired accents',
  });
  const [eventSettingsLoading, setEventSettingsLoading] = useState(false);
  const [isSavingEventSettings, setIsSavingEventSettings] = useState(false);
  const [isDeletingVenue, setIsDeletingVenue] = useState(false);
  const [eventAlert, setEventAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch Event Settings
  const fetchEventSettings = useCallback(async () => {
    try {
      setEventSettingsLoading(true);
      const res = await fetch('/api/admin/event');
      if (res.ok) {
        const data = await res.json();
        if (data.event) {
          setEventSettings(data.event);
        }
      }
    } catch (err) {
      console.error('Fetch event settings error:', err);
    } finally {
      setEventSettingsLoading(false);
    }
  }, []);

  // Save Event Settings
  const handleSaveEventSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingEventSettings(true);
      const res = await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventSettings),
      });
      const data = await res.json();
      if (res.ok) {
        setEventAlert({ type: 'success', message: 'Event details successfully updated and saved to database!' });
        setTimeout(() => setEventAlert(null), 4000);
      } else {
        setEventAlert({ type: 'error', message: data.error || 'Failed to update event details' });
      }
    } catch (err) {
      console.error('Save event settings error:', err);
      setEventAlert({ type: 'error', message: 'An error occurred while saving' });
    } finally {
      setIsSavingEventSettings(false);
    }
  };

  // Delete Venue
  const handleDeleteVenue = async () => {
    if (!confirm('Are you sure you want to delete the venue details? The public site and invitation will display "Venue to be announced soon".')) {
      return;
    }
    try {
      setIsDeletingVenue(true);
      const res = await fetch('/api/admin/event', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setEventSettings((prev) => ({
          ...prev,
          venueName: '',
          venueAddress: '',
          venueCity: '',
          venueMapUrl: '',
        }));
        setEventAlert({ type: 'success', message: 'Venue successfully deleted and cleared from database!' });
        setTimeout(() => setEventAlert(null), 4000);
      } else {
        setEventAlert({ type: 'error', message: data.error || 'Failed to delete venue' });
      }
    } catch (err) {
      console.error('Delete venue error:', err);
      setEventAlert({ type: 'error', message: 'An error occurred while deleting venue' });
    } finally {
      setIsDeletingVenue(false);
    }
  };

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

  // Fetch Quiz Questions
  const fetchQuizQuestions = useCallback(async () => {
    try {
      setQuizLoading(true);
      const res = await fetch('/api/admin/quiz');
      if (res.ok) {
        const data = await res.json();
        if (data.questions) setQuizList(data.questions);
      }
    } catch (err) {
      console.error('Fetch quiz error:', err);
    } finally {
      setQuizLoading(false);
    }
  }, []);

  // Fetch Quiz Submissions from Database
  const fetchQuizSubmissions = useCallback(async () => {
    try {
      setQuizSubmissionsLoading(true);
      const res = await fetch('/api/admin/quiz/submissions');
      if (res.ok) {
        const data = await res.json();
        if (data.submissions) setQuizSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Fetch quiz submissions error:', err);
    } finally {
      setQuizSubmissionsLoading(false);
    }
  }, []);

  // Birthday Wishes State (from Neon DB)
  const [wishesList, setWishesList] = useState<AdminWish[]>([]);
  const [wishesLoading, setWishesLoading] = useState(false);
  const [wishSearch, setWishSearch] = useState('');
  const [wishViewMode, setWishViewMode] = useState<'cards' | 'table'>('cards');
  const [wishAlert, setWishAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDeletingWish, setIsDeletingWish] = useState(false);

  // Fetch Wishes from Neon DB
  const fetchWishes = useCallback(async () => {
    try {
      setWishesLoading(true);
      const params = new URLSearchParams();
      if (wishSearch) params.set('search', wishSearch);
      const res = await fetch(`/api/admin/wishes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.wishes) setWishesList(data.wishes);
      }
    } catch (err) {
      console.error('Fetch wishes error:', err);
    } finally {
      setWishesLoading(false);
    }
  }, [wishSearch]);

  // Delete Wish
  const handleDeleteWish = async (id: number) => {
    if (!confirm('Are you sure you want to remove this birthday wish from the database?')) return;
    try {
      setIsDeletingWish(true);
      const res = await fetch(`/api/admin/wishes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWishAlert({ type: 'success', message: 'Birthday wish deleted from database.' });
        setTimeout(() => setWishAlert(null), 3000);
        fetchWishes();
      } else {
        alert('Failed to delete wish');
      }
    } catch (err) {
      console.error('Delete wish error:', err);
    } finally {
      setIsDeletingWish(false);
    }
  };

  // Print All Wishes
  const handlePrintWishes = () => {
    window.print();
  };

  // Download Wishes as PDF
  const handleDownloadWishesPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(41, 75, 53);
      doc.rect(0, 0, 595.28, 70, 'F');

      // Gold Accent Line
      doc.setFillColor(217, 182, 111);
      doc.rect(0, 70, 595.28, 4, 'F');

      // Title & Event Info
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text("Ditvi's 1st Birthday Celebration", 40, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text('Official Birthday Wish Keepsake & Guestbook Report', 40, 54);

      // Event Info Row
      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Total Birthday Wishes:', 40, 95);
      doc.setFont('helvetica', 'normal');
      doc.text(`${wishesList.length} heartfelt notes recorded in database`, 160, 95);

      // Table data
      const tableData = wishesList.map((w, index) => [
        (index + 1).toString(),
        w.name,
        w.relation || '—',
        w.phone || '—',
        w.message,
        new Date(w.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      ]);

      autoTable(doc, {
        startY: 110,
        head: [['#', 'Guest Name', 'Relation', 'Phone', 'Birthday Wish / Message', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 75, 53],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [50, 50, 50],
          cellPadding: 6,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 247],
        },
        columnStyles: {
          0: { cellWidth: 26, halign: 'center' },
          1: { cellWidth: 105, fontStyle: 'bold' },
          2: { cellWidth: 80 },
          3: { cellWidth: 85 },
          4: { cellWidth: 160 },
          5: { cellWidth: 59, halign: 'center' },
        },
        margin: { left: 40, right: 40, bottom: 40 },
        didDrawPage: (data) => {
          const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
          const currentPage = (data as any).pageNumber || 1;
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text(
            `Ditvi's 1st Birthday Wish Keepsake | Page ${currentPage} of ${pageCount}`,
            40,
            doc.internal.pageSize.height - 20
          );
        },
      });

      doc.save(`Ditvi_Birthday_Wishes_Keepsake_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to generate wishes PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Download All Wishes in A4 Size with 4 Printable Keepsake Cards per Page (2x2 Grid)
  // High-fidelity native vector PDF rendering ensuring instant, bulletproof generation with zero blank cards
  const handleDownloadWishesA4CardsPdf = async () => {
    if (wishesList.length === 0) {
      alert('No wishes to download.');
      return;
    }

    try {
      setIsGeneratingA4Pdf(true);
      const { default: jsPDF } = await import('jspdf');

      // A4 dimensions in pt: 595.28 x 841.89
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const headerHeight = 56;
      const marginX = 22;
      const marginY = headerHeight + 14;
      const gapX = 14;
      const gapY = 14;
      const cols = 2;
      const rows = 2;
      const cardsPerPage = 4;

      const cardWidth = (pageWidth - marginX * 2 - gapX * (cols - 1)) / cols; // ~268.6pt
      const cardHeight = (pageHeight - marginY - 24 - gapY * (rows - 1)) / rows; // ~368.9pt

      const totalPages = Math.ceil(wishesList.length / cardsPerPage);

      wishesList.forEach((wish, idx) => {
        const pageIndex = Math.floor(idx / cardsPerPage);
        const cardIndexOnPage = idx % cardsPerPage;

        // Add page if starting new group of 4
        if (cardIndexOnPage === 0 && pageIndex > 0) {
          doc.addPage();
        }

        // Draw Sheet Header on each page
        if (cardIndexOnPage === 0) {
          // Dark forest green header banner
          doc.setFillColor(41, 75, 53); // #294B35
          doc.rect(0, 0, pageWidth, headerHeight, 'F');

          // Gold ribbon line
          doc.setFillColor(217, 182, 111); // #D9B66F
          doc.rect(0, headerHeight, pageWidth, 3, 'F');

          // Header Text
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(15);
          doc.text("Ditvi's 1st Birthday - Guestbook Keepsake Cards", marginX, 26);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(
            `A4 Printable Cards Edition • 4 Cards Per Sheet (Total ${wishesList.length} Wishes)`,
            marginX,
            42
          );

          // Page Number
          doc.setFontSize(9);
          doc.setTextColor(217, 182, 111);
          doc.text(`Sheet ${pageIndex + 1} of ${totalPages}`, pageWidth - marginX - 70, 32);
        }

        // Calculate (x, y) on A4 sheet
        const col = cardIndexOnPage % cols;
        const row = Math.floor(cardIndexOnPage / cols);
        const x = marginX + col * (cardWidth + gapX);
        const y = marginY + row * (cardHeight + gapY);

        const centerX = x + cardWidth / 2;

        // ==========================================
        // 1. CARD CONTAINER (Personal card frame style)
        // ==========================================
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(220, 232, 210);
        doc.setLineWidth(1.4);
        doc.roundedRect(x, y, cardWidth, cardHeight, 14, 14, 'FD');

        // Draw bamboo tree stalks on left & right margins
        const drawStalk = (bx: number) => {
          const stalkHeight = cardHeight - 36;
          const stalkY = y + 18;
          const segments = 10;
          const segH = stalkHeight / segments;

          for (let s = 0; s < segments; s++) {
            const sy = stalkY + s * segH;
            // Stem
            doc.setFillColor(145, 178, 128); // #91b280
            doc.roundedRect(bx, sy + 1.5, 3.5, segH - 3, 1, 1, 'F');
            // Joint node
            doc.setFillColor(80, 115, 68);
            doc.roundedRect(bx - 1, sy, 5.5, 2, 0.8, 0.8, 'F');
            // Little leaf alternating
            doc.setFillColor(120, 155, 99);
            if (s % 2 === 0) {
              doc.ellipse(bx - 3.5, sy + 4, 4, 1.6, 'F');
            } else {
              doc.ellipse(bx + 7, sy + 4, 4, 1.6, 'F');
            }
          }
        };

        drawStalk(x + 7);
        drawStalk(x + cardWidth - 11);

        // Draw 4 corner gold paw prints
        const drawPawPrint = (px: number, py: number) => {
          doc.setFillColor(217, 182, 111);
          doc.ellipse(px, py, 3.2, 2.4, 'F');
          doc.circle(px - 2.8, py - 3.2, 1.1, 'F');
          doc.circle(px - 1, py - 4.2, 1.1, 'F');
          doc.circle(px + 1.2, py - 4.2, 1.1, 'F');
          doc.circle(px + 3, py - 3.2, 1.1, 'F');
        };

        drawPawPrint(x + 22, y + 22);
        drawPawPrint(x + cardWidth - 22, y + 22);
        drawPawPrint(x + 22, y + cardHeight - 22);
        drawPawPrint(x + cardWidth - 22, y + cardHeight - 22);

        // ==========================================
        // 2. PARTY PANDA MASCOT (Exact matching illustration)
        // ==========================================
        const mascotY = y + 42;
        const scale = 0.92;
        const r = (val: number) => val * scale;

        // Ears (Dark)
        doc.setFillColor(35, 45, 38);
        doc.circle(centerX - r(15), mascotY - r(15), r(7.5), 'F');
        doc.circle(centerX + r(15), mascotY - r(15), r(7.5), 'F');

        // Inner pink ears
        doc.setFillColor(255, 205, 210);
        doc.circle(centerX - r(15), mascotY - r(15), r(3.5), 'F');
        doc.circle(centerX + r(15), mascotY - r(15), r(3.5), 'F');

        // Panda Face
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(215, 225, 210);
        doc.setLineWidth(1);
        doc.circle(centerX, mascotY, r(19), 'FD');

        // Eye Patches
        doc.setFillColor(45, 55, 48);
        doc.ellipse(centerX - r(7), mascotY - r(2), r(4.5), r(6), 'F');
        doc.ellipse(centerX + r(7), mascotY - r(2), r(4.5), r(6), 'F');

        // Eye highlights
        doc.setFillColor(255, 255, 255);
        doc.circle(centerX - r(6), mascotY - r(3.5), r(1.8), 'F');
        doc.circle(centerX + r(8), mascotY - r(3.5), r(1.8), 'F');

        // Blush cheeks
        doc.setFillColor(255, 195, 205);
        doc.ellipse(centerX - r(11), mascotY + r(5), r(3.2), r(2), 'F');
        doc.ellipse(centerX + r(11), mascotY + r(5), r(3.2), r(2), 'F');

        // Nose
        doc.setFillColor(30, 35, 30);
        doc.ellipse(centerX, mascotY + r(3), r(2.6), r(1.6), 'F');

        // Gold Party Hat with white pom-pom
        doc.setFillColor(217, 182, 111); // Gold #D9B66F
        doc.triangle(centerX - r(7), mascotY - r(18), centerX + r(7), mascotY - r(18), centerX, mascotY - r(32), 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(centerX, mascotY - r(33), r(2.8), 'F');

        // ==========================================
        // 3. CARD HEADINGS (Exact match to personal card)
        // ==========================================
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(181, 132, 34); // #B58422 Gold
        doc.text("A HEARTFELT BIRTHDAY WISH FOR DITVI", centerX, y + 80, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(41, 75, 53); // #294B35
        doc.text("Ditvi's 1st Birthday Keepsake", centerX, y + 96, { align: 'center' });

        // Thin decorative gold divider
        doc.setFillColor(217, 182, 111);
        doc.rect(centerX - 42, y + 102, 84, 1.2, 'F');

        // ==========================================
        // 4. AUTHOR / GUEST INFO SECTION
        // ==========================================
        const authorBoxY = y + 112;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(110, 126, 115); // #6e7e73
        const relationLabel = wish.relation ? `${wish.relation.toUpperCase()} • ` : '';
        doc.text(`${relationLabel}WISH FROM`, centerX, authorBoxY, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(41, 75, 53);
        const guestName = wish.name.length > 25 ? wish.name.slice(0, 23) + '...' : wish.name;
        doc.text(guestName, centerX, authorBoxY + 14, { align: 'center' });

        if (wish.phone) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(90, 105, 95);
          doc.text(`Phone: ${wish.phone}`, centerX, authorBoxY + 26, { align: 'center' });
        }

        // ==========================================
        // 5. MESSAGE QUOTE BOX
        // ==========================================
        const quoteBoxX = x + 22;
        const quoteBoxY = y + 156;
        const quoteBoxW = cardWidth - 44;
        const quoteBoxH = cardHeight - 212;

        // Background
        doc.setFillColor(248, 250, 247); // #f8faf7
        doc.setDrawColor(220, 232, 210);
        doc.setLineWidth(1);
        doc.roundedRect(quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH, 9, 9, 'FD');

        // Quote Message Text
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(41, 75, 53);
        const splitMsg = doc.splitTextToSize(`"${wish.message}"`, quoteBoxW - 18);
        doc.text(splitMsg.slice(0, 7), quoteBoxX + 9, quoteBoxY + 18);

        // ==========================================
        // 6. FOOTER LOVE NOTE & MEMORY DATE
        // ==========================================
        const footerY = y + cardHeight - 44;

        // "With Love & Giant Panda Hugs"
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(217, 182, 111); // Accent gold
        doc.text("With Love & Giant Panda Hugs", centerX, footerY, { align: 'center' });

        // Likes & Date sub-row
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(110, 126, 115);
        const dateStr = new Date(wish.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        doc.text(
          `Recorded on ${dateStr} • Ditvi's Memory Wall (${wish.likes || 1} Likes)`,
          centerX,
          footerY + 13,
          { align: 'center' }
        );

        // Sheet footer bottom of page
        if (cardIndexOnPage === cardsPerPage - 1 || idx === wishesList.length - 1) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(130, 145, 135);
          doc.text(
            `Ditvi's 1st Birthday Celebration • Official Memory Keepsake • Sheet ${pageIndex + 1} of ${totalPages}`,
            marginX,
            pageHeight - 10
          );
        }
      });

      doc.save(`Ditvi_Birthday_Wishes_4_Cards_A4_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to generate 4-card A4 PDF:', err);
      alert('Failed to generate A4 Cards PDF. Please try again.');
    } finally {
      setIsGeneratingA4Pdf(false);
    }
  };

  // Download All Wishes Data as Excel/CSV Spreadsheet
  const handleDownloadWishesCsv = () => {
    if (wishesList.length === 0) {
      alert('No wishes to export.');
      return;
    }
    const headers = ['ID', 'Guest Name', 'Relationship', 'Phone Number', 'Birthday Message', 'Likes', 'Date Submitted'];
    const rows = wishesList.map((w) => [
      w.id,
      `"${(w.name || '').replace(/"/g, '""')}"`,
      `"${(w.relation || '').replace(/"/g, '""')}"`,
      `"${(w.phone || '').replace(/"/g, '""')}"`,
      `"${(w.message || '').replace(/"/g, '""')}"`,
      w.likes || 1,
      `"${new Date(w.created_at).toLocaleString('en-US')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ditvi_Birthday_Wishes_All_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate and Download Wish Image (PNG)
  const handleDownloadWishImage = async (wish: AdminWish) => {
    if (!wishCardRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(wishCardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FFFFFF',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Ditvi-Birthday-Wish-${(wish.name || 'guest').replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to generate wish image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchQuizQuestions();
    fetchQuizSubmissions();
    fetchEventSettings();
    fetchWishes();
  }, [fetchGuests, fetchQuizQuestions, fetchQuizSubmissions, fetchEventSettings, fetchWishes]);

  useEffect(() => {
    if (activeTab === '1') {
      fetchEventSettings();
    }
    if (activeTab === '9') {
      fetchWishes();
    }
    if (activeTab === '10') {
      fetchQuizQuestions();
      fetchQuizSubmissions();
    }
  }, [activeTab, fetchEventSettings, fetchWishes, fetchQuizQuestions, fetchQuizSubmissions]);

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

  // Download CSV Template
  const handleDownloadCsvTemplate = () => {
    const csvContent = 'Title,Name,Mobile,Email\nMr.,John Doe,9876543210,john@example.com\nMiss,Priya Sharma,9876543211,priya@example.com\nMr.,Ajay Verma,9876543212,ajay@example.com\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ditvi_guest_list_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Parse CSV File
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCsvUploadSuccess(null);
    setCsvUploadError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvUploadError('Please select a valid .csv file');
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setCsvUploadError('CSV file is empty');
          return;
        }

        const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          setCsvUploadError('CSV must include header row and at least one guest row');
          return;
        }

        // Parse header
        const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
        const titleIdx = header.findIndex((h) => h.includes('title'));
        const nameIdx = header.findIndex((h) => h.includes('name'));
        const mobileIdx = header.findIndex((h) => h.includes('mobile') || h.includes('phone') || h.includes('contact'));
        const emailIdx = header.findIndex((h) => h.includes('email') || h.includes('mail'));

        const parsed: { title: string; name: string; mobile: string; email: string }[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
          if (row.length === 0 || row.every((c) => c === '')) continue;

          const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx] : 'Mr.';
          const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : row[1] || row[0] || '';
          const mobile = mobileIdx !== -1 && row[mobileIdx] ? row[mobileIdx] : row[2] || '';
          const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx] : row[3] || '';

          if (name && mobile) {
            parsed.push({ title, name, mobile, email });
          }
        }

        if (parsed.length === 0) {
          setCsvUploadError('No valid rows found. Please ensure "Name" and "Mobile" columns are provided.');
        } else {
          setCsvParsedGuests(parsed);
        }
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setCsvUploadError('Failed to parse CSV file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  // Submit CSV Bulk Upload
  const handleCsvUploadSubmit = async () => {
    if (csvParsedGuests.length === 0) return;

    try {
      setIsUploadingCsv(true);
      setCsvUploadError(null);
      setCsvUploadSuccess(null);

      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: csvParsedGuests }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCsvUploadError(data.error || 'Failed to upload CSV');
        return;
      }

      setCsvUploadSuccess(`Successfully imported ${data.count || csvParsedGuests.length} guests!`);
      setCsvParsedGuests([]);
      setCsvFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchGuests();
    } catch (err) {
      console.error('CSV upload submit error:', err);
      setCsvUploadError('Network error while importing guests');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  // Download Guest List in PDF format
  const handleDownloadPdf = async () => {
    if (guests.length === 0) return;

    try {
      setIsGeneratingPdf(true);
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Header Banner - Forest Green
      doc.setFillColor(41, 75, 53); // #294B35
      doc.rect(0, 0, 595.28, 70, 'F');

      // Gold Accent Line
      doc.setFillColor(217, 182, 111); // #D9B66F
      doc.rect(0, 70, 595.28, 4, 'F');

      // Title & Event Info
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text("Ditvi's 1st Birthday Celebration", 40, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text('Official Guest List & RSVP Status Report', 40, 54);

      // Event Details
      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Event Date:', 40, 95);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${eventSettings.eventDate || 'Saturday, December 12, 2026'}${eventSettings.eventTime ? ` (${eventSettings.eventTime})` : ''}`,
        105,
        95
      );

      doc.setFont('helvetica', 'bold');
      doc.text('Venue:', 40, 110);
      doc.setFont('helvetica', 'normal');
      doc.text(
        [eventSettings.venueName, eventSettings.venueCity].filter(Boolean).join(', ') || 'To be announced soon by hosts',
        80,
        110
      );

      // Stats Pill summary box
      doc.setFillColor(248, 250, 247);
      doc.setDrawColor(220, 232, 210);
      doc.roundedRect(40, 122, 515, 34, 4, 4, 'FD');

      doc.setFontSize(9.5);
      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Guests: ${stats.totalGuests}`, 55, 143);
      doc.text(`Attending: ${stats.attending}`, 180, 143);
      doc.text(`Pending: ${stats.pending}`, 300, 143);
      doc.text(`Declined: ${stats.declined}`, 420, 143);

      // Table rows
      const tableData = guests.map((g, index) => [
        (index + 1).toString(),
        `${g.title || 'Mr.'} ${g.name}`,
        g.mobile || '—',
        g.email || '—',
        g.invite_code || '—',
        g.rsvp_status ? g.rsvp_status.toUpperCase() : 'PENDING',
      ]);

      autoTable(doc, {
        startY: 168,
        head: [['#', 'Guest Name', 'Mobile', 'Email', 'Invite Code', 'RSVP Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 75, 53],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [50, 50, 50],
          cellPadding: 5,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 247],
        },
        columnStyles: {
          0: { cellWidth: 26, halign: 'center' },
          1: { cellWidth: 130, fontStyle: 'bold' },
          2: { cellWidth: 95 },
          3: { cellWidth: 120 },
          4: { cellWidth: 70, halign: 'center' },
          5: { cellWidth: 74, halign: 'center' },
        },
        margin: { left: 40, right: 40, bottom: 40 },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
          const currentPage = (data as any).pageNumber || 1;
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text(
            `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} | Page ${currentPage} of ${pageCount}`,
            40,
            doc.internal.pageSize.height - 20
          );
        },
      });

      doc.save(`Ditvi_Birthday_Guest_List_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle quick RSVP change from RSVP Management tab
  const handleRsvpStatusChange = async (guestId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: guestId,
          rsvp_status: newStatus,
        }),
      });
      if (res.ok) {
        fetchGuests();
      }
    } catch (err) {
      console.error('Failed to update guest RSVP status:', err);
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

  // Add Quiz Question
  const handleAddQuizQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQuestion.trim()) return;

    const validOptions = newQuizOptions.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options for the quiz question.');
      return;
    }

    try {
      setIsAddingQuiz(true);
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuizQuestion.trim(),
          options: newQuizOptions.map((o) => o.trim() || 'Option'),
          correctIndex: newQuizCorrectIndex,
          explanation: newQuizExplanation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to add quiz question');
        return;
      }

      setNewQuizQuestion('');
      setNewQuizOptions(['', '', '', '']);
      setNewQuizCorrectIndex(0);
      setNewQuizExplanation('');
      setQuizAlert({ type: 'success', message: 'New quiz question added! It is now live on the homepage.' });
      setTimeout(() => setQuizAlert(null), 4000);
      fetchQuizQuestions();
    } catch (err) {
      console.error('Add quiz question error:', err);
    } finally {
      setIsAddingQuiz(false);
    }
  };

  // Open Edit Quiz Modal
  const handleOpenEditQuiz = (q: AdminQuizQuestion) => {
    setEditingQuiz(q);
    setEditQuizQuestion(q.question);
    const opts = [...q.options];
    while (opts.length < 4) opts.push('');
    setEditQuizOptions(opts);
    setEditQuizCorrectIndex(q.correctIndex);
    setEditQuizExplanation(q.explanation || '');
  };

  // Save Quiz Edit
  const handleSaveQuizEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz || !editQuizQuestion.trim()) return;

    const validOptions = editQuizOptions.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }

    try {
      setIsSavingQuizEdit(true);
      const res = await fetch('/api/admin/quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuiz.id,
          question: editQuizQuestion.trim(),
          options: editQuizOptions.map((o) => o.trim() || 'Option'),
          correctIndex: editQuizCorrectIndex,
          explanation: editQuizExplanation.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update quiz question');
        return;
      }

      setEditingQuiz(null);
      setQuizAlert({ type: 'success', message: 'Quiz question updated and refreshed on the homepage!' });
      setTimeout(() => setQuizAlert(null), 4000);
      fetchQuizQuestions();
    } catch (err) {
      console.error('Save quiz error:', err);
    } finally {
      setIsSavingQuizEdit(false);
    }
  };

  // Delete Quiz Question
  const handleDeleteQuizQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to remove this quiz question?')) return;
    try {
      const res = await fetch(`/api/admin/quiz?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuizAlert({ type: 'success', message: 'Question removed.' });
        setTimeout(() => setQuizAlert(null), 3000);
        fetchQuizQuestions();
      } else {
        alert('Failed to delete question');
      }
    } catch (err) {
      console.error('Delete quiz error:', err);
    }
  };

  // Delete Quiz Submission from Database
  const handleDeleteQuizSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this score submission?')) return;
    try {
      const res = await fetch(`/api/admin/quiz/submissions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuizAlert({ type: 'success', message: 'Score record deleted from database.' });
        setTimeout(() => setQuizAlert(null), 3000);
        fetchQuizSubmissions();
      }
    } catch (err) {
      console.error('Delete submission error:', err);
    }
  };

  const [isGeneratingQuizPdf, setIsGeneratingQuizPdf] = useState(false);

  // Download PDF for a single particular person with their questions & answers
  const handleDownloadSingleSubmissionPdf = async (sub: QuizSubmission) => {
    try {
      setIsGeneratingQuizPdf(true);
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Header Banner - Forest Green
      doc.setFillColor(41, 75, 53); // #294B35
      doc.rect(0, 0, 595.28, 70, 'F');

      // Gold Accent Line
      doc.setFillColor(217, 182, 111); // #D9B66F
      doc.rect(0, 70, 595.28, 4, 'F');

      // Title & Event Info
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("Ditvi's 1st Birthday Celebration", 40, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text('Individual Guest Quiz Performance Report', 40, 54);

      // Player Information Box
      doc.setFillColor(248, 250, 247);
      doc.setDrawColor(220, 232, 210);
      doc.roundedRect(40, 90, 515, 60, 6, 6, 'FD');

      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Player: ${sub.player_name}`, 55, 115);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const pct = Math.round((sub.score / sub.total_questions) * 100);
      doc.text(`Score: ${sub.score} / ${sub.total_questions} (${pct}%)`, 55, 134);

      const dateStr = new Date(sub.submitted_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Submitted On: ${dateStr}`, 320, 134);

      // Questions & Answers Table
      const answers = sub.answers || [];
      const tableData =
        answers.length > 0
          ? answers.map((a, idx) => [
              (idx + 1).toString(),
              a.question || `Question ${idx + 1}`,
              a.selectedOption || '—',
              a.correctOption || '—',
              a.isCorrect ? 'CORRECT' : 'WRONG',
            ])
          : [
              ['1', 'General Quiz Attempt', `${sub.score} points scored`, '—', `${pct}%`],
            ];

      autoTable(doc, {
        startY: 165,
        head: [['#', 'Question', 'Guest Answer', 'Correct Answer', 'Result']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 75, 53],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [50, 50, 50],
          cellPadding: 6,
        },
        columnStyles: {
          0: { cellWidth: 26, halign: 'center' },
          1: { cellWidth: 190 },
          2: { cellWidth: 120 },
          3: { cellWidth: 110 },
          4: { cellWidth: 69, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 4) {
            if (data.cell.raw === 'CORRECT') {
              data.cell.styles.textColor = [46, 125, 50]; // Green
            } else if (data.cell.raw === 'WRONG') {
              data.cell.styles.textColor = [198, 40, 40]; // Red
            }
          }
        },
        margin: { left: 40, right: 40, bottom: 40 },
        didDrawPage: (data) => {
          const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
          const currentPage = (data as any).pageNumber || 1;
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text(
            `Ditvi's 1st Birthday | Generated on ${new Date().toLocaleDateString('en-US')} | Page ${currentPage} of ${pageCount}`,
            40,
            doc.internal.pageSize.height - 20
          );
        },
      });

      const cleanName = sub.player_name.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Ditvi_Quiz_${cleanName}_Report.pdf`);
    } catch (err) {
      console.error('Error generating single quiz PDF:', err);
      alert('Failed to generate PDF for this person. Please try again.');
    } finally {
      setIsGeneratingQuizPdf(false);
    }
  };

  // Download Master PDF for ALL quiz submissions with question & answer breakdown
  const handleDownloadAllSubmissionsPdf = async () => {
    if (quizSubmissions.length === 0) return;

    try {
      setIsGeneratingQuizPdf(true);
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(41, 75, 53);
      doc.rect(0, 0, 595.28, 70, 'F');

      // Gold Accent Line
      doc.setFillColor(217, 182, 111);
      doc.rect(0, 70, 595.28, 4, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("Ditvi's 1st Birthday Celebration", 40, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.text('All Guest Quiz Submissions & Answers Master Report', 40, 54);

      // Summary Stats Box
      doc.setFillColor(248, 250, 247);
      doc.setDrawColor(220, 232, 210);
      doc.roundedRect(40, 90, 515, 40, 4, 4, 'FD');

      const totalSubs = quizSubmissions.length;
      const perfectSubs = quizSubmissions.filter((s) => s.score === s.total_questions).length;
      const avgScore = (quizSubmissions.reduce((acc, s) => acc + s.score, 0) / (totalSubs || 1)).toFixed(1);

      doc.setFontSize(10);
      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Players: ${totalSubs}`, 55, 115);
      doc.text(`Perfect Scores (100%): ${perfectSubs}`, 220, 115);
      doc.text(`Average Score: ${avgScore}`, 400, 115);

      // Master Summary Table
      const summaryRows = quizSubmissions.map((s, idx) => {
        const pct = Math.round((s.score / s.total_questions) * 100);
        const dateStr = new Date(s.submitted_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return [
          (idx + 1).toString(),
          s.player_name,
          `${s.score} / ${s.total_questions}`,
          `${pct}%`,
          dateStr,
        ];
      });

      autoTable(doc, {
        startY: 145,
        head: [['#', 'Player Name', 'Score', 'Percentage', 'Submitted At']],
        body: summaryRows,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 75, 53],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8.5,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 26, halign: 'center' },
          1: { cellWidth: 170, fontStyle: 'bold' },
          2: { cellWidth: 80, halign: 'center' },
          3: { cellWidth: 80, halign: 'center' },
          4: { cellWidth: 159 },
        },
        margin: { left: 40, right: 40, bottom: 40 },
      });

      // Detailed question-by-question breakdown for each submission
      for (let i = 0; i < quizSubmissions.length; i++) {
        const s = quizSubmissions[i];
        if (!s.answers || s.answers.length === 0) continue;

        doc.addPage();

        // Individual Player Banner on new page
        doc.setFillColor(41, 75, 53);
        doc.rect(40, 40, 515, 34, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Player: ${s.player_name}  —  Score: ${s.score} / ${s.total_questions}`, 52, 62);

        const answersData = s.answers.map((a, aIdx) => [
          (aIdx + 1).toString(),
          a.question,
          a.selectedOption || '—',
          a.correctOption || '—',
          a.isCorrect ? 'CORRECT' : 'WRONG',
        ]);

        autoTable(doc, {
          startY: 85,
          head: [['#', 'Question', 'Guest Answer', 'Correct Answer', 'Result']],
          body: answersData,
          theme: 'striped',
          headStyles: {
            fillColor: [60, 141, 64],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 8.5,
            cellPadding: 5,
          },
          columnStyles: {
            0: { cellWidth: 26, halign: 'center' },
            1: { cellWidth: 190 },
            2: { cellWidth: 120 },
            3: { cellWidth: 110 },
            4: { cellWidth: 69, halign: 'center', fontStyle: 'bold' },
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
              if (data.cell.raw === 'CORRECT') {
                data.cell.styles.textColor = [46, 125, 50];
              } else if (data.cell.raw === 'WRONG') {
                data.cell.styles.textColor = [198, 40, 40];
              }
            }
          },
          margin: { left: 40, right: 40, bottom: 40 },
          didDrawPage: (data) => {
            const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
            const currentPage = (data as any).pageNumber || 1;
            doc.setFontSize(8);
            doc.setTextColor(140, 140, 140);
            doc.text(
              `Ditvi's 1st Birthday Master Quiz Report | Page ${currentPage} of ${pageCount}`,
              40,
              doc.internal.pageSize.height - 20
            );
          },
        });
      }

      doc.save(`Ditvi_Birthday_All_Quiz_Submissions_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generating all quiz PDF:', err);
      alert('Failed to generate master PDF report. Please try again.');
    } finally {
      setIsGeneratingQuizPdf(false);
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
            <span className={styles.sidebarPandaBadge}>
              <ChildCareIcon sx={{ fontSize: 18, color: '#3c8d40' }} />
            </span>
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
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle Sidebar"
            >
              {isSidebarCollapsed ? (
                <MenuIcon sx={{ fontSize: 20 }} />
              ) : (
                <CloseIcon sx={{ fontSize: 20 }} />
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
              <span className={styles.navItemText}>9. Wish Wall</span>
            </div>
            {wishesList.length > 0 && <span className={styles.navBadge}>{wishesList.length}</span>}
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
            {quizList.length > 0 && <span className={styles.navBadge}>{quizList.length}</span>}
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
      <main className={`${styles.mainContent} ${isSidebarCollapsed ? styles.mainContentShiftCollapsed : ''}`}>
        {/* Top Header Row */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.menuHamburgerBtn}
              onClick={() => setIsMobileSidebarOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <MenuIcon sx={{ fontSize: 24 }} />
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

            {/* Guest Entry Box (Single & Bulk CSV) */}
            <div className={styles.addGuestBox}>
              <div className={styles.guestAddTabs}>
                <button
                  type="button"
                  className={`${styles.guestAddTabBtn} ${guestAddMode === 'single' ? styles.activeTab : ''}`}
                  onClick={() => setGuestAddMode('single')}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                  <span>Add Single Guest</span>
                </button>
                <button
                  type="button"
                  className={`${styles.guestAddTabBtn} ${guestAddMode === 'csv' ? styles.activeTab : ''}`}
                  onClick={() => setGuestAddMode('csv')}
                >
                  <UploadFileIcon sx={{ fontSize: 18 }} />
                  <span>Bulk CSV Upload</span>
                </button>
              </div>

              {guestAddMode === 'single' ? (
                <>
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
                      <option value="Mrs.">Mrs.</option>
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
                </>
              ) : (
                <div className={styles.csvUploadContainer}>
                  {/* CSV Format Card */}
                  <div className={styles.csvFormatCard}>
                    <div className={styles.csvFormatHeader}>
                      <div className={styles.csvFormatTitle}>
                        <TableChartOutlinedIcon sx={{ fontSize: 20, color: '#3c8d40' }} />
                        <span>CSV Format &amp; Column Guidelines</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadCsvTemplate}
                        className={styles.csvDownloadTemplateBtn}
                        title="Download sample template"
                      >
                        <FileDownloadIcon sx={{ fontSize: 16 }} />
                        <span>Download Sample CSV Format</span>
                      </button>
                    </div>

                    <table className={styles.csvTableGuide}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Name (Required)</th>
                          <th>Mobile (Required)</th>
                          <th>Email (Optional)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Mr.</td>
                          <td>John Doe</td>
                          <td>9876543210</td>
                          <td>john@example.com</td>
                        </tr>
                        <tr>
                          <td>Miss</td>
                          <td>Priya Sharma</td>
                          <td>9876543211</td>
                          <td>priya@example.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CSV DropZone */}
                  <div
                    className={styles.csvDropZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadFileIcon sx={{ fontSize: 38, color: '#3c8d40' }} />
                    <div className={styles.csvDropTitle}>
                      {csvFileName ? `Selected File: ${csvFileName}` : 'Click here to upload CSV file'}
                    </div>
                    <div className={styles.csvDropSubtext}>
                      Select a .CSV file matching the format above (Title, Name, Mobile, Email)
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,text/csv"
                      className={styles.csvFileInputHidden}
                      onChange={handleCsvFileChange}
                    />
                  </div>

                  {/* Success / Error Messages */}
                  {csvUploadSuccess && (
                    <div style={{ padding: '10px 14px', background: '#edf7ed', color: '#1e4620', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', border: '1px solid #c8e6c9' }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                      <span>{csvUploadSuccess}</span>
                    </div>
                  )}
                  {csvUploadError && (
                    <div style={{ padding: '10px 14px', background: '#fde8e8', color: '#9b1c1c', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', border: '1px solid #f8b4b4' }}>
                      <InfoOutlinedIcon sx={{ fontSize: 18, color: '#c81e1e' }} />
                      <span>{csvUploadError}</span>
                    </div>
                  )}

                  {/* Parsed Preview Table */}
                  {csvParsedGuests.length > 0 && (
                    <div className={styles.csvParsedSection}>
                      <div className={styles.csvParsedHeader}>
                        <span className={styles.csvParsedCount}>
                          Ready to Import: {csvParsedGuests.length} Guests
                        </span>
                        <div className={styles.csvActionButtons}>
                          <button
                            type="button"
                            className={styles.csvClearBtn}
                            onClick={() => {
                              setCsvParsedGuests([]);
                              setCsvFileName('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className={styles.csvSubmitBtn}
                            onClick={handleCsvUploadSubmit}
                            disabled={isUploadingCsv}
                          >
                            <UploadFileIcon sx={{ fontSize: 18 }} />
                            <span>{isUploadingCsv ? 'Uploading...' : `Upload ${csvParsedGuests.length} Guests`}</span>
                          </button>
                        </div>
                      </div>

                      <div className={styles.csvPreviewTableWrapper}>
                        <table className={styles.csvTableGuide}>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Title</th>
                              <th>Name</th>
                              <th>Mobile</th>
                              <th>Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {csvParsedGuests.slice(0, 10).map((g, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{g.title}</td>
                                <td><strong>{g.name}</strong></td>
                                <td>{g.mobile}</td>
                                <td>{g.email || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {csvParsedGuests.length > 10 && (
                        <p style={{ fontSize: '0.78rem', color: '#6e7e73', marginTop: '6px' }}>
                          Previewing first 10 of {csvParsedGuests.length} guests parsed from your CSV file.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
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

              <button
                type="button"
                onClick={handleDownloadPdf}
                className={styles.pdfDownloadBtn}
                title="Download complete guest list report as PDF"
                disabled={isGeneratingPdf || guests.length === 0}
              >
                <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
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
                        <div className={styles.emptyIcon}>
                          <SentimentSatisfiedAltIcon sx={{ fontSize: 44, color: '#789b63' }} />
                        </div>
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
              <DashboardIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Event Overview &amp; Key Metrics</span>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Total Invited Guests</span>
                <h3 style={{ fontSize: '1.8rem', color: '#294B35', marginTop: '4px' }}>{stats.totalGuests}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Section 3: Guest List</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Confirmed RSVPs</span>
                <h3 style={{ fontSize: '1.8rem', color: '#3C8D40', marginTop: '4px' }}>{stats.attending}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Section 5: RSVP Management</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Birthday Wishes Received</span>
                <h3 style={{ fontSize: '1.8rem', color: '#D9B66F', marginTop: '4px' }}>{wishesList.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Section 9: Wish Wall</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Quiz Submissions</span>
                <h3 style={{ fontSize: '1.8rem', color: '#2b5b84', marginTop: '4px' }}>{quizSubmissions.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Section 10: Quiz Responses</span>
              </div>
            </div>

            {/* Event Summary Card */}
            <div style={{ background: 'linear-gradient(135deg, #f7faf5 0%, #edf5eb 100%)', border: '1.5px solid #dce8d2', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dce8d2', color: '#294B35', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    {eventSettings.eventDate || 'Event Date Configured'}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', color: '#294B35', fontWeight: 800, margin: '4px 0' }}>{eventSettings.eventTitle || "Ditvi's 1st Birthday Party"}</h2>
                  <p style={{ color: '#576b5c', fontSize: '0.92rem', margin: 0 }}>
                    <PlaceIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginRight: '4px' }} />
                    {eventSettings.venueName || 'Grand Blossom Banquet Hall'} • {eventSettings.eventTime || '6:30 PM Onwards'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('1')}
                  className={styles.addGuestBtn}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                  <span>Edit Event Details</span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Hub */}
            <h3 style={{ fontSize: '1.1rem', color: '#294B35', fontWeight: 700, marginBottom: '14px' }}>Console Quick Navigation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div
                onClick={() => setActiveTab('1')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <EventNoteIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>1. Event Details</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Update event title, dates, venue location, and contact numbers.</p>
              </div>

              <div
                onClick={() => setActiveTab('2')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MarkEmailReadIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>2. Invitations &amp; eCards</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Generate personalized panda invitation eCards for all guests.</p>
              </div>

              <div
                onClick={() => setActiveTab('3')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <PeopleIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>3. Guest List</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Add individual guests, bulk upload via CSV, edit and export.</p>
              </div>

              <div
                onClick={() => setActiveTab('5')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <HowToRegIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>5. RSVP Tracking</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Filter and review attending vs pending vs declined RSVPs.</p>
              </div>

              <div
                onClick={() => setActiveTab('9')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <ChatBubbleOutlineIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>9. Wish Wall</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>View real guestbook wishes, download CSV/PDF, export cards.</p>
              </div>

              <div
                onClick={() => setActiveTab('10')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <SportsEsportsIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>10. Birthday Quiz</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Add trivia questions, view guest scores, export PDF reports.</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 10: Birthday Quiz Management */}
        {activeTab === '10' && (
          <div className={styles.quizContainer}>
            <div className={styles.sectionHeader}>
              <SportsEsportsIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Birthday Quiz Management ({quizList.length} Live Questions)</span>
            </div>

            {/* Notification Alert */}
            {quizAlert && (
              <div
                style={{
                  padding: '12px 16px',
                  background: quizAlert.type === 'success' ? '#edf7ed' : '#fde8e8',
                  color: quizAlert.type === 'success' ? '#1e4620' : '#9b1c1c',
                  border: `1px solid ${quizAlert.type === 'success' ? '#c8e6c9' : '#f8b4b4'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                <span>{quizAlert.message}</span>
              </div>
            )}

            {/* Quiz Section Mode Switcher */}
            <div className={styles.guestAddTabs}>
              <button
                type="button"
                className={`${styles.guestAddTabBtn} ${quizTabMode === 'questions' ? styles.activeTab : ''}`}
                onClick={() => setQuizTabMode('questions')}
              >
                <SportsEsportsIcon sx={{ fontSize: 18 }} />
                <span>1. Quiz Questions Manager ({quizList.length})</span>
              </button>
              <button
                type="button"
                className={`${styles.guestAddTabBtn} ${quizTabMode === 'submissions' ? styles.activeTab : ''}`}
                onClick={() => setQuizTabMode('submissions')}
              >
                <PeopleIcon sx={{ fontSize: 18 }} />
                <span>2. Guest Submissions &amp; Scores ({quizSubmissions.length})</span>
              </button>
            </div>

            {quizTabMode === 'questions' ? (
              <>
                {/* Add New Question Form */}
                <div className={styles.quizAddCard}>
                  <div className={styles.quizAddTitle}>
                    <AddIcon sx={{ fontSize: 20, color: '#3c8d40' }} />
                    <span>Create &amp; Publish New Quiz Question</span>
                  </div>

                  <form onSubmit={handleAddQuizQuestion} className={styles.quizForm}>
                    <div>
                      <label className={styles.formLabel} htmlFor="quiz-question-input">
                        Question Text (e.g. What is Ditvi&apos;s favorite food?)
                      </label>
                      <input
                        id="quiz-question-input"
                        type="text"
                        placeholder="Enter question text..."
                        className={styles.inputField}
                        value={newQuizQuestion}
                        onChange={(e) => setNewQuizQuestion(e.target.value)}
                        required
                        style={{ width: '100%', marginTop: '6px' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className={styles.formLabel}>
                          Answer Options (Select the radio circle next to the correct answer)
                        </label>
                        <span style={{ fontSize: '0.8rem', color: '#3c8d40', fontWeight: 700 }}>
                          Selected Correct: Option {['A', 'B', 'C', 'D'][newQuizCorrectIndex]}
                        </span>
                      </div>

                      <div className={styles.quizOptionsGrid}>
                        {['A', 'B', 'C', 'D'].map((letter, idx) => (
                          <div
                            key={letter}
                            className={`${styles.quizOptionInputRow} ${newQuizCorrectIndex === idx ? styles.selectedCorrect : ''}`}
                          >
                            <span className={styles.quizOptionBadge}>{letter}</span>
                            <input
                              type="text"
                              placeholder={`Option ${letter}`}
                              className={styles.quizOptionInput}
                              value={newQuizOptions[idx] || ''}
                              onChange={(e) => {
                                const updated = [...newQuizOptions];
                                updated[idx] = e.target.value;
                                setNewQuizOptions(updated);
                              }}
                              required={idx < 2}
                            />
                            <label className={styles.quizCorrectRadioLabel}>
                              <input
                                type="radio"
                                name="correctOptionRadio"
                                checked={newQuizCorrectIndex === idx}
                                onChange={() => setNewQuizCorrectIndex(idx)}
                              />
                              <span>Correct</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={styles.formLabel} htmlFor="quiz-explanation-input">
                        Fun Fact / Explanation (Displayed to guests after answering)
                      </label>
                      <input
                        id="quiz-explanation-input"
                        type="text"
                        placeholder="e.g. Ditvi loves sweet potato mash and smiles every time she eats it!"
                        className={styles.inputField}
                        value={newQuizExplanation}
                        onChange={(e) => setNewQuizExplanation(e.target.value)}
                        style={{ width: '100%', marginTop: '6px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        type="submit"
                        disabled={isAddingQuiz}
                        className={styles.csvSubmitBtn}
                      >
                        <AddIcon sx={{ fontSize: 18 }} />
                        <span>{isAddingQuiz ? 'Publishing...' : 'Add Question to Live Quiz'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Quiz Questions List */}
                <div className={styles.quizCardsList}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#294B35', fontWeight: 700 }}>
                      Active Questions in Database ({quizList.length})
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#6e7e73' }}>
                      Guests play these questions in the Interactive Games section on the homepage
                    </span>
                  </div>

                  {quizLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#6e7e73' }}>
                      Loading quiz questions...
                    </div>
                  ) : quizList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                      <p style={{ color: '#6e7e73' }}>No quiz questions yet. Use the form above to add your first question!</p>
                    </div>
                  ) : (
                    quizList.map((q, index) => (
                      <div key={q.id} className={styles.quizCardItem}>
                        <div className={styles.quizCardHeader}>
                          <div className={styles.quizCardTitleGroup}>
                            <span className={styles.quizNumberBadge}>Q{index + 1}</span>
                            <h4 className={styles.quizQuestionHeading}>{q.question}</h4>
                          </div>

                          <div className={styles.quizCardActions}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditQuiz(q)}
                              className={styles.editBtn}
                              title="Edit Question"
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuizQuestion(q.id)}
                              className={styles.actionBtn}
                              title="Delete Question"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </div>

                        <div className={styles.quizCardOptionsDisplay}>
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === q.correctIndex;
                            return (
                              <div
                                key={optIdx}
                                className={`${styles.quizOptionDisplayPill} ${isCorrect ? styles.isCorrect : ''}`}
                              >
                                <span style={{ fontWeight: 700, minWidth: '18px' }}>
                                  {['A', 'B', 'C', 'D'][optIdx]}.
                                </span>
                                <span style={{ flex: 1 }}>{opt}</span>
                                {isCorrect && (
                                  <span style={{ fontSize: '0.72rem', background: '#3c8d40', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <CheckIcon sx={{ fontSize: 13 }} />
                                    <span>Correct</span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className={styles.quizFactBox}>
                            <strong>Fun Fact:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* Submissions & Scores Table */
              <div>
                {/* Stats Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                    <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Total Quiz Submissions</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#294B35', marginTop: '4px' }}>{quizSubmissions.length}</h3>
                  </div>
                  <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                    <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Perfect Scores (100%)</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#3C8D40', marginTop: '4px' }}>
                      {quizSubmissions.filter(s => s.score === s.total_questions).length}
                    </h3>
                  </div>
                  <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                    <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Database Storage</span>
                    <h3 style={{ fontSize: '1.1rem', color: '#294B35', marginTop: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StorageIcon sx={{ fontSize: 20, color: '#294B35' }} />
                      <span>Neon PostgreSQL</span>
                    </h3>
                  </div>
                </div>

                {/* Submissions Table Header with Master Download Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#294B35', fontWeight: 700 }}>
                      Stored Guest Quiz Submissions ({quizSubmissions.length})
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#6e7e73', marginTop: '2px' }}>
                      Download complete answers report in PDF for all guests or for any particular person
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadAllSubmissionsPdf}
                    disabled={isGeneratingQuizPdf || quizSubmissions.length === 0}
                    className={styles.pdfDownloadBtn}
                    title="Download master PDF report of all submissions with question & answer details"
                  >
                    <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                    <span>{isGeneratingQuizPdf ? 'Generating Master PDF...' : 'Download All Submissions PDF'}</span>
                  </button>
                </div>

                {/* Submissions Table */}
                <div className={styles.tableCard}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>#</th>
                        <th className={styles.th}>PLAYER NAME</th>
                        <th className={styles.th}>SCORE</th>
                        <th className={styles.th}>PERCENTAGE</th>
                        <th className={styles.th}>SUBMITTED AT</th>
                        <th className={styles.th}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizSubmissionsLoading ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#6e7e73' }}>
                            Loading submissions from database...
                          </td>
                        </tr>
                      ) : quizSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6e7e73' }}>
                            No guest quiz submissions stored yet. Play the quiz on the homepage to record the first score!
                          </td>
                        </tr>
                      ) : (
                        quizSubmissions.map((s, idx) => {
                          const pct = Math.round((s.score / s.total_questions) * 100);
                          return (
                            <tr key={s.id} className={styles.tr}>
                              <td className={styles.td}>{idx + 1}</td>
                              <td className={`${styles.td} ${styles.guestName}`}>
                                <strong>{s.player_name}</strong>
                              </td>
                              <td className={styles.td}>
                                <span style={{
                                  background: s.score === s.total_questions ? '#eaf5e6' : '#f0f4ee',
                                  color: s.score === s.total_questions ? '#1e5a26' : '#294B35',
                                  fontWeight: 700,
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.88rem'
                                }}>
                                  {s.score} / {s.total_questions}
                                </span>
                              </td>
                              <td className={styles.td}>
                                <span style={{ fontWeight: 600, color: pct >= 80 ? '#2e7d32' : pct >= 50 ? '#d97706' : '#6e7e73' }}>
                                  {pct}%
                                </span>
                              </td>
                              <td className={styles.td}>
                                {new Date(s.submitted_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className={styles.td}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadSingleSubmissionPdf(s)}
                                    disabled={isGeneratingQuizPdf}
                                    className={styles.topBtn}
                                    style={{
                                      padding: '5px 12px',
                                      fontSize: '0.8rem',
                                      color: '#c0392b',
                                      borderColor: '#f2aba2',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: 600,
                                    }}
                                    title={`Download PDF report for ${s.player_name}`}
                                  >
                                    <PictureAsPdfIcon sx={{ fontSize: 15 }} />
                                    <span>Download PDF</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuizSubmission(s.id)}
                                    className={styles.actionBtn}
                                    title="Delete submission"
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 1: Event Details & Venue Management (Redesigned) */}
        {activeTab === '1' && (
          <div>
            {/* Header Hero Banner */}
            <div className={styles.eventHeroBanner}>
              <div className={styles.eventHeroContent}>
                <div className={styles.eventHeroIconPanda}>
                  <EventNoteIcon sx={{ fontSize: 26, color: '#294B35' }} />
                </div>
                <div>
                  <h2 className={styles.eventHeroTitle}>Event Details &amp; Venue Management</h2>
                  <p className={styles.eventHeroSub}>
                    Configure live event settings, date, timing, and venue location synced directly with PostgreSQL.
                  </p>
                </div>
              </div>
              <div className={styles.eventHeroActions}>
                <button
                  type="button"
                  onClick={fetchEventSettings}
                  className={styles.eventHeroBtn}
                  disabled={eventSettingsLoading}
                  title="Reload settings from database"
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  <span>{eventSettingsLoading ? 'Refreshing...' : 'Sync DB'}</span>
                </button>
              </div>
            </div>

            {/* Notification Alert */}
            {eventAlert && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: eventAlert.type === 'success' ? '#e8f5e9' : '#ffebee',
                  color: eventAlert.type === 'success' ? '#2e7d32' : '#c62828',
                  border: `1px solid ${eventAlert.type === 'success' ? '#c8e6c9' : '#ffcdd2'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                <span style={{ fontWeight: 600 }}>{eventAlert.message}</span>
              </div>
            )}

            <div className={styles.eventDashboardGrid}>
              {/* Left Column: Organized Sectional Forms */}
              <form onSubmit={handleSaveEventSettings}>
                {/* 1. Core Celebration Settings */}
                <div className={styles.eventCardBox}>
                  <div className={styles.eventCardHeader}>
                    <div className={styles.eventCardTitleWrap}>
                      <div className={styles.eventCardIconWrap}>
                        <CelebrationIcon sx={{ fontSize: 18 }} />
                      </div>
                      <div>
                        <h3 className={styles.eventCardTitle}>Birthday Celebration Profile</h3>
                        <p className={styles.eventCardSubtitle}>Primary heading &amp; star honoree details</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.eventFieldGrid}>
                    <div>
                      <label className={styles.eventLabel}>
                        <span>Event Title</span>
                        <span className={styles.eventLabelBadge}>Hero &amp; Invitation</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.eventTitle}
                        onChange={(e) => setEventSettings({ ...eventSettings, eventTitle: e.target.value })}
                        placeholder="Ditvi's 1st Birthday Party"
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.eventLabel}>
                        <span>Birthday Star Name</span>
                        <span className={styles.eventLabelBadge}>Honoree</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.childName}
                        onChange={(e) => setEventSettings({ ...eventSettings, childName: e.target.value })}
                        placeholder="Ditvi"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.eventFieldGrid}>
                    <div>
                      <label className={styles.eventLabel}>
                        <span>Turning Age</span>
                        <span className={styles.eventLabelBadge}>Years</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.turningAge}
                        onChange={(e) => setEventSettings({ ...eventSettings, turningAge: e.target.value })}
                        placeholder="1"
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.eventLabel}>
                        <span>Theme &amp; Dress Code</span>
                        <span className={styles.eventLabelBadge}>RSVP Card</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.dressCode}
                        onChange={(e) => setEventSettings({ ...eventSettings, dressCode: e.target.value })}
                        placeholder="Pastel forest tones, sage, cream, or panda accents"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Date & Schedule Timing */}
                <div className={styles.eventCardBox}>
                  <div className={styles.eventCardHeader}>
                    <div className={styles.eventCardTitleWrap}>
                      <div className={styles.eventCardIconWrap}>
                        <CalendarMonthIcon sx={{ fontSize: 18 }} />
                      </div>
                      <div>
                        <h3 className={styles.eventCardTitle}>Date &amp; Schedule Timing</h3>
                        <p className={styles.eventCardSubtitle}>Display strings &amp; calendar timing</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.eventFieldGrid}>
                    <div>
                      <label className={styles.eventLabel}>
                        <span>Event Date (Display String)</span>
                        <span className={styles.eventLabelBadge}>Friendly</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.eventDate}
                        onChange={(e) => setEventSettings({ ...eventSettings, eventDate: e.target.value })}
                        placeholder="Saturday, December 12, 2026"
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.eventLabel}>
                        <span>Celebration Hours / Schedule</span>
                        <span className={styles.eventLabelBadge}>Hours</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.eventTime}
                        onChange={(e) => setEventSettings({ ...eventSettings, eventTime: e.target.value })}
                        placeholder="3:30 PM - 7:30 PM CST (Cake cutting at 5:00 PM)"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Venue & Maps Location */}
                <div className={styles.eventCardBox}>
                  <div className={styles.eventCardHeader}>
                    <div className={styles.eventCardTitleWrap}>
                      <div className={styles.eventCardIconWrap}>
                        <PlaceIcon sx={{ fontSize: 18 }} />
                      </div>
                      <div>
                        <h3 className={styles.eventCardTitle}>Venue &amp; Location Management</h3>
                        <p className={styles.eventCardSubtitle}>Physical address, navigation maps, &amp; directions</p>
                      </div>
                    </div>

                    {eventSettings.venueName && (
                      <button
                        type="button"
                        onClick={handleDeleteVenue}
                        disabled={isDeletingVenue}
                        className={styles.venueDeleteBtn}
                        title="Delete venue and revert to announcement placeholder"
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        <span>{isDeletingVenue ? 'Deleting...' : 'Delete Venue'}</span>
                      </button>
                    )}
                  </div>

                  {/* Venue Status Indicator Banner */}
                  <div className={`${styles.venueStatusBanner} ${eventSettings.venueName ? styles.venueStatusBannerActive : styles.venueStatusBannerEmpty}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {eventSettings.venueName ? (
                        <LocationOnIcon sx={{ fontSize: 20, color: '#294B35' }} />
                      ) : (
                        <HourglassTopIcon sx={{ fontSize: 20, color: '#B58422' }} />
                      )}
                      <span>
                        {eventSettings.venueName ? (
                          <>
                            <strong>Active Venue:</strong> Displayed across website, eCards, and PDF reports.
                          </>
                        ) : (
                          <>
                            <strong>No Venue Set:</strong> The site is currently showing the graceful &ldquo;Venue to be announced soon&rdquo; placeholder.
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className={styles.eventFieldGridFull} style={{ marginBottom: '14px' }}>
                    <label className={styles.eventLabel}>
                      <span>Venue Name</span>
                      <span className={styles.eventLabelBadge}>Required to activate</span>
                    </label>
                    <input
                      type="text"
                      className={styles.eventInput}
                      value={eventSettings.venueName}
                      onChange={(e) => setEventSettings({ ...eventSettings, venueName: e.target.value })}
                      placeholder="e.g. Whispering Pines Pavilion (leave blank to announce later)"
                    />
                  </div>

                  <div className={styles.eventFieldGrid}>
                    <div>
                      <label className={styles.eventLabel}>
                        <span>Street Address</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.venueAddress}
                        onChange={(e) => setEventSettings({ ...eventSettings, venueAddress: e.target.value })}
                        placeholder="e.g. 4280 Forest View Way"
                      />
                    </div>

                    <div>
                      <label className={styles.eventLabel}>
                        <span>City, State &amp; ZIP</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.venueCity}
                        onChange={(e) => setEventSettings({ ...eventSettings, venueCity: e.target.value })}
                        placeholder="e.g. Austin, TX 78704"
                      />
                    </div>
                  </div>

                  <div className={styles.eventFieldGridFull}>
                    <label className={styles.eventLabel}>
                      <span>Google Maps Link or Embed URL</span>
                      <span className={styles.eventLabelBadge}>Directions Button</span>
                    </label>
                    <input
                      type="text"
                      className={styles.eventInput}
                      value={eventSettings.venueMapUrl}
                      onChange={(e) => setEventSettings({ ...eventSettings, venueMapUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                    />
                  </div>
                </div>

                {/* 4. Host Contact Channels */}
                <div className={styles.eventCardBox}>
                  <div className={styles.eventCardHeader}>
                    <div className={styles.eventCardTitleWrap}>
                      <div className={styles.eventCardIconWrap}>
                        <HowToRegIcon sx={{ fontSize: 18 }} />
                      </div>
                      <div>
                        <h3 className={styles.eventCardTitle}>Host Family Contact Channels</h3>
                        <p className={styles.eventCardSubtitle}>Telephone &amp; RSVP email for guest inquiries</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.eventFieldGrid}>
                    <div>
                      <label className={styles.eventLabel}>
                        <span>Contact Phone</span>
                        <span className={styles.eventLabelBadge}>Call &amp; Text</span>
                      </label>
                      <input
                        type="text"
                        className={styles.eventInput}
                        value={eventSettings.contactPhone}
                        onChange={(e) => setEventSettings({ ...eventSettings, contactPhone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                      />
                    </div>

                    <div>
                      <label className={styles.eventLabel}>
                        <span>Contact Email</span>
                        <span className={styles.eventLabelBadge}>RSVP Email</span>
                      </label>
                      <input
                        type="email"
                        className={styles.eventInput}
                        value={eventSettings.contactEmail}
                        onChange={(e) => setEventSettings({ ...eventSettings, contactEmail: e.target.value })}
                        placeholder="family@ditvibirthday.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '32px' }}>
                  <button
                    type="submit"
                    disabled={isSavingEventSettings}
                    className={styles.btnAdd}
                    style={{ flex: 1, padding: '14px', fontSize: '0.96rem' }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                    <span>{isSavingEventSettings ? 'Saving to Database...' : 'Save All Event Details'}</span>
                  </button>

                  {eventSettings.venueName && (
                    <button
                      type="button"
                      onClick={handleDeleteVenue}
                      disabled={isDeletingVenue}
                      className={styles.venueDeleteBtn}
                      style={{ padding: '0 20px', fontSize: '0.9rem' }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      <span>{isDeletingVenue ? 'Clearing...' : 'Clear Venue'}</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Right Column: Live Mockup Card Preview */}
              <div className={styles.eventPreviewSticky}>
                <div className={styles.previewPhoneMockup}>
                  <div className={styles.previewPhoneHeader}>
                    <div className={styles.previewPhoneHeaderLeft}>
                      <SmartphoneIcon sx={{ fontSize: 18 }} />
                      <span>Live Invitation Preview</span>
                    </div>
                    <span className={styles.previewLiveBadge}>Online</span>
                  </div>

                  <div className={styles.previewBody}>
                    <div className={styles.previewStarCard}>
                      <span className={styles.previewAgeTag}>
                        Turning {eventSettings.turningAge || '1'} Year Old
                      </span>
                      <h4 className={styles.previewStarTitle}>
                        {eventSettings.eventTitle || "Ditvi's 1st Birthday Party"}
                      </h4>
                      <p className={styles.previewStarHonoree}>
                        Honoring our sweet baby <strong>{eventSettings.childName || 'Ditvi'}</strong>
                      </p>
                    </div>

                    <div className={styles.previewDetailsList}>
                      {/* Date */}
                      <div className={styles.previewDetailItem}>
                        <CalendarMonthIcon sx={{ fontSize: 20 }} className={styles.previewDetailIcon} />
                        <div>
                          <div className={styles.previewDetailLabel}>Celebration Date</div>
                          <div className={styles.previewDetailVal}>
                            {eventSettings.eventDate || 'Saturday, December 12, 2026'}
                          </div>
                        </div>
                      </div>

                      {/* Time */}
                      <div className={styles.previewDetailItem}>
                        <AccessTimeIcon sx={{ fontSize: 20 }} className={styles.previewDetailIcon} />
                        <div>
                          <div className={styles.previewDetailLabel}>Party Timing</div>
                          <div className={styles.previewDetailVal}>
                            {eventSettings.eventTime || '3:30 PM - 7:30 PM CST'}
                          </div>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className={styles.previewDetailItem}>
                        <PlaceIcon sx={{ fontSize: 20 }} className={styles.previewDetailIcon} />
                        <div>
                          <div className={styles.previewDetailLabel}>Location &amp; Venue</div>
                          <div className={styles.previewDetailVal}>
                            {eventSettings.venueName || 'Venue to be announced soon'}
                          </div>
                          {(eventSettings.venueAddress || eventSettings.venueCity) && (
                            <div className={styles.previewDetailSub}>
                              {[eventSettings.venueAddress, eventSettings.venueCity].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dress Code */}
                      {eventSettings.dressCode && (
                        <div className={styles.previewDetailItem}>
                          <AutoAwesomeIcon sx={{ fontSize: 20 }} className={styles.previewDetailIcon} />
                          <div>
                            <div className={styles.previewDetailLabel}>Theme &amp; Attire</div>
                            <div className={styles.previewDetailVal} style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                              {eventSettings.dressCode}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      <div className={styles.previewDetailItem}>
                        <HowToRegIcon sx={{ fontSize: 20 }} className={styles.previewDetailIcon} />
                        <div>
                          <div className={styles.previewDetailLabel}>Host Contacts</div>
                          <div className={styles.previewDetailVal}>
                            {eventSettings.contactPhone || '+1 (555) 019-2831'}
                          </div>
                          {eventSettings.contactEmail && (
                            <div className={styles.previewDetailSub}>{eventSettings.contactEmail}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.previewNoticeBox} ${eventSettings.venueName ? styles.previewNoticeActive : styles.previewNoticeEmpty}`}>
                      {eventSettings.venueName ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: '#3c8d40' }} />
                          <span><strong>Venue Active:</strong> Map navigation is enabled and visible across Contact and RSVP sections.</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <InfoOutlinedIcon sx={{ fontSize: 16, color: '#B58422' }} />
                          <span><strong>Pending Venue:</strong> Guests see a cute announcement placeholder until you save venue details.</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Wish Wall (Redesigned) */}
        {activeTab === '9' && (
          <div>
            {/* Header Hero Banner */}
            <div className={styles.wishHeroBanner}>
              <div className={styles.wishHeroContent}>
                <div className={styles.wishHeroPandaCircle}>
                  <ParkIcon sx={{ fontSize: 26, color: '#294B35' }} />
                </div>
                <div>
                  <h2 className={styles.wishHeroTitle}>Ditvi&apos;s Birthday Wish Wall</h2>
                  <p className={styles.wishHeroSub}>
                    Real-time guestbook blessings, heartfelt prayers, and panda love notes saved to PostgreSQL.
                  </p>
                </div>
              </div>

              <div className={styles.wishHeroActions}>
                <button
                  type="button"
                  onClick={fetchWishes}
                  className={styles.wishHeroActionBtn}
                  disabled={wishesLoading}
                  title="Refresh wishes from database"
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  <span>{wishesLoading ? 'Refreshing...' : 'Refresh'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWishesCsv}
                  className={styles.wishHeroActionBtn}
                  title="Download all wishes raw data in CSV / Excel format"
                >
                  <FileDownloadIcon sx={{ fontSize: 16, color: '#3C8D40' }} />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  disabled={isGeneratingA4Pdf}
                  onClick={handleDownloadWishesA4CardsPdf}
                  className={styles.wishHeroPdfBtn}
                  title="Download all wishes in A4 printable format with 4 cards per page (rendered from exact HTML design)"
                >
                  <ViewModuleIcon sx={{ fontSize: 18 }} />
                  <span>{isGeneratingA4Pdf ? 'Generating Cards...' : 'Download 4-Card A4 PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWishesPdf}
                  className={styles.wishHeroActionBtn}
                  title="Download tabular birthday wishes keepsake in PDF format"
                >
                  <PictureAsPdfIcon sx={{ fontSize: 16, color: '#294B35' }} />
                  <span>PDF Table</span>
                </button>
              </div>
            </div>

            {/* Notification Alert */}
            {wishAlert && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: wishAlert.type === 'success' ? '#e8f5e9' : '#ffebee',
                  color: wishAlert.type === 'success' ? '#2e7d32' : '#c62828',
                  border: `1px solid ${wishAlert.type === 'success' ? '#c8e6c9' : '#ffcdd2'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
                <span style={{ fontWeight: 600 }}>{wishAlert.message}</span>
              </div>
            )}

            {/* Stat Summary Metrics Row */}
            <div className={styles.wishStatsRow}>
              <div className={styles.wishStatCard}>
                <div>
                  <div className={styles.wishStatLabel}>Total Wishes</div>
                  <div className={styles.wishStatValue}>{wishesList.length}</div>
                </div>
                <div className={styles.wishStatIconBadge} style={{ background: '#eef7ee', color: '#294B35' }}>
                  <EmailOutlinedIcon sx={{ fontSize: 24, color: '#294B35' }} />
                </div>
              </div>

              <div className={styles.wishStatCard}>
                <div>
                  <div className={styles.wishStatLabel}>Total Hearts / Likes</div>
                  <div className={styles.wishStatValue}>
                    {wishesList.reduce((acc, curr) => acc + (curr.likes || 1), 0)}
                  </div>
                </div>
                <div className={styles.wishStatIconBadge} style={{ background: '#ffebee', color: '#d32f2f' }}>
                  <FavoriteIcon sx={{ fontSize: 24, color: '#d32f2f' }} />
                </div>
              </div>

              <div className={styles.wishStatCard}>
                <div>
                  <div className={styles.wishStatLabel}>Family &amp; Relatives</div>
                  <div className={styles.wishStatValue}>
                    {wishesList.filter((w) => w.relation && w.relation.trim().length > 0).length}
                  </div>
                </div>
                <div className={styles.wishStatIconBadge} style={{ background: '#fff8eb', color: '#b78103' }}>
                  <FamilyRestroomIcon sx={{ fontSize: 24, color: '#b78103' }} />
                </div>
              </div>

              <div className={styles.wishStatCard}>
                <div>
                  <div className={styles.wishStatLabel}>Live Database Status</div>
                  <div className={styles.wishStatValue} style={{ fontSize: '1.05rem', color: '#2e7d32', marginTop: '8px' }}>
                    ● Connected
                  </div>
                </div>
                <div className={styles.wishStatIconBadge} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  <BoltIcon sx={{ fontSize: 24, color: '#2e7d32' }} />
                </div>
              </div>
            </div>

            {/* Search Bar - 100% Full Width */}
            <div style={{ width: '100%', marginBottom: '22px' }}>
              <div className={styles.searchWrapper} style={{ width: '100%', maxWidth: '100%' }}>
                <SearchIcon sx={{ fontSize: 18 }} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search wishes by guest name, relation, phone, or blessing..."
                  className={styles.searchInput}
                  style={{ width: '100%' }}
                  value={wishSearch}
                  onChange={(e) => setWishSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table View Only - 100% Full Width Container */}
            <div
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #e1e7de',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(41, 75, 53, 0.05)',
              }}
            >
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table className={styles.table} style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th className={styles.th} style={{ width: '45px', textAlign: 'center' }}>#</th>
                      <th className={styles.th} style={{ width: '180px' }}>Guest / Author</th>
                      <th className={styles.th} style={{ width: '130px' }}>Relationship</th>
                      <th className={styles.th} style={{ width: '140px' }}>Phone Number</th>
                      <th className={styles.th}>Birthday Wish Message</th>
                      <th className={styles.th} style={{ width: '85px', textAlign: 'center' }}>Likes</th>
                      <th className={styles.th} style={{ width: '140px' }}>Submitted On</th>
                      <th className={styles.th} style={{ width: '160px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishesLoading ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyState}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '24px 0' }}>
                            <ParkIcon sx={{ fontSize: 22, color: '#3c8d40' }} />
                            <span>Loading wishes from Neon database...</span>
                          </div>
                        </td>
                      </tr>
                    ) : wishesList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyState}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 0', gap: '8px' }}>
                            <SentimentSatisfiedAltIcon sx={{ fontSize: 36, color: '#789b63' }} />
                            <span style={{ fontWeight: 600, color: '#294B35' }}>
                              {wishSearch ? 'No birthday wishes match your search.' : 'No wishes recorded yet.'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      wishesList.map((w, index) => (
                        <tr key={w.id} className={styles.tr}>
                          <td className={styles.td} style={{ textAlign: 'center', color: '#6e7e73', fontWeight: 600 }}>
                            {index + 1}
                          </td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: '#f2f7ef',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <SentimentSatisfiedAltIcon sx={{ fontSize: 20, color: '#3c8d40' }} />
                              </div>
                              <div>
                                <div className={styles.guestName}>{w.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className={styles.td}>
                            {w.relation ? (
                              <span
                                style={{
                                  background: '#eef7ee',
                                  color: '#245e28',
                                  padding: '3px 9px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  border: '1px solid #d4edd4',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {w.relation}
                              </span>
                            ) : (
                              <span style={{ color: '#9e9e9e', fontSize: '0.82rem' }}>—</span>
                            )}
                          </td>
                          <td className={styles.td}>
                            {w.phone ? (
                              <span style={{ color: '#294B35', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                                {w.phone}
                              </span>
                            ) : (
                              <span style={{ color: '#9e9e9e', fontSize: '0.82rem' }}>—</span>
                            )}
                          </td>
                          <td className={styles.td}>
                            <div
                              style={{
                                fontSize: '0.88rem',
                                lineHeight: '1.5',
                                color: '#252525',
                                background: '#fcfdfa',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #edf4eb',
                                fontStyle: 'italic',
                              }}
                            >
                              &ldquo;{w.message}&rdquo;
                            </div>
                          </td>
                          <td className={styles.td} style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#d32f2f',
                                fontWeight: 700,
                                fontSize: '0.86rem',
                              }}
                            >
                              <FavoriteIcon sx={{ fontSize: 15, color: '#d32f2f' }} />
                              <span>{w.likes || 1}</span>
                            </span>
                          </td>
                          <td className={styles.td} style={{ fontSize: '0.82rem', color: '#6e7e73', whiteSpace: 'nowrap' }}>
                            {new Date(w.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedWishCard(w)}
                                className={styles.ecardBtn}
                                title="Generate Wish Card Image (PNG)"
                                style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                              >
                                <ImageIcon sx={{ fontSize: 15 }} />
                                <span>Card Image</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWish(w.id)}
                                disabled={isDeletingWish}
                                className={styles.actionBtn}
                                title="Delete wish"
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
          </div>
        )}

        {/* Section 2: Invitations & eCards Management */}
        {activeTab === '2' && (
          <div>
            <div className={styles.sectionHeader}>
              <MarkEmailReadIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>2. Invitations &amp; eCard Distribution</span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f7faf5 0%, #edf5eb 100%)', border: '1.5px solid #dce8d2', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#294B35', fontWeight: 800, margin: '0 0 6px 0' }}>Personalized Digital Panda eCards</h3>
                  <p style={{ color: '#576b5c', fontSize: '0.9rem', margin: 0 }}>
                    Every registered guest has a custom illustrated panda invitation eCard rendered with gold flourishes and event details.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('3')}
                    className={styles.addGuestBtn}
                  >
                    <PeopleIcon sx={{ fontSize: 18 }} />
                    <span>Manage Guest List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Guests eCard list */}
            <div className={styles.tableResponsive}>
              <table className={styles.guestTable}>
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Mobile</th>
                    <th>RSVP Status</th>
                    <th>eCard Action</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#7b8e7e' }}>
                        No guests found. Go to section 3 (Guest List) to add guests.
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g.id}>
                        <td>
                          <strong>{g.title} {g.name}</strong>
                        </td>
                        <td>{g.mobile}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[g.rsvp_status]}`}>
                            {g.rsvp_status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedEcardGuest(g)}
                            className={styles.ecardBtn}
                            title="Preview and download personalized eCard"
                          >
                            <AutoAwesomeIcon sx={{ fontSize: 15 }} />
                            <span>Preview &amp; Download eCard</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 5: RSVP Management */}
        {activeTab === '5' && (
          <div>
            <div className={styles.sectionHeader}>
              <HowToRegIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>5. RSVP Tracking &amp; Attendance</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Total Invited</span>
                <h3 style={{ fontSize: '1.8rem', color: '#294B35', marginTop: '4px' }}>{stats.totalGuests}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Attending Confirmed</span>
                <h3 style={{ fontSize: '1.8rem', color: '#3C8D40', marginTop: '4px' }}>{stats.attending}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Awaiting Response</span>
                <h3 style={{ fontSize: '1.8rem', color: '#B58422', marginTop: '4px' }}>{stats.pending}</h3>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #dce8d2' }}>
                <span style={{ fontSize: '0.85rem', color: '#6e7e73', fontWeight: 600 }}>Declined</span>
                <h3 style={{ fontSize: '1.8rem', color: '#D32F2F', marginTop: '4px' }}>{stats.declined}</h3>
              </div>
            </div>

            {/* Quick RSVP Table */}
            <div className={styles.tableResponsive}>
              <table className={styles.guestTable}>
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Mobile</th>
                    <th>RSVP Status</th>
                    <th>Update Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#7b8e7e' }}>
                        No guests added yet.
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g.id}>
                        <td>
                          <strong>{g.title} {g.name}</strong>
                        </td>
                        <td>{g.mobile}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[g.rsvp_status]}`}>
                            {g.rsvp_status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={g.rsvp_status}
                            onChange={(e) => handleRsvpStatusChange(g.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1px solid #dce8d2',
                              background: '#ffffff',
                              color: '#294b35',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="attending">Attending</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 6: Gift Registry */}
        {activeTab === '6' && (
          <div>
            <div className={styles.sectionHeader}>
              <CardGiftcardIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>6. Gift Registry &amp; Blessings Preference</span>
            </div>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #e1e7de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardGiftcardIcon sx={{ color: '#294b35', fontSize: 28 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem' }}>Gift Preferences Configured</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>&ldquo;Only your warm blessings &amp; presence are requested!&rdquo;</p>
                </div>
              </div>
              <p style={{ color: '#576b5c', lineHeight: 1.6, fontSize: '0.94rem' }}>
                For Ditvi&apos;s 1st birthday, the family has designated that guest presence and love are the sweetest gifts. If you wish to enable a digital registry wishlist or baby bank link in the future, it can be seamlessly toggled on here.
              </p>
            </div>
          </div>
        )}

        {/* Section 7: Live Streaming */}
        {activeTab === '7' && (
          <div>
            <div className={styles.sectionHeader}>
              <VideocamIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>7. Live Streaming Broadcast</span>
            </div>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #e1e7de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VideocamIcon sx={{ color: '#294b35', fontSize: 28 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem' }}>Virtual Event Stream</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>Live broadcast integration for distant friends and overseas relatives.</p>
                </div>
              </div>
              <div style={{ background: '#fbfdfa', border: '1px solid #edf4eb', borderRadius: '10px', padding: '16px', marginTop: '16px' }}>
                <p style={{ margin: 0, color: '#4a5b4e', fontSize: '0.9rem' }}>
                  Stream Link: <strong>Ready for YouTube Live / Zoom broadcast embed</strong> on the homepage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 8: Hashtag & Social Media */}
        {activeTab === '8' && (
          <div>
            <div className={styles.sectionHeader}>
              <TagIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>8. Social Media &amp; Hashtag Campaign</span>
            </div>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #e1e7de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TagIcon sx={{ color: '#294b35', fontSize: 28 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem' }}>Official Event Hashtags</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>Share memories on Instagram, Facebook, and WhatsApp.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                <span style={{ background: '#edf6ea', color: '#294b35', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #cbe3c6', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <TagIcon sx={{ fontSize: 16, color: '#294b35' }} />
                  <span>#DitviTurnsOne</span>
                </span>
                <span style={{ background: '#edf6ea', color: '#294b35', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #cbe3c6', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <TagIcon sx={{ fontSize: 16, color: '#294b35' }} />
                  <span>#DitviFirstBirthday</span>
                </span>
                <span style={{ background: '#edf6ea', color: '#294b35', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #cbe3c6', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <TagIcon sx={{ fontSize: 16, color: '#294b35' }} />
                  <span>#PandaPartyCelebration</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 11: Media & Photo Albums */}
        {activeTab === '11' && (
          <div>
            <div className={styles.sectionHeader}>
              <PhotoLibraryIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>11. Media &amp; Photo Albums</span>
            </div>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #e1e7de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhotoLibraryIcon sx={{ color: '#294b35', fontSize: 28 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem' }}>Event Memory Gallery</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>High-resolution birthday photoshoot albums and live ceremony snaps.</p>
                </div>
              </div>
              <p style={{ color: '#576b5c', lineHeight: 1.6, fontSize: '0.94rem' }}>
                Guests can view Ditvi&apos;s 1st year journey milestones, baby photoshoot photos, and live cake cutting photos directly on the homepage gallery carousel.
              </p>
            </div>
          </div>
        )}

        {/* Section 12: Thank You Cards */}
        {activeTab === '12' && (
          <div>
            <div className={styles.sectionHeader}>
              <VolunteerActivismIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>12. Personalized Thank You Cards</span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f7faf5 0%, #edf5eb 100%)', border: '1.5px solid #dce8d2', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#294B35', fontWeight: 800, margin: '0 0 6px 0' }}>Post-Event Guest Appreciation</h3>
                  <p style={{ color: '#576b5c', fontSize: '0.9rem', margin: 0 }}>
                    Generate bespoke thank-you notes with custom bamboo illustrations and Ditvi&apos;s party panda for each attending family.
                  </p>
                </div>
              </div>
            </div>

            {/* Guests Thank You Card list */}
            <div className={styles.tableResponsive}>
              <table className={styles.guestTable}>
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Mobile</th>
                    <th>RSVP Status</th>
                    <th>Thank You Card Action</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#7b8e7e' }}>
                        No guests found.
                      </td>
                    </tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g.id}>
                        <td>
                          <strong>{g.title} {g.name}</strong>
                        </td>
                        <td>{g.mobile}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[g.rsvp_status]}`}>
                            {g.rsvp_status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedThankYouGuest(g)}
                            className={styles.thankYouBtn}
                            title="Generate & View Thank You Card"
                          >
                            <FavoriteIcon sx={{ fontSize: 15 }} />
                            <span>Generate Thank You Card</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>

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
                    <span>{eventSettings.eventDate || 'Saturday, December 12, 2026'}</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: '#789B63' }} />
                    <span>{eventSettings.eventTime || '3:30 PM – 7:30 PM CST'}</span>
                  </div>
                  <div className={styles.ecardDetailRow}>
                    <PlaceIcon sx={{ fontSize: 20, color: '#789B63' }} />
                    <span>
                      {[eventSettings.venueName, eventSettings.venueCity].filter(Boolean).join(' • ') || 'Venue to be announced'}
                    </span>
                  </div>
                </div>

                <div className={styles.ecardFooterLove}>
                  Warmly, Ditvi &amp; Family
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
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>

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
                  Forever Grateful, Ditvi &amp; Family
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
      {/* Edit Quiz Question Modal */}
      {editingQuiz && (
        <div className={styles.modalOverlay} onClick={() => setEditingQuiz(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <EditIcon sx={{ fontSize: 20, color: '#3c8d40' }} />
                <span>Edit Quiz Question</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditingQuiz(null)}
                aria-label="Close"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveQuizEdit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-quiz-question">Question Text</label>
                <input
                  id="edit-quiz-question"
                  type="text"
                  className={styles.editInput}
                  value={editQuizQuestion}
                  onChange={(e) => setEditQuizQuestion(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.formLabel}>Options &amp; Correct Answer</label>
                  <span style={{ fontSize: '0.78rem', color: '#3c8d40', fontWeight: 700 }}>
                    Correct: Option {['A', 'B', 'C', 'D'][editQuizCorrectIndex]}
                  </span>
                </div>
                <div className={styles.quizOptionsGrid}>
                  {['A', 'B', 'C', 'D'].map((letter, idx) => (
                    <div
                      key={letter}
                      className={`${styles.quizOptionInputRow} ${editQuizCorrectIndex === idx ? styles.selectedCorrect : ''}`}
                    >
                      <span className={styles.quizOptionBadge}>{letter}</span>
                      <input
                        type="text"
                        placeholder={`Option ${letter}`}
                        className={styles.quizOptionInput}
                        value={editQuizOptions[idx] || ''}
                        onChange={(e) => {
                          const updated = [...editQuizOptions];
                          updated[idx] = e.target.value;
                          setEditQuizOptions(updated);
                        }}
                        required={idx < 2}
                      />
                      <label className={styles.quizCorrectRadioLabel}>
                        <input
                          type="radio"
                          name="editCorrectOptionRadio"
                          checked={editQuizCorrectIndex === idx}
                          onChange={() => setEditQuizCorrectIndex(idx)}
                        />
                        <span>Correct</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-quiz-explanation">Fun Fact / Explanation</label>
                <input
                  id="edit-quiz-explanation"
                  type="text"
                  className={styles.editInput}
                  value={editQuizExplanation}
                  onChange={(e) => setEditQuizExplanation(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter} style={{ padding: '16px 0 0', marginTop: '8px' }}>
                <button
                  type="button"
                  className={styles.topBtn}
                  onClick={() => setEditingQuiz(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuizEdit}
                  className={styles.btnAdd}
                  style={{ minWidth: '130px' }}
                >
                  <span>{isSavingQuizEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Birthday Wish Keepsake Card Modal */}
      {selectedWishCard && (
        <div className={styles.modalOverlay} onClick={() => setSelectedWishCard(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <CollectionsBookmarkIcon sx={{ fontSize: 20, color: '#D9B66F' }} />
                <span>Birthday Wish Keepsake Card</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedWishCard(null)}
                aria-label="Close"
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div ref={wishCardRef} className={styles.ecardFrame}>
                {/* Bamboo Trees on sides */}
                <div className={styles.ecardBambooTreeLeft} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>
                <div className={styles.ecardBambooTreeRight} aria-hidden="true">
                  <BambooStalkDecoration height={360} />
                </div>

                {/* Background Panda Paws */}
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>
                <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true"><PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} /></span>

                {/* Friendly Panda Mascot */}
                <div className={styles.ecardMascotWrap}>
                  <PartyPanda size={120} />
                </div>

                {/* Heading */}
                <div className={styles.ecardInviteLead}>A Heartfelt Birthday Wish for Ditvi</div>
                <h2 className={styles.ecardEventTitle}>
                  Ditvi&apos;s 1st Birthday <span>Keepsake</span>
                </h2>

                {/* Author Info */}
                <div className={styles.ecardGuestSection}>
                  <span className={styles.ecardGuestGreeting}>
                    {selectedWishCard.relation ? `${selectedWishCard.relation} • ` : ''}Wish From
                  </span>
                  <h3 className={styles.ecardGuestName}>
                    {selectedWishCard.name}
                  </h3>
                  {selectedWishCard.phone && (
                    <div style={{ fontSize: '0.82rem', color: '#6e7e73', marginTop: '2px' }}>
                      Phone: {selectedWishCard.phone}
                    </div>
                  )}
                </div>

                {/* Message Quote */}
                <div
                  style={{
                    background: '#f8faf7',
                    border: '1.5px dashed #dce8d2',
                    borderRadius: '14px',
                    padding: '18px 22px',
                    margin: '16px 20px',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    color: '#294b35',
                    fontStyle: 'italic',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  &ldquo;{selectedWishCard.message}&rdquo;
                </div>

                {/* Date and love footer */}
                <div className={styles.ecardFooterLove}>
                  With Love &amp; Giant Panda Hugs
                </div>
                <div className={styles.ecardFootnote}>
                  Recorded on {new Date(selectedWishCard.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })} • Ditvi&apos;s Memory Wall
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.topBtn}
                onClick={() => setSelectedWishCard(null)}
              >
                Close
              </button>
              <button
                type="button"
                disabled={isDownloading}
                className={styles.topBtn}
                onClick={() => handleDownloadWishImage(selectedWishCard)}
              >
                <ImageIcon sx={{ fontSize: 18 }} />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                disabled={isDownloading}
                className={styles.downloadBtn}
                onClick={() => handleDownloadSingleWishA4Pdf(selectedWishCard)}
              >
                <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                <span>{isDownloading ? 'Generating...' : 'Download A4 Size PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Offscreen DOM Container for Generating 100% Exact Matching 4-Card A4 PDF */}
      <div
        ref={printCardsContainerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-99999px',
          left: '-99999px',
          width: '500px',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        {wishesList.map((wish, wIdx) => (
          <div
            key={wish.id}
            data-wish-card-index={wIdx}
            className={styles.ecardFrame}
            style={{
              width: '440px',
              maxWidth: '440px',
              marginBottom: '40px',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            {/* Bamboo Trees on sides */}
            <div className={styles.ecardBambooTreeLeft} aria-hidden="true">
              <BambooStalkDecoration height={360} />
            </div>
            <div className={styles.ecardBambooTreeRight} aria-hidden="true">
              <BambooStalkDecoration height={360} />
            </div>

            {/* Background Panda Paws */}
            <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopLeft}`} aria-hidden="true">
              <PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} />
            </span>
            <span className={`${styles.ecardBgPaw} ${styles.ecardPawTopRight}`} aria-hidden="true">
              <PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} />
            </span>
            <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomLeft}`} aria-hidden="true">
              <PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} />
            </span>
            <span className={`${styles.ecardBgPaw} ${styles.ecardPawBottomRight}`} aria-hidden="true">
              <PetsIcon sx={{ fontSize: 28, color: 'rgba(217, 182, 111, 0.45)' }} />
            </span>

            {/* Friendly Panda Mascot */}
            <div className={styles.ecardMascotWrap}>
              <PartyPanda size={120} />
            </div>

            {/* Heading */}
            <div className={styles.ecardInviteLead}>A Heartfelt Birthday Wish for Ditvi</div>
            <h2 className={styles.ecardEventTitle}>
              Ditvi&apos;s 1st Birthday <span>Keepsake</span>
            </h2>

            {/* Author Info */}
            <div className={styles.ecardGuestSection}>
              <span className={styles.ecardGuestGreeting}>
                {wish.relation ? `${wish.relation} • ` : ''}Wish From
              </span>
              <h3 className={styles.ecardGuestName}>{wish.name}</h3>
              {wish.phone && (
                <div style={{ fontSize: '0.82rem', color: '#6e7e73', marginTop: '2px' }}>
                  Phone: {wish.phone}
                </div>
              )}
            </div>

            {/* Message Quote */}
            <div
              style={{
                background: '#f8faf7',
                border: '1.5px dashed #dce8d2',
                borderRadius: '14px',
                padding: '18px 22px',
                margin: '16px 20px',
                fontSize: '1.05rem',
                lineHeight: '1.6',
                color: '#294b35',
                fontStyle: 'italic',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              &ldquo;{wish.message}&rdquo;
            </div>

            {/* Date and love footer */}
            <div className={styles.ecardFooterLove}>With Love &amp; Giant Panda Hugs</div>
            <div className={styles.ecardFootnote}>
              Recorded on{' '}
              {new Date(wish.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              • Ditvi&apos;s Memory Wall
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

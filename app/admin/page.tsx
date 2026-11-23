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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HowToRegIcon from '@mui/icons-material/HowToReg';
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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LinkIcon from '@mui/icons-material/Link';
import SendIcon from '@mui/icons-material/Send';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { CARD_BG_BASE64 } from './cardBgBase64';
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

interface AdminRSVP {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  attending: string;
  guests_count: number;
  dietary?: string;
  allergies?: string;
  message?: string;
  created_at: string;
}

interface AdminDrivePhoto {
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
}

interface AdminGiftItem {
  id: number;
  asin?: string;
  title: string;
  category: string;
  price: string;
  list_price?: string;
  rating?: number;
  review_count?: string;
  image_url: string;
  purchase_url: string;
  description?: string;
  priority?: string;
  is_ordered: boolean;
  ordered_by?: string;
  ordered_email?: string;
  ordered_phone?: string;
  order_note?: string;
  ordered_at?: string;
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
  // Guest to delete (confirmation modal)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isDeletingGuest, setIsDeletingGuest] = useState(false);
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

  // Multi-User / Customer Accounts State
  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('admin');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userToast, setUserToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Gmail & Invitations Management State
  const [gmailStatus, setGmailStatus] = useState<{
    connected: boolean;
    accountEmail?: string | null;
    connectedAt?: string | null;
    errorMessage?: string | null;
    stats?: {
      totalGuests: number;
      invitationsSent: number;
      failedInvitations: number;
      pendingInvitations: number;
    };
  } | null>(null);
  const [isTestingGmail, setIsTestingGmail] = useState(false);
  const [isDisconnectingGmail, setIsDisconnectingGmail] = useState(false);
  const [gmailToast, setGmailToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Email template & customization state
  const [emailSubject, setEmailSubject] = useState("You're Invited to My Birthday! 🎂");
  const [emailCustomMessage, setEmailCustomMessage] = useState(
    "We would love to invite you to celebrate this magical milestone with us! Join us for a joyful day filled with laughter, delicious treats, games, and warm family moments."
  );
  const [emailBirthdayPerson, setEmailBirthdayPerson] = useState('Ditvi');
  const [emailBirthdayDate, setEmailBirthdayDate] = useState('Saturday, December 12, 2026');
  const [emailBirthdayTime, setEmailBirthdayTime] = useState('3:30 PM - 7:30 PM CST');
  const [emailBirthdayLocation, setEmailBirthdayLocation] = useState('Austin, TX');
  const [emailHostName, setEmailHostName] = useState('Birthday Star Family');

  // Selected guests for bulk invitation sending
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);
  const [isSendingInvitations, setIsSendingInvitations] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [forceResend, setForceResend] = useState(false);
  const [invitationResults, setInvitationResults] = useState<{
    summary?: { totalSelected: number; sent: number; failed: number; skipped: number };
    results?: Array<{ guestId: number; name: string; email: string; status: string; error?: string }>;
  } | null>(null);

  // Email Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewPlainText, setPreviewPlainText] = useState('');
  const [previewGuestName, setPreviewGuestName] = useState('Sample Guest');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Invitation History
  const [invitationHistory, setInvitationHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [retryingHistoryId, setRetryingHistoryId] = useState<number | null>(null);

  // Google Drive Photos Management State
  const [drivePhotos, setDrivePhotos] = useState<AdminDrivePhoto[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveStatus, setDriveStatus] = useState<{
    connected: boolean;
    isCustomerSpecific?: boolean;
    accountEmail?: string | null;
    folderId?: string;
    folderName?: string;
    sharingStatus?: string;
    connectedAt?: string | null;
    errorMessage?: string | null;
    message?: string;
    filesCount?: number;
  } | null>(null);
  const [isTestingDrive, setIsTestingDrive] = useState(false);
  const [isDisconnectingDrive, setIsDisconnectingDrive] = useState(false);
  const [driveToast, setDriveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [driveUploadFiles, setDriveUploadFiles] = useState<File[]>([]);
  const [driveUploadPreviews, setDriveUploadPreviews] = useState<string[]>([]);
  const [driveUploaderName, setDriveUploaderName] = useState('Admin / Host');
  const [driveCaption, setDriveCaption] = useState('');
  const [isDriveUploading, setIsDriveUploading] = useState(false);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState<string | null>(null);
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null);
  const [driveSearch, setDriveSearch] = useState('');
  const [copiedPhotoId, setCopiedPhotoId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [isDeletingDrivePhoto, setIsDeletingDrivePhoto] = useState(false);
  const driveFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch photos from Google Drive
  const fetchDrivePhotos = useCallback(async () => {
    try {
      setDriveLoading(true);
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.photos) {
        setDrivePhotos(data.photos);
      }
    } catch (err) {
      console.error('Failed to fetch drive photos:', err);
    } finally {
      setDriveLoading(false);
    }
  }, []);

  // Fetch all user accounts and their Drive/Gmail statuses
  const fetchUserAccounts = useCallback(async () => {
    try {
      setUsersLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUserAccounts(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Create a new user/customer account
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setUserToast({ type: 'error', message: 'Name, email, and password are required.' });
      return;
    }

    try {
      setIsCreatingUser(true);
      setUserToast(null);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword.trim(),
          role: newUserRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUserToast({ type: 'success', message: data.message });
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        fetchUserAccounts();
      } else {
        setUserToast({ type: 'error', message: data.error || 'Failed to create user account.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating user';
      setUserToast({ type: 'error', message: msg });
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Check Gmail connection status
  const checkGmailStatus = useCallback(async () => {
    try {
      setIsTestingGmail(true);
      const res = await fetch('/api/gmail/status');
      const data = await res.json();
      setGmailStatus(data);
    } catch (err) {
      console.error('Failed to check Gmail status:', err);
      setGmailStatus({
        connected: false,
        errorMessage: 'Network error contacting Gmail status API',
      });
    } finally {
      setIsTestingGmail(false);
    }
  }, []);

  // Fetch Invitation History
  const fetchInvitationHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/invitations/history');
      const data = await res.json();
      if (data.history) {
        setInvitationHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to fetch invitation history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Disconnect customer Gmail
  const handleDisconnectGmail = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Gmail account? Guest records and invitation history will remain safely preserved.')) {
      return;
    }
    try {
      setIsDisconnectingGmail(true);
      const res = await fetch('/api/gmail/disconnect', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setGmailToast({ type: 'success', message: data.message || 'Gmail disconnected.' });
        checkGmailStatus();
      } else {
        setGmailToast({ type: 'error', message: data.error || 'Failed to disconnect Gmail.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error disconnecting Gmail';
      setGmailToast({ type: 'error', message: msg });
    } finally {
      setIsDisconnectingGmail(false);
    }
  };

  // Send Test Email to host's connected Gmail
  const handleSendTestEmail = async () => {
    try {
      setIsSendingTestEmail(true);
      setGmailToast(null);
      const res = await fetch('/api/gmail/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailCustomMessage,
          birthdayPersonName: emailBirthdayPerson,
          birthdayDate: emailBirthdayDate,
          birthdayTime: emailBirthdayTime,
          birthdayLocation: emailBirthdayLocation,
          hostName: emailHostName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGmailToast({ type: 'success', message: data.message });
      } else {
        setGmailToast({ type: 'error', message: data.error || 'Failed to send test email.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send test email';
      setGmailToast({ type: 'error', message: msg });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Preview Email Modal Open
  const handleOpenEmailPreview = async (guestId?: number) => {
    try {
      setPreviewLoading(true);
      setIsPreviewOpen(true);
      const res = await fetch('/api/invitations/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          subject: emailSubject,
          message: emailCustomMessage,
          birthdayPersonName: emailBirthdayPerson,
          birthdayDate: emailBirthdayDate,
          birthdayTime: emailBirthdayTime,
          birthdayLocation: emailBirthdayLocation,
          hostName: emailHostName,
        }),
      });
      const data = await res.json();
      if (data.preview) {
        setPreviewHtml(data.preview.html);
        setPreviewPlainText(data.preview.plainText);
        setPreviewGuestName(data.preview.guestName);
      }
    } catch (err) {
      console.error('Preview error:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Send Bulk Invitations to Selected Guests
  const handleSendBulkInvitations = async () => {
    if (selectedGuestIds.length === 0) {
      alert('Please select at least one guest with an email address to send invitations.');
      return;
    }
    if (!window.confirm(`Are you ready to send personalized birthday invitations to ${selectedGuestIds.length} selected guest(s)?`)) {
      return;
    }

    try {
      setIsSendingInvitations(true);
      setGmailToast(null);
      setInvitationResults(null);

      const res = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestIds: selectedGuestIds,
          forceResend,
          subject: emailSubject,
          message: emailCustomMessage,
          birthdayPersonName: emailBirthdayPerson,
          birthdayDate: emailBirthdayDate,
          birthdayTime: emailBirthdayTime,
          birthdayLocation: emailBirthdayLocation,
          hostName: emailHostName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInvitationResults(data);
        setGmailToast({
          type: 'success',
          message: `Invitations processed! Sent: ${data.summary.sent}, Failed: ${data.summary.failed}, Skipped: ${data.summary.skipped}.`,
        });
        checkGmailStatus();
        fetchGuests();
        fetchInvitationHistory();
      } else {
        setGmailToast({ type: 'error', message: data.error || 'Failed to send invitations.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending invitations';
      setGmailToast({ type: 'error', message: msg });
    } finally {
      setIsSendingInvitations(false);
    }
  };

  // Retry a failed invitation
  const handleRetryInvitation = async (historyItem: any) => {
    try {
      setRetryingHistoryId(historyItem.id);
      const res = await fetch('/api/invitations/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historyId: historyItem.id,
          guestId: historyItem.guest_id,
          subject: emailSubject,
          message: emailCustomMessage,
          birthdayPersonName: emailBirthdayPerson,
          birthdayDate: emailBirthdayDate,
          birthdayTime: emailBirthdayTime,
          birthdayLocation: emailBirthdayLocation,
          hostName: emailHostName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGmailToast({ type: 'success', message: data.message });
        checkGmailStatus();
        fetchGuests();
        fetchInvitationHistory();
      } else {
        setGmailToast({ type: 'error', message: data.error || 'Failed to retry sending invitation.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Retry failed';
      setGmailToast({ type: 'error', message: msg });
    } finally {
      setRetryingHistoryId(null);
    }
  };
  const checkDriveStatus = useCallback(async () => {
    try {
      setIsTestingDrive(true);
      const res = await fetch('/api/google-drive/status');
      const data = await res.json();
      setDriveStatus(data);
    } catch (err) {
      console.error('Failed to check drive status:', err);
      setDriveStatus({
        connected: false,
        message: 'Network error contacting drive status API',
        folderId: '',
      });
    } finally {
      setIsTestingDrive(false);
    }
  }, []);

  // Disconnect customer Google Drive
  const handleDisconnectDrive = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Google Drive? Your photos will remain safe in your Drive, but new uploads will stop until you reconnect.')) {
      return;
    }
    try {
      setIsDisconnectingDrive(true);
      const res = await fetch('/api/google-drive/disconnect', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setDriveToast({ type: 'success', message: data.message || 'Google Drive disconnected.' });
        checkDriveStatus();
        fetchDrivePhotos();
      } else {
        setDriveToast({ type: 'error', message: data.error || 'Failed to disconnect Google Drive.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error disconnecting Drive';
      setDriveToast({ type: 'error', message: msg });
    } finally {
      setIsDisconnectingDrive(false);
    }
  };

  // Handle files selected for drive upload
  const handleDriveFilesSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });
    setDriveUploadFiles((prev) => [...prev, ...newFiles]);
    setDriveUploadPreviews((prev) => [...prev, ...newPreviews]);
    setDriveUploadError(null);
  };

  const handleRemoveDrivePreview = (idx: number) => {
    URL.revokeObjectURL(driveUploadPreviews[idx]);
    setDriveUploadFiles((prev) => prev.filter((_, i) => i !== idx));
    setDriveUploadPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit upload to Google Drive
  const handleDriveUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (driveUploadFiles.length === 0) {
      setDriveUploadError('Please select at least one photo or video to upload.');
      return;
    }

    setIsDriveUploading(true);
    setDriveUploadError(null);
    setDriveUploadSuccess(null);

    let uploadedCount = 0;
    const errors: string[] = [];

    for (const file of driveUploadFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaderName', driveUploaderName.trim() || 'Admin');
      formData.append('caption', driveCaption.trim());

      try {
        const res = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success) {
          uploadedCount++;
        } else {
          errors.push(data.error || `Upload failed for ${file.name}`);
        }
      } catch (err) {
        errors.push(`Network error uploading ${file.name}`);
      }
    }

    setIsDriveUploading(false);

    if (uploadedCount > 0) {
      setDriveUploadSuccess(`Successfully uploaded ${uploadedCount} photo${uploadedCount > 1 ? 's' : ''} directly to Google Drive!`);
      driveUploadPreviews.forEach((u) => URL.revokeObjectURL(u));
      setDriveUploadFiles([]);
      setDriveUploadPreviews([]);
      setDriveCaption('');
      fetchDrivePhotos();
      checkDriveStatus();
    }

    if (errors.length > 0) {
      setDriveUploadError(errors.join('. '));
    }
  };

  // Delete photo from Google Drive
  const handleDeleteDrivePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo from Google Drive? This cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingDrivePhoto(true);
      setDeletingPhotoId(photoId);
      const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setDrivePhotos((prev) => prev.filter((p) => p.id !== photoId));
      } else {
        alert(data.error || 'Failed to delete photo');
      }
    } catch (err) {
      console.error('Delete photo error:', err);
      alert('An error occurred while deleting the photo');
    } finally {
      setIsDeletingDrivePhoto(false);
      setDeletingPhotoId(null);
    }
  };

  // Copy direct link
  const handleCopyPhotoLink = (photo: AdminDrivePhoto) => {
    const fullUrl = window.location.origin + photo.proxyUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPhotoId(photo.id);
    setTimeout(() => setCopiedPhotoId(null), 2500);
  };

  // Gift Registry Management State
  const [adminGifts, setAdminGifts] = useState<AdminGiftItem[]>([]);
  const [adminGiftsLoading, setAdminGiftsLoading] = useState(false);
  const [giftAmazonUrl, setGiftAmazonUrl] = useState('');
  const [isFetchingAmazonGift, setIsFetchingAmazonGift] = useState(false);
  const [fetchedAmazonData, setFetchedAmazonData] = useState<any | null>(null);
  const [newGiftCategory, setNewGiftCategory] = useState('toys');
  const [newGiftPriority, setNewGiftPriority] = useState('medium');
  const [newGiftCustomTitle, setNewGiftCustomTitle] = useState('');
  const [newGiftCustomPrice, setNewGiftCustomPrice] = useState('');
  const [newGiftCustomImg, setNewGiftCustomImg] = useState('');
  const [newGiftCustomUrl, setNewGiftCustomUrl] = useState('');
  const [newGiftCustomDesc, setNewGiftCustomDesc] = useState('');
  const [isSavingGift, setIsSavingGift] = useState(false);
  const [giftAlert, setGiftAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [giftFilterCategory, setGiftFilterCategory] = useState('all');
  const [giftSearchQuery, setGiftSearchQuery] = useState('');

  // Fetch all gifts from DB
  const fetchAdminGifts = useCallback(async () => {
    try {
      setAdminGiftsLoading(true);
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.gifts) {
        setAdminGifts(data.gifts);
      }
    } catch (err) {
      console.error('Fetch gifts error:', err);
    } finally {
      setAdminGiftsLoading(false);
    }
  }, []);

  // 1-Click: Fetch all details from Amazon URL and save to DB
  const handleFetchAndSaveAmazonProduct = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || giftAmazonUrl).trim();
    if (!targetUrl) {
      setGiftAlert({ type: 'error', message: 'Please enter or paste an Amazon product URL.' });
      return;
    }

    try {
      setIsFetchingAmazonGift(true);
      setGiftAlert(null);

      // 1. Fetch from Amazon scraper
      const res = await fetch('/api/amazon-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.product) {
        throw new Error(data.error || 'Failed to extract product details from Amazon.');
      }

      const p = data.product;

      // Smart category detection
      let category = newGiftCategory || 'toys';
      const titleLower = p.title.toLowerCase();
      if (titleLower.includes('headphone') || titleLower.includes('earbud') || titleLower.includes('audio') || titleLower.includes('bluetooth') || titleLower.includes('speaker')) {
        category = 'electronics';
      } else if (titleLower.includes('book') || titleLower.includes('story') || titleLower.includes('reading')) {
        category = 'books';
      } else if (titleLower.includes('plush') || titleLower.includes('stuffed') || titleLower.includes('doll') || titleLower.includes('cuddle')) {
        category = 'soft';
      } else if (titleLower.includes('swaddle') || titleLower.includes('bamboo') || titleLower.includes('blanket') || titleLower.includes('bowl') || titleLower.includes('plate') || titleLower.includes('feeder')) {
        category = 'essentials';
      }

      // 2. Automatically save product directly to database
      const saveRes = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin: p.asin || '',
          title: p.title,
          category,
          price: p.price || '$0.00',
          listPrice: p.listPrice || '',
          rating: p.rating || 4.5,
          reviewCount: p.reviewCount || '',
          imageUrl: p.mainImage,
          purchaseUrl: p.productUrl,
          description: p.features?.slice(0, 2).join(' • ') || p.brand || '',
          priority: newGiftPriority || 'high',
        }),
      });

      const saveData = await saveRes.json();
      if (saveRes.ok && saveData.success) {
        setGiftAlert({
          type: 'success',
          message: `Successfully fetched and added "${p.title.slice(0, 50)}..." to Gift Registry!`,
        });
        setGiftAmazonUrl('');
        setFetchedAmazonData(p);
        fetchAdminGifts();
      } else {
        throw new Error(saveData.error || 'Failed to save gift to database');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing Amazon URL';
      setGiftAlert({ type: 'error', message: msg });
    } finally {
      setIsFetchingAmazonGift(false);
    }
  };

  // Delete gift from DB
  const handleDeleteGift = async (id: number) => {
    if (!confirm('Are you sure you want to remove this gift from the registry?')) return;
    try {
      const res = await fetch(`/api/gifts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAdminGifts((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error('Delete gift error:', err);
    }
  };

  // Toggle Ordered status in DB
  const handleToggleGiftOrderedStatus = async (gift: AdminGiftItem) => {
    try {
      const nextOrdered = !gift.is_ordered;
      const res = await fetch('/api/gifts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: gift.id,
          is_ordered: nextOrdered,
          ordered_by: nextOrdered ? 'Admin Marked' : null,
        }),
      });
      if (res.ok) {
        setAdminGifts((prev) =>
          prev.map((g) => (g.id === gift.id ? { ...g, is_ordered: nextOrdered, ordered_by: nextOrdered ? 'Admin Marked' : undefined } : g))
        );
      }
    } catch (err) {
      console.error('Update gift status error:', err);
    }
  };

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

  // RSVP Database Records State
  const [rsvpsList, setRsvpsList] = useState<AdminRSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(false);

  // Fetch RSVPs from Database
  const fetchRsvps = useCallback(async () => {
    try {
      setRsvpsLoading(true);
      const res = await fetch('/api/admin/rsvp');
      if (res.ok) {
        const data = await res.json();
        if (data.rsvps) setRsvpsList(data.rsvps);
      }
    } catch (err) {
      console.error('Fetch RSVPs error:', err);
    } finally {
      setRsvpsLoading(false);
    }
  }, []);

  // Delete RSVP from Database
  const handleDeleteRsvp = async (id: number) => {
    if (!confirm('Are you sure you want to delete this RSVP response from the database?')) return;
    try {
      const res = await fetch(`/api/admin/rsvp?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRsvps();
      } else {
        alert('Failed to delete RSVP');
      }
    } catch (err) {
      console.error('Delete RSVP error:', err);
    }
  };

  // Download RSVP Data as CSV
  const handleDownloadRsvpCsv = () => {
    if (rsvpsList.length === 0) {
      alert('No RSVP data to export.');
      return;
    }
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Attending', 'Guests Count', 'Dietary Preference', 'Allergies', 'Personal Message', 'Submitted At'];
    const rows = rsvpsList.map((r) => [
      r.id,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${r.attending === 'yes' ? 'Attending' : 'Not Attending'}"`,
      r.guests_count || 1,
      `"${(r.dietary || '').replace(/"/g, '""')}"`,
      `"${(r.allergies || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.created_at ? new Date(r.created_at).toLocaleString('en-US') : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ditvi_Birthday_RSVP_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download RSVP Data as PDF Report - Themed & Styled for Bamboo Grove Context
  const handleDownloadRsvpPdf = async () => {
    if (rsvpsList.length === 0) {
      alert('No RSVP data to export.');
      return;
    }
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });

      // Background decorative tint (Warm bamboo cream #FCFDF9)
      doc.setFillColor(252, 253, 249);
      doc.rect(0, 0, 841.89, 595.28, 'F');

      // Top Deep Forest Green Header Banner
      doc.setFillColor(27, 56, 36); // #1B3824
      doc.rect(0, 0, 841.89, 68, 'F');

      // Gold Sparkle Stripe Divider
      doc.setFillColor(217, 182, 111); // #D9B66F Gold
      doc.rect(0, 68, 841.89, 3.5, 'F');

      // Sage Green Accent Sub-stripe
      doc.setFillColor(120, 155, 99); // #789B63
      doc.rect(0, 71.5, 841.89, 1.5, 'F');

      // Header Typography
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("Ditvi's 1st Birthday Celebration • Bamboo Grove", 42, 34);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(215, 235, 218);
      doc.text(
        `Official RSVP & Meal Preferences Roster • Generated ${new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} • Total Responses: ${rsvpsList.length}`,
        42,
        52
      );

      // Context Info Cards (Event Date, Venue, Key Attendance Stats)
      // Card 1: Event Context Box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 232, 210);
      doc.setLineWidth(1);
      doc.roundedRect(42, 85, 360, 48, 6, 6, 'FD');

      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('CELEBRATION EVENT CONTEXT', 54, 100);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 100, 85);
      const eventDateStr = eventSettings.eventDate || 'Saturday, December 12, 2026';
      const venueStr = [eventSettings.venueName, eventSettings.venueCity].filter(Boolean).join(', ') || 'Bamboo Grove Party Venue';
      doc.text(`Date & Time: ${eventDateStr} • ${eventSettings.eventTime || '3:30 PM CST'}`, 54, 113);
      doc.text(`Location: ${venueStr}`, 54, 125);

      // Card 2: Metrics Summary Pill Box
      const attendingCount = rsvpsList.filter((r) => r.attending === 'yes').length;
      const declinedCount = rsvpsList.filter((r) => r.attending === 'no').length;
      const totalHeadcount = rsvpsList.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + (r.guests_count || 1), 0);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 232, 210);
      doc.roundedRect(418, 85, 381, 48, 6, 6, 'FD');

      // Metric 1: Attending
      doc.setTextColor(46, 125, 50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${attendingCount}`, 436, 107);
      doc.setFontSize(7.5);
      doc.setTextColor(90, 120, 95);
      doc.text('Attending Families', 436, 122);

      // Metric 2: Headcount
      doc.setTextColor(181, 132, 34);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${totalHeadcount}`, 550, 107);
      doc.setFontSize(7.5);
      doc.setTextColor(120, 100, 70);
      doc.text('Total Guest Headcount', 550, 122);

      // Metric 3: Declined
      doc.setTextColor(211, 47, 47);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(`${declinedCount}`, 675, 107);
      doc.setFontSize(7.5);
      doc.setTextColor(140, 90, 90);
      doc.text('Declined / Wishes', 675, 122);

      // Table Data
      const tableData = rsvpsList.map((r, idx) => [
        (idx + 1).toString(),
        r.full_name,
        r.phone,
        r.email || '—',
        r.attending === 'yes' ? 'CONFIRMED' : 'DECLINED',
        r.attending === 'yes' ? (r.guests_count || 1).toString() : '0',
        r.dietary || 'Standard',
        r.allergies || 'None',
        r.message ? `"${r.message}"` : '—',
        r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
      ]);

      autoTable(doc, {
        head: [['#', 'Guest Name', 'Mobile', 'Email Address', 'Status', 'Guests', 'Diet Preference', 'Allergies', 'Heartfelt Message', 'Date']],
        body: tableData,
        startY: 144,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 5.5,
          valign: 'middle',
          textColor: [35, 45, 38],
          lineColor: [225, 235, 220],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [41, 75, 53], // #294B35
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'left',
        },
        alternateRowStyles: {
          fillColor: [248, 251, 246], // Soft bamboo alternate rows
        },
        columnStyles: {
          0: { cellWidth: 24, halign: 'center' },
          1: { cellWidth: 105, fontStyle: 'bold', textColor: [32, 51, 37] },
          2: { cellWidth: 72 },
          3: { cellWidth: 100 },
          4: { cellWidth: 64, halign: 'center', fontStyle: 'bold' },
          5: { cellWidth: 38, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 68 },
          7: { cellWidth: 62 },
          8: { cellWidth: 165, fontStyle: 'italic', textColor: [65, 80, 70] },
          9: { cellWidth: 59, halign: 'center', fontSize: 7.5 },
        },
        didParseCell: (data) => {
          // Highlight Attending (Green) vs Declined (Red)
          if (data.column.index === 4 && data.section === 'body') {
            if (data.cell.raw === 'CONFIRMED') {
              data.cell.styles.textColor = [46, 125, 50];
              data.cell.styles.fillColor = [237, 247, 237];
            } else if (data.cell.raw === 'DECLINED') {
              data.cell.styles.textColor = [211, 47, 47];
              data.cell.styles.fillColor = [253, 232, 232];
            }
          }
        },
      });

      // Footer Note
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(27, 56, 36);
        doc.rect(42, 568, 757, 1, 'F');

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 130, 115);
        doc.text("Ditvi's 1st Birthday Celebration • Official RSVP Admin Registry • Bamboo Forest Theme", 42, 580);
        doc.text(`Page ${i} of ${pageCount}`, 755, 580, { align: 'right' });
      }

      doc.save(`Ditvi_Birthday_Official_RSVP_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export RSVP PDF:', err);
      alert('Failed to generate RSVP PDF report.');
    }
  };

  // WhatsApp RSVP Modal State
  const [whatsappGuest, setWhatsappGuest] = useState<Guest | null>(null);
  const [whatsappCustomMessage, setWhatsappCustomMessage] = useState<string>('');

  const openWhatsappModal = (guest: Guest) => {
    setWhatsappGuest(guest);
    const guestName = guest.name ? `${guest.title ? guest.title + ' ' : ''}${guest.name}` : 'Guest';
    const defaultMsg = `Dear ${guestName},\n\nYou are cordially invited to Ditvi's 1st Birthday Celebration in the Bamboo Grove! 🐼🎋\n\nPlease confirm your attendance and let us know your preferences by filling out your RSVP using the link below:`;
    setWhatsappCustomMessage(defaultMsg);
  };

  const sendWhatsappRsvp = () => {
    if (!whatsappGuest) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const rsvpUrl = `${origin}/rsvp?name=${encodeURIComponent(whatsappGuest.name || '')}&phone=${encodeURIComponent(whatsappGuest.mobile || '')}&email=${encodeURIComponent(whatsappGuest.email || '')}`;
    
    const fullText = `${whatsappCustomMessage.trim()}\n\n👉 Fill RSVP Here: ${rsvpUrl}\n\nWe look forward to celebrating together with you! 🎈🎂`;

    // Clean phone number (strip spaces, dashes, etc.)
    const cleanPhone = (whatsappGuest.mobile || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const whatsappLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappLink, '_blank');
    setWhatsappGuest(null);
  };

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
        // 1. CARD CONTAINER (Personal card frame style with custom panda paws background)
        // ==========================================
        doc.setFillColor(250, 247, 240);
        doc.setDrawColor(220, 232, 210);
        doc.setLineWidth(1.4);
        doc.roundedRect(x, y, cardWidth, cardHeight, 14, 14, 'FD');

        // Render card background pattern matching ecard & thank you card
        try {
          doc.addImage(CARD_BG_BASE64, 'JPEG', x + 1, y + 1, cardWidth - 2, cardHeight - 2, undefined, 'FAST');
        } catch {
          // graceful fallback if image decoding fails in pdf
        }

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
    fetchRsvps();
    fetchAdminGifts();
  }, [fetchGuests, fetchQuizQuestions, fetchQuizSubmissions, fetchEventSettings, fetchWishes, fetchRsvps, fetchAdminGifts]);

  useEffect(() => {
    if (activeTab === '1') {
      fetchEventSettings();
    }
    if (activeTab === '5') {
      fetchRsvps();
      fetchGuests();
    }
    if (activeTab === '6') {
      fetchAdminGifts();
    }
    if (activeTab === '9') {
      fetchWishes();
    }
    if (activeTab === '10') {
      fetchQuizQuestions();
      fetchQuizSubmissions();
    }
    if (activeTab === '8') {
      checkGmailStatus();
      fetchGuests();
      fetchInvitationHistory();

      // Check URL search params for Gmail OAuth success or error
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const gmailSuccess = params.get('gmail_success');
        const gmailError = params.get('gmail_error');
        if (gmailSuccess) {
          setGmailToast({ type: 'success', message: gmailSuccess });
          window.history.replaceState({}, '', '/admin?tab=8');
        } else if (gmailError) {
          setGmailToast({ type: 'error', message: gmailError });
          window.history.replaceState({}, '', '/admin?tab=8');
        }
      }
    }
    if (activeTab === 'users') {
      fetchUserAccounts();
    }
    if (activeTab === '11') {
      fetchDrivePhotos();
      checkDriveStatus();

      // Check URL search params for OAuth success or error
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const gdriveSuccess = params.get('gdrive_success');
        const gdriveError = params.get('gdrive_error');
        if (gdriveSuccess) {
          setDriveToast({ type: 'success', message: gdriveSuccess });
          // Clean URL without refresh
          window.history.replaceState({}, '', '/admin?tab=11');
        } else if (gdriveError) {
          setDriveToast({ type: 'error', message: gdriveError });
          window.history.replaceState({}, '', '/admin?tab=11');
        }
      }
    }
    if (activeTab === '12') {
      fetchAdminGifts();
    }
  }, [activeTab, fetchEventSettings, fetchWishes, fetchQuizQuestions, fetchQuizSubmissions, fetchRsvps, fetchGuests, fetchDrivePhotos, checkDriveStatus, fetchAdminGifts]);

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

  // Download Guest List in PDF format - Themed & Styled for Bamboo Grove Context
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

      // Background decorative tint (Warm bamboo cream #FCFDF9)
      doc.setFillColor(252, 253, 249);
      doc.rect(0, 0, 595.28, 841.89, 'F');

      // Header Banner - Forest Green
      doc.setFillColor(27, 56, 36); // #1B3824
      doc.rect(0, 0, 595.28, 70, 'F');

      // Gold Sparkle Accent Line
      doc.setFillColor(217, 182, 111); // #D9B66F Gold
      doc.rect(0, 70, 595.28, 3.5, 'F');

      // Sage Green Accent Sub-stripe
      doc.setFillColor(120, 155, 99); // #789B63
      doc.rect(0, 73.5, 595.28, 1.5, 'F');

      // Title & Event Info
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text("Ditvi's 1st Birthday Celebration • Bamboo Grove", 40, 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(215, 235, 218);
      doc.text(
        `Official Guest Directory • Generated ${new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} • Total Guests: ${guests.length}`,
        40,
        54
      );

      // Event Details & Stats Card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 232, 210);
      doc.setLineWidth(1);
      doc.roundedRect(40, 86, 515, 56, 6, 6, 'FD');

      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('CELEBRATION EVENT OVERVIEW', 52, 102);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 95, 80);
      doc.text(
        `Event Date: ${eventSettings.eventDate || 'Saturday, December 12, 2026'}${eventSettings.eventTime ? ` (${eventSettings.eventTime})` : ''}`,
        52,
        116
      );
      doc.text(
        `Venue: ${[eventSettings.venueName, eventSettings.venueCity].filter(Boolean).join(', ') || 'To be announced soon by hosts'}`,
        52,
        130
      );

      // Right Stats Badge inside Card
      doc.setFillColor(242, 248, 240);
      doc.roundedRect(420, 94, 120, 40, 4, 4, 'F');
      doc.setTextColor(41, 75, 53);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`${guests.length}`, 480, 114, { align: 'center' });
      doc.setFontSize(7.5);
      doc.setTextColor(90, 120, 95);
      doc.text('Invited Guests', 480, 126, { align: 'center' });

      // Table rows
      const tableData = guests.map((g, index) => [
        (index + 1).toString(),
        `${g.title || 'Mr.'} ${g.name}`,
        g.mobile || '—',
        g.email || '—',
        g.invited ? 'INVITED' : 'PENDING',
      ]);

      autoTable(doc, {
        startY: 154,
        head: [['#', 'Guest Full Name', 'Mobile Number', 'Email Address', 'Status']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 8.5,
          cellPadding: 6,
          valign: 'middle',
          textColor: [35, 45, 38],
          lineColor: [225, 235, 220],
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [41, 75, 53], // #294B35
          textColor: [255, 255, 255],
          fontSize: 8.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        alternateRowStyles: {
          fillColor: [248, 251, 246], // Soft bamboo tint
        },
        columnStyles: {
          0: { cellWidth: 28, halign: 'center' },
          1: { cellWidth: 165, fontStyle: 'bold', textColor: [32, 51, 37] },
          2: { cellWidth: 110 },
          3: { cellWidth: 145 },
          4: { cellWidth: 67, halign: 'center', fontStyle: 'bold', textColor: [46, 125, 50] },
        },
        margin: { left: 40, right: 40, bottom: 40 },
        didDrawPage: (data) => {
          // Footer
          const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : (doc as any).internal.pages.length - 1;
          const currentPage = (data as any).pageNumber || 1;
          doc.setFillColor(27, 56, 36);
          doc.rect(40, doc.internal.pageSize.height - 30, 515, 1, 'F');
          doc.setFontSize(7.5);
          doc.setTextColor(110, 130, 115);
          doc.text(
            "Ditvi's 1st Birthday Celebration • Official Guest Directory • Bamboo Forest Theme",
            40,
            doc.internal.pageSize.height - 18
          );
          doc.text(
            `Page ${currentPage} of ${pageCount}`,
            555,
            doc.internal.pageSize.height - 18,
            { align: 'right' }
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

  // Handle guest delete confirmation
  const handleConfirmDeleteGuest = async () => {
    if (!guestToDelete) return;
    try {
      setIsDeletingGuest(true);
      const res = await fetch(`/api/admin/guests?id=${guestToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchGuests();
        setGuestToDelete(null);
      }
    } catch (err) {
      console.error('Delete guest error:', err);
    } finally {
      setIsDeletingGuest(false);
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
              <span className={styles.navItemText}>Event Details</span>
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
              <span className={styles.navItemText}>Guest List</span>
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
              <span className={styles.navItemText}>RSVP Management</span>
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
              <span className={styles.navItemText}>Gift Registry</span>
            </div>
            {adminGifts.length > 0 && <span className={styles.navBadge}>{adminGifts.length}</span>}
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
              <span className={styles.navIcon}><AddShoppingCartIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>Add Product</span>
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
              <span className={styles.navItemText}>Live Streaming</span>
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
              <span className={styles.navIcon}><EmailOutlinedIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>Email Invitations</span>
            </div>
            {gmailStatus?.connected && <span className={styles.navBadge} style={{ background: '#2e7d32' }}>Active</span>}
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('users');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><PeopleIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>Customer Accounts</span>
            </div>
            {userAccounts.length > 0 && <span className={styles.navBadge}>{userAccounts.length}</span>}
          </button>

          <button
            type="button"
            className={`${styles.navItem} ${activeTab === 'hashtags' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('hashtags');
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}><TagIcon sx={{ fontSize: 20 }} /></span>
              <span className={styles.navItemText}>Hashtag</span>
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
              <span className={styles.navItemText}>Wish Wall</span>
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
              <span className={styles.navItemText}>Birthday Quiz</span>
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
              <span className={styles.navItemText}>Media &amp; Albums</span>
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

        {/* Section 3: Guest List Management - 100% Full Width Bamboo Grove Theme */}
        {activeTab === '3' && (
          <div style={{ width: '100%' }}>
            {/* Themed Hero Banner */}
            <div
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #183321 0%, #294B35 55%, #3c6e4a 100%)',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '24px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(41, 75, 53, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px', color: '#f0fdf4' }}>
                  <ParkIcon sx={{ fontSize: 16, color: '#a3e635' }} />
                  <span>BAMBOO GROVE • OFFICIAL GUEST ROSTER</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff', letterSpacing: '-0.3px' }}>
                  Guest List Management
                </h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#d1e7d6', maxWidth: '580px', lineHeight: 1.5 }}>
                  Add invitees, trigger personalized WhatsApp invites with autofilled RSVP forms, generate birthday eCards, and track your party guests.
                </p>
              </div>

              {/* Stats badges */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#d1e7d6', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Total Guests</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>{stats.totalGuests}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#d1e7d6', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>RSVPs Saved</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#a3e635' }}>{rsvpsList.length}</span>
                </div>
              </div>
            </div>

            {/* Guest Entry Box */}
            <div
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1.5px solid #dce8d2',
                borderRadius: '18px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)',
                boxSizing: 'border-box',
              }}
            >
              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #edf4ea', paddingBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setGuestAddMode('single')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: guestAddMode === 'single' ? '#294B35' : '#f0f6ee',
                    color: guestAddMode === 'single' ? '#ffffff' : '#4a5b4e',
                    transition: 'all 0.2s',
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                  <span>Add Single Guest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuestAddMode('csv')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: guestAddMode === 'csv' ? '#294B35' : '#f0f6ee',
                    color: guestAddMode === 'csv' ? '#ffffff' : '#4a5b4e',
                    transition: 'all 0.2s',
                  }}
                >
                  <UploadFileIcon sx={{ fontSize: 18 }} />
                  <span>Bulk CSV Upload</span>
                </button>
              </div>

              {guestAddMode === 'single' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#294B35', fontWeight: 800, fontSize: '1rem' }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#3c8d40' }} />
                    <span>Quick Guest Entry</span>
                  </div>

                  <form onSubmit={handleAddGuest} style={{ display: 'grid', gridTemplateColumns: '110px 1.2fr 1fr 1.2fr auto', gap: '12px', alignItems: 'center' }}>
                    <select
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      aria-label="Title"
                      style={{
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #d2ded0',
                        background: '#fafcfa',
                        color: '#294B35',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Guest Full Name *"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      style={{
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #d2ded0',
                        background: '#ffffff',
                        fontSize: '0.92rem',
                        color: '#294B35',
                        outline: 'none',
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Mobile Phone (10-digit) *"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      required
                      style={{
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #d2ded0',
                        background: '#ffffff',
                        fontSize: '0.92rem',
                        color: '#294B35',
                        outline: 'none',
                      }}
                    />

                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      style={{
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #d2ded0',
                        background: '#ffffff',
                        fontSize: '0.92rem',
                        color: '#294B35',
                        outline: 'none',
                      }}
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '11px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #294B35 0%, #3C8D40 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(41, 75, 53, 0.2)',
                      }}
                    >
                      <AddIcon sx={{ fontSize: 18 }} />
                      <span>{isSubmitting ? 'Adding...' : 'Add Guest'}</span>
                    </button>
                  </form>
                </div>
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
                          <td>Mr. / Miss / Mrs.</td>
                          <td>Abhishek Choudhary</td>
                          <td>9264248504</td>
                          <td>guest@example.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CSV DropZone */}
                  <div
                    className={styles.csvDropZone}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileChange}
                      style={{ display: 'none' }}
                    />
                    <div className={styles.csvDropIcon}>
                      <UploadFileIcon sx={{ fontSize: 44, color: '#3c8d40' }} />
                    </div>
                    <div className={styles.csvDropText}>
                      {csvFileName ? `Selected File: ${csvFileName}` : 'Click here to upload CSV file'}
                    </div>
                    <div className={styles.csvDropSub}>
                      Select a .CSV file matching the format above (Title, Name, Mobile, Email)
                    </div>
                  </div>

                  {/* CSV Error */}
                  {csvUploadError && (
                    <div className={styles.csvErrorAlert}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                      <span>{csvUploadError}</span>
                    </div>
                  )}

                  {/* CSV Success / Uploaded message */}
                  {csvUploadSuccess && (
                    <div className={styles.csvSuccessAlert}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      <span>{csvUploadSuccess}</span>
                    </div>
                  )}

                  {/* CSV Preview */}
                  {csvParsedGuests.length > 0 && (
                    <div className={styles.csvPreviewContainer}>
                      <div className={styles.csvPreviewHeader}>
                        <div className={styles.csvPreviewTitle}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#3c8d40' }} />
                          <span>Ready to Import: {csvParsedGuests.length} Guests</span>
                        </div>
                        <div className={styles.csvPreviewActions}>
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

            {/* Filter, Search & Export Bar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '18px',
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1.5px solid #dce8d2',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <SearchIcon sx={{ position: 'absolute', left: '12px', fontSize: 19, color: '#7a8c7e' }} />
                  <input
                    type="text"
                    placeholder="Search guests by name, phone, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #d2ded0',
                      fontSize: '0.9rem',
                      color: '#294B35',
                      background: '#fafcfa',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #d2ded0',
                    background: '#fafcfa',
                    color: '#294B35',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending RSVP</option>
                  <option value="confirmed">Confirmed / Attending</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf || guests.length === 0}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1.5px solid #dce8d2',
                    background: '#ffffff',
                    color: '#294B35',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <PictureAsPdfIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
                  <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF List'}</span>
                </button>
              </div>
            </div>

            {/* Themed Guest Table - 100% Full Width */}
            <div
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1.5px solid #dce8d2',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)',
                boxSizing: 'border-box',
              }}
            >
              <div className={styles.tableResponsive} style={{ width: '100%', overflowX: 'auto' }}>
                <table className={styles.guestTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5faf3', borderBottom: '1.5px solid #dce8d2' }}>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px' }}>GUEST NAME</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px' }}>MOBILE</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px' }}>EMAIL</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px' }}>INVITATION STATUS</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'center' }}>CARDS &amp; INVITE</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={`guest-skel-${i}`} style={{ borderBottom: '1px solid #edf4ea' }}>
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={styles.skeletonBase} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className={styles.skeletonBase} style={{ width: '130px', height: '16px' }} />
                                <div className={styles.skeletonBase} style={{ width: '80px', height: '12px' }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 18px' }}>
                            <div className={styles.skeletonBase} style={{ width: '110px', height: '15px' }} />
                          </td>
                          <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                            <div className={styles.skeletonBase} style={{ width: '85px', height: '24px', borderRadius: '12px', margin: '0 auto' }} />
                          </td>
                          <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                            <div className={styles.skeletonBase} style={{ width: '70px', height: '16px', margin: '0 auto' }} />
                          </td>
                          <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                            <div className={styles.skeletonBase} style={{ width: '90px', height: '28px', borderRadius: '6px', margin: '0 auto' }} />
                          </td>
                          <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                            <div className={styles.skeletonBase} style={{ width: '80px', height: '28px', borderRadius: '6px', marginLeft: 'auto' }} />
                          </td>
                        </tr>
                      ))
                    ) : guests.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eef6ec', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SentimentSatisfiedAltIcon sx={{ fontSize: 32, color: '#3c8d40' }} />
                          </div>
                          <h4 style={{ margin: '0 0 6px', color: '#294B35', fontSize: '1.1rem' }}>No guests found</h4>
                          <p style={{ margin: 0, color: '#7a8c7e', fontSize: '0.88rem' }}>
                            Add your first guest above or import using CSV!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      guests.map((g) => (
                        <tr key={g.id} style={{ borderBottom: '1px solid #edf4ea', transition: 'background 0.15s' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eef6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#294B35', fontWeight: 800, fontSize: '0.85rem' }}>
                                {(g.name || 'G')[0].toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ color: '#203325', fontSize: '0.94rem' }}>
                                  {g.title ? `${g.title} ` : ''}{g.name}
                                </strong>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#3f5344', fontSize: '0.9rem' }}>
                            {g.mobile}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#5b6e60', fontSize: '0.88rem' }}>
                            {g.email || <span style={{ color: '#a0b1a4' }}>—</span>}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: '#edf7ed', color: '#1e4620', fontSize: '0.82rem', fontWeight: 700 }}>
                              <CheckCircleIcon sx={{ fontSize: 14, color: '#2e7d32' }} />
                              <span>Invited</span>
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => openWhatsappModal(g)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: '#25D366',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
                                }}
                                title="Send WhatsApp RSVP Link (Pre-filled)"
                              >
                                <WhatsAppIcon sx={{ fontSize: 15 }} />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedEcardGuest(g)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  border: '1.5px solid #d2ded0',
                                  background: '#ffffff',
                                  color: '#294B35',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                }}
                                title="Generate & View eCard"
                              >
                                <AutoAwesomeIcon sx={{ fontSize: 14, color: '#D9B66F' }} />
                                <span>eCard</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedThankYouGuest(g)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  border: '1.5px solid #d2ded0',
                                  background: '#ffffff',
                                  color: '#294B35',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                }}
                                title="Generate & View Thank You Card"
                              >
                                <FavoriteIcon sx={{ fontSize: 14, color: '#e57373' }} />
                                <span>Thank You</span>
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end' }}>
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
                                onClick={() => setGuestToDelete(g)}
                                className={styles.actionBtn}
                                title="Delete guest"
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
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
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Guest List</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Confirmed RSVPs</span>
                <h3 style={{ fontSize: '1.8rem', color: '#3C8D40', marginTop: '4px' }}>{stats.attending}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>RSVP Management</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Birthday Wishes Received</span>
                <h3 style={{ fontSize: '1.8rem', color: '#D9B66F', marginTop: '4px' }}>{wishesList.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Wish Wall</span>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #dce8d2', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#6e7e73', fontWeight: 600 }}>Quiz Submissions</span>
                <h3 style={{ fontSize: '1.8rem', color: '#2b5b84', marginTop: '4px' }}>{quizSubmissions.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#8e9e93' }}>Quiz Responses</span>
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
                  <span style={{ fontWeight: 700, color: '#294b35' }}>Event Details</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6e7e73', margin: 0 }}>Update event title, dates, venue location, and contact numbers.</p>
              </div>

              <div
                onClick={() => setActiveTab('3')}
                style={{ background: '#ffffff', border: '1px solid #e3ece0', borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3c8d40')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e3ece0')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <PeopleIcon sx={{ color: '#3c8d40' }} />
                  <span style={{ fontWeight: 700, color: '#294b35' }}>Guest List</span>
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
                  <span style={{ fontWeight: 700, color: '#294b35' }}>RSVP Tracking</span>
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
                  <span style={{ fontWeight: 700, color: '#294b35' }}>Wish Wall</span>
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
                  <span style={{ fontWeight: 700, color: '#294b35' }}>Birthday Quiz</span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[...Array(3)].map((_, i) => (
                        <div key={`quiz-skel-${i}`} className={styles.skeletonCard} style={{ padding: '18px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={styles.skeletonBase} style={{ width: '32px', height: '24px', borderRadius: '6px' }} />
                              <div className={styles.skeletonBase} style={{ width: '280px', height: '20px' }} />
                            </div>
                            <div className={styles.skeletonBase} style={{ width: '70px', height: '28px', borderRadius: '6px' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div className={styles.skeletonBase} style={{ height: '32px', borderRadius: '8px' }} />
                            <div className={styles.skeletonBase} style={{ height: '32px', borderRadius: '8px' }} />
                          </div>
                        </div>
                      ))}
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
                        [...Array(4)].map((_, i) => (
                          <tr key={`quiz-sub-skel-${i}`} className={styles.tr}>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '20px', height: '16px' }} /></td>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '130px', height: '18px' }} /></td>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '60px', height: '16px' }} /></td>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '50px', height: '22px', borderRadius: '10px' }} /></td>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '100px', height: '16px' }} /></td>
                            <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '70px', height: '26px', borderRadius: '6px' }} /></td>
                          </tr>
                        ))
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
                      [...Array(5)].map((_, i) => (
                        <tr key={`wish-skel-${i}`} className={styles.tr}>
                          <td className={styles.td} style={{ textAlign: 'center' }}><div className={styles.skeletonBase} style={{ width: '20px', height: '16px', margin: '0 auto' }} /></td>
                          <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '120px', height: '18px' }} /></td>
                          <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '80px', height: '16px' }} /></td>
                          <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '100px', height: '16px' }} /></td>
                          <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '85%', height: '18px' }} /></td>
                          <td className={styles.td} style={{ textAlign: 'center' }}><div className={styles.skeletonBase} style={{ width: '35px', height: '16px', margin: '0 auto' }} /></td>
                          <td className={styles.td}><div className={styles.skeletonBase} style={{ width: '90px', height: '16px' }} /></td>
                          <td className={styles.td} style={{ textAlign: 'center' }}><div className={styles.skeletonBase} style={{ width: '75px', height: '26px', borderRadius: '6px', margin: '0 auto' }} /></td>
                        </tr>
                      ))
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

        {/* Section 5: RSVP Management - 100% Full Width Themed Redesign */}
        {activeTab === '5' && (
          <div style={{ width: '100%' }}>
            {/* Themed Hero Banner - 100% Width */}
            <div
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #183321 0%, #294B35 55%, #3c6e4a 100%)',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '24px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(41, 75, 53, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px', color: '#f0fdf4' }}>
                  <ParkIcon sx={{ fontSize: 16, color: '#a3e635' }} />
                  <span>BAMBOO GROVE • LIVE ATTENDANCE &amp; MEAL PREFERENCES</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff', letterSpacing: '-0.3px' }}>
                  RSVP Management
                </h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#d1e7d6', maxWidth: '620px', lineHeight: 1.5 }}>
                  Real-time database records of guest confirmations, headcount, party size, dietary requirements, and personal birthday notes submitted via the website RSVP page.
                </p>
              </div>

              {/* Action Buttons in Banner */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadRsvpCsv}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title="Export all RSVP data as CSV spreadsheet"
                >
                  <FileDownloadIcon sx={{ fontSize: 18, color: '#a3e635' }} />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadRsvpPdf}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title="Download official branded A4 PDF report"
                >
                  <PictureAsPdfIcon sx={{ fontSize: 18, color: '#ff8a80' }} />
                  <span>Download PDF Report</span>
                </button>

                <button
                  type="button"
                  onClick={fetchRsvps}
                  disabled={rsvpsLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 18 }} />
                  <span>{rsvpsLoading ? 'Syncing...' : 'Sync Database'}</span>
                </button>
              </div>
            </div>

            {/* 4 Themed Metric Cards - 100% Width Grid */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                boxSizing: 'border-box',
              }}
            >
              {/* Card 1: Total Invited */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '22px 24px',
                  borderRadius: '16px',
                  border: '1.5px solid #dce8d2',
                  boxShadow: '0 4px 14px rgba(41, 75, 53, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eef6ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PeopleIcon sx={{ color: '#294B35', fontSize: 26 }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#6e7e73', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered</span>
                  <h3 style={{ fontSize: '1.85rem', color: '#294B35', margin: '2px 0 0', fontWeight: 800, lineHeight: 1 }}>{stats.totalGuests}</h3>
                </div>
              </div>

              {/* Card 2: Attending Confirmed */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '22px 24px',
                  borderRadius: '16px',
                  border: '1.5px solid #dce8d2',
                  boxShadow: '0 4px 14px rgba(41, 75, 53, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#edf7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 26 }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attending Confirmed</span>
                  <h3 style={{ fontSize: '1.85rem', color: '#2e7d32', margin: '2px 0 0', fontWeight: 800, lineHeight: 1 }}>
                    {rsvpsList.filter((r) => r.attending === 'yes').length}
                  </h3>
                </div>
              </div>

              {/* Card 3: Headcount Expected */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '22px 24px',
                  borderRadius: '16px',
                  border: '1.5px solid #dce8d2',
                  boxShadow: '0 4px 14px rgba(41, 75, 53, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fdf7ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FamilyRestroomIcon sx={{ color: '#b58422', fontSize: 26 }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#b58422', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Guest Headcount</span>
                  <h3 style={{ fontSize: '1.85rem', color: '#b58422', margin: '2px 0 0', fontWeight: 800, lineHeight: 1 }}>
                    {rsvpsList.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + (r.guests_count || 1), 0)}
                  </h3>
                </div>
              </div>

              {/* Card 4: Declined RSVPs */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '22px 24px',
                  borderRadius: '16px',
                  border: '1.5px solid #dce8d2',
                  boxShadow: '0 4px 14px rgba(41, 75, 53, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fde8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloseIcon sx={{ color: '#d32f2f', fontSize: 26 }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#d32f2f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Declined / Sending Love</span>
                  <h3 style={{ fontSize: '1.85rem', color: '#d32f2f', margin: '2px 0 0', fontWeight: 800, lineHeight: 1 }}>
                    {rsvpsList.filter((r) => r.attending === 'no').length}
                  </h3>
                </div>
              </div>
            </div>

            {/* 100% Full Width Direct Website RSVP Submissions Table */}
            <div
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1.5px solid #dce8d2',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  background: '#fafcfa',
                  borderBottom: '1.5px solid #dce8d2',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#294B35', fontWeight: 800 }}>
                    Live Website Submissions ({rsvpsList.length} Entries)
                  </h3>
                  <p style={{ margin: 0, color: '#6e7e73', fontSize: '0.88rem' }}>
                    Guests who opened the invitation and submitted their response directly into the database.
                  </p>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eef6ec', color: '#294B35', padding: '6px 14px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: 700 }}>
                  <StorageIcon sx={{ fontSize: 16, color: '#3c8d40' }} />
                  <span>Neon PostgreSQL Active</span>
                </div>
              </div>

              <div className={styles.tableResponsive} style={{ width: '100%', overflowX: 'auto' }}>
                <table className={styles.guestTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5faf3', borderBottom: '1.5px solid #dce8d2' }}>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'left', whiteSpace: 'nowrap' }}>GUEST NAME</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'left', whiteSpace: 'nowrap' }}>CONTACT INFO</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>ATTENDANCE</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>PARTY SIZE</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'left', whiteSpace: 'nowrap' }}>DIET &amp; ALLERGIES</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'left' }}>PERSONAL NOTE</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'left', whiteSpace: 'nowrap' }}>SUBMITTED AT</th>
                      <th style={{ color: '#294B35', fontWeight: 800, padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpsLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={`rsvp-skel-${i}`} style={{ borderBottom: '1px solid #edf4ea' }}>
                          <td style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={styles.skeletonBase} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                              <div className={styles.skeletonBase} style={{ width: '120px', height: '16px' }} />
                            </div>
                          </td>
                          <td style={{ padding: '16px 18px' }}><div className={styles.skeletonBase} style={{ width: '110px', height: '15px' }} /></td>
                          <td style={{ padding: '16px 18px', textAlign: 'center' }}><div className={styles.skeletonBase} style={{ width: '80px', height: '22px', borderRadius: '12px', margin: '0 auto' }} /></td>
                          <td style={{ padding: '16px 18px', textAlign: 'center' }}><div className={styles.skeletonBase} style={{ width: '40px', height: '16px', margin: '0 auto' }} /></td>
                          <td style={{ padding: '16px 18px' }}><div className={styles.skeletonBase} style={{ width: '90px', height: '15px' }} /></td>
                          <td style={{ padding: '16px 18px' }}><div className={styles.skeletonBase} style={{ width: '160px', height: '15px' }} /></td>
                          <td style={{ padding: '16px 18px' }}><div className={styles.skeletonBase} style={{ width: '80px', height: '15px' }} /></td>
                          <td style={{ padding: '16px 18px', textAlign: 'right' }}><div className={styles.skeletonBase} style={{ width: '60px', height: '26px', borderRadius: '6px', marginLeft: 'auto' }} /></td>
                        </tr>
                      ))
                    ) : rsvpsList.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '60px 20px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eef6ec', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SentimentSatisfiedAltIcon sx={{ fontSize: 32, color: '#3c8d40' }} />
                          </div>
                          <h4 style={{ margin: '0 0 6px', color: '#294B35', fontSize: '1.1rem' }}>No RSVP responses yet</h4>
                          <p style={{ margin: 0, color: '#7a8c7e', fontSize: '0.88rem' }}>
                            Share your invitation link via WhatsApp from the Guest List tab to start receiving RSVPs!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      rsvpsList.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #edf4ea', transition: 'background 0.15s' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eef6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#294B35', fontWeight: 800, fontSize: '0.85rem' }}>
                                {(r.full_name || 'G')[0].toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ color: '#203325', fontSize: '0.94rem' }}>{r.full_name}</strong>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#294B35', fontWeight: 600, fontSize: '0.88rem' }}>
                              <PhoneIcon sx={{ fontSize: 14, color: '#3c8d40' }} />
                              <span>{r.phone}</span>
                            </div>
                            {r.email && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#7b8e7e', marginTop: '3px' }}>
                                <EmailOutlinedIcon sx={{ fontSize: 13, color: '#8e9e93' }} />
                                <span>{r.email}</span>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                background: r.attending === 'yes' ? '#edf7ed' : '#fde8e8',
                                color: r.attending === 'yes' ? '#1e4620' : '#9b1c1c',
                                border: `1px solid ${r.attending === 'yes' ? '#c8e6c9' : '#f8b4b4'}`,
                              }}
                            >
                              {r.attending === 'yes' ? (
                                <>
                                  <CheckCircleIcon sx={{ fontSize: 14, color: '#2e7d32' }} />
                                  <span>Attending</span>
                                </>
                              ) : (
                                <>
                                  <CloseIcon sx={{ fontSize: 14, color: '#d32f2f' }} />
                                  <span>Declined</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#f3f8f1',
                                color: '#294B35',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                border: '1px solid #dce8d2',
                              }}
                            >
                              {r.guests_count || 1}
                            </span>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '0.86rem' }}>
                              {r.dietary && (
                                <div style={{ color: '#294B35', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <SpaIcon sx={{ fontSize: 13, color: '#3c8d40' }} />
                                  <span>{r.dietary}</span>
                                </div>
                              )}
                              {r.allergies && (
                                <div style={{ color: '#d32f2f', fontSize: '0.82rem', marginTop: '2px' }}>
                                  <strong>Allergy:</strong> {r.allergies}
                                </div>
                              )}
                              {!r.dietary && !r.allergies && <span style={{ color: '#a0b1a4' }}>Standard / None</span>}
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px', maxWidth: '280px', wordBreak: 'break-word', fontSize: '0.86rem', color: '#4a5b4e' }}>
                            {r.message ? (
                              <div style={{ background: '#fafcfa', padding: '6px 10px', borderRadius: '8px', border: '1px solid #edf4ea', fontStyle: 'italic' }}>
                                &ldquo;{r.message}&rdquo;
                              </div>
                            ) : (
                              <span style={{ color: '#a0b1a4' }}>—</span>
                            )}
                          </td>

                          <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: '#6e7e73', whiteSpace: 'nowrap' }}>
                            {r.created_at ? new Date(r.created_at).toLocaleString() : '—'}
                          </td>

                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteRsvp(r.id)}
                              className={styles.actionBtn}
                              title="Delete RSVP record"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                            </button>
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

        {/* Section 6: Gift Registry & Guest Registrations */}
        {activeTab === '6' && (
          <div>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CardGiftcardIcon sx={{ fontSize: 28, color: '#294B35' }} />
                <span>Gift Registry &amp; Registered Guests</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('12')}
                className={styles.btnPrimary}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #294B35 0%, #1a3323 100%)',
                }}
              >
                <AddShoppingCartIcon sx={{ fontSize: 18 }} />
                <span>+ Add New Product</span>
              </button>
            </div>

            {/* Quick Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e1e7de', boxShadow: '0 2px 8px rgba(41,75,53,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#6e7e73', fontWeight: 600 }}>Total Wishlist Products</div>
                <div style={{ fontSize: '1.6rem', color: '#294b35', fontWeight: 800, marginTop: '4px' }}>{adminGifts.length}</div>
              </div>
              <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e1e7de', boxShadow: '0 2px 8px rgba(41,75,53,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#6e7e73', fontWeight: 600 }}>Available for Guests</div>
                <div style={{ fontSize: '1.6rem', color: '#2e7d32', fontWeight: 800, marginTop: '4px' }}>
                  {adminGifts.filter((g) => !g.is_ordered).length}
                </div>
              </div>
              <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e1e7de', boxShadow: '0 2px 8px rgba(41,75,53,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#6e7e73', fontWeight: 600 }}>Registered by Guests</div>
                <div style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800, marginTop: '4px' }}>
                  {adminGifts.filter((g) => g.is_ordered).length}
                </div>
              </div>
            </div>

            {/* Registered Gifts & Products Table */}
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e1e7de', boxShadow: '0 4px 16px rgba(41,75,53,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Gift Registry Items &amp; Registrations</span>
                    <span style={{ background: '#edf6ea', color: '#294b35', fontSize: '0.82rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      {adminGifts.length}
                    </span>
                  </h3>
                  <p style={{ margin: '2px 0 0', color: '#6e7e73', fontSize: '0.84rem' }}>
                    Products registered by guests with verified emails are marked unavailable in the public registry.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#7b8e7e' }} />
                    <input
                      type="text"
                      placeholder="Search product, guest name or email..."
                      value={giftSearchQuery}
                      onChange={(e) => setGiftSearchQuery(e.target.value)}
                      style={{ padding: '7px 12px 7px 34px', borderRadius: '20px', border: '1px solid #cbe3c6', fontSize: '0.86rem', outline: 'none', background: '#fcfdfa', minWidth: '240px' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={fetchAdminGifts}
                    disabled={adminGiftsLoading}
                    className={styles.exportBtn}
                    style={{ padding: '7px 14px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshIcon sx={{ fontSize: 15, animation: adminGiftsLoading ? 'spin 1s linear infinite' : 'none' }} />
                    <span>Refresh</span>
                  </button>

                  <a
                    href="/#gifts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.exportBtn}
                    style={{ textDecoration: 'none', padding: '7px 14px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 15 }} />
                    <span>View Public Registry</span>
                  </a>
                </div>
              </div>

              {giftAlert && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: giftAlert.type === 'success' ? '#edf7ed' : '#fef2f2', border: `1px solid ${giftAlert.type === 'success' ? '#c8e6c9' : '#fecaca'}`, color: giftAlert.type === 'success' ? '#1e4620' : '#b91c1c', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  {giftAlert.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> : <WarningAmberIcon sx={{ fontSize: 18, color: '#dc2626' }} />}
                  <span>{giftAlert.message}</span>
                </div>
              )}

              {adminGiftsLoading && (
                <div style={{ padding: '20px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={`gift-skel-${i}`} className={styles.skeletonTableRow} style={{ background: '#fafafa', borderRadius: '12px' }}>
                        <div className={styles.skeletonBase} style={{ width: '56px', height: '56px', borderRadius: '10px' }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div className={styles.skeletonBase} style={{ width: '60%', height: '18px' }} />
                          <div className={styles.skeletonBase} style={{ width: '30%', height: '14px' }} />
                        </div>
                        <div className={styles.skeletonBase} style={{ width: '80px', height: '22px' }} />
                        <div className={styles.skeletonBase} style={{ width: '90px', height: '26px', borderRadius: '12px' }} />
                        <div className={styles.skeletonBase} style={{ width: '120px', height: '40px', borderRadius: '8px' }} />
                        <div className={styles.skeletonBase} style={{ width: '100px', height: '30px', borderRadius: '6px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!adminGiftsLoading && adminGifts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fbfdf9', borderRadius: '14px', border: '1px dashed #d5e5d1' }}>
                  <CardGiftcardIcon sx={{ fontSize: 48, color: '#a3c58e', marginBottom: '10px' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#294B35' }}>No Products in Gift Registry Yet</div>
                  <p style={{ fontSize: '0.88rem', color: '#6e7e73', maxWidth: '420px', margin: '6px auto 16px' }}>
                    Add gifts by going to the Add Product tab and pasting any Amazon product link!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('12')}
                    className={styles.btnPrimary}
                    style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                  >
                    Go to Add Product Section
                  </button>
                </div>
              )}

              {!adminGiftsLoading && adminGifts.length > 0 && (
                <div className={styles.tableCard} style={{ width: '100%', overflowX: 'auto' }}>
                  <table className={styles.table} style={{ width: '100%', minWidth: '950px' }}>
                    <thead>
                      <tr>
                        <th className={styles.th} style={{ width: '70px' }}>Image</th>
                        <th className={styles.th} style={{ width: '30%' }}>Product Details</th>
                        <th className={styles.th} style={{ width: '12%' }}>Price</th>
                        <th className={styles.th} style={{ width: '13%' }}>Status</th>
                        <th className={styles.th} style={{ width: '30%' }}>Registered Guest Info</th>
                        <th className={styles.th} style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminGifts
                        .filter((g) => {
                          if (!giftSearchQuery.trim()) return true;
                          const q = giftSearchQuery.toLowerCase();
                          return (
                            g.title.toLowerCase().includes(q) ||
                            (g.category && g.category.toLowerCase().includes(q)) ||
                            (g.ordered_by && g.ordered_by.toLowerCase().includes(q)) ||
                            (g.ordered_email && g.ordered_email.toLowerCase().includes(q)) ||
                            (g.ordered_phone && g.ordered_phone.toLowerCase().includes(q))
                          );
                        })
                        .map((gift) => (
                          <tr key={gift.id} className={styles.tr}>
                            <td className={styles.td}>
                              <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e1e7de', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={gift.image_url} alt={gift.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                            </td>
                            <td className={styles.td}>
                              <div style={{ fontWeight: 700, color: '#252525', fontSize: '0.92rem', lineHeight: 1.4 }}>
                                <a href={gift.purchase_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                  {gift.title}
                                </a>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                {gift.category && (
                                  <span style={{ textTransform: 'capitalize', background: '#edf6ea', color: '#294b35', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {gift.category}
                                  </span>
                                )}
                                {gift.asin && (
                                  <span style={{ fontSize: '0.74rem', color: '#7b8e7e', fontFamily: 'monospace' }}>
                                    ASIN: {gift.asin}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className={styles.td}>
                              <span style={{ fontWeight: 800, color: '#294b35', fontSize: '1.05rem' }}>{gift.price}</span>
                              {gift.list_price && (
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                  {gift.list_price}
                                </div>
                              )}
                            </td>
                            <td className={styles.td}>
                              {gift.is_ordered ? (
                                <span style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '5px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                  <span>🔒 Unavailable</span>
                                </span>
                              ) : (
                                <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '5px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircleIcon sx={{ fontSize: 15 }} />
                                  <span>Available</span>
                                </span>
                              )}
                            </td>
                            <td className={styles.td}>
                              {gift.is_ordered ? (
                                <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '10px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}>
                                  <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '0.92rem' }}>
                                    {gift.ordered_by || 'Anonymous Guest'}
                                  </div>
                                  {gift.ordered_email && (
                                    <div style={{ fontSize: '0.8rem', color: '#c2410c', marginTop: '3px', wordBreak: 'break-all' }}>
                                      ✉️ {gift.ordered_email}
                                    </div>
                                  )}
                                  {gift.ordered_phone && (
                                    <div style={{ fontSize: '0.78rem', color: '#7c2d12', marginTop: '3px' }}>
                                      📞 {gift.ordered_phone}
                                    </div>
                                  )}
                                  {gift.ordered_at && (
                                    <div style={{ fontSize: '0.74rem', color: '#9a3412', opacity: 0.8, marginTop: '3px' }}>
                                      🕒 {new Date(gift.ordered_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  )}
                                  {gift.order_note && (
                                    <div style={{ fontSize: '0.76rem', color: '#475569', fontStyle: 'italic', marginTop: '5px', borderTop: '1px dashed #fed7aa', paddingTop: '5px' }}>
                                      &ldquo;{gift.order_note}&rdquo;
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.84rem', fontStyle: 'italic' }}>
                                  Not yet registered
                                </span>
                              )}
                            </td>
                            <td className={styles.td} style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleGiftOrderedStatus(gift)}
                                  title={gift.is_ordered ? 'Release gift and mark as Available' : 'Mark as Unavailable/Registered'}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    background: gift.is_ordered ? '#fff7ed' : '#edf6ea',
                                    color: gift.is_ordered ? '#c2410c' : '#294b35',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {gift.is_ordered ? 'Release / Available' : 'Mark Registered'}
                                </button>

                                <a
                                  href={gift.purchase_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View on Amazon"
                                  style={{ padding: '6px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#334155', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteGift(gift.id)}
                                  title="Delete Gift from Registry"
                                  style={{ padding: '6px 8px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 12: Dedicated Add Product via Amazon URL */}
        {activeTab === '12' && (
          <div>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AddShoppingCartIcon sx={{ fontSize: 28, color: '#ea580c' }} />
                <span>Add Product to Gift Registry</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('6')}
                className={styles.exportBtn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.86rem',
                }}
              >
                <CardGiftcardIcon sx={{ fontSize: 17 }} />
                <span>View Registry &amp; Registered Guests (Tab 6)</span>
              </button>
            </div>

            {/* 1-Step Amazon URL Fetch & Add Card */}
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '28px', boxShadow: '0 4px 16px rgba(41,75,53,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCartIcon sx={{ color: '#ea580c', fontSize: 28 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.3rem', fontWeight: 800 }}>Paste Amazon Product URL</h3>
                  <p style={{ margin: '3px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>
                    Simply paste any Amazon product link below. The system automatically scrapes and parses high-resolution photos, real-time price, customer rating, review count, and saves it directly to your PostgreSQL gift registry.
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFetchAndSaveAmazonProduct();
                }}
              >
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <input
                    type="url"
                    required
                    placeholder="Paste Amazon product URL (e.g. https://www.amazon.com/dp/B0DZHR44J9)..."
                    value={giftAmazonUrl}
                    onChange={(e) => setGiftAmazonUrl(e.target.value)}
                    className={styles.formInput}
                    style={{ flex: 1, minWidth: '300px', padding: '14px 18px', fontSize: '0.96rem', borderRadius: '12px', border: '1.5px solid #cbe3c6' }}
                  />

                  <button
                    type="submit"
                    disabled={isFetchingAmazonGift || !giftAmazonUrl.trim()}
                    className={styles.btnPrimary}
                    style={{
                      padding: '14px 28px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                    }}
                  >
                    <RefreshIcon sx={{ fontSize: 18, animation: isFetchingAmazonGift ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isFetchingAmazonGift ? 'Fetching Product Details...' : 'Fetch & Add to Registry'}</span>
                  </button>
                </div>

                {/* Quick Try Sample Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748b' }}>
                  <span style={{ fontWeight: 600 }}>Quick Test URLs:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = 'https://www.amazon.com/Bose-QuietComfort-Bluetooth-Headphones-Cancelling/dp/B0DZHR44J9';
                      setGiftAmazonUrl(url);
                      handleFetchAndSaveAmazonProduct(url);
                    }}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}
                  >
                    🎧 Bose QuietComfort (Twilight Blue)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = 'https://www.amazon.com/dp/B0CCZ26B5V';
                      setGiftAmazonUrl(url);
                      handleFetchAndSaveAmazonProduct(url);
                    }}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}
                  >
                    🖤 Bose QuietComfort (Black)
                  </button>
                </div>
              </form>

              {/* Status Alert */}
              {giftAlert && (
                <div style={{ marginTop: '18px', padding: '12px 18px', borderRadius: '12px', background: giftAlert.type === 'success' ? '#edf7ed' : '#fef2f2', border: `1px solid ${giftAlert.type === 'success' ? '#c8e6c9' : '#fecaca'}`, color: giftAlert.type === 'success' ? '#1e4620' : '#b91c1c', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                  {giftAlert.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 20, color: '#2e7d32' }} /> : <WarningAmberIcon sx={{ fontSize: 20, color: '#dc2626' }} />}
                  <span>{giftAlert.message}</span>
                </div>
              )}

              {/* Fetched Preview Card */}
              {fetchedAmazonData && (
                <div style={{ marginTop: '22px', padding: '20px', background: '#f8faf7', border: '1px solid #dce8d2', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fetchedAmazonData.mainImage} alt={fetchedAmazonData.title} style={{ width: '84px', height: '84px', objectFit: 'contain', background: '#fff', borderRadius: '12px', padding: '6px', border: '1px solid #e2e8f0' }} />
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', marginBottom: '6px' }}>
                      {fetchedAmazonData.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.86rem' }}>
                      <span style={{ fontWeight: 800, color: '#294B35', fontSize: '1.1rem' }}>{fetchedAmazonData.price}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                        <StarIcon sx={{ fontSize: 16 }} /> {fetchedAmazonData.rating}
                      </span>
                      <span style={{ color: '#64748b' }}>({fetchedAmazonData.reviewCount} customer reviews)</span>
                      <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
                        ✓ Saved to Database &amp; Public Wishlist
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('6')}
                    className={styles.exportBtn}
                    style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                  >
                    Go to Gift Registry →
                  </button>
                </div>
              )}
            </div>

            {/* Recently Added Gifts Overview */}
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e1e7de', boxShadow: '0 4px 16px rgba(41,75,53,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#294B35', fontSize: '1.05rem', fontWeight: 700 }}>
                  Recently Added Products ({adminGifts.length})
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('6')}
                  style={{ background: 'none', border: 'none', color: '#294B35', fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem' }}
                >
                  Manage All in Registry →
                </button>
              </div>

              {adminGifts.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>No products added yet. Paste a link above to get started!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {adminGifts.slice(0, 6).map((g) => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fafafa' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.image_url} alt={g.title} style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '3px', border: '1px solid #e2e8f0' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {g.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.78rem' }}>
                          <span style={{ fontWeight: 800, color: '#294B35' }}>{g.price}</span>
                          <span style={{ color: g.is_ordered ? '#ea580c' : '#16a34a', fontWeight: 700 }}>
                            {g.is_ordered ? '• Registered' : '• Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Customer Accounts & Multi-Tenant Connection Manager */}
        {activeTab === 'users' && (
          <div>
            <div className={styles.sectionHeader}>
              <PeopleIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Customer Accounts &amp; Multi-User OAuth Storage</span>
            </div>

            {userToast && (
              <div style={{
                padding: '12px 18px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: userToast.type === 'success' ? '#edf7ed' : '#fdf2f2',
                color: userToast.type === 'success' ? '#1e4620' : '#991b1b',
                border: userToast.type === 'success' ? '1px solid #c8e6c9' : '1px solid #fecaca',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {userToast.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <WarningAmberIcon sx={{ fontSize: 18 }} />}
                  <span>{userToast.message}</span>
                </div>
                <button type="button" onClick={() => setUserToast(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
              </div>
            )}

            {/* Create New Customer Account Card */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AddIcon sx={{ color: '#294B35' }} />
                <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>Add New Customer / Admin User</h3>
              </div>
              <p style={{ margin: '0 0 18px', color: '#6e7e73', fontSize: '0.86rem' }}>
                Each customer has their own dedicated account, their own Google Drive media folder, and their own connected Gmail account.
              </p>

              <form onSubmit={handleCreateUser}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className={styles.filterInput}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Login Email</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className={styles.filterInput}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Password</label>
                    <input
                      type="password"
                      placeholder="Secure password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className={styles.filterInput}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className={styles.filterSelect}
                      style={{ width: '100%' }}
                    >
                      <option value="admin">Customer Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className={styles.btnPrimary}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontSize: '0.88rem' }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                  <span>{isCreatingUser ? 'Creating User...' : 'Create Customer Account'}</span>
                </button>
              </form>
            </div>

            {/* List of Accounts with Drive & Gmail Status */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>All Customer Accounts &amp; Connected Accounts</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.85rem' }}>
                    Each customer can independently connect, reconnect, or disconnect their own Google Drive and Gmail accounts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchUserAccounts}
                  className={styles.exportBtn}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  <span>Refresh Accounts</span>
                </button>
              </div>

              {usersLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6e7e73' }}>Loading customer accounts...</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #edf4eb', color: '#6e7e73', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 10px' }}>User / Customer</th>
                        <th style={{ padding: '12px 10px' }}>Role</th>
                        <th style={{ padding: '12px 10px' }}>Google Drive Status</th>
                        <th style={{ padding: '12px 10px' }}>Gmail Status</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAccounts.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f2f7f1', background: u.isCurrentUser ? '#f8fbf7' : 'transparent' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 700, color: '#294B35', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{u.name}</span>
                              {u.isCurrentUser && (
                                <span style={{ background: '#edf7ed', color: '#1e4620', fontSize: '0.72rem', padding: '1px 8px', borderRadius: '10px', fontWeight: 800 }}>
                                  YOU (Logged In)
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6e7e73' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{ textTransform: 'capitalize', background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            {u.drive.connected ? (
                              <div>
                                <span style={{ background: '#edf7ed', color: '#1e4620', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircleIcon sx={{ fontSize: 13, color: '#2e7d32' }} /> Connected
                                </span>
                                <div style={{ fontSize: '0.78rem', color: '#294B35', marginTop: '2px', fontWeight: 600 }}>
                                  {u.drive.accountEmail}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span style={{ background: '#fff8e1', color: '#8d6e00', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <WarningAmberIcon sx={{ fontSize: 13, color: '#f57f17' }} /> Not Connected
                                </span>
                                {u.isCurrentUser && (
                                  <div style={{ marginTop: '4px' }}>
                                    <a href="/api/google-drive/connect" style={{ fontSize: '0.78rem', color: '#294B35', fontWeight: 700, textDecoration: 'underline' }}>
                                      Connect Drive →
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            {u.gmail.connected ? (
                              <div>
                                <span style={{ background: '#edf7ed', color: '#1e4620', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircleIcon sx={{ fontSize: 13, color: '#2e7d32' }} /> Connected
                                </span>
                                <div style={{ fontSize: '0.78rem', color: '#294B35', marginTop: '2px', fontWeight: 600 }}>
                                  {u.gmail.accountEmail}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span style={{ background: '#fff8e1', color: '#8d6e00', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <WarningAmberIcon sx={{ fontSize: 13, color: '#f57f17' }} /> Not Connected
                                </span>
                                {u.isCurrentUser && (
                                  <div style={{ marginTop: '4px' }}>
                                    <a href="/api/gmail/connect" style={{ fontSize: '0.78rem', color: '#294B35', fontWeight: 700, textDecoration: 'underline' }}>
                                      Connect Gmail →
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            {u.isCurrentUser ? (
                              <span style={{ fontSize: '0.8rem', color: '#6e7e73', fontStyle: 'italic' }}>
                                Use sidebar tabs (8 &amp; 11) to manage
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                Managed by user
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 7: Live Streaming */}
        {activeTab === '7' && (
          <div>
            <div className={styles.sectionHeader}>
              <VideocamIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Live Streaming Broadcast</span>
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

        {/* Section: Official Event Hashtags */}
        {activeTab === 'hashtags' && (
          <div>
            <div className={styles.sectionHeader}>
              <TagIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Social Media &amp; Hashtag Campaign</span>
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

        {/* Section 8: Gmail OAuth & Email Invitations */}
        {activeTab === '8' && (
          <div>
            <div className={styles.sectionHeader}>
              <EmailOutlinedIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Email Invitations &amp; Gmail Integration</span>
            </div>

            {/* Gmail Connection Status Card */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              
              {/* Toast message */}
              {gmailToast && (
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: gmailToast.type === 'success' ? '#edf7ed' : '#fdf2f2',
                  color: gmailToast.type === 'success' ? '#1e4620' : '#991b1b',
                  border: gmailToast.type === 'success' ? '1px solid #c8e6c9' : '1px solid #fecaca',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {gmailToast.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <WarningAmberIcon sx={{ fontSize: 18 }} />}
                    <span>{gmailToast.message}</span>
                  </div>
                  <button type="button" onClick={() => setGmailToast(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eef6ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailOutlinedIcon sx={{ color: '#294b35', fontSize: 28 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.25rem', fontWeight: 700 }}>Host Gmail Integration</h3>
                      {gmailStatus ? (
                        gmailStatus.connected ? (
                          <span style={{ background: '#edf7ed', color: '#1e4620', border: '1px solid #c8e6c9', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: '#2e7d32' }} /> Connected
                          </span>
                        ) : (
                          <span style={{ background: '#fff8e1', color: '#8d6e00', border: '1px solid #ffe082', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <WarningAmberIcon sx={{ fontSize: 14, color: '#f57f17' }} /> Disconnected
                          </span>
                        )
                      ) : (
                        <span style={{ background: '#f5f5f5', color: '#666', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600 }}>Checking...</span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>
                      Send personalized HTML birthday invitation cards directly from your own Gmail account with one click.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {gmailStatus?.connected ? (
                    <>
                      <a
                        href="/api/gmail/connect"
                        className={styles.exportBtn}
                        style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                      >
                        <RefreshIcon sx={{ fontSize: 16 }} />
                        <span>Reconnect</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleDisconnectGmail}
                        disabled={isDisconnectingGmail}
                        className={styles.deleteBtn}
                        style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        <span>{isDisconnectingGmail ? 'Disconnecting...' : 'Disconnect'}</span>
                      </button>
                    </>
                  ) : (
                    <a
                      href="/api/gmail/connect"
                      className={styles.btnPrimary}
                      style={{
                        padding: '10px 22px',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #294B35 0%, #437351 100%)',
                        boxShadow: '0 4px 14px rgba(41, 75, 53, 0.22)',
                      }}
                    >
                      <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                      <span>Connect Gmail</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={checkGmailStatus}
                    disabled={isTestingGmail}
                    className={styles.exportBtn}
                    style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshIcon sx={{ fontSize: 16, animation: isTestingGmail ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isTestingGmail ? 'Checking...' : 'Refresh Status'}</span>
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Connected Gmail</div>
                  <div style={{ fontSize: '0.92rem', color: '#294b35', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>
                    {gmailStatus?.accountEmail || 'Not Connected'}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Total Guests</div>
                  <div style={{ fontSize: '1.25rem', color: '#294b35', fontWeight: 800, marginTop: '2px' }}>
                    {gmailStatus?.stats?.totalGuests ?? guests.length}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#2e7d32', fontWeight: 600 }}>Invitations Sent</div>
                  <div style={{ fontSize: '1.25rem', color: '#2e7d32', fontWeight: 800, marginTop: '2px' }}>
                    {gmailStatus?.stats?.invitationsSent ?? guests.filter(g => (g as any).invitation_status === 'sent').length}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>Pending</div>
                  <div style={{ fontSize: '1.25rem', color: '#d97706', fontWeight: 800, marginTop: '2px' }}>
                    {gmailStatus?.stats?.pendingInvitations ?? guests.filter(g => !(g as any).invitation_status || (g as any).invitation_status === 'pending').length}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>Failed</div>
                  <div style={{ fontSize: '1.25rem', color: '#dc2626', fontWeight: 800, marginTop: '2px' }}>
                    {gmailStatus?.stats?.failedInvitations ?? guests.filter(g => (g as any).invitation_status === 'failed').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Personalization & Template Editor */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <EditIcon sx={{ color: '#294b35', fontSize: 22 }} />
                <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>Personalize Invitation Email Template</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={styles.filterInput}
                    style={{ width: '100%' }}
                    placeholder="Subject line with emoji..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>Host / Family Name</label>
                  <input
                    type="text"
                    value={emailHostName}
                    onChange={(e) => setEmailHostName(e.target.value)}
                    className={styles.filterInput}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#294B35', marginBottom: '6px' }}>
                  Custom Invitation Message &bull; <span style={{ color: '#789b63', fontWeight: 600 }}>Supports variables: {'{{guest_name}}'}, {'{{birthday_person_name}}'}, {'{{birthday_date}}'}, {'{{birthday_website_url}}'}</span>
                </label>
                <textarea
                  value={emailCustomMessage}
                  onChange={(e) => setEmailCustomMessage(e.target.value)}
                  className={styles.filterInput}
                  rows={3}
                  style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.88rem' }}
                />
              </div>

              {/* Action Buttons: Preview & Send Test */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEmailPreview()}
                  className={styles.exportBtn}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  <span>Preview Email (HTML &amp; Text)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail || !gmailStatus?.connected}
                  className={styles.exportBtn}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <SendIcon sx={{ fontSize: 16 }} />
                  <span>{isSendingTestEmail ? 'Sending Test...' : 'Send Test Email to Myself'}</span>
                </button>

                {!gmailStatus?.connected && (
                  <span style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 600 }}>
                    ⚠️ Connect Gmail above to test or send invitations.
                  </span>
                )}
              </div>
            </div>

            {/* Recipients Selection & Bulk Sending Table */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>Select Guests for Invitation</h3>
                  <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.85rem' }}>
                    Selected: <strong>{selectedGuestIds.length}</strong> of {guests.length} guest(s)
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = guests.filter((g) => g.email && g.email.includes('@')).map((g) => g.id);
                      setSelectedGuestIds(allIds);
                    }}
                    className={styles.exportBtn}
                    style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                  >
                    Select All With Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGuestIds([])}
                    className={styles.exportBtn}
                    style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                  >
                    Deselect All
                  </button>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#294B35', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={forceResend}
                      onChange={(e) => setForceResend(e.target.checked)}
                    />
                    <span>Force resend to already sent guests</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSendBulkInvitations}
                    disabled={isSendingInvitations || selectedGuestIds.length === 0 || !gmailStatus?.connected}
                    className={styles.btnPrimary}
                    style={{
                      padding: '9px 20px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #294B35 0%, #3e6b4d 100%)',
                    }}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                    <span>{isSendingInvitations ? 'Sending Invitations...' : `Send Invitations (${selectedGuestIds.length})`}</span>
                  </button>
                </div>
              </div>

              {/* Table of Guests */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #edf4eb', color: '#6e7e73', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 10px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedGuestIds.length > 0 && selectedGuestIds.length === guests.filter((g) => g.email).length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGuestIds(guests.filter((g) => g.email && g.email.includes('@')).map((g) => g.id));
                            } else {
                              setSelectedGuestIds([]);
                            }
                          }}
                        />
                      </th>
                      <th style={{ padding: '12px 10px' }}>Guest Name</th>
                      <th style={{ padding: '12px 10px' }}>Email Address</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((g) => {
                      const isSelected = selectedGuestIds.includes(g.id);
                      const invStatus = (g as any).invitation_status || 'pending';
                      const hasEmail = Boolean(g.email && g.email.includes('@'));

                      return (
                        <tr key={g.id} style={{ borderBottom: '1px solid #f2f7f1', background: isSelected ? '#f5faf3' : 'transparent' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!hasEmail}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuestIds((prev) => [...prev, g.id]);
                                } else {
                                  setSelectedGuestIds((prev) => prev.filter((id) => id !== g.id));
                                }
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 600, color: '#294B35' }}>
                            {g.name}
                          </td>
                          <td style={{ padding: '12px 10px', color: hasEmail ? '#334437' : '#9ca3af' }}>
                            {g.email || '(No email provided)'}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            {invStatus === 'sent' && (
                              <span style={{ background: '#edf7ed', color: '#1e4620', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Sent
                              </span>
                            )}
                            {invStatus === 'failed' && (
                              <span style={{ background: '#fef2f2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Failed
                              </span>
                            )}
                            {(invStatus === 'pending' || !invStatus) && (
                              <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEmailPreview(g.id)}
                              className={styles.exportBtn}
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Preview
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invitation History Log Card */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>Recent Invitation History Log</h3>
                <button
                  type="button"
                  onClick={fetchInvitationHistory}
                  className={styles.exportBtn}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  <span>Refresh Log</span>
                </button>
              </div>

              {historyLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6e7e73' }}>Loading history...</div>
              ) : invitationHistory.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6e7e73', background: '#fafdf9', borderRadius: '10px', border: '1px dashed #d5e5d1' }}>
                  No invitations sent through Gmail yet. Select guests above to send your first batch!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #edf4eb', color: '#6e7e73', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px' }}>Recipient</th>
                        <th style={{ padding: '10px' }}>Subject</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Sent Date</th>
                        <th style={{ padding: '10px' }}>Message ID / Error</th>
                        <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitationHistory.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f2f7f1' }}>
                          <td style={{ padding: '10px', fontWeight: 600, color: '#294B35' }}>
                            {item.guest_name || item.recipient_email}
                            <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 400 }}>{item.recipient_email}</div>
                          </td>
                          <td style={{ padding: '10px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.subject}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: item.status === 'sent' ? '#edf7ed' : '#fef2f2',
                              color: item.status === 'sent' ? '#1e4620' : '#991b1b',
                            }}>
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '10px', color: '#6e7e73', fontSize: '0.8rem' }}>
                            {item.sent_at ? new Date(item.sent_at).toLocaleString() : '-'}
                          </td>
                          <td style={{ padding: '10px', fontSize: '0.78rem', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.status === 'sent' ? item.gmail_message_id : (item.error_message || 'Failed')}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            {item.status === 'failed' && (
                              <button
                                type="button"
                                onClick={() => handleRetryInvitation(item)}
                                disabled={retryingHistoryId === item.id}
                                className={styles.exportBtn}
                                style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                              >
                                {retryingHistoryId === item.id ? 'Retrying...' : 'Retry Send'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Email Preview Modal */}
            {isPreviewOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(20, 36, 26, 0.6)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #edf4eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <EmailOutlinedIcon sx={{ color: '#294B35' }} />
                      <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem' }}>
                        Email Preview for <strong>{previewGuestName}</strong>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('html')}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: '1px solid #cbe3c6',
                          background: previewMode === 'html' ? '#294B35' : '#ffffff',
                          color: previewMode === 'html' ? '#ffffff' : '#294B35',
                          cursor: 'pointer',
                        }}
                      >
                        HTML View
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('text')}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: '1px solid #cbe3c6',
                          background: previewMode === 'text' ? '#294B35' : '#ffffff',
                          color: previewMode === 'text' ? '#ffffff' : '#294B35',
                          cursor: 'pointer',
                        }}
                      >
                        Plain Text
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(false)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6e7e73', marginLeft: '6px' }}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#F8FAF7' }}>
                    {previewLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6e7e73' }}>Rendering preview...</div>
                    ) : previewMode === 'html' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                        style={{ maxWidth: '600px', margin: '0 auto' }}
                      />
                    ) : (
                      <pre style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e1ece0',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                        color: '#294B35',
                      }}>
                        {previewPlainText}
                      </pre>
                    )}
                  </div>

                  <div style={{ padding: '14px 24px', borderTop: '1px solid #edf4eb', display: 'flex', justifyContent: 'flex-end', background: '#ffffff' }}>
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className={styles.exportBtn}
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 11: Media & Photo Albums (Google Drive) */}
        {activeTab === '11' && (
          <div>
            <div className={styles.sectionHeader}>
              <PhotoLibraryIcon sx={{ fontSize: 26, color: '#294B35' }} />
              <span>Google Drive Photos &amp; Media Management</span>
            </div>

            {/* Google Drive Connection & Customer OAuth Card */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '24px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              
              {/* Toast alert */}
              {driveToast && (
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  marginBottom: '18px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: driveToast.type === 'success' ? '#edf7ed' : '#fdf2f2',
                  color: driveToast.type === 'success' ? '#1e4620' : '#991b1b',
                  border: driveToast.type === 'success' ? '1px solid #c8e6c9' : '1px solid #fecaca',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {driveToast.type === 'success' ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : <WarningAmberIcon sx={{ fontSize: 18 }} />}
                    <span>{driveToast.message}</span>
                  </div>
                  <button type="button" onClick={() => setDriveToast(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eef6ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CloudUploadIcon sx={{ color: '#294b35', fontSize: 28 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.25rem', fontWeight: 700 }}>Google Drive Storage</h3>
                      {driveStatus ? (
                        driveStatus.connected ? (
                          <span style={{ background: '#edf7ed', color: '#1e4620', border: '1px solid #c8e6c9', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: '#2e7d32' }} /> Connected
                          </span>
                        ) : (
                          <span style={{ background: '#fff8e1', color: '#8d6e00', border: '1px solid #ffe082', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <WarningAmberIcon sx={{ fontSize: 14, color: '#f57f17' }} /> Disconnected
                          </span>
                        )
                      ) : (
                        <span style={{ background: '#f5f5f5', color: '#666', borderRadius: '20px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600 }}>Checking...</span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#6e7e73', fontSize: '0.88rem' }}>
                      Connect your own Google Drive account to store and manage birthday photos and videos automatically.
                    </p>
                  </div>
                </div>

                {/* Connection action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {driveStatus?.connected ? (
                    <>
                      <a
                        href="/api/google-drive/connect"
                        className={styles.exportBtn}
                        style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                      >
                        <RefreshIcon sx={{ fontSize: 16 }} />
                        <span>Reconnect</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleDisconnectDrive}
                        disabled={isDisconnectingDrive}
                        className={styles.deleteBtn}
                        style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        <span>{isDisconnectingDrive ? 'Disconnecting...' : 'Disconnect'}</span>
                      </button>
                    </>
                  ) : (
                    <a
                      href="/api/google-drive/connect"
                      className={styles.btnPrimary}
                      style={{
                        padding: '10px 22px',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #294B35 0%, #437351 100%)',
                        boxShadow: '0 4px 14px rgba(41, 75, 53, 0.22)'
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 18 }} />
                      <span>Connect Google Drive</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={checkDriveStatus}
                    disabled={isTestingDrive}
                    className={styles.exportBtn}
                    style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshIcon sx={{ fontSize: 16, animation: isTestingDrive ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isTestingDrive ? 'Checking...' : 'Refresh Status'}</span>
                  </button>

                  {driveStatus?.folderId && (
                    <a
                      href={`https://drive.google.com/drive/folders/${driveStatus.folderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.exportBtn}
                      style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                      <span>Open Folder</span>
                    </a>
                  )}

                  <a
                    href="/photos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnPrimary}
                    style={{ padding: '8px 18px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <PhotoLibraryIcon sx={{ fontSize: 16 }} />
                    <span>View /photos Page</span>
                  </a>
                </div>
              </div>

              {/* Status details & diagnostics */}
              {driveStatus && !driveStatus.connected && (
                <div style={{ background: '#fff9e6', border: '1px solid #fed7aa', borderLeft: '4px solid #f59e0b', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px', fontSize: '0.88rem', color: '#78350f' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <span>Google Drive Not Connected</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>
                    {driveStatus.errorMessage || driveStatus.message || 'Click "Connect Google Drive" above to link your Google account. We will automatically create your "Birthday Website Media" folder and configure public access.'}
                  </p>
                </div>
              )}

              {/* Connected Google Account & Folder Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Connected Account</div>
                  <div style={{ fontSize: '0.92rem', color: '#294b35', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>
                    {driveStatus?.accountEmail || 'Not Connected'}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Media Folder</div>
                  <div style={{ fontSize: '0.92rem', color: '#294b35', fontWeight: 700, marginTop: '2px' }}>
                    {driveStatus?.folderName || 'Birthday Website Media'}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Folder Access</div>
                  <div style={{ fontSize: '0.92rem', color: driveStatus?.sharingStatus === 'public_reader' ? '#2e7d32' : '#f57f17', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    {driveStatus?.sharingStatus === 'public_reader' ? 'Public Viewer' : (driveStatus?.sharingStatus || 'Public Viewer')}
                  </div>
                </div>
                <div style={{ background: '#f8faf7', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4eb' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6e7e73', fontWeight: 600 }}>Total Photos Loaded</div>
                  <div style={{ fontSize: '1.25rem', color: '#294b35', fontWeight: 800, marginTop: '2px' }}>
                    {drivePhotos.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload to Google Drive Section */}
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e1e7de', marginBottom: '28px', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#edf6ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadFileIcon sx={{ color: '#294b35', fontSize: 24 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.15rem', fontWeight: 700 }}>Upload Photos &amp; Videos to Google Drive</h3>
                  <p style={{ margin: '2px 0 0', color: '#6e7e73', fontSize: '0.85rem' }}>Select photos or videos to upload directly to Ditvi&apos;s birthday Google Drive folder.</p>
                </div>
              </div>

              {/* Dropzone */}
              <div
                onClick={() => driveFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #b7d8b3',
                  borderRadius: '14px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: '#fcfdfa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '18px',
                }}
              >
                <input
                  type="file"
                  ref={driveFileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleDriveFilesSelect(e.target.files)}
                />
                <CloudUploadIcon sx={{ fontSize: 44, color: '#789b63', marginBottom: '8px' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#294b35' }}>
                  Click to select photos or videos (or drag and drop here)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#7b8e7e', marginTop: '4px' }}>
                  Supports JPG, PNG, WEBP, MP4, MOV, HEIC up to 15MB each
                </div>
              </div>

              {/* Selected File Previews */}
              {driveUploadPreviews.length > 0 && (
                <div style={{ background: '#f8faf7', border: '1px solid #e2ede0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#294b35' }}>
                      Ready to Upload ({driveUploadPreviews.length} photos)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        driveUploadPreviews.forEach((u) => URL.revokeObjectURL(u));
                        setDriveUploadFiles([]);
                        setDriveUploadPreviews([]);
                      }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Clear Selection
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                    {driveUploadPreviews.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbe3c6' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Upload preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDrivePreview(idx);
                          }}
                          style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <CloseIcon sx={{ fontSize: 13 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Inputs & Submit Form */}
              <form onSubmit={handleDriveUploadSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#294b35', marginBottom: '6px' }}>
                      Uploader / Album Tag
                    </label>
                    <input
                      type="text"
                      value={driveUploaderName}
                      onChange={(e) => setDriveUploaderName(e.target.value)}
                      placeholder="e.g. Admin, Birthday Photoshoot, Cake Cutting"
                      className={styles.formInput}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#294b35', marginBottom: '6px' }}>
                      Photo Caption or Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={driveCaption}
                      onChange={(e) => setDriveCaption(e.target.value)}
                      placeholder="e.g. Ditvi in her party dress with panda balloons"
                      className={styles.formInput}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {driveUploadError && (
                  <div style={{ color: '#d32f2f', fontSize: '0.86rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <WarningAmberIcon sx={{ fontSize: 16 }} />
                    <span>{driveUploadError}</span>
                  </div>
                )}

                {driveUploadSuccess && (
                  <div style={{ color: '#2e7d32', fontSize: '0.88rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                    <span>{driveUploadSuccess}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={isDriveUploading || driveUploadFiles.length === 0}
                    className={styles.btnPrimary}
                    style={{ padding: '10px 24px', fontSize: '0.94rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 18 }} />
                    <span>{isDriveUploading ? 'Uploading to Google Drive...' : `Upload ${driveUploadFiles.length > 0 ? `${driveUploadFiles.length} ` : ''}File${driveUploadFiles.length > 1 ? 's' : ''}`}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Google Drive Photo Gallery */}
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e1e7de', boxShadow: '0 4px 16px rgba(41, 75, 53, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#294B35', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>All Photos in Google Drive</span>
                    <span style={{ background: '#edf6ea', color: '#294b35', fontSize: '0.82rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      {drivePhotos.length}
                    </span>
                  </h3>
                  <p style={{ margin: '2px 0 0', color: '#6e7e73', fontSize: '0.84rem' }}>Photos stored in folder &quot;{driveStatus?.folderName || 'Ditvi Birthday Photos'}&quot;</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#7b8e7e' }} />
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={driveSearch}
                      onChange={(e) => setDriveSearch(e.target.value)}
                      style={{ padding: '7px 12px 7px 34px', borderRadius: '20px', border: '1px solid #cbe3c6', fontSize: '0.86rem', outline: 'none', background: '#fcfdfa' }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={fetchDrivePhotos}
                    disabled={driveLoading}
                    className={styles.exportBtn}
                    style={{ padding: '7px 14px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshIcon sx={{ fontSize: 15, animation: driveLoading ? 'spin 1s linear infinite' : 'none' }} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Photo Cards Grid */}
              {driveLoading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={`drive-skel-${i}`} className={styles.skeletonCard} style={{ padding: '12px' }}>
                      <div className={styles.skeletonBase} style={{ width: '100%', height: '170px', borderRadius: '10px', marginBottom: '12px' }} />
                      <div className={styles.skeletonBase} style={{ width: '70%', height: '16px', marginBottom: '8px' }} />
                      <div className={styles.skeletonBase} style={{ width: '45%', height: '12px' }} />
                    </div>
                  ))}
                </div>
              )}

              {!driveLoading && drivePhotos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fbfdf9', borderRadius: '14px', border: '1px dashed #d5e5d1' }}>
                  <PhotoLibraryIcon sx={{ fontSize: 48, color: '#a3c58e', marginBottom: '10px' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#294B35' }}>No Photos Found in Google Drive Folder</div>
                  <p style={{ fontSize: '0.88rem', color: '#6e7e73', maxWidth: '400px', margin: '6px auto 16px' }}>
                    Upload birthday photos or videos above to display them on the website and in Google Drive!
                  </p>
                </div>
              )}

              {!driveLoading && drivePhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {drivePhotos
                    .filter((p) => {
                      if (!driveSearch.trim()) return true;
                      const q = driveSearch.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        (p.caption && p.caption.toLowerCase().includes(q)) ||
                        (p.uploaderName && p.uploaderName.toLowerCase().includes(q))
                      );
                    })
                    .map((photo) => {
                      const formattedSize = photo.size
                        ? photo.size > 1024 * 1024
                          ? `${(photo.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${Math.round(photo.size / 1024)} KB`
                        : '';

                      const formattedDate = photo.createdTime
                        ? new Date(photo.createdTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '';

                      return (
                        <div
                          key={photo.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e1e7de',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 8px rgba(41,75,53,0.04)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#f2f6f1', overflow: 'hidden' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.proxyUrl || photo.directUrl}
                              alt={photo.caption || photo.name}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = photo.directUrl;
                              }}
                            />
                            {photo.uploaderName && (
                              <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(41,75,53,0.85)', color: '#fff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                                {photo.uploaderName}
                              </span>
                            )}
                          </div>

                          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#252525', lineHeight: 1.3, wordBreak: 'break-all' }}>
                              {photo.caption || photo.name.replace(/ditvi-birthday-.*?-(.+)/, '$1')}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#7b8e7e', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f2f5f1' }}>
                              <span>{formattedDate}</span>
                              {formattedSize && <span>{formattedSize}</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                              {photo.webViewLink && (
                                <a
                                  href={photo.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View on Google Drive"
                                  style={{ flex: 1, padding: '5px', textAlign: 'center', background: '#f0f5ee', color: '#294b35', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                >
                                  <OpenInNewIcon sx={{ fontSize: 13 }} />
                                  <span>Drive</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => handleCopyPhotoLink(photo)}
                                title="Copy direct photo URL"
                                style={{ flex: 1, padding: '5px', background: copiedPhotoId === photo.id ? '#edf7ed' : '#f0f5ee', color: copiedPhotoId === photo.id ? '#2e7d32' : '#294b35', border: 'none', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                              >
                                <ContentCopyIcon sx={{ fontSize: 13 }} />
                                <span>{copiedPhotoId === photo.id ? 'Copied!' : 'Link'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteDrivePhoto(photo.id)}
                                disabled={isDeletingDrivePhoto && deletingPhotoId === photo.id}
                                title="Delete photo from Google Drive"
                                style={{ padding: '5px 8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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
                className={styles.downloadBtn}
                onClick={() => handleDownloadWishImage(selectedWishCard)}
              >
                <ImageIcon sx={{ fontSize: 18 }} />
                <span>{isDownloading ? 'Generating...' : 'Download PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp RSVP Modal - Redesigned WhatsApp Chat Preview UI */}
      {whatsappGuest && (
        <div className={styles.modalOverlay} onClick={() => setWhatsappGuest(null)}>
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              borderRadius: '24px',
              background: '#ffffff',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalSlideUp 0.25s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp App-style Top Bar */}
            <div
              style={{
                background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: 26, color: '#ffffff' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                    Send RSVP Invite • {whatsappGuest.title} {whatsappGuest.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '2px', fontSize: '0.82rem', color: '#d8f4e2' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <SmartphoneIcon sx={{ fontSize: 15, color: '#ffffff' }} />
                      <span>{whatsappGuest.mobile}</span>
                    </span>
                    {whatsappGuest.email && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <EmailOutlinedIcon sx={{ fontSize: 15, color: '#ffffff' }} />
                        <span>{whatsappGuest.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappGuest(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
              >
                <CloseIcon sx={{ fontSize: 20, color: '#ffffff' }} />
              </button>
            </div>

            {/* Content Body: Chat Bubble Preview + Custom Editor */}
            <div style={{ padding: '24px 28px', background: '#F0F2F5', maxHeight: '78vh', overflowY: 'auto' }}>
              
              {/* Message Editor Section */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', border: '1px solid #e1e7de', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#294B35', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EditIcon sx={{ fontSize: 16, color: '#3c8d40' }} />
                    <span>Customize Invitation Message</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#7a8c7e', background: '#eef6ec', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    RSVP link will auto-attach
                  </span>
                </div>
                <textarea
                  value={whatsappCustomMessage}
                  onChange={(e) => setWhatsappCustomMessage(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #d2e2cd',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    color: '#203325',
                    background: '#fcfdfb',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#25D366')}
                  onBlur={(e) => (e.target.style.borderColor = '#d2e2cd')}
                  placeholder="Type your personalized invitation note here..."
                />
              </div>

              {/* Realistic WhatsApp Chat Preview */}
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#68796c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                  Live Recipient Message Preview
                </span>
                
                {/* Chat bubble */}
                <div
                  style={{
                    background: '#E7FCE3',
                    border: '1px solid #D1F4CA',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '16px 18px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    position: 'relative',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.92rem', color: '#111b21', lineHeight: 1.55 }}>
                    {whatsappCustomMessage || 'Loading message...'}
                  </div>

                  {/* Attached Rich RSVP Link Box */}
                  <div
                    style={{
                      marginTop: '12px',
                      background: '#ffffff',
                      border: '1.5px solid #25D366',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <ParkIcon sx={{ fontSize: 18, color: '#075E54' }} />
                      <strong style={{ fontSize: '0.88rem', color: '#075E54' }}>
                        Ditvi&apos;s 1st Birthday RSVP • Bamboo Grove
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#54656f', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
                      Pre-filled for: <strong>{whatsappGuest.name}</strong> • Phone: <strong>{whatsappGuest.mobile}</strong>
                      {whatsappGuest.email ? ` • Email: ${whatsappGuest.email}` : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5faf3', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e1efe0' }}>
                      <LinkIcon sx={{ fontSize: 16, color: '#25D366' }} />
                      <span style={{ fontSize: '0.76rem', color: '#128C7E', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {typeof window !== 'undefined' ? window.location.origin : ''}/rsvp?name={encodeURIComponent(whatsappGuest.name || '')}&amp;phone={encodeURIComponent(whatsappGuest.mobile || '')}&amp;email={encodeURIComponent(whatsappGuest.email || '')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.7rem', color: '#667781' }}>
                    <span>Just now</span>
                    <DoneAllIcon sx={{ fontSize: 15, color: '#53bdeb' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div
              style={{
                padding: '16px 28px',
                background: '#ffffff',
                borderTop: '1px solid #e3ebe0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#576b5c' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#25D366' }} />
                <span>One-click opens WhatsApp with everything pre-filled</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setWhatsappGuest(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1.5px solid #d2ded0',
                    background: '#ffffff',
                    color: '#495a4d',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f8f3')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={sendWhatsappRsvp}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #25D366 0%, #1EBE5D 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 211, 102, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.35)';
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: 22 }} />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Delete Confirmation Modal */}
      {guestToDelete && (
        <div className={styles.modalOverlay} onClick={() => !isDeletingGuest && setGuestToDelete(null)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '460px',
              padding: '0',
              overflow: 'hidden',
              borderRadius: '20px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
              border: '1.5px solid rgba(220, 38, 38, 0.18)',
              background: '#ffffff',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid #f1f5f2',
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#1B3824',
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    Delete Guest
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6A7D70' }}>
                    Confirm removal from guest list
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isDeletingGuest && setGuestToDelete(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6A7D70',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={isDeletingGuest}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '0.92rem', color: '#3A4D40', lineHeight: 1.5 }}>
                Are you sure you want to remove{' '}
                <strong style={{ color: '#1B3824', fontWeight: 800 }}>
                  {guestToDelete.title ? `${guestToDelete.title} ` : ''}
                  {guestToDelete.name}
                </strong>{' '}
                from the guest registry?
              </p>

              <div
                style={{
                  background: '#F7F9F6',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid #E5EBE3',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.85rem',
                  color: '#55695C',
                }}
              >
                {guestToDelete.mobile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneIcon sx={{ fontSize: 16, color: '#1B3824' }} />
                    <span style={{ fontWeight: 600, color: '#1B3824' }}>Phone:</span>
                    <span>{guestToDelete.mobile}</span>
                  </div>
                )}
                {guestToDelete.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EmailOutlinedIcon sx={{ fontSize: 16, color: '#1B3824' }} />
                    <span style={{ fontWeight: 600, color: '#1B3824' }}>Email:</span>
                    <span>{guestToDelete.email}</span>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: '#991B1B',
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 16, marginTop: '2px', flexShrink: 0 }} />
                <span>This action cannot be undone. Any personalized invitation link created for this guest will also be disconnected.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: '#FBFDFB',
                borderTop: '1px solid #EAEFE9',
              }}
            >
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                disabled={isDeletingGuest}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #d2ded0',
                  background: '#ffffff',
                  color: '#495a4d',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isDeletingGuest ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isDeletingGuest) e.currentTarget.style.background = '#f5f8f3';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGuest}
                disabled={isDeletingGuest}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: isDeletingGuest ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  opacity: isDeletingGuest ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDeletingGuest) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(220, 38, 38, 0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.35)';
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                <span>{isDeletingGuest ? 'Deleting...' : 'Delete Guest'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

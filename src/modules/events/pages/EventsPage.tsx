'use client';

import React from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  Event as EventIcon,
  EventAvailable,
  ConfirmationNumber,
  MeetingRoom,
  LocalOffer,
  Settings,
  ConfirmationNumberOutlined,
  Discount,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useEventsController } from '../hooks/useEventsController';
import { EventsTable } from '../components/EventsTable';
import { EventDrawer } from '../components/EventDrawer';
import { TicketsTable } from '../components/TicketsTable';
import { TicketModal } from '../components/TicketModal';
import { CouponsTable } from '../components/CouponsTable';
import { CouponModal } from '../components/CouponModal';
import { AppConfigPanel } from '../components/AppConfigPanel';
import { Loader } from '@/shared/components/Loader';

const translations: Record<string, any> = {
  en: {
    pageTitle: 'Events & Booking CMS',
    subTitle: 'Manage live shows, concerts, ticket categories, promo coupons, and system settings',
    tabEvents: 'Events',
    tabTickets: 'Ticket Types',
    tabCoupons: 'Discount Coupons',
    tabConfig: 'App Config',
    statTotal: 'Total Events',
    statUpcoming: 'Upcoming Events',
    statLive: 'Live Now',
    statSeats: 'Available Seats',
    searchPlaceholder: 'Search by event name, code, venue...',
    filterCity: 'Filter City',
    filterStatus: 'Filter Status',
    allCities: 'All Cities',
    allStatuses: 'All Statuses',
    addEvent: 'Add Event',
    addTicket: 'Add Ticket Tier',
    addCoupon: 'Create Coupon',
    colCode: 'Event Code',
    colEvent: 'Event Name',
    colType: 'Category',
    colDateTime: 'Date & Time',
    colLocation: 'Location',
    colSeats: 'Seat Availability',
    colStatus: 'Status',
    colActive: 'Active',
    colActions: 'Actions',
    colTicketTier: 'Ticket Tier Name',
    colEventName: 'Event Name',
    colPrice: 'Price (₹)',
    colCapacity: 'Capacity (Available / Total)',
    colDescription: 'Perks & Access',
    colCouponCode: 'Promo Code',
    colDiscount: 'Discount Value',
    colEventCode: 'Target Event',
    colUsage: 'Usage Limit',
    colValidUntil: 'Valid Until',
    statusUpcoming: 'UPCOMING',
    statusLive: 'LIVE',
    statusCompleted: 'COMPLETED',
    statusCancelled: 'CANCELLED',
    noEvents: 'No events found.',
    noTickets: 'No ticket categories found.',
    noCoupons: 'No discount coupons found.',
    btnEdit: 'Edit Event',
    btnDelete: 'Delete',
    modalAddTitle: 'Add New Event',
    modalEditTitle: 'Edit Event',
    modalAddTicketTitle: 'Add Ticket Category Tier',
    modalAddCouponTitle: 'Create Discount Promo Coupon',
    labelName: 'Event Name',
    labelCode: 'Event Code',
    labelType: 'Category / Type',
    labelCity: 'City',
    labelLocation: 'Venue / Location',
    labelDate: 'Start Date',
    labelTime: 'Time',
    labelStatus: 'Status',
    labelTotalSeats: 'Total Seats',
    labelAvailableSeats: 'Available Seats',
    labelOrganizer: 'Organizer',
    labelImage: 'Banner Image URL',
    labelAvailability: 'Active for Booking',
    labelDescription: 'Description',
    labelSelectEvent: 'Select Event',
    labelTicketTier: 'Tier Name (e.g. VIP Pass, Early Bird)',
    labelPrice: 'Price (₹)',
    labelCapacity: 'Total Quantity / Capacity',
    labelCouponCode: 'Promo Code (e.g. FESTIVE25)',
    labelDiscountType: 'Discount Type',
    labelDiscountValue: 'Discount Value',
    labelTargetEvent: 'Target Event (Optional)',
    labelMaxUses: 'Max Usage Limit',
    labelValidUntil: 'Valid Until Date',
    configFeatureFlagsTitle: 'Feature Flags & System Controls',
    configPaymentTitle: 'Payment Gateway Credentials',
    flagEventsEnable: 'Events & Ticket Booking System',
    flagBannersEnable: 'Hero Banner Highlights',
    flagFolkNight: 'Folk Night & Cultural Special',
    flagCricket: 'Sports & Cricket Match Screenings',
    flagMaintenance: 'Maintenance Mode',
    flagTestMode: 'Razorpay Sandbox / Test Mode',
    labelRazorpayKey: 'Razorpay Public Key ID',
    btnCancel: 'Cancel',
    btnSave: 'Save',
    btnUpdate: 'Update',
  },
  te: {
    pageTitle: 'ఈవెంట్లు & బుకింగ్ CMS',
    subTitle: 'లైవ్ షోలు, కాన్సర్ట్‌లు, టికెట్ కేటగిరీలు, డిస్కౌంట్ కూపన్లు మరియు సిస్టమ్ సెట్టింగులను నిర్వహించండి',
    tabEvents: 'ఈవెంట్లు',
    tabTickets: 'టికెట్ రకాలు',
    tabCoupons: 'డిస్కౌంట్ కూపన్లు',
    tabConfig: 'యాప్ కాన్ఫిగ్',
    statTotal: 'మొత్తం ఈవెంట్లు',
    statUpcoming: 'రాబోయే ఈవెంట్లు',
    statLive: 'ప్రస్తుతం లైవ్',
    statSeats: 'అందుబాటులో ఉన్న సీట్లు',
    searchPlaceholder: 'ఈవెంట్ పేరు, కోడ్, వేదికతో శోధించండి...',
    filterCity: 'నగరం వడపోత',
    filterStatus: 'స్థితి వడపోత',
    allCities: 'అన్ని నగరాలు',
    allStatuses: 'అన్ని స్థితులు',
    addEvent: 'ఈవెంట్ జోడించండి',
    addTicket: 'టికెట్ కేటగిరీ జోడించండి',
    addCoupon: 'కూపన్ సృష్టించండి',
    colCode: 'ఈవెంట్ కోడ్',
    colEvent: 'ఈవెంట్ పేరు',
    colType: 'విభాగం',
    colDateTime: 'తేదీ & సమయం',
    colLocation: 'ప్రాంతం',
    colSeats: 'సీట్ల లభ్యత',
    colStatus: 'స్థితి',
    colActive: 'యాక్టివ్',
    colActions: 'చర్యలు',
    colTicketTier: 'టికెట్ కేటగిరీ పేరు',
    colEventName: 'ఈవెంట్ పేరు',
    colPrice: 'ధర (₹)',
    colCapacity: 'సీట్ల సామర్థ్యం',
    colDescription: 'సౌకర్యాలు & వివరాలు',
    colCouponCode: 'ప్రోమో కోడ్',
    colDiscount: 'డిస్కౌంట్ విలువ',
    colEventCode: 'లక్ష్య ఈవెంట్',
    colUsage: 'పరిమితి',
    colValidUntil: 'చెల్లుబాటు తేదీ',
    statusUpcoming: 'రాబోయేవి',
    statusLive: 'లైవ్',
    statusCompleted: 'పూర్తయినవి',
    statusCancelled: 'రద్దయినవి',
    noEvents: 'ఈవెంట్లు ఏవీ కనుగొనబడలేదు.',
    noTickets: 'టికెట్ కేటగిరీలు ఏవీ లేవు.',
    noCoupons: 'కూపన్లు ఏవీ కనుగొనబడలేదు.',
    btnEdit: 'సవరించు',
    btnDelete: 'తొలగించు',
    modalAddTitle: 'కొత్త ఈవెంట్‌ను జోడించండి',
    modalEditTitle: 'ఈవెంట్‌ను సవరించండి',
    modalAddTicketTitle: 'కొత్త టికెట్ కేటగిరీ జోడించండి',
    modalAddCouponTitle: 'డిస్కౌంట్ ప్రోమో కూపన్ సృష్టించండి',
    labelName: 'ఈవెంట్ పేరు',
    labelCode: 'ఈవెంట్ కోడ్',
    labelType: 'విభాగం / రకం',
    labelCity: 'నగరం',
    labelLocation: 'వేదిక / ప్రాంతం',
    labelDate: 'ప్రారంభ తేదీ',
    labelTime: 'సమయం',
    labelStatus: 'స్థితి',
    labelTotalSeats: 'మొత్తం సీట్లు',
    labelAvailableSeats: 'అందుబాటులో ఉన్న సీట్లు',
    labelOrganizer: 'నిర్వాహకుడు',
    labelImage: 'బ్యానర్ చిత్రం URL',
    labelAvailability: 'బుకింగ్‌కు అందుబాటులో ఉంది',
    labelDescription: 'వివరాలు',
    labelSelectEvent: 'ఈవెంట్‌ను ఎంచుకోండి',
    labelTicketTier: 'టికెట్ పేరు (ఉదా. VIP పాస్)',
    labelPrice: 'ధర (₹)',
    labelCapacity: 'మొత్తం సీట్లు',
    labelCouponCode: 'ప్రోమో కోడ్ (ఉదా. FESTIVE25)',
    labelDiscountType: 'డిస్కౌంట్ రకం',
    labelDiscountValue: 'డిస్కౌంట్ విలువ',
    labelTargetEvent: 'లక్ష్య ఈవెంట్',
    labelMaxUses: 'గరిష్ట వినియోగం',
    labelValidUntil: 'చెల్లుబాటు తేదీ',
    configFeatureFlagsTitle: 'ఫీచర్ ఫ్లాగ్స్ & సిస్టమ్ కంట్రోల్స్',
    configPaymentTitle: 'పేమెంట్ గేట్‌వే వివరాలు',
    flagEventsEnable: 'ఈవెంట్లు & టికెట్ బుకింగ్ సిస్టమ్',
    flagBannersEnable: 'హీరో బ్యానర్ హైలైట్స్',
    flagFolkNight: 'ఫోక్ నైట్ & సాంస్కృతిక కార్యక్రమాలు',
    flagCricket: 'క్రీడలు & క్రికెట్ మ్యాచ్ స్క్రీనింగ్',
    flagMaintenance: 'మెయింటెనెన్స్ మోడ్',
    flagTestMode: 'రేజర్‌పే టెస్ట్ మోడ్',
    labelRazorpayKey: 'రేజర్‌పే పబ్లిక్ కీ ID',
    btnCancel: 'రద్దు చేయి',
    btnSave: 'సమర్పించు',
    btnUpdate: 'నవీకరించు',
  },
  hi: {
    pageTitle: 'इवेंट्स & बुकिंग CMS',
    subTitle: 'लाइव शो, कॉन्सर्ट, टिकट श्रेणियां, कूपन और सिस्टम सेटिंग्स प्रबंधित करें',
    tabEvents: 'इवेंट्स (Events)',
    tabTickets: 'टिकट के प्रकार (Tickets)',
    tabCoupons: 'डिस्काउंट कूपन (Coupons)',
    tabConfig: 'ऐप कॉन्फ़िगरेशन (Config)',
    statTotal: 'कुल इवेंट्स',
    statUpcoming: 'आगामी इवेंट्स',
    statLive: 'लाइव इवेंट्स',
    statSeats: 'उपलब्ध सीटें',
    searchPlaceholder: 'इवेंट नाम, कोड, स्थान से खोजें...',
    filterCity: 'शहर फ़िल्टर',
    filterStatus: 'स्थिति फ़िल्टर',
    allCities: 'सभी शहर',
    allStatuses: 'सभी स्थितियाँ',
    addEvent: 'इवेंट जोड़ें',
    addTicket: 'टिकट श्रेणी जोड़ें',
    addCoupon: 'कूपन बनाएं',
    colCode: 'इवेंट कोड',
    colEvent: 'इवेंट का नाम',
    colType: 'श्रेणी',
    colDateTime: 'दिनांक और समय',
    colLocation: 'स्थान',
    colSeats: 'सीट उपलब्धता',
    colStatus: 'स्थिति',
    colActive: 'सक्रिय',
    colActions: 'कार्रवाई',
    colTicketTier: 'टिकट श्रेणी',
    colEventName: 'इवेंट का नाम',
    colPrice: 'मूल्य (₹)',
    colCapacity: 'क्षमता',
    colDescription: 'सुविधाएं',
    colCouponCode: 'प्रोमो कोड',
    colDiscount: 'छूट मान',
    colEventCode: 'लक्ष्य इवेंट',
    colUsage: 'उपयोग सीमा',
    colValidUntil: 'वैधता तिथि',
    statusUpcoming: 'आगामी',
    statusLive: 'लाइव',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',
    noEvents: 'कोई इवेंट नहीं मिला।',
    noTickets: 'कोई टिकट श्रेणी नहीं मिली।',
    noCoupons: 'कोई कूपन नहीं मिला।',
    btnEdit: 'संपादित करें',
    btnDelete: 'हटाएं',
    modalAddTitle: 'नया इवेंट जोड़ें',
    modalEditTitle: 'इवेंट संपादित करें',
    modalAddTicketTitle: 'टिकट श्रेणी जोड़ें',
    modalAddCouponTitle: 'प्रोमो कूपन बनाएं',
    labelName: 'इवेंट का नाम',
    labelCode: 'इवेंट कोड',
    labelType: 'श्रेणी / प्रकार',
    labelCity: 'शहर',
    labelLocation: 'स्थान',
    labelDate: 'प्रारंभ तिथि',
    labelTime: 'समय',
    labelStatus: 'स्थिति',
    labelTotalSeats: 'कुल सीटें',
    labelAvailableSeats: 'उपलब्ध सीटें',
    labelOrganizer: 'आयोजक',
    labelImage: 'बैनर छवि URL',
    labelAvailability: 'बुकिंग के लिए सक्रिय',
    labelDescription: 'विवरण',
    labelSelectEvent: 'इवेंट चुनें',
    labelTicketTier: 'श्रेणी का नाम',
    labelPrice: 'मूल्य (₹)',
    labelCapacity: 'कुल सीटें',
    labelCouponCode: 'प्रोमो कोड',
    labelDiscountType: 'छूट का प्रकार',
    labelDiscountValue: 'छूट मान',
    labelTargetEvent: 'लक्ष्य इवेंट',
    labelMaxUses: 'उपयोग सीमा',
    labelValidUntil: 'वैधता तिथि',
    configFeatureFlagsTitle: 'फ़ीचर फ़्लैग और सिस्टम नियंत्रण',
    configPaymentTitle: 'पेमेंट गेटवे क्रेडेंशियल',
    flagEventsEnable: 'इवेंट्स और टिकट बुकिंग सिस्टम',
    flagBannersEnable: 'हीरो बैनर हाइलाइट्स',
    flagFolkNight: 'लोक नाइट सांस्कृतिक कार्यक्रम',
    flagCricket: 'खेल और क्रिकेट मैच स्क्रीनिंग',
    flagMaintenance: 'मेंटेनेंस मोड',
    flagTestMode: 'रेज़रपे टेस्ट मोड',
    labelRazorpayKey: 'रेज़रपे पब्लिक की ID',
    btnCancel: 'रद्द करें',
    btnSave: 'सहेजें',
    btnUpdate: 'अद्यतन करें',
  },
  ml: {
    pageTitle: 'ഇവന്റുകൾ & ബുക്കിംഗ് CMS',
    subTitle: 'ലൈവ് ഷോകൾ, കച്ചേരികൾ, ടിക്കറ്റ് തരങ്ങൾ, കൂപ്പണുകൾ, ക്രമീകരണങ്ങൾ എന്നിവ കൈകാര്യം ചെയ്യുക',
    tabEvents: 'ഇവന്റുകൾ (Events)',
    tabTickets: 'ടിക്കറ്റ് തരങ്ങൾ (Tickets)',
    tabCoupons: 'ഡിസ്കൗണ്ട് കൂപ്പണുകൾ (Coupons)',
    tabConfig: 'ആപ്പ് കോൺഫിഗറേഷൻ (Config)',
    statTotal: 'ആകെ ഇവന്റുകൾ',
    statUpcoming: 'വരാനിരിക്കുന്ന ഇവന്റുകൾ',
    statLive: 'ലൈവ് ഇവന്റുകൾ',
    statSeats: 'ലഭ്യമായ സീറ്റുകൾ',
    searchPlaceholder: 'ഇവന്റ് പേര്, കോഡ്, സ്ഥലം തിരയുക...',
    filterCity: 'നഗരം ഫിൽട്ടർ',
    filterStatus: 'സ്റ്റാറ്റസ് ഫിൽട്ടർ',
    allCities: 'എല്ലാ നഗരങ്ങളും',
    allStatuses: 'എല്ലാ സ്റ്റാറ്റസുകളും',
    addEvent: 'ഇവന്റ് ചേർക്കുക',
    addTicket: 'ടിക്കറ്റ് തരം ചേർക്കുക',
    addCoupon: 'കൂപ്പൺ സൃഷ്ടിക്കുക',
    colCode: 'ഇവന്റ് കോഡ്',
    colEvent: 'ഇവന്റ് പേര്',
    colType: 'വിഭാഗം',
    colDateTime: 'തീയതി & സമയം',
    colLocation: 'സ്ഥലം',
    colSeats: 'സീറ്റ് ലഭ്യത',
    colStatus: 'സ്റ്റാറ്റസ്',
    colActive: 'സജീവം',
    colActions: 'നടപടികൾ',
    colTicketTier: 'ടിക്കറ്റ് പേര്',
    colEventName: 'ഇവന്റ് പേര്',
    colPrice: 'വില (₹)',
    colCapacity: 'സീറ്റ് ശേഷി',
    colDescription: 'വിവരങ്ങൾ',
    colCouponCode: 'പ്രൊമോ കോഡ്',
    colDiscount: 'ഡിസ്കൗണ്ട് മൂല്യം',
    colEventCode: 'ലക്ഷ്യ ഇവന്റ്',
    colUsage: 'ഉപയോഗ പരിധി',
    colValidUntil: 'അവസാന തീയതി',
    statusUpcoming: 'വരാനിരിക്കുന്നത്',
    statusLive: 'ലൈവ്',
    statusCompleted: 'പൂർത്തിയായി',
    statusCancelled: 'റദ്ദാക്കി',
    noEvents: 'ഇവന്റുകളൊന്നും കണ്ടെത്തിയില്ല.',
    noTickets: 'ടിക്കറ്റ് വിഭാഗങ്ങളൊന്നും ലഭ്യമല്ല.',
    noCoupons: 'കൂപ്പണുകളൊന്നും ലഭ്യമല്ല.',
    btnEdit: 'തിരുത്തുക',
    btnDelete: 'ഇല്ലാതാക്കുക',
    modalAddTitle: 'പുതിയ ഇവന്റ് ചേർക്കുക',
    modalEditTitle: 'ഇവന്റ് തിരുത്തുക',
    modalAddTicketTitle: 'ടിക്കറ്റ് തരം ചേർക്കുക',
    modalAddCouponTitle: 'ഡിസ്കൗണ്ട് കൂപ്പൺ സൃഷ്ടിക്കുക',
    labelName: 'ഇവന്റ് പേര്',
    labelCode: 'ഇവന്റ് കോഡ്',
    labelType: 'വിഭാഗം',
    labelCity: 'നഗരം',
    labelLocation: 'സ്ഥലം',
    labelDate: 'ആരംഭ തീയതി',
    labelTime: 'സമയം',
    labelStatus: 'സ്റ്റാറ്റസ്',
    labelTotalSeats: 'ആകെ സീറ്റുകൾ',
    labelAvailableSeats: 'ലഭ്യമായ സീറ്റുകൾ',
    labelOrganizer: 'സംഘാടകൻ',
    labelImage: 'ബാനർ ചിത്രം URL',
    labelAvailability: 'ബുക്കിംഗിനായി സജീവം',
    labelDescription: 'വിവരണം',
    labelSelectEvent: 'ഇവന്റ് തിരഞ്ഞെടുക്കുക',
    labelTicketTier: 'ടിക്കറ്റ് തരം',
    labelPrice: 'വില (₹)',
    labelCapacity: 'ആകെ സീറ്റുകൾ',
    labelCouponCode: 'പ്രൊമോ കോഡ്',
    labelDiscountType: 'ഡിസ്കൗണ്ട് തരം',
    labelDiscountValue: 'ഡിസ്കൗണ്ട് മൂല്യം',
    labelTargetEvent: 'ലക്ഷ്യ ഇവന്റ്',
    labelMaxUses: 'ഉപയോഗ പരിധി',
    labelValidUntil: 'അവസാന തീയതി',
    configFeatureFlagsTitle: 'ഫീച്ചർ ഫ്ലാഗുകളും സിസ്റ്റം നിയന്ത്രണങ്ങളും',
    configPaymentTitle: 'പേയ്‌മെന്റ് ഗേറ്റ്‌വേ വിവരങ്ങൾ',
    flagEventsEnable: 'ഇവന്റുകൾ & ബുക്കിംഗ് സിസ്റ്റം',
    flagBannersEnable: 'ഹീറോ ബാനർ ഹൈലൈറ്റുകൾ',
    flagFolkNight: 'ഫോക്ക് നൈറ്റ് സാംസ്കാരിക പരിപാടികൾ',
    flagCricket: 'കായിക മത്സരങ്ങൾ & ക്രിക്കറ്റ് സ്ക്രീനിംഗ്',
    flagMaintenance: 'മെയിന്റനൻസ് മോഡ്',
    flagTestMode: 'റേസർപേ ടെസ്റ്റ് മോഡ്',
    labelRazorpayKey: 'റേസർപേ പബ്ലിക് കീ ID',
    btnCancel: 'റദ്ദാക്കുക',
    btnSave: 'സേവ് ചെയ്യുക',
    btnUpdate: 'അപ്‌ഡേറ്റ് ചെയ്യുക',
  },
};

export const EventsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    activeTab,
    setActiveTab,
    events,
    allEvents,
    stats,
    loading,
    search,
    setSearch,
    selectedCity,
    setSelectedCity,
    selectedStatus,
    setSelectedStatus,
    page,
    totalPages,
    setPage,
    isDrawerOpen,
    isModalOpen,
    selectedEvent,
    handleOpenAddDrawer,
    handleOpenAddModal,
    handleOpenEditDrawer,
    handleOpenEditModal,
    handleCloseDrawer,
    handleCloseModal,
    handleSaveEvent,
    handleDeleteEvent,
    handleToggleAvailability,

    // Tickets
    tickets,
    selectedTicketEventId,
    setSelectedTicketEventId,
    selectedTicket,
    isTicketModalOpen,
    setIsTicketModalOpen,
    handleOpenAddTicketModal,
    handleOpenEditTicketModal,
    handleCloseTicketModal,
    handleSaveTicket,
    handleToggleTicketStatus,
    handleDeleteTicket,

    // Coupons
    coupons,
    selectedCoupon,
    isCouponModalOpen,
    setIsCouponModalOpen,
    handleOpenAddCouponModal,
    handleOpenEditCouponModal,
    handleCloseCouponModal,
    handleSaveCoupon,
    handleToggleCouponStatus,
    handleDeleteCoupon,

    // Config
    appConfig,
    handleUpdateConfig,
  } = useEventsController();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activeHref="/events" />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            backgroundColor: isDark ? '#0f0c29' : '#f8fafc',
            color: isDark ? '#ffffff' : '#0f172a',
          }}
        >
          {/* Header Banner */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                {t.pageTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', mt: 0.5 }}>
                {t.subTitle}
              </Typography>
            </Box>

            {activeTab === 'events' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAddModal}
                sx={{
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: '#2563eb',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                }}
              >
                {t.addEvent}
              </Button>
            )}

            {activeTab === 'tickets' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAddTicketModal}
                sx={{
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: '#2563eb',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                }}
              >
                {t.addTicket}
              </Button>
            )}

            {activeTab === 'coupons' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAddCouponModal}
                sx={{
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: '#10b981',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                {t.addCoupon}
              </Button>
            )}
          </Box>

          {/* Top Tabs Bar */}
          <Box sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isDark ? '#94a3b8' : '#64748b',
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: isDark ? '#60a5fa' : '#2563eb',
                  },
                },
              }}
            >
              <Tab label={t.tabEvents} icon={<EventIcon />} iconPosition="start" value="events" />
              <Tab label={t.tabTickets} icon={<ConfirmationNumber />} iconPosition="start" value="tickets" />
              <Tab label={t.tabCoupons} icon={<LocalOffer />} iconPosition="start" value="coupons" />
              <Tab label={t.tabConfig} icon={<Settings />} iconPosition="start" value="config" />
            </Tabs>
          </Box>

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Events Tab */}
              {activeTab === 'events' && (
                <>
                  {/* Stat Cards */}
                  <Grid container spacing={2.5} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                          backdropFilter: isDark ? 'blur(16px)' : 'none',
                          borderRadius: 3,
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                            <EventIcon />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                              {t.statTotal}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {stats.totalEvents}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                          backdropFilter: isDark ? 'blur(16px)' : 'none',
                          borderRadius: 3,
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                            <EventAvailable />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                              {t.statUpcoming}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {stats.upcomingEvents}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                          backdropFilter: isDark ? 'blur(16px)' : 'none',
                          borderRadius: 3,
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                            <ConfirmationNumber />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                              {t.statLive}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {stats.liveEvents}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                          backdropFilter: isDark ? 'blur(16px)' : 'none',
                          borderRadius: 3,
                          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2.5, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                            <MeetingRoom />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                              {t.statSeats}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {stats.availableSeats} / {stats.totalSeats}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Search & Filter Row */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                      placeholder={t.searchPlaceholder}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1, minWidth: 260 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>{t.filterCity}</InputLabel>
                      <Select
                        value={selectedCity}
                        label={t.filterCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <MenuItem value="ALL">{t.allCities}</MenuItem>
                        <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                        <MenuItem value="Visakhapatnam">Visakhapatnam</MenuItem>
                        <MenuItem value="Vijayawada">Vijayawada</MenuItem>
                        <MenuItem value="Tirupati">Tirupati</MenuItem>
                        <MenuItem value="Bengaluru">Bengaluru</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>{t.filterStatus}</InputLabel>
                      <Select
                        value={selectedStatus}
                        label={t.filterStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <MenuItem value="ALL">{t.allStatuses}</MenuItem>
                        <MenuItem value="UPCOMING">{t.statusUpcoming}</MenuItem>
                        <MenuItem value="LIVE">{t.statusLive}</MenuItem>
                        <MenuItem value="COMPLETED">{t.statusCompleted}</MenuItem>
                        <MenuItem value="CANCELLED">{t.statusCancelled}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <EventsTable
                    events={events}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteEvent}
                    onToggleAvailability={handleToggleAvailability}
                    translations={t}
                  />

                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                    </Box>
                  )}
                </>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 300 }}>
                      <InputLabel>{t.labelSelectEvent || 'Filter by Event'}</InputLabel>
                      <Select
                        value={selectedTicketEventId}
                        label={t.labelSelectEvent || 'Filter by Event'}
                        onChange={(e) => setSelectedTicketEventId(e.target.value)}
                      >
                        <MenuItem value="ALL">All Events</MenuItem>
                        {allEvents.map((evt) => (
                          <MenuItem key={evt.id} value={evt.id}>
                            {evt.name} ({evt.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <TicketsTable
                    tickets={tickets}
                    onEdit={handleOpenEditTicketModal}
                    onToggleStatus={handleToggleTicketStatus}
                    onDelete={handleDeleteTicket}
                    translations={t}
                  />
                </Box>
              )}

              {/* Coupons Tab */}
              {activeTab === 'coupons' && (
                <CouponsTable
                  coupons={coupons}
                  onEdit={handleOpenEditCouponModal}
                  onToggleStatus={handleToggleCouponStatus}
                  onDelete={handleDeleteCoupon}
                  translations={t}
                />
              )}

              {/* Config Tab */}
              {activeTab === 'config' && (
                <AppConfigPanel
                  config={appConfig}
                  onUpdateConfig={handleUpdateConfig}
                  translations={t}
                />
              )}
            </>
          )}

          {/* Side Window Drawer */}
          <EventDrawer
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            onSave={handleSaveEvent}
            event={selectedEvent}
            translations={t}
          />

          <TicketModal
            open={isTicketModalOpen}
            onClose={handleCloseTicketModal}
            onSave={handleSaveTicket}
            ticket={selectedTicket}
            events={allEvents}
            translations={t}
          />

          <CouponModal
            open={isCouponModalOpen}
            onClose={handleCloseCouponModal}
            onSave={handleSaveCoupon}
            initialData={selectedCoupon}
            events={allEvents}
            translations={t}
          />
        </Box>
      </Box>
    </Box>
  );
};

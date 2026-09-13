import { useState, useEffect, useCallback } from 'react';
import {
  EventItem,
  EventStats,
  CreateEventInput,
  UpdateEventInput,
  TicketTypeItem,
  CreateTicketTypeInput,
  CouponItem,
  CreateCouponInput,
  AppConfigItem,
} from '../domain/event.types';
import { eventsRepository } from '../repositories/events.repository';

export type EventTabType = 'events' | 'tickets' | 'coupons' | 'config';

export const useEventsController = () => {
  const [activeTab, setActiveTab] = useState<EventTabType>('events');

  // Events State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    liveEvents: 0,
    completedEvents: 0,
    totalSeats: 0,
    availableSeats: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Tickets State
  const [tickets, setTickets] = useState<TicketTypeItem[]>([]);
  const [selectedTicketEventId, setSelectedTicketEventId] = useState<string>('ALL');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);

  // Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);

  // Discount Coupons Handlers
  const handleOpenAddCouponModal = () => {
    setSelectedCoupon(null);
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCouponModal = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  const handleCloseCouponModal = () => {
    setIsCouponModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleSaveCoupon = async (input: CreateCouponInput) => {
    if (selectedCoupon) {
      await eventsRepository.updateCoupon(selectedCoupon.id, input);
    } else {
      await eventsRepository.createCoupon(input);
    }
    handleCloseCouponModal();
    fetchAllData();
  };

  const handleToggleCouponStatus = async (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    await eventsRepository.toggleCouponStatus(id);
    fetchAllData();
  };

  const handleDeleteCoupon = async (id: string) => {
    await eventsRepository.deleteCoupon(id);
    fetchAllData();
  };

  // App Config State
  const [appConfig, setAppConfig] = useState<AppConfigItem>({
    id: 'cfg_default_001',
    key: 'default',
    webEnable: true,
    eventsEnable: true,
    folkNight: true,
    cricket: true,
    bannersEnable: true,
    razorpayKeyId: 'rzp_test_TThQ1dclehkMIs',
    isTestMode: true,
    maintenanceMode: false,
  });

  // Drawer State for Events
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedEvents, fetchedStats, fetchedTickets, fetchedCoupons, fetchedConfig] =
        await Promise.all([
          eventsRepository.getEvents(search, selectedCity, selectedStatus),
          eventsRepository.getStats(),
          eventsRepository.getTicketTypes(selectedTicketEventId),
          eventsRepository.getCoupons(),
          eventsRepository.getAppConfig(),
        ]);

      setEvents(fetchedEvents);
      setStats(fetchedStats);
      setTickets(fetchedTickets);
      setCoupons(fetchedCoupons);
      if (fetchedConfig) setAppConfig(fetchedConfig);
    } catch {
      // Handled in repository fallback
    } finally {
      setLoading(false);
    }
  }, [search, selectedCity, selectedStatus, selectedTicketEventId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Events Handlers
  const totalPages = Math.max(1, Math.ceil(events.length / itemsPerPage));
  const paginatedEvents = events.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenAddDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (input: CreateEventInput | UpdateEventInput) => {
    if (selectedEvent) {
      await eventsRepository.updateEvent(selectedEvent.id, input);
    } else {
      await eventsRepository.createEvent(input as CreateEventInput);
    }
    handleCloseDrawer();
    fetchAllData();
  };

  const handleDeleteEvent = async (id: string) => {
    await eventsRepository.deleteEvent(id);
    fetchAllData();
  };

  const handleToggleAvailability = async (id: string) => {
    await eventsRepository.toggleAvailability(id);
    fetchAllData();
  };

  // Ticket Types Handlers
  const [selectedTicket, setSelectedTicket] = useState<TicketTypeItem | null>(null);

  const handleOpenAddTicketModal = () => {
    setSelectedTicket(null);
    setIsTicketModalOpen(true);
  };

  const handleOpenEditTicketModal = (ticket: TicketTypeItem) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setSelectedTicket(null);
  };

  const handleSaveTicket = async (input: CreateTicketTypeInput) => {
    if (selectedTicket) {
      await eventsRepository.updateTicketType(selectedTicket.id, input);
    } else {
      await eventsRepository.createTicketType(input);
    }
    handleCloseTicketModal();
    fetchAllData();
  };

  const handleToggleTicketStatus = async (id: string) => {
    await eventsRepository.toggleTicketStatus(id);
    fetchAllData();
  };

  const handleDeleteTicket = async (id: string) => {
    await eventsRepository.deleteTicketType(id);
    fetchAllData();
  };

  // App Config Handlers
  const handleUpdateConfig = async (updated: Partial<AppConfigItem>) => {
    const newConfig = await eventsRepository.updateAppConfig(updated);
    setAppConfig(newConfig);
  };

  return {
    activeTab,
    setActiveTab,
    events: paginatedEvents,
    allEvents: events,
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
    isModalOpen: isDrawerOpen,
    selectedEvent,
    handleOpenAddDrawer,
    handleOpenAddModal: handleOpenAddDrawer,
    handleOpenEditDrawer,
    handleOpenEditModal: handleOpenEditDrawer,
    handleCloseDrawer,
    handleCloseModal: handleCloseDrawer,
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

    refresh: fetchAllData,
  };
};

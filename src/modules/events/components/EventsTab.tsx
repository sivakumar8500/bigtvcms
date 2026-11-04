'use client';

import React from 'react';
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
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useEventsController } from '../hooks/useEventsController';
import { EventsTable } from './EventsTable';
import { EventDrawer } from './EventDrawer';
import { TicketsTable } from './TicketsTable';
import { TicketModal } from './TicketModal';
import { CouponsTable } from './CouponsTable';
import { CouponModal } from './CouponModal';
import { AppConfigPanel } from './AppConfigPanel';
import { Loader } from '@/shared/components/Loader';
import { eventTranslations } from '../translations';

export const EventsTab: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = eventTranslations[language] || eventTranslations.en;

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Sub-Header / Action Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Navigation Sub-Tabs */}
        <Box sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: isDark ? '#94a3b8' : '#64748b',
                minHeight: 44,
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

        {/* Action Button */}
        <Box>
          {activeTab === 'events' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddModal}
              sx={{
                borderRadius: '12px',
                px: 2.5,
                py: 1,
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
                py: 1,
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
                py: 1,
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
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* ======================================================= */}
          {/* 1. EVENTS SUB-TAB */}
          {/* ======================================================= */}
          {activeTab === 'events' && (
            <>
              {/* Stat Cards */}
              <Grid container spacing={2.5}>
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
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                </Box>
              )}
            </>
          )}

          {/* ======================================================= */}
          {/* 2. TICKETS SUB-TAB */}
          {/* ======================================================= */}
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

          {/* ======================================================= */}
          {/* 3. COUPONS SUB-TAB */}
          {/* ======================================================= */}
          {activeTab === 'coupons' && (
            <CouponsTable
              coupons={coupons}
              onEdit={handleOpenEditCouponModal}
              onToggleStatus={handleToggleCouponStatus}
              onDelete={handleDeleteCoupon}
              translations={t}
            />
          )}

          {/* ======================================================= */}
          {/* 4. CONFIG SUB-TAB */}
          {/* ======================================================= */}
          {activeTab === 'config' && (
            <AppConfigPanel
              config={appConfig}
              onUpdateConfig={handleUpdateConfig}
              translations={t}
            />
          )}
        </>
      )}

      {/* Modals & Drawers */}
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
  );
};

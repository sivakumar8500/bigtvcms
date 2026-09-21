import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventsPage } from '../pages/EventsPage';
import { EventsTable } from '../components/EventsTable';
import { TicketsTable } from '../components/TicketsTable';
import { CouponsTable } from '../components/CouponsTable';
import { AppConfigPanel } from '../components/AppConfigPanel';
import { EventDrawer } from '../components/EventDrawer';
import { TicketModal } from '../components/TicketModal';
import { CouponModal } from '../components/CouponModal';
import { eventsRepository } from '../repositories/events.repository';
import { EventItem, TicketTypeItem, CouponItem, AppConfigItem } from '../domain/event.types';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/events',
}));

jest.mock('@/core/api/api-client', () => {
  const clientMock = {
    get: jest.fn().mockImplementation((url: string) => {
      if (url === '/app-config') {
        return Promise.resolve({
          data: {
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
          },
        });
      }
      if (url === '/events/stats') {
        return Promise.resolve({
          data: {
            totalEvents: 4,
            upcomingEvents: 2,
            liveEvents: 1,
            completedEvents: 1,
            totalSeats: 18800,
            availableSeats: 4730,
          },
        });
      }
      return Promise.resolve({
        data: [
          {
            id: 'e4d962de-5393-4541-a792-4c23f1429f9c',
            name: 'BIGTV Folk Night Patala Jatahra 2026',
            code: 'Bigtv-2026',
            description: 'The Big Folk Night 2025 was a massive cultural celebration',
            type: 'Concert',
            images: ['https://i.ibb.co/bRbkYdyY/folknight4.png'],
            date: '2026-12-25T18:00:00.000Z',
            endDate: '2026-12-25T23:00:00.000Z',
            time: '06:00 PM',
            location: 'Gachibowli Stadium, Hyderabad',
            city: 'Hyderabad',
            availability: true,
            totalSeats: 5000,
            availableSeats: 4500,
            language: 'Telugu',
            ageLimit: '18+',
            duration: '3h 30m',
            organizer: 'BigTV Live Events',
            terms: 'Standard terms apply.',
            status: 'UPCOMING',
          },
        ],
      });
    }),
    post: jest.fn().mockRejectedValue(new Error('Network error')),
    put: jest.fn().mockRejectedValue(new Error('Network error')),
    patch: jest.fn().mockRejectedValue(new Error('Network error')),
    delete: jest.fn().mockRejectedValue(new Error('Network error')),
  };

  return {
    apiClient: clientMock,
    eventsApiClient: clientMock,
  };
});

describe('Events Feature Module & Top Tabs', () => {
  describe('EventsRepository', () => {
    it('fetches events list, stats, ticket types, coupons, and config successfully', async () => {
      const events = await eventsRepository.getEvents();
      expect(Array.isArray(events)).toBe(true);

      const stats = await eventsRepository.getStats();
      expect(stats.totalEvents).toBeGreaterThan(0);

      const tickets = await eventsRepository.getTicketTypes();
      expect(tickets.length).toBeGreaterThan(0);

      const coupons = await eventsRepository.getCoupons();
      expect(coupons.length).toBeGreaterThan(0);

      const config = await eventsRepository.getAppConfig();
      expect(config.key).toBe('default');
    });

    it('creates, updates, toggles, and deletes ticket types, coupons, and app config', async () => {
      const ticket = await eventsRepository.createTicketType({
        eventId: 'evt-001',
        name: 'VIP Star Pass',
        price: 3000,
        totalQuantity: 100,
        availableQuantity: 100,
        description: 'Lounge access',
        isActive: true,
      });
      expect(ticket.name).toBe('VIP Star Pass');

      const coupon = await eventsRepository.createCoupon({
        code: 'FESTIVE50',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        totalUsageLimit: 100,
        validUntil: '2026-12-31',
        isActive: true,
      });
      expect(coupon.code).toBe('FESTIVE50');

      const updatedCoupon = await eventsRepository.updateCoupon(coupon.id, { discountValue: 60 });
      expect(updatedCoupon.discountValue).toBe(60);

      const toggledCoupon = await eventsRepository.toggleCouponStatus(coupon.id);
      expect(toggledCoupon.isActive).toBe(false);

      const deletedCoupon = await eventsRepository.deleteCoupon(coupon.id);
      expect(deletedCoupon).toBe(true);

      const updatedConfig = await eventsRepository.updateAppConfig({ folkNight: false });
      expect(updatedConfig.folkNight).toBe(false);
    });
  });

  describe('Sub-Module Components', () => {
    it('renders EventsTable and triggers edit, delete, availability actions', () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      const onToggleAvailability = jest.fn();

      const mockEvents: EventItem[] = [
        {
          id: 'evt-001',
          name: 'Sunburn Fest 2026',
          code: 'sunburn-2026',
          description: 'Music Fest',
          type: 'Concert',
          images: ['https://example.com/banner.jpg'],
          date: '2026-12-25T18:00:00.000Z',
          endDate: '2026-12-25T23:00:00.000Z',
          time: '06:00 PM',
          location: 'Gachibowli Stadium',
          city: 'Hyderabad',
          availability: true,
          totalSeats: 5000,
          availableSeats: 4500,
          language: 'Telugu',
          ageLimit: '18+',
          duration: '3h 30m',
          organizer: 'BigTV Live',
          terms: 'Standard terms',
          status: 'UPCOMING',
        },
      ];

      render(
        <EventsTable
          events={mockEvents}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
          translations={{ btnEdit: 'Edit', btnDelete: 'Delete' }}
        />
      );

      expect(screen.getByText('Sunburn Fest 2026')).toBeInTheDocument();
      expect(screen.getByText('sunburn-2026')).toBeInTheDocument();

      const editBtn = screen.getByLabelText('Edit');
      fireEvent.click(editBtn);
      expect(onEdit).toHaveBeenCalledWith(mockEvents[0]);

      const deleteBtn = screen.getByLabelText('Delete');
      fireEvent.click(deleteBtn);
      expect(onDelete).toHaveBeenCalledWith('evt-001');

      const toggleSwitch = screen.getByRole('checkbox');
      fireEvent.click(toggleSwitch);
      expect(onToggleAvailability).toHaveBeenCalledWith('evt-001');
    });

    it('renders TicketsTable details and triggers edit button', () => {
      const onEdit = jest.fn();
      const mockTickets: TicketTypeItem[] = [
        {
          id: 'tkt-1',
          eventId: 'evt-001',
          eventName: 'Sunburn 2026',
          name: 'VIP Pass',
          price: 2500,
          totalQuantity: 500,
          availableQuantity: 450,
          description: 'VIP Access',
          isActive: true,
        },
      ];

      render(
        <TicketsTable
          tickets={mockTickets}
          onEdit={onEdit}
          onToggleStatus={jest.fn()}
          onDelete={jest.fn()}
          translations={{ colTicketTier: 'Ticket Tier Name', btnEdit: 'Edit' }}
        />
      );

      expect(screen.getAllByText('VIP Pass')[0]).toBeInTheDocument();
      expect(screen.getByText('₹2500')).toBeInTheDocument();

      const editBtn = screen.getByLabelText('Edit');
      fireEvent.click(editBtn);
      expect(onEdit).toHaveBeenCalledWith(mockTickets[0]);
    });

    it('renders CouponsTable details and triggers edit button', () => {
      const onEdit = jest.fn();
      const mockCoupons: CouponItem[] = [
        {
          id: 'cpn-1',
          code: 'EARLYBIRD20',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          totalUsageLimit: 500,
          usageCount: 50,
          validUntil: '2026-12-31T23:59:59.000Z',
          isActive: true,
        },
      ];

      render(
        <CouponsTable
          coupons={mockCoupons}
          onEdit={onEdit}
          onToggleStatus={jest.fn()}
          onDelete={jest.fn()}
          translations={{ colCouponCode: 'Promo Code', btnEdit: 'Edit' }}
        />
      );

      expect(screen.getByText('EARLYBIRD20')).toBeInTheDocument();
      expect(screen.getByText('20% OFF')).toBeInTheDocument();

      const editBtn = screen.getByLabelText('Edit');
      fireEvent.click(editBtn);
      expect(onEdit).toHaveBeenCalledWith(mockCoupons[0]);
    });

    it('renders TicketModal and submits ticket form', () => {
      const onSave = jest.fn();
      render(
        <TicketModal
          open={true}
          onClose={jest.fn()}
          onSave={onSave}
          events={[]}
          translations={{ modalAddTicketTitle: 'Add Ticket Category' }}
        />
      );

      expect(screen.getAllByText('Add Ticket Category')[0]).toBeInTheDocument();
      const formElement = document.querySelector('form');
      if (formElement) fireEvent.submit(formElement);
      expect(onSave).toHaveBeenCalled();
    });

    it('renders CouponModal and submits coupon form', () => {
      const onSave = jest.fn();
      render(
        <CouponModal
          open={true}
          onClose={jest.fn()}
          onSave={onSave}
          events={[]}
          translations={{ modalAddCouponTitle: 'Create Promo Coupon' }}
        />
      );

      expect(screen.getAllByText('Create Promo Coupon')[0]).toBeInTheDocument();
      const formElement = document.querySelector('form');
      if (formElement) fireEvent.submit(formElement);
      expect(onSave).toHaveBeenCalled();
    });

    it('renders AppConfigPanel feature flags and toggles switch', () => {
      const onUpdateConfig = jest.fn();
      const mockConfig: AppConfigItem = {
        id: 'cfg-1',
        key: 'default',
        webEnable: true,
        eventsEnable: true,
        folkNight: true,
        cricket: true,
        bannersEnable: true,
        razorpayKeyId: 'rzp_test_123',
        isTestMode: true,
        maintenanceMode: false,
      };

      render(
        <AppConfigPanel
          config={mockConfig}
          onUpdateConfig={onUpdateConfig}
          translations={{ configFeatureFlagsTitle: 'Feature Flags & System Controls' }}
        />
      );

      expect(screen.getByText('Feature Flags & System Controls')).toBeInTheDocument();
      expect(screen.getByText('Events & Ticket Booking System')).toBeInTheDocument();

      const switches = screen.getAllByRole('checkbox');
      fireEvent.click(switches[0]);
      expect(onUpdateConfig).toHaveBeenCalledWith({ eventsEnable: false });
    });

    it('renders EventDrawer component and submits full event form', () => {
      const handleSave = jest.fn();
      render(
        <EventDrawer
          open={true}
          onClose={jest.fn()}
          onSave={handleSave}
          translations={{ drawerAddTitle: 'Create New Event', btnSave: 'Save Event' }}
        />
      );

      expect(screen.getByText('Create New Event')).toBeInTheDocument();

      const formElement = document.querySelector('form');
      expect(formElement).not.toBeNull();
      if (formElement) {
        fireEvent.submit(formElement);
      }

      expect(handleSave).toHaveBeenCalled();
    });
  });

  describe('EventsPage Component & Tab Switching', () => {
    it('renders top tabs (Events, Ticket Types, Discount Coupons, App Config) and switches tabs', async () => {
      render(<EventsPage />);

      expect(screen.getByText(/Events & Booking CMS/i)).toBeInTheDocument();

      // Check tab buttons
      const ticketTab = screen.getByRole('tab', { name: /Ticket Types|Tickets/i });
      const couponTab = screen.getByRole('tab', { name: /Discount Coupons|Coupons/i });
      const configTab = screen.getByRole('tab', { name: /App Config|Config/i });

      expect(ticketTab).toBeInTheDocument();
      expect(couponTab).toBeInTheDocument();
      expect(configTab).toBeInTheDocument();

      // Switch to Ticket Types tab
      fireEvent.click(ticketTab);
      await waitFor(() => {
        expect(screen.getByTestId('tickets-table')).toBeInTheDocument();
      });

      // Switch to Coupons tab
      fireEvent.click(couponTab);
      await waitFor(() => {
        expect(screen.getByTestId('coupons-table')).toBeInTheDocument();
      });

      // Switch to Config tab
      fireEvent.click(configTab);
      await waitFor(() => {
        expect(screen.getByTestId('app-config-panel')).toBeInTheDocument();
      });
    });
  });
});

import {
  EventItem,
  EventStats,
  CreateEventInput,
  UpdateEventInput,
  TicketTypeItem,
  CreateTicketTypeInput,
  UpdateTicketTypeInput,
  CouponItem,
  CreateCouponInput,
  UpdateCouponInput,
  AppConfigItem,
} from '../domain/event.types';
import { eventsApiClient, apiClient } from '@/core/api/api-client';

const client = eventsApiClient || apiClient;

const initialMockEvents: EventItem[] = [
  {
    id: 'e4d962de-5393-4541-a792-4c23f1429f9c',
    name: 'BIGTV Folk Night Patala Jatahra 2026',
    code: 'Bigtv-2026',
    description: 'The Big Folk Night 2025 was a massive cultural celebration organized by BIG TV at the LB Stadium in Hyderabad on August 23, 2025. Starting at 6:00 PM, the grand event brought together over 50 renowned folk artists for a dynamic 3.5-hour concert showcasing traditional music and heritage.',
    type: 'Concert',
    images: [
      'https://i.ibb.co/bRbkYdyY/folknight4.png',
      'https://i.ibb.co/7tSv7RBb/folknight3.png',
      'https://i.ibb.co/w1PX2vg/folknight2.png',
      'https://i.ibb.co/F4nHC5Db/folknight1.png'
    ],
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
    createdAt: '2026-09-13T11:26:46.901Z',
    updatedAt: '2026-09-13T11:26:46.901Z',
  },
  {
    id: 'evt-002',
    name: 'Tollywood Film Awards Gala',
    code: 'tfa-2026',
    description: 'Annual grand celebration of Telugu Cinema excellence and star performances.',
    type: 'Awards Show',
    images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80'],
    date: '2026-10-15T19:00:00.000Z',
    endDate: '2026-10-15T23:00:00.000Z',
    time: '07:00 PM',
    location: 'HICC Novotel',
    city: 'Hyderabad',
    availability: true,
    totalSeats: 3000,
    availableSeats: 450,
    language: 'Telugu',
    ageLimit: 'All Ages',
    duration: '4h 00m',
    organizer: 'BigTV Media & Entertainment',
    terms: 'Formal attire required. Ticket scanning at main gate.',
    status: 'UPCOMING',
    createdAt: '2026-09-05T12:00:00.000Z',
  },
];

let localEventsStore: EventItem[] = [...initialMockEvents];

let localTicketsStore: TicketTypeItem[] = [
  {
    id: 'd98b4bb5-629f-46c7-a1a3-ff684ad15232',
    eventId: 'e4d962de-5393-4541-a792-4c23f1429f9c',
    eventName: 'BIGTV Folk Night Patala Jatahra 2026',
    name: 'Gold',
    price: 2000,
    totalQuantity: 100,
    availableQuantity: 100,
    description: 'Front row seats + VIP Lounge access',
    isActive: true,
  },
  {
    id: '7eb302ab-1669-491e-88d0-faa740d93f52',
    eventId: 'e4d962de-5393-4541-a792-4c23f1429f9c',
    eventName: 'BIGTV Folk Night Patala Jatahra 2026',
    name: 'Silver',
    price: 2000,
    totalQuantity: 100,
    availableQuantity: 100,
    description: 'Front row seats',
    isActive: true,
  },
  {
    id: '7d508dfd-e843-4339-800d-c599a7d16fec',
    eventId: 'e4d962de-5393-4541-a792-4c23f1429f9c',
    eventName: 'BIGTV Folk Night Patala Jatahra 2026',
    name: 'Bronze',
    price: 2000,
    totalQuantity: 100,
    availableQuantity: 100,
    description: 'Back row seats',
    isActive: true,
  },
];

let localCouponsStore: CouponItem[] = [
  {
    id: '24e68ba2-5996-4bff-8ab8-6722176dd815',
    code: 'FN300',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 500,
    totalUsageLimit: 100,
    usageCount: 0,
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2026-12-31T23:59:59.000Z',
    eventId: 'e4d962de-5393-4541-a792-4c23f1429f9c',
    eventCode: 'Bigtv-2026',
    isActive: true,
  },
];

let localAppConfigStore: AppConfigItem = {
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
};

export const eventsRepository = {
  // --- Events ---
  async getEvents(search?: string, city?: string, status?: string, page: number = 1, limit: number = 10): Promise<EventItem[]> {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (city && city !== 'ALL') params.city = city;
      if (status && status !== 'ALL') params.status = status;

      const res: any = await client.get('/events', params);
      if (res) {
        if (Array.isArray(res.data)) return res.data;
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
      }
    } catch {}

    let filtered = [...localEventsStore];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }
    if (city && city !== 'ALL') {
      filtered = filtered.filter((e) => e.city.toLowerCase() === city.toLowerCase());
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter((e) => e.status === status);
    }
    return filtered;
  },

  async getStats(): Promise<EventStats> {
    try {
      const res: any = await client.get('/events/stats');
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    const totalEvents = localEventsStore.length;
    const upcomingEvents = localEventsStore.filter((e) => e.status === 'UPCOMING').length;
    const liveEvents = localEventsStore.filter((e) => e.status === 'LIVE').length;
    const completedEvents = localEventsStore.filter((e) => e.status === 'COMPLETED').length;
    const totalSeats = localEventsStore.reduce((acc, e) => acc + (e.totalSeats || 0), 0);
    const availableSeats = localEventsStore.reduce((acc, e) => acc + (e.availableSeats || 0), 0);

    return {
      totalEvents,
      upcomingEvents,
      liveEvents,
      completedEvents,
      totalSeats,
      availableSeats,
    };
  },

  async createEvent(input: CreateEventInput): Promise<EventItem> {
    const payload = { ...input };
    delete (payload as any).language;
    try {
      const res: any = await client.post('/events', payload);
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    const newEvent: EventItem = {
      ...input,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    localEventsStore.unshift(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, input: UpdateEventInput): Promise<EventItem> {
    const payload = { ...input };
    delete (payload as any).language;
    try {
      let res: any;
      try {
        res = await client.put(`/events/${id}`, payload);
      } catch {
        res = await client.patch(`/events/${id}`, payload);
      }
      if (res && res.data) {
        return res.data;
      }
    } catch {}

    const index = localEventsStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      localEventsStore[index] = { ...localEventsStore[index], ...input, updatedAt: new Date().toISOString() };
      return localEventsStore[index];
    }
    throw new Error('Event not found');
  },

  async deleteEvent(id: string): Promise<boolean> {
    try {
      await client.delete(`/events/${id}`);
      localEventsStore = localEventsStore.filter((e) => e.id !== id);
      return true;
    } catch {
      localEventsStore = localEventsStore.filter((e) => e.id !== id);
      return true;
    }
  },

  async toggleAvailability(id: string): Promise<EventItem> {
    const event = localEventsStore.find((e) => e.id === id);
    if (!event) throw new Error('Event not found');
    return this.updateEvent(id, { availability: !event.availability });
  },

  // --- Ticket Types ---
  async getTicketTypes(eventId?: string): Promise<TicketTypeItem[]> {
    const targetId = eventId && eventId !== 'ALL' ? eventId : (localEventsStore[0]?.id || 'e4d962de-5393-4541-a792-4c23f1429f9c');
    try {
      const res: any = await client.get(`/events/${targetId}/ticket-types`);
      if (res && res.data && Array.isArray(res.data)) {
        localTicketsStore = res.data;
        return res.data;
      }
    } catch {}

    try {
      const res: any = await client.get('/ticket-types');
      if (res && res.data && Array.isArray(res.data)) {
        localTicketsStore = res.data;
        return res.data;
      }
    } catch {}

    if (eventId && eventId !== 'ALL') {
      return localTicketsStore.filter((t) => t.eventId === eventId);
    }
    return localTicketsStore;
  },

  async createTicketType(input: CreateTicketTypeInput): Promise<TicketTypeItem> {
    const payload = { ...input };
    delete (payload as any).language;
    try {
      const res: any = await client.post(`/events/${input.eventId}/ticket-types`, payload);
      if (res && res.data) return res.data;
    } catch {}

    const matchedEvent = localEventsStore.find((e) => e.id === input.eventId);
    const newTicket: TicketTypeItem = {
      ...input,
      id: `tkt-${Date.now()}`,
      eventName: matchedEvent ? matchedEvent.name : 'General Event',
    };
    localTicketsStore.unshift(newTicket);
    return newTicket;
  },

  async updateTicketType(id: string, input: Partial<CreateTicketTypeInput>): Promise<TicketTypeItem> {
    const payload = { ...input };
    delete (payload as any).language;
    try {
      let res: any;
      try {
        res = await client.put(`/ticket-types/${id}`, payload);
      } catch {
        res = await client.patch(`/ticket-types/${id}`, payload);
      }
      if (res && res.data) return res.data;
    } catch {}

    const index = localTicketsStore.findIndex((t) => t.id === id);
    if (index !== -1) {
      localTicketsStore[index] = { ...localTicketsStore[index], ...input };
      return localTicketsStore[index];
    }
    return {
      id,
      eventId: input.eventId || '',
      name: input.name || 'Ticket Tier',
      price: input.price || 0,
      totalQuantity: input.totalQuantity || 100,
      availableQuantity: input.availableQuantity || 100,
      description: input.description || '',
      isActive: input.isActive ?? true,
    };
  },

  async toggleTicketStatus(id: string, currentStatus?: boolean): Promise<TicketTypeItem> {
    const ticket = localTicketsStore.find((t) => t.id === id);
    const newStatus = typeof currentStatus === 'boolean' ? !currentStatus : (ticket ? !ticket.isActive : true);
    try {
      const res: any = await client.patch(`/ticket-types/${id}/status`, { isActive: newStatus });
      if (res && res.data) return res.data;
    } catch {}

    if (ticket) {
      ticket.isActive = newStatus;
      return ticket;
    }
    return {
      id,
      eventId: '',
      name: 'Ticket Tier',
      price: 0,
      totalQuantity: 100,
      availableQuantity: 100,
      description: '',
      isActive: newStatus,
    };
  },

  async deleteTicketType(id: string): Promise<boolean> {
    try {
      await client.delete(`/ticket-types/${id}`);
    } catch {}

    localTicketsStore = localTicketsStore.filter((t) => t.id !== id);
    return true;
  },

  // --- Coupons ---
  async getCoupons(): Promise<CouponItem[]> {
    try {
      const res: any = await client.get('/coupons');
      if (res && res.data && Array.isArray(res.data)) {
        localCouponsStore = res.data;
        return res.data;
      }
    } catch {}
    return localCouponsStore;
  },

  async createCoupon(input: CreateCouponInput): Promise<CouponItem> {
    const payload = { ...input };
    delete (payload as any).language;
    delete (payload as any).eventCode;
    if (!payload.eventId) {
      delete (payload as any).eventId;
    }
    try {
      const res: any = await client.post('/coupons', payload);
      if (res && res.data) return res.data;
    } catch {}

    const newCoupon: CouponItem = {
      ...input,
      id: `cpn-${Date.now()}`,
      usageCount: 0,
    };
    localCouponsStore.unshift(newCoupon);
    return newCoupon;
  },

  async updateCoupon(id: string, input: UpdateCouponInput): Promise<CouponItem> {
    const payload = { ...input };
    delete (payload as any).language;
    delete (payload as any).eventCode;
    if ('eventId' in payload && !payload.eventId) {
      delete (payload as any).eventId;
    }
    try {
      let res: any;
      try {
        res = await client.patch(`/coupons/${id}`, payload);
      } catch {
        res = await client.put(`/coupons/${id}`, payload);
      }
      if (res && res.data) return res.data;
    } catch {}

    const index = localCouponsStore.findIndex((c) => c.id === id);
    if (index !== -1) {
      localCouponsStore[index] = { ...localCouponsStore[index], ...input };
      return localCouponsStore[index];
    }
    return {
      id,
      code: input.code || 'PROMO',
      discountType: input.discountType || 'PERCENTAGE',
      discountValue: input.discountValue || 0,
      totalUsageLimit: input.totalUsageLimit || 100,
      usageCount: 0,
      validUntil: input.validUntil || '',
      isActive: input.isActive ?? true,
    };
  },

  async toggleCouponStatus(id: string, currentIsActive?: boolean): Promise<CouponItem> {
    const coupon = localCouponsStore.find((c) => c.id === id);
    const newStatus = typeof currentIsActive === 'boolean' ? !currentIsActive : (coupon ? !coupon.isActive : false);
    try {
      let res: any;
      try {
        res = await client.patch(`/coupons/${id}`, { isActive: newStatus });
      } catch {
        res = await client.patch(`/coupons/${id}/status`, { isActive: newStatus });
      }
      const updatedItem = res?.data?.data || res?.data || res;
      if (coupon) coupon.isActive = newStatus;
      const index = localCouponsStore.findIndex((c) => c.id === id);
      const itemToReturn: CouponItem =
        typeof updatedItem === 'object' && updatedItem?.id
          ? { ...updatedItem, isActive: newStatus }
          : {
              id,
              code: coupon?.code || 'PROMO',
              discountType: 'PERCENTAGE',
              discountValue: 20,
              totalUsageLimit: 100,
              usageCount: 0,
              validUntil: '',
              isActive: newStatus,
            };

      if (index !== -1) {
        localCouponsStore[index] = { ...localCouponsStore[index], ...itemToReturn };
      } else {
        localCouponsStore.unshift(itemToReturn);
      }
      return itemToReturn;
    } catch {}

    if (coupon) {
      coupon.isActive = newStatus;
      return coupon;
    }

    const fallback: CouponItem = {
      id,
      code: 'PROMO',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      totalUsageLimit: 100,
      usageCount: 0,
      validUntil: '',
      isActive: newStatus,
    };
    localCouponsStore.unshift(fallback);
    return fallback;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      await client.delete(`/coupons/${id}`);
    } catch {}

    localCouponsStore = localCouponsStore.filter((c) => c.id !== id);
    return true;
  },

  // --- App Config ---
  async getAppConfig(): Promise<AppConfigItem> {
    try {
      const res: any = await client.get('/app-config');
      if (res && res.data) return res.data;
    } catch {}
    return localAppConfigStore;
  },

  async updateAppConfig(input: Partial<AppConfigItem>): Promise<AppConfigItem> {
    try {
      const res: any = await client.patch('/app-config/default', input);
      if (res && res.data) return res.data;
    } catch {}

    localAppConfigStore = { ...localAppConfigStore, ...input };
    return localAppConfigStore;
  },
};

export type EventStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface EventItem {
  id: string;
  name: string;
  code: string;
  description: string;
  type: string;
  images: string[];
  date: string;
  endDate: string;
  time: string;
  location: string;
  city: string;
  availability: boolean;
  totalSeats: number;
  availableSeats: number;
  language: string;
  ageLimit: string;
  duration: string;
  organizer: string;
  terms: string;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  liveEvents: number;
  completedEvents: number;
  totalSeats: number;
  availableSeats: number;
}

export interface CreateEventInput {
  name: string;
  code: string;
  description: string;
  type: string;
  images: string[];
  date: string;
  endDate: string;
  time: string;
  location: string;
  city: string;
  availability: boolean;
  totalSeats: number;
  availableSeats: number;
  language: string;
  ageLimit: string;
  duration: string;
  organizer: string;
  terms: string;
  status: EventStatus;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {}

// --- Ticket Types ---
export interface TicketTypeItem {
  id: string;
  eventId: string;
  eventName?: string;
  name: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  description: string;
  isActive: boolean;
}

export interface CreateTicketTypeInput {
  eventId: string;
  name: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  description: string;
  isActive: boolean;
}

export interface UpdateTicketTypeInput extends Partial<CreateTicketTypeInput> {}

// --- Discount Coupons ---
export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface CouponItem {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  totalUsageLimit: number;
  usageCount: number;
  validFrom?: string;
  validUntil: string;
  eventId?: string;
  eventCode?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponInput {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  totalUsageLimit: number;
  validFrom?: string;
  validUntil: string;
  eventId?: string;
  eventCode?: string;
  isActive: boolean;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}

// --- App Config & Feature Flags ---
export interface AppConfigItem {
  id: string;
  key: string;
  webEnable: boolean;
  eventsEnable: boolean;
  folkNight: boolean;
  cricket: boolean;
  bannersEnable: boolean;
  razorpayKeyId: string;
  razorpayKeySecret?: string;
  isTestMode: boolean;
  maintenanceMode: boolean;
}

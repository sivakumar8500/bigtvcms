export interface User {
  userId: number;
  name: string;
  username: string;
  password?: string;
  location: string;
  role?: 'superadmin' | 'admin' | 'creator' | 'epaper_creator' | 'movie_creator' | 'notification_creator' | string;
  userType?: string;
  languageCode?: string | null;
  isActive: boolean;
  imageUrl?: string;
}


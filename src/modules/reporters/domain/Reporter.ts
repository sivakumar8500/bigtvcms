export type ReporterLanguage = 'te' | 'en' | 'ml';
export type ReporterLanguageCode = 'te' | 'en' | 'ml' | 'all';

export interface SegregatedReporters {
  te: Reporter[];
  en: Reporter[];
  ml: Reporter[];
}

export interface ReporterEmployment {
  employeeId?: string;
  type?: string;
  status?: string;
  designation?: string;
  department?: string;
  role?: string;
  bureau?: string;
  joiningDate?: string;
  workEmail?: string;
  workPhone?: string;
}

export interface ReporterMediaChannel {
  id?: string;
  name?: string;
  type?: string;
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  address?: {
    addressLine1?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface ReporterSocialMediaProfiles {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface ReporterLocation {
  city?: string;
  state?: string;
}

export interface Reporter {
  id: string;
  name: string;
  language?: ReporterLanguage;
  profileImageUrl?: string;
  bio?: string;
  languages?: string[];
  specializations?: string[];
  isActive: boolean;
  isVerified: boolean;
  employment?: ReporterEmployment;
  mediaChannel?: ReporterMediaChannel;
  socialMediaProfiles?: ReporterSocialMediaProfiles;
  location?: ReporterLocation;
  createdAt?: string;
  updatedAt?: string;
}

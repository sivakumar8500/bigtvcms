export interface StateNameTranslations {
  en?: string;
  te?: string;
  hi?: string;
  ml?: string;
}

export interface StateResponseDto {
  locationId?: number;
  location_id?: number;
  state_id?: number;
  stateId?: number;
  locationName?: string;
  location_name?: string;
  state_name?: string;
  stateName?: string;
  locationNameTranslations?: StateNameTranslations;
  stateNameTranslations?: StateNameTranslations;
  translations?: StateNameTranslations;
  value?: string;
  imageUrl?: string;
  image_url?: string;
  isFollowed?: boolean;
  is_followed?: boolean;
  isActive?: boolean;
  is_active?: boolean;
  status?: boolean;
}

export interface CreateStateDto {
  translations: {
    en: string;
    te: string;
    ml: string;
  };
  image_url?: string;
  is_active: boolean;
}

export interface UpdateStateDto {
  translations?: {
    en?: string;
    te?: string;
    ml?: string;
  };
  image_url?: string;
  is_active?: boolean;
}

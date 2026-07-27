export interface StateNameTranslations {
  en?: string;
  te?: string;
  hi?: string;
  ml?: string;
}

export interface StateResponseDto {
  state_id?: number;
  stateId?: number;
  state_name?: string;
  stateName?: string;
  stateNameTranslations?: StateNameTranslations;
  translations?: StateNameTranslations;
  value?: string;
  isActive?: boolean;
  is_active?: boolean;
  status?: boolean;
}

export interface CreateStateDto {
  translations: {
    en?: string;
    te?: string;
    ml?: string;
  };
  is_active: boolean;
}

export interface UpdateStateDto {
  translations?: {
    en?: string;
    te?: string;
    ml?: string;
  };
  is_active?: boolean;
}

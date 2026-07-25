export interface StateNameTranslations {
  en?: string;
  te?: string;
  hi?: string;
  ml?: string;
}

export interface StateResponseDto {
  stateId: number;
  stateName: string;
  stateNameTranslations?: StateNameTranslations;
  value?: string;
  isActive?: boolean;
  status?: boolean;
}

export interface CreateStateDto {
  state_name_en: string;
  state_name_te: string;
  state_name_ml?: string;
  state_name_hi?: string;
  status: boolean;
}

export interface UpdateStateDto {
  state_name_en?: string;
  state_name_te?: string;
  state_name_ml?: string;
  state_name_hi?: string;
  is_active?: boolean;
  status?: boolean;
}

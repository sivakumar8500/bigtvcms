export interface AiTagDto {
  aitagid: number;
  aitagname: string;
  aitagnameTranslations?: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  imageUrl?: string;
  is_active?: boolean;
}

export interface CreateAiTagDto {
  name_en: string;
  name_te: string;
  name_hi?: string;
  name_ml: string;
  image_url?: string;
  device_id?: string;
}

export interface CreateAiTagResponse {
  message: string;
  data: AiTagDto;
}

export interface UpdateAiTagDto {
  name_en: string;
  name_te: string;
  name_hi?: string;
  name_ml: string;
  image_url?: string;
  device_id?: string;
  is_active?: boolean;
}

export interface UpdateAiTagResponse {
  message: string;
  data: AiTagDto;
}


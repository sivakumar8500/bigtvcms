export interface GroqKeyStatusResponse {
  latest_key?: string;
  active_key?: string;
  total_keys?: number;
  keys?: string[];
  model?: string;
  status?: string;
}

export interface GroqKeyUpdatePayload {
  groq_api_key: string;
}

export interface GroqKeyUpdateResponse {
  status?: string;
  message?: string;
  active_key?: string;
  env_updated?: boolean;
}

export interface GroqKeyTranslations {
  groqKeyTitle: string;
  groqKeyDescription: string;
  groqKeyLabel: string;
  groqKeyPlaceholder: string;
  updateKey: string;
  savingKey: string;
  keySavedSuccess: string;
  keySaveError: string;
  fetchError: string;
  modelStatusLabel?: string;
  systemStatusLabel?: string;
}

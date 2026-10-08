export interface VoiceProfile {
  name: string;
  voice_id: string;
}

export interface VoicesResponse {
  success: boolean;
  data: {
    voices: VoiceProfile[];
  };
  timestamp: string;
}

export interface TTSRequest {
  text: string;
  voice_id: string;
}

export interface TTSResponse {
  success: boolean;
  data: {
    message: string;
    filename: string;
    audio_path: string;
  };
  timestamp: string;
}

export interface AudioFileItem {
  filename: string;
  audio_path: string;
  size_bytes: number;
  created_at: string;
}

export interface GetAudioFilesResponse {
  success: boolean;
  data: {
    files: AudioFileItem[];
  };
  timestamp: string;
}

export interface DeleteAudioFileResponse {
  success: boolean;
  data: {
    message: string;
    filename: string;
  };
  timestamp: string;
}

export interface APIErrorResponse {
  success: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
}

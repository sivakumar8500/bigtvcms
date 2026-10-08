import { VoiceProfile, TTSResponse, AudioFileItem } from '../domain/tts.model';

export const getTtsApiBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_TTS_API_BASE_URL ||
    'https://api.pravasamedia.com'
  ).replace(/\/$/, '');
};

export class TTSService {
  /**
   * Fetch available voice profiles
   */
  static async getVoices(): Promise<VoiceProfile[]> {
    const baseUrl = getTtsApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/voices`);

    if (!response.ok) {
      throw new Error(`Failed to load voices: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data?.voices || json.voices || [];
  }

  /**
   * Generate Telugu Speech audio from text
   */
  static async generateSpeech(text: string, voiceId: string): Promise<TTSResponse['data']> {
    const baseUrl = getTtsApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      throw new Error(errorMessage || 'Failed to generate audio');
    }

    return json.data || json;
  }

  /**
   * Fetch all generated speech audio files
   */
  static async getAudioFiles(): Promise<AudioFileItem[]> {
    const baseUrl = getTtsApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/tts/files`);

    if (!response.ok) {
      throw new Error(`Failed to fetch audio files: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data?.files || [];
  }

  /**
   * Delete a specific speech audio file by filename
   */
  static async deleteAudioFile(filename: string): Promise<{ message: string; filename: string }> {
    const baseUrl = getTtsApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/tts/files/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Failed to delete file ${filename}`);
    }

    return json.data || json;
  }

  /**
   * Construct full URL for generated audio file
   */
  static getAudioUrl(audioPath: string): string {
    if (!audioPath) return '';
    if (audioPath.startsWith('http://') || audioPath.startsWith('https://')) {
      return audioPath;
    }
    const baseUrl = getTtsApiBaseUrl();
    const cleanPath = audioPath.startsWith('/') ? audioPath : `/${audioPath}`;
    return `${baseUrl}${cleanPath}`;
  }
}

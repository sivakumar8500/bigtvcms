import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceProfile, AudioFileItem } from '../domain/tts.model';
import { TTSService } from '../services/ttsService';

export function useTeluguTTS() {
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [loadingVoices, setLoadingVoices] = useState<boolean>(true);

  const [audioFiles, setAudioFiles] = useState<AudioFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);

  const [generating, setGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch audio files library
  const fetchFiles = useCallback(async () => {
    try {
      setLoadingFiles(true);
      const files = await TTSService.getAudioFiles();
      setAudioFiles(files);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch audio files';
      setError(msg);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  // Load voices & audio files on initial mount
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        setLoadingVoices(true);
        const data = await TTSService.getVoices();
        if (isMounted) {
          setVoices(data);
          if (data.length > 0) {
            setSelectedVoice(data[0].voice_id);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load voices';
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoadingVoices(false);
        }
      }

      await fetchFiles();
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchFiles]);

  // Generate speech
  const synthesizeText = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter text to synthesize.');
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice profile.');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      const result = await TTSService.generateSpeech(text, selectedVoice);
      const fullUrl = TTSService.getAudioUrl(result.audio_path);
      setAudioUrl(fullUrl);

      // Auto-play generated audio
      if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
        const newAudio = new Audio(fullUrl);
        audioRef.current = newAudio;

        newAudio.onended = () => setIsPlaying(false);
        newAudio.onerror = () => setError('Audio playback failed.');

        try {
          const playPromise = newAudio.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        } catch {
          // Playback might be blocked by browser autoplay policy
          setIsPlaying(false);
        }
      }

      // Refresh list after generating
      await fetchFiles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Speech generation failed.';
      setError(msg);
    } finally {
      setGenerating(false);
    }
  };

  // Delete an audio file
  const removeAudioFile = async (filename: string) => {
    try {
      setError(null);
      await TTSService.deleteAudioFile(filename);
      // Remove deleted file from state
      setAudioFiles((prev) => prev.filter((file) => file.filename !== filename));
      if (audioUrl && audioUrl.includes(filename)) {
        setAudioUrl(null);
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete audio file';
      setError(msg);
    }
  };

  // Toggle Play / Pause
  const togglePlayPause = (url?: string) => {
    const targetUrl = url || audioUrl;
    if (!targetUrl) return;

    if (audioRef.current && audioUrl === targetUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAudioUrl(targetUrl);
      if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
        const newAudio = new Audio(targetUrl);
        audioRef.current = newAudio;
        newAudio.onended = () => setIsPlaying(false);
        newAudio.onerror = () => setError('Audio playback failed.');
        const playPromise = newAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    }
  };

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    loadingVoices,
    audioFiles,
    loadingFiles,
    fetchFiles,
    generating,
    audioUrl,
    isPlaying,
    error,
    synthesizeText,
    removeAudioFile,
    togglePlayPause,
  };
}

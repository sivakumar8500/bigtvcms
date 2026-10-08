import { renderHook, act, waitFor } from '@testing-library/react';
import { TTSService, getTtsApiBaseUrl } from '../services/ttsService';
import { useTeluguTTS } from '../hooks/useTeluguTTS';

describe('TTSService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('getTtsApiBaseUrl returns process.env URL or fallback', () => {
    const url = getTtsApiBaseUrl();
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
  });

  test('getVoices fetches voice profiles successfully', async () => {
    const mockVoices = [
      { name: 'Telugu Female 1', voice_id: 'voice_1' },
      { name: 'Telugu Male 1', voice_id: 'voice_2' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { voices: mockVoices } }),
    } as Response);

    const result = await TTSService.getVoices();
    expect(result).toEqual(mockVoices);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/voices'));
  });

  test('getVoices handles direct voices field in json', async () => {
    const mockVoices = [{ name: 'Voice Direct', voice_id: 'vd' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ voices: mockVoices }),
    } as Response);

    const result = await TTSService.getVoices();
    expect(result).toEqual(mockVoices);
  });

  test('getVoices throws error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(TTSService.getVoices()).rejects.toThrow('Failed to load voices: Internal Server Error');
  });

  test('generateSpeech generates speech audio successfully', async () => {
    const mockResponse = {
      message: 'Generated',
      filename: 'speech_123.mp3',
      audio_path: '/outputs/speech_123.mp3',
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    } as Response);

    const result = await TTSService.generateSpeech('నమస్తే', 'voice_1');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/tts'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'నమస్తే', voice_id: 'voice_1' }),
      })
    );
  });

  test('generateSpeech handles array error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: ['text is required', 'voice_id invalid'] }),
    } as Response);

    await expect(TTSService.generateSpeech('', '')).rejects.toThrow('text is required, voice_id invalid');
  });

  test('generateSpeech handles fallback error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    await expect(TTSService.generateSpeech('test', 'v1')).rejects.toThrow('Failed to generate audio');
  });

  test('getAudioFiles returns file list successfully', async () => {
    const mockFiles = [
      { filename: 'file1.mp3', audio_path: '/outputs/file1.mp3', size_bytes: 2048, created_at: '2026-10-08T10:00:00Z' },
    ];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { files: mockFiles } }),
    } as Response);

    const result = await TTSService.getAudioFiles();
    expect(result).toEqual(mockFiles);
  });

  test('getAudioFiles throws error when response fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response);

    await expect(TTSService.getAudioFiles()).rejects.toThrow('Failed to fetch audio files: Not Found');
  });

  test('deleteAudioFile deletes file successfully', async () => {
    const mockRes = { message: 'Deleted', filename: 'file1.mp3' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockRes }),
    } as Response);

    const result = await TTSService.deleteAudioFile('file1.mp3');
    expect(result).toEqual(mockRes);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/tts/files/file1.mp3'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test('deleteAudioFile throws error when API fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'File not found' }),
    } as Response);

    await expect(TTSService.deleteAudioFile('missing.mp3')).rejects.toThrow('File not found');
  });

  test('getAudioUrl constructs valid URLs', () => {
    expect(TTSService.getAudioUrl('')).toBe('');
    expect(TTSService.getAudioUrl('http://example.com/audio.mp3')).toBe('http://example.com/audio.mp3');
    expect(TTSService.getAudioUrl('https://example.com/audio.mp3')).toBe('https://example.com/audio.mp3');
    expect(TTSService.getAudioUrl('/outputs/test.mp3')).toContain('/outputs/test.mp3');
    expect(TTSService.getAudioUrl('outputs/test.mp3')).toContain('/outputs/test.mp3');
  });
});

describe('useTeluguTTS', () => {
  const originalAudio = global.Audio;

  beforeEach(() => {
    class MockAudio {
      src: string;
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      paused = true;

      constructor(src: string) {
        this.src = src;
      }

      play() {
        this.paused = false;
        return Promise.resolve();
      }

      pause() {
        this.paused = true;
      }
    }

    (global as any).Audio = MockAudio;
  });

  afterEach(() => {
    (global as any).Audio = originalAudio;
    jest.restoreAllMocks();
  });

  test('loads voices and files on initial mount', async () => {
    const mockVoices = [{ name: 'Voice 1', voice_id: 'v1' }];
    const mockFiles = [{ filename: 'test.mp3', audio_path: '/outputs/test.mp3', size_bytes: 1000, created_at: '2026-10-08T10:00:00Z' }];

    jest.spyOn(TTSService, 'getVoices').mockResolvedValue(mockVoices);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue(mockFiles);

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    expect(result.current.voices).toEqual(mockVoices);
    expect(result.current.selectedVoice).toBe('v1');
    expect(result.current.audioFiles).toEqual(mockFiles);
  });

  test('handles failure when loading voices or fetching files', async () => {
    jest.spyOn(TTSService, 'getVoices').mockRejectedValue(new Error('Voice load error'));
    jest.spyOn(TTSService, 'getAudioFiles').mockRejectedValue(new Error('Fetch files error'));

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });

  test('synthesizeText fails on empty text or voice', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    act(() => {
      result.current.synthesizeText('');
    });
    expect(result.current.error).toBe('Please enter text to synthesize.');

    act(() => {
      result.current.synthesizeText('నమస్తే');
    });
    expect(result.current.error).toBe('Please select a voice profile.');
  });

  test('synthesizeText handles speech generation error', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([{ name: 'v1', voice_id: 'v1' }]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);
    jest.spyOn(TTSService, 'generateSpeech').mockRejectedValue(new Error('Backend error'));

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.selectedVoice).toBe('v1');
    });

    await act(async () => {
      await result.current.synthesizeText('నమస్తే');
    });

    expect(result.current.error).toBe('Backend error');
  });

  test('synthesizeText successfully generates speech and handles autoplay policy block', async () => {
    const mockVoices = [{ name: 'Voice 1', voice_id: 'v1' }];
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue(mockVoices);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);
    jest.spyOn(TTSService, 'generateSpeech').mockResolvedValue({
      message: 'OK',
      filename: 'new_audio.mp3',
      audio_path: '/outputs/new_audio.mp3',
    });

    // Mock play rejection for autoplay policy test
    (global as any).Audio = class extends (global as any).Audio {
      play() {
        return Promise.reject(new Error('Autoplay blocked'));
      }
    };

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.selectedVoice).toBe('v1');
    });

    await act(async () => {
      await result.current.synthesizeText('నమస్తే');
    });

    expect(result.current.audioUrl).toContain('/outputs/new_audio.mp3');
    expect(result.current.isPlaying).toBe(false);
  });

  test('removeAudioFile removes item from state and stops current playback if active', async () => {
    const mockFiles = [{ filename: 'file1.mp3', audio_path: '/outputs/file1.mp3', size_bytes: 100, created_at: '2026-10-08T10:00:00Z' }];
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([{ name: 'v1', voice_id: 'v1' }]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue(mockFiles);
    jest.spyOn(TTSService, 'deleteAudioFile').mockResolvedValue({ message: 'Deleted', filename: 'file1.mp3' });
    jest.spyOn(TTSService, 'generateSpeech').mockResolvedValue({
      message: 'OK',
      filename: 'file1.mp3',
      audio_path: '/outputs/file1.mp3',
    });

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.audioFiles).toEqual(mockFiles);
    });

    await act(async () => {
      await result.current.synthesizeText('నమస్తే');
    });

    expect(result.current.audioUrl).toContain('file1.mp3');

    await act(async () => {
      await result.current.removeAudioFile('file1.mp3');
    });

    expect(result.current.audioFiles).toHaveLength(0);
    expect(result.current.audioUrl).toBeNull();
  });

  test('removeAudioFile handles deletion failure', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);
    jest.spyOn(TTSService, 'deleteAudioFile').mockRejectedValue(new Error('Delete error'));

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    await act(async () => {
      await result.current.removeAudioFile('file1.mp3');
    });

    expect(result.current.error).toBe('Delete error');
  });

  test('togglePlayPause plays and pauses current audio', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    const testUrl = 'http://localhost:2200/outputs/test.mp3';

    // Start playing
    await act(async () => {
      result.current.togglePlayPause(testUrl);
    });

    expect(result.current.audioUrl).toBe(testUrl);

    // Pause playing audio without argument
    act(() => {
      result.current.togglePlayPause();
    });

    // Toggle back on with same URL
    act(() => {
      result.current.togglePlayPause(testUrl);
    });
  });

  test('togglePlayPause does nothing if no target URL', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);

    const { result } = renderHook(() => useTeluguTTS());

    await waitFor(() => {
      expect(result.current.loadingVoices).toBe(false);
    });

    act(() => {
      result.current.togglePlayPause();
    });

    expect(result.current.audioUrl).toBeNull();
  });

  test('triggers audio onerror callback during synthesis', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([{ name: 'v1', voice_id: 'v1' }]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);
    jest.spyOn(TTSService, 'generateSpeech').mockResolvedValue({
      message: 'OK',
      filename: 'new_audio.mp3',
      audio_path: '/outputs/new_audio.mp3',
    });

    (global as any).Audio = class {
      src: string;
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(src: string) {
        this.src = src;
      }
      play() {
        if (this.onerror) this.onerror();
        return Promise.resolve();
      }
      pause() {}
    };

    const { result } = renderHook(() => useTeluguTTS());
    await waitFor(() => expect(result.current.selectedVoice).toBe('v1'));

    await act(async () => {
      await result.current.synthesizeText('నమస్తే');
    });

    expect(result.current.error).toBe('Audio playback failed.');
  });

  test('triggers audio onerror callback during togglePlayPause', async () => {
    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([]);

    (global as any).Audio = class {
      src: string;
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(src: string) {
        this.src = src;
      }
      play() {
        if (this.onerror) this.onerror();
        return Promise.resolve();
      }
      pause() {}
    };

    const { result } = renderHook(() => useTeluguTTS());
    await waitFor(() => expect(result.current.loadingVoices).toBe(false));

    act(() => {
      result.current.togglePlayPause('http://localhost:2200/outputs/test.mp3');
    });

    expect(result.current.error).toBe('Audio playback failed.');
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeluguTTSStudio } from '../components/TeluguTTSStudio';
import { TTSService } from '../services/ttsService';

describe('TeluguTTSStudio Component', () => {
  const originalAudio = global.Audio;

  beforeEach(() => {
    class MockAudio {
      src: string;
      onended: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(src: string) {
        this.src = src;
      }
      play() {
        return Promise.resolve();
      }
      pause() {}
    }
    (global as any).Audio = MockAudio;

    jest.spyOn(TTSService, 'getVoices').mockResolvedValue([
      { name: 'Voice 1', voice_id: 'v1' },
      { name: 'Voice 2', voice_id: 'v2' },
    ]);
    jest.spyOn(TTSService, 'getAudioFiles').mockResolvedValue([
      {
        filename: 'sample_audio_1.mp3',
        audio_path: '/outputs/sample_audio_1.mp3',
        size_bytes: 10240,
        created_at: '2026-10-08T10:00:00Z',
      },
      {
        filename: 'telugu_news_2.mp3',
        audio_path: '/outputs/telugu_news_2.mp3',
        size_bytes: 20480,
        created_at: '2026-10-08T11:00:00Z',
      },
    ]);
    jest.spyOn(TTSService, 'deleteAudioFile').mockResolvedValue({
      message: 'Deleted',
      filename: 'sample_audio_1.mp3',
    });
  });

  afterEach(() => {
    (global as any).Audio = originalAudio;
    jest.restoreAllMocks();
  });

  test('renders studio title and audio library table view by default', async () => {
    render(<TeluguTTSStudio />);

    expect(screen.getByTestId('telugu-tts-studio')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('sample_audio_1.mp3')).toBeInTheDocument();
    });

    expect(screen.getByText('telugu_news_2.mp3')).toBeInTheDocument();
  });

  test('opens create speech audio modal on top right button click', async () => {
    render(<TeluguTTSStudio />);

    await waitFor(() => {
      expect(screen.getByText('sample_audio_1.mp3')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /Create Speech Audio|ఆడియోను సృష్టించండి|ऑडियो बनाएं|ഓഡിയോ സൃഷ്ടിക്കുക/i });
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Telugu text/i)).toBeInTheDocument();
    });
  });

  test('allows searching files by filename', async () => {
    render(<TeluguTTSStudio />);

    await waitFor(() => {
      expect(screen.getByText('sample_audio_1.mp3')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search audio files|ఫైల్ పేరుతో శోధించండి/i);
    fireEvent.change(searchInput, { target: { value: 'telugu_news' } });

    expect(screen.queryByText('sample_audio_1.mp3')).not.toBeInTheDocument();
    expect(screen.getByText('telugu_news_2.mp3')).toBeInTheDocument();
  });

  test('deletes an audio file from table', async () => {
    render(<TeluguTTSStudio />);

    await waitFor(() => {
      expect(screen.getByText('sample_audio_1.mp3')).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByLabelText(/Delete|తొలగించండి|హటా|हटाएं|ഇല്ലാതാക്കുക/i);
    expect(deleteBtns.length).toBeGreaterThan(0);
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(TTSService.deleteAudioFile).toHaveBeenCalledWith('sample_audio_1.mp3');
    });
  });
});

import axios from 'axios';
import { MoviesRepository } from '../repositories/movies.repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesRepository', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch all movies via GET endpoint', async () => {
    const mockApiResponse = {
      data: {
        success: true,
        data: [
          {
            id: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
            title: 'Nikhil Kumar',
            description: 'A thief who steals corporate secrets.',
            poster: 'https://example.com/poster.jpeg',
            banner: 'https://example.com/banner.jpeg',
            thumbnail: 'https://example.com/thumb.jpeg',
            videoUrl: 'https://streamable.com/f673g4',
            genres: ['Sci-Fi', 'Action'],
            languages: ['English', 'Spanish'],
            duration: 2,
            releaseDate: '2010-07-16',
            rating: 8.8,
            ageRestriction: 'PG-13',
            featured: true,
            isPremium: true,
            status: 'published',
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

    const result = await MoviesRepository.getAll();

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringMatching(/\/api\/admin\/content\/movie/), expect.anything());
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toBe('Nikhil Kumar');
    expect(result[0].rating).toBe(8.8);
  });

  it('should fallback to local storage when GET fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    const result = await MoviesRepository.getAll();

    expect(Array.isArray(result)).toBe(true);
  });

  it('should create a new movie record via POST endpoint', async () => {
    const mockApiResponse = {
      data: {
        id: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
        title: 'Nikhil Kumar',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        poster: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
        banner: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
        thumbnail: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
        videoUrl: 'https://streamable.com/f673g4',
        genres: ['Sci-Fi', 'Action'],
        languages: ['English', 'Spanish'],
        duration: 2,
        releaseDate: '2010-07-16',
        rating: 8.8,
        ageRestriction: 'PG-13',
        featured: true,
        isPremium: true,
        status: 'published',
        createdAt: '2026-08-04T07:34:32',
        updatedAt: '2026-08-04T07:34:32',
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockApiResponse);

    const inputData = {
      title: 'Nikhil Kumar',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      poster: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
      banner: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
      thumbnail: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
      videoUrl: 'https://streamable.com/f673g4',
      genres: ['Sci-Fi', 'Action'],
      languages: ['English', 'Spanish'],
      duration: 2,
      releaseDate: '2010-07-16',
      rating: 8.8,
      ageRestriction: 'PG-13',
      featured: true,
      isPremium: true,
      status: 'published',
    };

    const createdMovie = await MoviesRepository.add(inputData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/content\/movie/),
      expect.objectContaining({
        title: 'Nikhil Kumar',
        description: 'A thief who steals corporate secrets through dream-sharing technology.',
        status: 'published',
      })
    );

    expect(createdMovie.id).toBe('7c740c5e-521c-4ec2-afc1-1136dccd3868');
    expect(createdMovie.title).toBe('Nikhil Kumar');
    expect(createdMovie.status).toBe('published');
    expect(createdMovie.isPublished).toBe(true);
  });

  it('should update movie via PUT endpoint', async () => {
    const mockApiResponse = {
      data: {
        id: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
        title: 'Nikhil Kumar Updated',
        status: 'published',
      },
    };

    mockedAxios.put.mockResolvedValueOnce(mockApiResponse);

    const updated = await MoviesRepository.update('7c740c5e-521c-4ec2-afc1-1136dccd3868', { title: 'Nikhil Kumar Updated' });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/content\/movie\/7c740c5e-521c-4ec2-afc1-1136dccd3868/),
      expect.objectContaining({ title: 'Nikhil Kumar Updated' })
    );
    expect(updated?.title).toBe('Nikhil Kumar Updated');
  });

  it('should delete movie via DELETE endpoint', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await MoviesRepository.delete('7c740c5e-521c-4ec2-afc1-1136dccd3868');

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/admin\/content\/movie\/7c740c5e-521c-4ec2-afc1-1136dccd3868/)
    );
    expect(result).toBe(true);
  });

  it('should toggle publish status for movie', async () => {
    mockedAxios.put.mockResolvedValueOnce({
      data: {
        id: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
        title: 'Test Movie',
        status: 'draft',
      },
    });

    const result = await MoviesRepository.togglePublish('7c740c5e-521c-4ec2-afc1-1136dccd3868');
    expect(result).not.toBeNull();
  });
});

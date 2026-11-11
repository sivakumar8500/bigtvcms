import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { RatingsRepository } from '../repositories/ratings.repository';
import { useRatingsController } from '../hooks/useRatingsController';
import { apiClient } from '@/core/api/api-client';
import { ratingsTranslations } from '../translations';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  cricketApiClient: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/matches/live')) {
        return Promise.resolve({
          typeMatches: [
            {
              matchType: 'International',
              seriesMatches: [
                {
                  seriesAdWrapper: {
                    seriesId: 101,
                    seriesName: 'Tour of India',
                    matches: [
                      {
                        matchInfo: {
                          matchId: 991,
                          seriesId: 101,
                          seriesName: 'Tour of India',
                          matchDesc: '1st ODI',
                          matchFormat: 'ODI',
                          startDate: '1700000000000',
                          endDate: '1700030000000',
                          state: 'In Progress',
                          status: 'IND 240/3',
                          team1: { teamId: 1, teamName: 'India', teamSName: 'IND' },
                          team2: { teamId: 2, teamName: 'Australia', teamSName: 'AUS' },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        });
      }
      if (url.includes('/matches/recent')) {
        return Promise.resolve({
          matches: [
            {
              id: 'rec-1',
              matchId: 991,
              title: 'IND vs AUS',
              status: 'live',
              isPinned: false,
              seriesName: 'Tour of India',
              matchDesc: '1st ODI',
              pravasaStatus: 'published',
            },
          ],
        });
      }
      return Promise.resolve({});
    }),
    post: jest.fn().mockResolvedValue({ success: true, isPinned: true }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('Ratings Module - Repository & Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Translations Completeness', () => {
    it('supports all 4 official languages (en, te, hi, ml)', () => {
      const languages = ['en', 'te', 'hi', 'ml'];
      languages.forEach((lang) => {
        expect(ratingsTranslations[lang]).toBeDefined();
        expect(ratingsTranslations[lang].pageTitle).toBeDefined();
        expect(ratingsTranslations[lang].tabMovie).toBeDefined();
        expect(ratingsTranslations[lang].tabPolls).toBeDefined();
        expect(ratingsTranslations[lang].tabCricket).toBeDefined();
        expect(ratingsTranslations[lang].tabEvents).toBeDefined();
        expect(ratingsTranslations[lang].tabGames).toBeDefined();
      });
    });

    it('has identical keys across en, te, hi, and ml', () => {
      const enKeys = Object.keys(ratingsTranslations.en).sort();
      const teKeys = Object.keys(ratingsTranslations.te).sort();
      const hiKeys = Object.keys(ratingsTranslations.hi).sort();
      const mlKeys = Object.keys(ratingsTranslations.ml).sort();

      expect(teKeys).toEqual(enKeys);
      expect(hiKeys).toEqual(enKeys);
      expect(mlKeys).toEqual(enKeys);
    });
  });

  describe('RatingsRepository - Movie Reviews', () => {
    it('fetches movie reviews from API when available', async () => {
      const mockApiResponse = [
        {
          id: 2001,
          title: 'Varanasi Chronicles',
          content: 'Gripping spiritual thriller',
          subType: 'Reviews',
          language_code: 'te',
          chotarating: '4.0/5',
          externalRatings: [{ platform_name: 'IMDb', platform_rating: '8.0/10' }],
          draft: false,
        },
      ];
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const result = await RatingsRepository.getMovieReviews();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe(2001);
      expect(result[0].title).toBe('Varanasi Chronicles');
    });

    it('falls back to local movie reviews and applies filters when API fails', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await RatingsRepository.getMovieReviews({
        language_code: 'te',
        search: 'Devara',
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('Devara');
    });

    it('creates movie review via API with video_url and gallery and updates list', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ id: 3001 });

      const newReview = await RatingsRepository.createMovieReview({
        title: 'New Sci-Fi Movie',
        content: 'Remarkable visual effects',
        type: 'Standard',
        subType: 'Reviews',
        language_code: 'te',
        category_ids: [5],
        image_url: 'https://example.com/poster.jpg',
        video_url: 'https://www.youtube.com/watch?v=sample123',
        gallery: [
          { Url: 'https://example.com/still1.jpg' },
          { Url: 'https://example.com/still2.jpg' },
        ],
        chotarating: '4.5/5',
        externalRatings: [{ platform_name: 'IMDb', platform_rating: '8.5/10' }],
        draft: false,
      });

      expect(newReview.id).toBe(3001);
      expect(newReview.title).toBe('New Sci-Fi Movie');
      expect(newReview.video_url).toBe('https://www.youtube.com/watch?v=sample123');
      expect(newReview.gallery).toEqual([
        { Url: 'https://example.com/still1.jpg' },
        { Url: 'https://example.com/still2.jpg' },
      ]);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/news-posts',
        expect.objectContaining({
          video_url: 'https://www.youtube.com/watch?v=sample123',
          gallery: [
            { Url: 'https://example.com/still1.jpg' },
            { Url: 'https://example.com/still2.jpg' },
          ],
        })
      );
    });

    it('creates movie review with fallback ID when API fails', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Post error'));

      const newReview = await RatingsRepository.createMovieReview({
        title: 'Fallback Movie Review',
        content: 'Fallback review content',
        type: 'Standard',
        subType: 'Reviews',
        language_code: 'en',
        category_ids: [5],
        image_url: '',
        chotarating: '3.5/5',
        externalRatings: [],
        draft: true,
      });

      expect(newReview.id).toBeDefined();
      expect(newReview.title).toBe('Fallback Movie Review');
    });

    it('updates movie review with video_url and gallery', async () => {
      (apiClient.put as jest.Mock).mockResolvedValueOnce({ success: true });

      const updated = await RatingsRepository.updateMovieReview(1051, {
        title: 'Devara Part 1 - Updated Title',
        chotarating: '4.0/5',
        video_url: 'https://www.youtube.com/watch?v=updated_trailer',
        gallery: [{ Url: 'https://example.com/updated_still.jpg' }],
      });

      expect(updated.title).toBe('Devara Part 1 - Updated Title');
      expect(updated.chotarating).toBe('4.0/5');
      expect(updated.video_url).toBe('https://www.youtube.com/watch?v=updated_trailer');
      expect(updated.gallery).toEqual([{ Url: 'https://example.com/updated_still.jpg' }]);
      expect(apiClient.put).toHaveBeenCalledWith(
        '/news-posts/1051',
        expect.objectContaining({
          video_url: 'https://www.youtube.com/watch?v=updated_trailer',
          gallery: [{ Url: 'https://example.com/updated_still.jpg' }],
        })
      );
    });

    it('deletes movie review', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({ success: true });

      await RatingsRepository.deleteMovieReview(1051);
      const list = await RatingsRepository.getMovieReviews();
      expect(list.find((m) => m.id === 1051)).toBeUndefined();
    });

    it('retrieves movie review audience details breakdown', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        overall_rating: 4.5,
        critic_rating: 4.0,
        total_reviews: 60,
        movie_platform_ratings: [{ platform_name: 'IMDb', platform_rating: '8.2/10' }],
        user_reviews: [{ id: 1, user_name: 'Kiran', rating: 5, comment: 'Superb film' }],
      });

      const details = await RatingsRepository.getMovieReviewDetails(1052);
      expect(details.overall_rating).toBe(4.5);
      expect(details.total_reviews).toBe(60);
    });

    it('uploads media file via uploadMediaFile', async () => {
      const mockFile = new File(['content'], 'trailer.mp4', { type: 'video/mp4' });
      jest.spyOn(RatingsRepository, 'uploadImage').mockResolvedValueOnce('https://example.com/trailer.mp4');

      const url = await RatingsRepository.uploadMediaFile(mockFile);
      expect(url).toBe('https://example.com/trailer.mp4');
    });
  });

  describe('RatingsRepository - Polls', () => {
    it('fetches polls from API when available', async () => {
      const mockApiResponse = [
        {
          id: 5001,
          title: 'Election Exit Poll',
          subType: 'Poll',
          poll_options: [
            { option: 1, option_name: 'Party A', votes: 100 },
            { option: 2, option_name: 'Party B', votes: 200 },
          ],
          totalVotes: 300,
        },
      ];
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

      const result = await RatingsRepository.getPolls();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toBe(5001);
    });

    it('falls back to local polls and applies filters when API fails', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await RatingsRepository.getPolls({
        language_code: 'te',
        search: 'AP Assembly',
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('AP Assembly');
    });

    it('creates poll via API and updates list', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ id: 6001 });

      const newPoll = await RatingsRepository.createPoll({
        title: 'New Political Poll',
        content: 'Cast your vote',
        type: 'Standard',
        subType: 'Poll',
        language_code: 'te',
        category_ids: [1],
        image_url: '',
        poll_options: [
          { option: 1, option_name: 'Yes' },
          { option: 2, option_name: 'No' },
        ],
        draft: false,
      });

      expect(newPoll.id).toBe(6001);
      expect(newPoll.title).toBe('New Political Poll');
    });

    it('creates poll with fallback ID when API fails', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const newPoll = await RatingsRepository.createPoll({
        title: 'Fallback Poll',
        content: 'Fallback description',
        type: 'Standard',
        subType: 'Poll',
        language_code: 'en',
        category_ids: [1],
        image_url: '',
        poll_options: [
          { option: 1, option_name: 'Opt A' },
          { option: 2, option_name: 'Opt B' },
        ],
        draft: true,
      });

      expect(newPoll.id).toBeDefined();
      expect(newPoll.title).toBe('Fallback Poll');
    });

    it('updates poll', async () => {
      (apiClient.put as jest.Mock).mockResolvedValueOnce({ success: true });

      const updated = await RatingsRepository.updatePoll(1050, {
        title: 'Updated AP Assembly Poll',
      });

      expect(updated.title).toBe('Updated AP Assembly Poll');
    });

    it('submits poll vote and updates option counts', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ success: true });

      const success = await RatingsRepository.submitPollVote({
        post_id: 1050,
        user_id: 101,
        selected_option: 2,
        comment: 'Great initiative',
      });

      expect(success).toBe(true);
      const poll = (await RatingsRepository.getPolls()).find((p) => p.id === 1050);
      expect(poll?.userHasVoted).toBe(true);
      expect(poll?.userVotedOption).toBe(2);
    });

    it('retrieves live poll results breakdown', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        totalVotes: 2500,
        userHasVoted: true,
        userVotedOption: 1,
        options: [
          { option: 1, option_name: 'Choice A', votes: 1500, percentage: 60 },
          { option: 2, option_name: 'Choice B', votes: 1000, percentage: 40 },
        ],
        topComments: [{ userName: 'Rajesh', comment: 'Clear outcome' }],
      });

      const res = await RatingsRepository.getPollResults(1050);
      expect(res.totalVotes).toBe(2500);
      expect(res.options.length).toBe(2);
    });

    it('deletes poll', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({ success: true });

      await RatingsRepository.deletePoll(1054);
      const list = await RatingsRepository.getPolls();
      expect(list.find((p) => p.id === 1054)).toBeUndefined();
    });
  });

  describe('RatingsRepository - Cricket Matches', () => {
    it('fetches cricket matches and applies status filter', async () => {
      const matches = await RatingsRepository.getCricketMatches('live');
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((m) => m.status === 'live')).toBe(true);
    });

    it('updates cricket match scores and status text', async () => {
      const updated = await RatingsRepository.updateCricketMatch(1, {
        statusText: 'India won by 15 runs!',
        team2: { runs: 186, wickets: 5, overs: 19.2 },
      });

      expect(updated.statusText).toBe('India won by 15 runs!');
      expect(updated.team2.runs).toBe(186);
    });

    it('toggles match pin status', async () => {
      const toggled = await RatingsRepository.togglePinMatch(2);
      expect(toggled.isPinned).toBe(true);

      const toggledBack = await RatingsRepository.togglePinMatch(2);
      expect(toggledBack.isPinned).toBe(false);
    });

    it('handles togglePinMatch and updateCricketMatch with non-existent id', async () => {
      await expect(RatingsRepository.togglePinMatch(99999)).rejects.toThrow('Match not found');

      const updated = await RatingsRepository.updateCricketMatch(99999, { title: 'Unknown' });
      expect(updated.id).toBe(99999);
    });

    it('handles getMatchLiveScore error gracefully', async () => {
      const { cricketApiClient } = jest.requireMock('@/core/api/api-client');
      cricketApiClient.get.mockRejectedValueOnce(new Error('Network error'));

      const res = await RatingsRepository.getMatchLiveScore('err-id');
      expect(res).toBeNull();
    });
  });

  describe('useRatingsController Hook', () => {
    it('initializes with movie tab active and fetches data', async () => {
      const { result } = renderHook(() => useRatingsController());

      expect(result.current.activeTab).toBe('movie');
      await act(async () => {
        await result.current.fetchMovies();
      });

      expect(result.current.movies.length).toBeGreaterThan(0);
    });

    it('switches between movie, polls, cricket, events, and games tabs', async () => {
      const { result } = renderHook(() => useRatingsController());

      act(() => {
        result.current.setActiveTab('polls');
      });
      expect(result.current.activeTab).toBe('polls');

      act(() => {
        result.current.setActiveTab('cricket');
      });
      expect(result.current.activeTab).toBe('cricket');

      act(() => {
        result.current.setActiveTab('events');
      });
      expect(result.current.activeTab).toBe('events');

      act(() => {
        result.current.setActiveTab('games');
      });
      expect(result.current.activeTab).toBe('games');
    });

    it('handles movie review modal and save workflow', async () => {
      const { result } = renderHook(() => useRatingsController());

      act(() => {
        result.current.openAddMovie();
      });
      expect(result.current.movieModalOpen).toBe(true);
      expect(result.current.editingMovie).toBeNull();

      await act(async () => {
        await result.current.saveMovieReview({
          title: 'Controller Movie Test',
          content: 'Test content',
          type: 'Standard',
          subType: 'Reviews',
          language_code: 'te',
          category_ids: [5],
          image_url: '',
          chotarating: '4.0/5',
          externalRatings: [{ platform_name: 'IMDb', platform_rating: '8.0/10' }],
          draft: false,
        });
      });

      expect(result.current.movieModalOpen).toBe(false);
      expect(result.current.snackbar.open).toBe(true);
    });

    it('handles audience ratings modal and delete movie workflow', async () => {
      const { result } = renderHook(() => useRatingsController());
      await act(async () => {
        await result.current.fetchMovies();
      });
      const testMovie = result.current.allMovies[0];

      await act(async () => {
        await result.current.openAudienceRatings(testMovie);
      });
      expect(result.current.audienceModalOpen).toBe(true);
      expect(result.current.activeAudienceReview).toBeDefined();

      act(() => {
        result.current.closeAudienceModal();
      });
      expect(result.current.audienceModalOpen).toBe(false);

      await act(async () => {
        await result.current.deleteMovieReview(testMovie.id);
      });
      expect(result.current.allMovies.find((m) => m.id === testMovie.id)).toBeUndefined();
    });

    it('handles poll modal, save, vote, and live results workflow', async () => {
      const { result } = renderHook(() => useRatingsController());
      await act(async () => {
        await result.current.fetchPolls();
      });

      act(() => {
        result.current.openAddPoll();
      });
      expect(result.current.pollModalOpen).toBe(true);

      await act(async () => {
        await result.current.savePoll({
          title: 'Controller Test Poll',
          content: 'Poll context',
          type: 'Standard',
          subType: 'Poll',
          language_code: 'te',
          category_ids: [1],
          image_url: '',
          poll_options: [
            { option: 1, option_name: 'Option 1' },
            { option: 2, option_name: 'Option 2' },
          ],
          draft: false,
        });
      });
      expect(result.current.pollModalOpen).toBe(false);

      const targetPoll = result.current.allPolls[0];
      await act(async () => {
        await result.current.openPollResults(targetPoll);
      });
      expect(result.current.pollResultsModalOpen).toBe(true);

      act(() => {
        result.current.closePollResultsModal();
      });
      expect(result.current.pollResultsModalOpen).toBe(false);

      act(() => {
        result.current.openTestVote(targetPoll);
      });
      expect(result.current.pollVoteModalOpen).toBe(true);

      await act(async () => {
        await result.current.submitVote(1, 'Testing vote from controller');
      });
      expect(result.current.pollVoteModalOpen).toBe(false);
    });

    it('handles cricket tab actions: pin toggle, scorecard, and edit score', async () => {
      const { result } = renderHook(() => useRatingsController());

      act(() => {
        result.current.setActiveTab('cricket');
      });

      await act(async () => {
        await result.current.fetchCricket();
      });
      expect(result.current.cricketMatches.length).toBeGreaterThan(0);

      const firstMatch = result.current.cricketMatches[0];
      await act(async () => {
        await result.current.togglePinMatch(firstMatch.id);
      });
      expect(result.current.snackbar.open).toBe(true);

      act(() => {
        result.current.openScorecard(firstMatch);
      });
      expect(result.current.scorecardModalOpen).toBe(true);

      act(() => {
        result.current.closeScorecard();
      });
      expect(result.current.scorecardModalOpen).toBe(false);

      act(() => {
        result.current.openEditMatchScore(firstMatch);
      });
      expect(result.current.updateScoreModalOpen).toBe(true);

      await act(async () => {
        await result.current.saveMatchScore({
          id: firstMatch.id,
          statusText: 'Score updated via test',
          team1: { runs: 200, wickets: 4, overs: 20 },
        });
      });
      expect(result.current.updateScoreModalOpen).toBe(false);
    });

    it('manages search, filters, pagination, and snackbars', async () => {
      const { result } = renderHook(() => useRatingsController());
      await act(async () => {
        await result.current.fetchMovies();
      });

      act(() => {
        result.current.setMovieSearch('Pushpa');
        result.current.setMovieLang('te');
        result.current.setMovieStatus('published');
        result.current.setMoviePage(1);
      });
      expect(result.current.movieSearch).toBe('Pushpa');
      expect(result.current.movieLang).toBe('te');
      expect(result.current.movieStatus).toBe('published');
      expect(result.current.movies.length).toBeGreaterThan(0);

      act(() => {
        result.current.setMovieSearch('non-matching-movie-query-xyz');
      });
      expect(result.current.movies.length).toBe(0);

      act(() => {
        result.current.setMovieSearch('');
        result.current.setMovieStatus('draft');
      });

      await act(async () => {
        await result.current.fetchPolls();
      });

      act(() => {
        result.current.setPollSearch('Assembly');
        result.current.setPollLang('te');
        result.current.setPollStatus('published');
      });
      expect(result.current.pollSearch).toBe('Assembly');
      expect(result.current.polls.length).toBeGreaterThan(0);

      act(() => {
        result.current.setPollSearch('non-matching-poll-query-xyz');
      });
      expect(result.current.polls.length).toBe(0);

      act(() => {
        result.current.setPollSearch('');
        result.current.setPollStatus('draft');
      });

      await act(async () => {
        await result.current.fetchCricket();
      });

      act(() => {
        result.current.setCricketFilter('live');
        result.current.setCricketSearch('IND');
      });
      expect(result.current.cricketFilter).toBe('live');
      expect(result.current.cricketSearch).toBe('IND');
      expect(result.current.cricketMatches.length).toBeGreaterThan(0);

      act(() => {
        result.current.setCricketSearch('Tour of India');
      });
      expect(result.current.cricketMatches.length).toBeGreaterThan(0);

      act(() => {
        result.current.setCricketSearch('NonExistentTournamentXYZ');
      });
      expect(result.current.cricketMatches.length).toBe(0);

      act(() => {
        result.current.showSnackbar('Test message', 'info');
      });
      expect(result.current.snackbar.message).toBe('Test message');

      act(() => {
        result.current.closeSnackbar();
      });
      expect(result.current.snackbar.open).toBe(false);
    });

    it('covers edit workflows and error handling branches in useRatingsController', async () => {
      const { result } = renderHook(() => useRatingsController());
      await act(async () => {
        await result.current.fetchMovies();
      });

      const testMovie = result.current.allMovies[0];
      act(() => {
        result.current.openEditMovie(testMovie);
      });
      expect(result.current.movieModalOpen).toBe(true);
      expect(result.current.editingMovie?.id).toBe(testMovie.id);

      // Save existing movie
      await act(async () => {
        await result.current.saveMovieReview({
          id: testMovie.id,
          title: 'Updated Test Movie Title',
        });
      });
      expect(result.current.movieModalOpen).toBe(false);

      // Save movie error handling
      jest.spyOn(RatingsRepository, 'updateMovieReview').mockRejectedValueOnce(new Error('Update failed'));
      await act(async () => {
        await result.current.saveMovieReview({
          id: testMovie.id,
          title: 'Failing Update',
        });
      });
      expect(result.current.snackbar.message).toContain('Failed to save movie review');

      // Poll edit and error
      await act(async () => {
        await result.current.fetchPolls();
      });
      const testPoll = result.current.allPolls[0];
      act(() => {
        result.current.openEditPoll(testPoll);
      });
      expect(result.current.pollModalOpen).toBe(true);
      expect(result.current.editingPoll?.id).toBe(testPoll.id);

      await act(async () => {
        await result.current.savePoll({
          id: testPoll.id,
          title: 'Updated Test Poll Title',
        });
      });
      expect(result.current.pollModalOpen).toBe(false);

      // Cricket save score with missing id and error
      await act(async () => {
        await result.current.saveMatchScore({} as any);
      });

      jest.spyOn(RatingsRepository, 'updateCricketMatch').mockRejectedValueOnce(new Error('Cricket update error'));
      await act(async () => {
        await result.current.saveMatchScore({ id: 1, statusText: 'Failing' });
      });
      expect(result.current.snackbar.message).toContain('Failed to update live match score');
    });
  });
});

import axios from 'axios';
import { apiClient, cricketApiClient } from '@/core/api/api-client';
import {
  MovieReviewItem,
  CreateMovieReviewDto,
  UpdateMovieReviewDto,
  PollItem,
  CreatePollDto,
  UpdatePollDto,
  PollVoteSubmission,
  CricketMatchItem,
  CricbuzzLiveResponse,
  CricbuzzTypeMatch,
  CricbuzzMatchItem,
  PublishedCricketMatch,
  RecentMatchesApiResponse,
  UpdateCricketMatchDto,
} from '../domain/ratings.types';

const INITIAL_MOCK_MOVIES: MovieReviewItem[] = [
  {
    id: 1051,
    title: 'Devara Movie Review & Analysis',
    content: 'Director Koratala Siva delivers an intense coastal action drama with NTR Jr in top form.',
    type: 'Standard',
    subType: 'Reviews',
    language_code: 'te',
    category_ids: [5],
    image_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    chotarating: '3.5/5',
    externalRatings: [
      { platform_name: 'IMDb', platform_rating: '7.8/10' },
      { platform_name: 'BookMyShow', platform_rating: '84%' },
      { platform_name: 'Rotten Tomatoes', platform_rating: '76%' },
    ],
    draft: false,
    createdAt: '2026-10-29T10:00:00Z',
    totalViews: 4520,
    totalLikes: 890,
    totalReviews: 48,
    overallRating: 4.1,
  },
  {
    id: 1052,
    title: 'Pushpa 2: The Rule - Mega Blockbuster Review',
    content: 'Allu Arjun and Sukumar raise the stakes in this roaring mass spectacle with spectacular punchlines.',
    type: 'Standard',
    subType: 'Reviews',
    language_code: 'te',
    category_ids: [5],
    image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    chotarating: '4.0/5',
    externalRatings: [
      { platform_name: 'IMDb', platform_rating: '8.4/10' },
      { platform_name: 'BookMyShow', platform_rating: '91%' },
      { platform_name: 'Times of India', platform_rating: '4.0/5' },
    ],
    draft: false,
    createdAt: '2026-10-30T12:00:00Z',
    totalViews: 12500,
    totalLikes: 3400,
    totalReviews: 142,
    overallRating: 4.4,
  },
  {
    id: 1053,
    title: 'Kalki 2898 AD - Cinematic Marvel Review',
    content: 'Nag Ashwin blazes a trail for Indian sci-fi mythology with stunning VFX and Amitabh Bachchan masterclass.',
    type: 'Standard',
    subType: 'Reviews',
    language_code: 'en',
    category_ids: [5],
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    chotarating: '4.2/5',
    externalRatings: [
      { platform_name: 'IMDb', platform_rating: '8.1/10' },
      { platform_name: 'BookMyShow', platform_rating: '89%' },
      { platform_name: 'Letterboxd', platform_rating: '4.1/5' },
    ],
    draft: false,
    createdAt: '2026-11-01T08:00:00Z',
    totalViews: 9800,
    totalLikes: 2100,
    totalReviews: 87,
    overallRating: 4.3,
  },
];

const INITIAL_MOCK_POLLS: PollItem[] = [
  {
    id: 1050,
    title: 'Who will win the upcoming AP Assembly Debate?',
    content: 'Share your opinion on the recent political developments and key policy debates.',
    type: 'Standard',
    subType: 'Poll',
    language_code: 'te',
    category_ids: [1],
    image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
    poll_options: [
      { option: 1, option_name: 'Ruling Party', votes: 852, percentage: 60.0 },
      { option: 2, option_name: 'Opposition Coalition', votes: 426, percentage: 30.0 },
      { option: 3, option_name: 'Neutral / Undecided', votes: 142, percentage: 10.0 },
    ],
    totalVotes: 1420,
    userHasVoted: true,
    userVotedOption: 1,
    draft: false,
    createdAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 1054,
    title: 'Which upcoming Pan-India release are you most excited for?',
    content: 'Vote for your most anticipated theatrical spectacle releasing this season.',
    type: 'Standard',
    subType: 'Poll',
    language_code: 'en',
    category_ids: [5],
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    poll_options: [
      { option: 1, option_name: 'Game Changer', votes: 620, percentage: 41.3 },
      { option: 2, option_name: 'Varanasi Chronicles', votes: 480, percentage: 32.0 },
      { option: 3, option_name: 'Spirit', votes: 400, percentage: 26.7 },
    ],
    totalVotes: 1500,
    userHasVoted: false,
    draft: false,
    createdAt: '2026-11-01T15:30:00Z',
  },
  {
    id: 1055,
    title: 'Should T20 matches allow 2 bouncers per over in international cricket?',
    content: 'Share your take on balancing the contest between bat and ball in shorter formats.',
    type: 'Standard',
    subType: 'Poll',
    language_code: 'hi',
    category_ids: [4],
    image_url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80',
    poll_options: [
      { option: 1, option_name: 'Yes, gives bowlers more weapon', votes: 710, percentage: 71.0 },
      { option: 2, option_name: 'No, keep batting favorable', votes: 290, percentage: 29.0 },
    ],
    totalVotes: 1000,
    userHasVoted: false,
    draft: false,
    createdAt: '2026-10-31T09:15:00Z',
  },
];

const INITIAL_MOCK_CRICKET: CricketMatchItem[] = [
  {
    id: 1,
    matchId: 'ind-aus-t20-2026',
    title: 'India vs Australia, 2nd T20I',
    series: 'Australia Tour of India 2026',
    matchType: 'T20',
    venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    status: 'live',
    statusText: 'India need 24 runs in 18 balls with 5 wickets in hand',
    isPinned: true,
    startDate: '2026-11-03T13:30:00Z',
    team1: {
      teamName: 'Australia',
      shortName: 'AUS',
      runs: 185,
      wickets: 7,
      overs: 20.0,
      crr: 9.25,
    },
    team2: {
      teamName: 'India',
      shortName: 'IND',
      runs: 162,
      wickets: 5,
      overs: 17.0,
      crr: 9.53,
    },
    battingTeamShortName: 'IND',
    target: 186,
    rrr: 8.0,
    tossWinner: 'India',
    tossDecision: 'opted to bowl first',
    batsmen: [
      { name: 'Hardik Pandya', runs: 42, balls: 22, fours: 3, sixes: 3, strikeRate: 190.9, isNotOut: true },
      { name: 'Rinku Singh', runs: 28, balls: 14, fours: 2, sixes: 2, strikeRate: 200.0, isNotOut: true },
      { name: 'Suryakumar Yadav', runs: 56, balls: 31, fours: 6, sixes: 2, strikeRate: 180.6 },
    ],
    bowlers: [
      { name: 'Mitchell Starc', overs: 3.0, maidens: 0, runs: 29, wickets: 2, economy: 9.67 },
      { name: 'Pat Cummins', overs: 4.0, maidens: 0, runs: 38, wickets: 1, economy: 9.5 },
      { name: 'Adam Zampa', overs: 4.0, maidens: 0, runs: 32, wickets: 2, economy: 8.0 },
    ],
  },
  {
    id: 2,
    matchId: 'csk-mi-ipl-2026',
    title: 'Chennai Super Kings vs Mumbai Indians',
    series: 'Indian Premier League 2026 - Match 24',
    matchType: 'T20',
    venue: 'MA Chidambaram Stadium, Chepauk, Chennai',
    status: 'upcoming',
    statusText: 'Match starts at 7:30 PM IST',
    isPinned: false,
    startDate: '2026-11-03T14:00:00Z',
    team1: {
      teamName: 'Chennai Super Kings',
      shortName: 'CSK',
      runs: 0,
      wickets: 0,
      overs: 0,
    },
    team2: {
      teamName: 'Mumbai Indians',
      shortName: 'MI',
      runs: 0,
      wickets: 0,
      overs: 0,
    },
    tossWinner: 'Toss yet to happen',
    tossDecision: 'Pitch expected to assist spinners',
  },
  {
    id: 3,
    matchId: 'eng-nz-odi-2026',
    title: 'England vs New Zealand, 3rd ODI',
    series: 'New Zealand in England ODI Series 2026',
    matchType: 'ODI',
    venue: 'Lord’s Cricket Ground, London',
    status: 'recent',
    statusText: 'England won by 34 runs (DLS Method)',
    isPinned: false,
    startDate: '2026-11-02T10:00:00Z',
    team1: {
      teamName: 'England',
      shortName: 'ENG',
      runs: 288,
      wickets: 8,
      overs: 50.0,
      crr: 5.76,
    },
    team2: {
      teamName: 'New Zealand',
      shortName: 'NZ',
      runs: 254,
      wickets: 10,
      overs: 47.3,
      crr: 5.35,
    },
    target: 289,
    tossWinner: 'New Zealand',
    tossDecision: 'opted to bowl first',
    batsmen: [
      { name: 'Harry Brook', runs: 85, balls: 72, fours: 8, sixes: 3, strikeRate: 118.0 },
      { name: 'Jos Buttler', runs: 64, balls: 54, fours: 5, sixes: 2, strikeRate: 118.5 },
    ],
    bowlers: [
      { name: 'Jofra Archer', overs: 9.3, maidens: 1, runs: 42, wickets: 4, economy: 4.42 },
      { name: 'Trent Boult', overs: 10.0, maidens: 1, runs: 51, wickets: 3, economy: 5.1 },
    ],
  },
];

export class RatingsRepository {
  private static localMovies: MovieReviewItem[] = [...INITIAL_MOCK_MOVIES];
  private static localPolls: PollItem[] = [...INITIAL_MOCK_POLLS];
  private static localCricket: CricketMatchItem[] = [...INITIAL_MOCK_CRICKET];

  // ----------------------------------------------------
  // MOVIE REVIEWS REPOSITORY
  // ----------------------------------------------------
  static async getMovieReviews(params?: {
    skip?: number;
    limit?: number;
    language_code?: string;
    search?: string;
  }): Promise<MovieReviewItem[]> {
    try {
      const response = await apiClient.get<any[]>('/news-posts', {
        subType: 'Reviews',
        skip: params?.skip || 0,
        limit: params?.limit || 50,
      });
      if (Array.isArray(response)) {
        // Hydrate from API
        const mapped = response
          .filter((p) => p.subType === 'Reviews' || p.subType === 'MovieReview' || p.chotarating)
          .map((p) => ({
            id: p.id,
            title: p.title || '',
            content: p.content || '',
            type: p.type || 'Standard',
            subType: p.subType || 'Reviews',
            language_code: p.language_code || p.lan || 'te',
            category_ids: p.category_ids || [],
            image_url: p.image_url || '',
            chotarating: p.chotarating || p.chotaMeter || '3.5/5',
            externalRatings: Array.isArray(p.externalRatings) ? p.externalRatings : [],
            draft: Boolean(p.draft),
            createdAt: p.created || p.createdAt,
            totalReviews: p.reviewCount || 0,
            overallRating: p.overallRating || 4.0,
          }));

        let filtered = mapped;
        if (params?.language_code && params.language_code !== 'all') {
          filtered = filtered.filter((m) => m.language_code === params.language_code);
        }
        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(
            (m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
          );
        }
        return filtered;
      }
    } catch {
      // Fallback gracefully to memory store on network error
    }

    let items = [...this.localMovies];
    if (params?.language_code && params.language_code !== 'all') {
      items = items.filter((m) => m.language_code === params.language_code);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
      );
    }
    return items;
  }

  static async createMovieReview(dto: CreateMovieReviewDto): Promise<MovieReviewItem> {
    const payload = {
      title: dto.title,
      notificationtitle: dto.title,
      imagetitel: dto.title,
      content: dto.content || '',
      type: dto.type || 'Standard',
      subType: 'Reviews',
      language_code: dto.language_code || 'te',
      category_ids: dto.category_ids && dto.category_ids.length > 0 ? dto.category_ids : [5],
      location_ids: [19],
      isStickyPost: false,
      image_url: dto.image_url || null,
      chotarating: dto.chotarating || '3.5/5',
      externalRatings: dto.externalRatings || [],
      draft: Boolean(dto.draft),
      subLanguage: 'english',
    };

    try {
      const result = await apiClient.post<any, any>('/news-posts', payload);
      if (result && result.id) {
        const newItem: MovieReviewItem = {
          id: result.id,
          ...dto,
          subType: 'Reviews',
          createdAt: result.createdAt || new Date().toISOString(),
          totalReviews: 0,
          overallRating: 4.0,
        };
        this.localMovies.unshift(newItem);
        return newItem;
      }
    } catch (err) {
      console.error('Failed to create movie review on backend:', err);
    }

    const newItem: MovieReviewItem = {
      id: Date.now(),
      ...dto,
      subType: 'Reviews',
      createdAt: new Date().toISOString(),
      totalReviews: 0,
      overallRating: 4.0,
    };
    this.localMovies.unshift(newItem);
    return newItem;
  }

  static async updateMovieReview(id: number, dto: UpdateMovieReviewDto): Promise<MovieReviewItem> {
    const payload: Record<string, any> = {
      title: dto.title,
      notificationtitle: dto.title,
      imagetitel: dto.title,
      content: dto.content,
      type: dto.type || 'Standard',
      subType: 'Reviews',
      language_code: dto.language_code,
      category_ids: dto.category_ids && dto.category_ids.length > 0 ? dto.category_ids : [5],
      location_ids: [19],
      isStickyPost: false,
      image_url: dto.image_url || null,
      chotarating: dto.chotarating,
      externalRatings: dto.externalRatings,
      draft: dto.draft !== undefined ? Boolean(dto.draft) : false,
      subLanguage: 'english',
    };

    try {
      await apiClient.put(`/news-posts/${id}`, payload);
    } catch (err) {
      console.error('Failed to update movie review on backend:', err);
    }

    const index = this.localMovies.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.localMovies[index] = { ...this.localMovies[index], ...dto };
      return this.localMovies[index];
    }
    return { ...dto, id } as MovieReviewItem;
  }

  static async deleteMovieReview(id: number): Promise<void> {
    try {
      await apiClient.delete(`/news-posts/${id}`);
    } catch {
      // Continue
    }
    this.localMovies = this.localMovies.filter((m) => m.id !== id);
  }

  static async getMovieReviewDetails(id: number): Promise<any> {
    try {
      const res = await apiClient.get<any>(`/moviereviews/${id}`);
      if (res) return res;
    } catch {
      // Fallback mock breakdown
    }
    return {
      overall_rating: 4.2,
      critic_rating: 3.5,
      total_reviews: 48,
      movie_platform_ratings: [
        { platform_name: 'IMDb', platform_rating: '7.8/10' },
        { platform_name: 'BookMyShow', platform_rating: '84%' },
      ],
      user_reviews: [
        { id: 1, user_name: 'Suresh Kumar', rating: 4.5, comment: 'Breathtaking action sequences and thumping BGM!' },
        { id: 2, user_name: 'Ananya Reddy', rating: 4.0, comment: 'Great performance by lead actors. Well paced.' },
        { id: 3, user_name: 'Vikram Singh', rating: 4.0, comment: 'Intermission block was pure goosebumps.' },
      ],
    };
  }

  // ----------------------------------------------------
  // POLLS REPOSITORY
  // ----------------------------------------------------
  static async getPolls(params?: {
    skip?: number;
    limit?: number;
    language_code?: string;
    search?: string;
  }): Promise<PollItem[]> {
    try {
      const response = await apiClient.get<any[]>('/news-posts', {
        subType: 'Poll',
        skip: params?.skip || 0,
        limit: params?.limit || 50,
      });
      if (Array.isArray(response)) {
        const mapped = response
          .filter((p) => p.subType === 'Poll' || p.subType === 'Polls' || p.poll_options)
          .map((p) => ({
            id: p.id,
            title: p.title || '',
            content: p.content || '',
            type: p.type || 'Standard',
            subType: p.subType || 'Poll',
            language_code: p.language_code || p.lan || 'te',
            category_ids: p.category_ids || [],
            image_url: p.image_url || '',
            poll_options: Array.isArray(p.poll_options) ? p.poll_options : [],
            totalVotes: p.pollData?.totalVotes || p.totalVotes || 0,
            userHasVoted: p.pollData?.userHasVoted || false,
            userVotedOption: p.pollData?.userVotedOption,
            draft: Boolean(p.draft),
            createdAt: p.created || p.createdAt,
          }));

        let filtered = mapped;
        if (params?.language_code && params.language_code !== 'all') {
          filtered = filtered.filter((p) => p.language_code === params.language_code);
        }
        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(
            (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
          );
        }
        return filtered;
      }
    } catch {
      // Continue to local memory store on network error
    }

    let items = [...this.localPolls];
    if (params?.language_code && params.language_code !== 'all') {
      items = items.filter((p) => p.language_code === params.language_code);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      );
    }
    return items;
  }

  static async createPoll(dto: CreatePollDto): Promise<PollItem> {
    const payload = {
      title: dto.title,
      notificationtitle: dto.title,
      imagetitel: dto.title,
      content: dto.content || '',
      type: dto.type || 'Standard',
      subType: 'Poll',
      language_code: dto.language_code || 'te',
      category_ids: dto.category_ids && dto.category_ids.length > 0 ? dto.category_ids : [1],
      location_ids: [19],
      isStickyPost: false,
      image_url: dto.image_url || null,
      poll_options: dto.poll_options || [],
      draft: Boolean(dto.draft),
      subLanguage: 'english',
    };

    try {
      const result = await apiClient.post<any, any>('/news-posts', payload);
      if (result && result.id) {
        const newPoll: PollItem = {
          id: result.id,
          ...dto,
          subType: 'Poll',
          totalVotes: 0,
          userHasVoted: false,
          createdAt: result.createdAt || new Date().toISOString(),
        };
        this.localPolls.unshift(newPoll);
        return newPoll;
      }
    } catch (err) {
      console.error('Failed to create poll on backend:', err);
    }

    const newPoll: PollItem = {
      id: Date.now(),
      ...dto,
      subType: 'Poll',
      totalVotes: 0,
      userHasVoted: false,
      createdAt: new Date().toISOString(),
    };
    this.localPolls.unshift(newPoll);
    return newPoll;
  }

  static async updatePoll(id: number, dto: UpdatePollDto): Promise<PollItem> {
    const payload: Record<string, any> = {
      title: dto.title,
      notificationtitle: dto.title,
      imagetitel: dto.title,
      content: dto.content,
      type: dto.type || 'Standard',
      subType: 'Poll',
      language_code: dto.language_code,
      category_ids: dto.category_ids && dto.category_ids.length > 0 ? dto.category_ids : [1],
      location_ids: [19],
      isStickyPost: false,
      image_url: dto.image_url || null,
      poll_options: dto.poll_options,
      draft: dto.draft !== undefined ? Boolean(dto.draft) : false,
      subLanguage: 'english',
    };

    try {
      await apiClient.put(`/news-posts/${id}`, payload);
    } catch (err) {
      console.error('Failed to update poll on backend:', err);
    }

    const index = this.localPolls.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.localPolls[index] = { ...this.localPolls[index], ...dto };
      return this.localPolls[index];
    }
    return { ...dto, id } as PollItem;
  }

  static async deletePoll(id: number): Promise<void> {
    try {
      await apiClient.delete(`/news-posts/${id}`);
    } catch {
      // Continue
    }
    this.localPolls = this.localPolls.filter((p) => p.id !== id);
  }

  static async submitPollVote(submission: PollVoteSubmission): Promise<boolean> {
    try {
      await apiClient.post('/polls/submit', submission);
    } catch {
      // Continue to local update
    }

    const target = this.localPolls.find((p) => p.id === submission.post_id);
    if (target) {
      target.userHasVoted = true;
      target.userVotedOption = submission.selected_option;
      target.totalVotes = (target.totalVotes || 0) + 1;
      target.poll_options = target.poll_options.map((opt) => {
        const isSelected = opt.option === submission.selected_option;
        const newVotes = (opt.votes || 0) + (isSelected ? 1 : 0);
        return {
          ...opt,
          votes: newVotes,
          percentage: Number(((newVotes / (target.totalVotes || 1)) * 100).toFixed(1)),
        };
      });
    }
    return true;
  }

  static async getPollResults(id: number): Promise<any> {
    try {
      const res = await apiClient.get<any>(`/polls/${id}/results`);
      if (res) return res;
    } catch {
      // Continue
    }
    const poll = this.localPolls.find((p) => p.id === id);
    return {
      totalVotes: poll?.totalVotes || 1420,
      userHasVoted: poll?.userHasVoted || false,
      userVotedOption: poll?.userVotedOption || null,
      options: poll?.poll_options || [],
      topComments: [
        { userName: 'Ramesh Reddy', comment: 'Insightful debate on AP assembly proceedings.', createdAt: '2026-11-02T10:00:00Z' },
        { userName: 'Pooja Sharma', comment: 'Good initiative to track public opinion.', createdAt: '2026-11-02T11:30:00Z' },
      ],
    };
  }

  // ----------------------------------------------------
  
  // ----------------------------------------------------
  // CRICBUZZ LIVE & PUBLISHING SERVICE
  // ----------------------------------------------------
  static async getLiveMatches(cbTz = "+05:30", cbLoc = "IN"): Promise<CricbuzzLiveResponse> {
    try {
      const res = await cricketApiClient.get<any>("/cricket/matches/live", {
        params: {
          "CB-TZ": cbTz,
          "CB-loc": cbLoc,
        },
      });
      return res || { typeMatches: [] };
    } catch (err) {
      console.error("Failed to fetch live cricket feed:", err);
      return { typeMatches: [] };
    }
  }

  static async publishMatch(matchId: string | number): Promise<PublishedCricketMatch> {
    const res = await cricketApiClient.post<any>(`/cricket/matches/${matchId}/publish`, {
      isPublished: true,
    });
    return res?.data || res;
  }

  static async unpublishMatch(matchId: string | number): Promise<PublishedCricketMatch> {
    const res = await cricketApiClient.post<any>(`/cricket/matches/${matchId}/publish`, {
      isPublished: false,
    });
    return res?.data || res;
  }

  static async getRecentMatches(limit = 20): Promise<PublishedCricketMatch[]> {
    try {
      const res = await cricketApiClient.get<any>("/cricket/matches/recent", {
        params: { limit },
      });
      return res?.data?.matches || res?.matches || [];
    } catch (err) {
      console.error("Failed to fetch recent cricket matches:", err);
      return [];
    }
  }

  static async getMatchLiveScore(matchId: string | number): Promise<any> {
    try {
      const res = await cricketApiClient.get<any>(`/cricket/matches/${matchId}/livescore`);
      return res?.data || res;
    } catch (err) {
      console.error("Failed to fetch match livescore:", err);
      return null;
    }
  }

  // CRICKET MATCHES REPOSITORY
  // ----------------------------------------------------
  static async getCricketMatches(filter?: 'all' | 'live' | 'upcoming' | 'recent'): Promise<CricketMatchItem[]> {
    try {
      const res = await cricketApiClient.get<any>('/cricket/admin/matches');
      if (res?.success && Array.isArray(res?.data?.items) && res.data.items.length > 0) {
        const mapped: CricketMatchItem[] = res.data.items.map((m: any, idx: number) => {
          const t1ScoreParts = (m.team1Score || '0/0').split('/');
          const t2ScoreParts = (m.team2Score || '0/0').split('/');
          return {
            id: idx + 1,
            matchId: m.matchId || String(idx + 1),
            title: m.matchDesc || `${m.team1Name} vs ${m.team2Name}`,
            series: m.seriesName || 'Cricket Series',
            matchType: (m.matchFormat?.toUpperCase() === 'ODI' || m.matchFormat?.toUpperCase() === 'TEST') ? m.matchFormat.toUpperCase() : 'T20',
            venue: m.venue ? `${m.venue}${m.city ? ', ' + m.city : ''}` : 'Cricket Stadium',
            status: m.state === 'live' ? 'live' : m.state === 'upcoming' ? 'upcoming' : 'recent',
            statusText: m.status || (m.state === 'live' ? 'Live match in progress' : 'Scheduled match'),
            isPinned: Boolean(m.isPublished),
            startDate: m.startTime || new Date().toISOString(),
            team1: {
              teamName: m.team1Name,
              shortName: m.team1ShortName || m.team1Name?.substring(0, 3).toUpperCase(),
              runs: parseInt(t1ScoreParts[0], 10) || 0,
              wickets: parseInt(t1ScoreParts[1], 10) || 0,
              overs: parseFloat(m.team1Overs) || 0,
              crr: m.liveScorePayload?.miniscore?.currentRunRate,
            },
            team2: {
              teamName: m.team2Name,
              shortName: m.team2ShortName || m.team2Name?.substring(0, 3).toUpperCase(),
              runs: parseInt(t2ScoreParts[0], 10) || 0,
              wickets: parseInt(t2ScoreParts[1], 10) || 0,
              overs: parseFloat(m.team2Overs) || 0,
            },
            target: m.liveScorePayload?.miniscore?.target,
            rrr: m.liveScorePayload?.miniscore?.requiredRunRate,
            batsmen: [
              m.liveScorePayload?.miniscore?.batsmanStriker,
              m.liveScorePayload?.miniscore?.batsmanNonStriker,
            ].filter(Boolean),
            bowlers: [
              m.liveScorePayload?.miniscore?.bowlerStriker,
              m.liveScorePayload?.miniscore?.bowlerNonStriker,
            ].filter(Boolean),
          };
        });

        const activeMatches = mapped.filter((m) => m.status !== 'recent');
        this.localCricket = activeMatches;
        let items = activeMatches;
        if (filter && filter !== 'all') {
          items = items.filter((m) => m.status === filter);
        }
        return items;
      }
    } catch {
      // Fallback
    }

    try {
      const liveData = await this.getLiveMatches();
      if (liveData?.typeMatches && liveData.typeMatches.length > 0) {
        const liveItems: CricketMatchItem[] = [];
        liveData.typeMatches.forEach((tm) => {
          tm.seriesMatches?.forEach((sm) => {
            sm.seriesAdWrapper?.matches?.forEach((item) => {
              const { matchInfo, matchScore } = item;
              const t1 = matchScore?.team1Score?.inngs1;
              const t2 = matchScore?.team2Score?.inngs1;
              liveItems.push({
                id: matchInfo.matchId,
                matchId: String(matchInfo.matchId),
                title: `${matchInfo.matchDesc} - ${matchInfo.seriesName}`,
                series: matchInfo.seriesName,
                matchType: matchInfo.matchFormat?.toUpperCase() === 'ODI' ? 'ODI' : matchInfo.matchFormat?.toUpperCase() === 'TEST' ? 'TEST' : 'T20',
                venue: matchInfo.venueInfo?.ground ? `${matchInfo.venueInfo.ground}, ${matchInfo.venueInfo.city || ''}` : 'Cricket Ground',
                status: 'live',
                statusText: matchInfo.status || matchInfo.state || 'In Progress',
                isPinned: false,
                startDate: matchInfo.startDate || new Date().toISOString(),
                team1: {
                  teamName: matchInfo.team1?.teamName || 'Team 1',
                  shortName: matchInfo.team1?.teamSName || matchInfo.team1?.teamName?.slice(0, 3).toUpperCase() || 'T1',
                  runs: t1?.runs || 0,
                  wickets: t1?.wickets || 0,
                  overs: t1?.overs || 0,
                },
                team2: {
                  teamName: matchInfo.team2?.teamName || 'Team 2',
                  shortName: matchInfo.team2?.teamSName || matchInfo.team2?.teamName?.slice(0, 3).toUpperCase() || 'T2',
                  runs: t2?.runs || 0,
                  wickets: t2?.wickets || 0,
                  overs: t2?.overs || 0,
                },
              });
            });
          });
        });
        if (liveItems.length > 0) {
          this.localCricket = liveItems;
          return liveItems;
        }
      }
    } catch {
      // Fallback
    }

    let items = this.localCricket.filter((m) => m.status !== 'recent');
    if (filter && filter !== 'all') {
      items = items.filter((m) => m.status === filter);
    }
    return items;
  }

  static async updateCricketMatch(id: number, dto: UpdateCricketMatchDto): Promise<CricketMatchItem> {
    const index = this.localCricket.findIndex((m) => m.id === id);
    if (index !== -1) {
      const current = this.localCricket[index];
      const updated: CricketMatchItem = {
        ...current,
        ...dto,
        team1: { ...current.team1, ...(dto.team1 || {}) },
        team2: { ...current.team2, ...(dto.team2 || {}) },
      };
      this.localCricket[index] = updated;
      return updated;
    }
    return { ...dto, id } as CricketMatchItem;
  }

  static async togglePinMatch(id: number): Promise<CricketMatchItem> {
    const match = this.localCricket.find((m) => m.id === id);
    if (match) {
      const nextPinned = !match.isPinned;
      try {
        if (match.matchId) {
          if (nextPinned) {
            await cricketApiClient.post(`/cricket/matches/${match.matchId}/publish`, {});
          } else {
            await cricketApiClient.post(`/cricket/matches/${match.matchId}/unpublish`, {});
          }
        }
      } catch (err) {
        console.warn('Backend toggle cricket status failed, updating local state:', err);
      }
      match.isPinned = nextPinned;
      return { ...match };
    }
    throw new Error('Match not found');
  }

  // ----------------------------------------------------
  // IMAGE UPLOAD API
  // ----------------------------------------------------
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<{
      success: boolean;
      message?: string;
      data?: { url: string; id?: string; fileName?: string };
      url?: string;
    }>('https://api.pravasamedia.com/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: '*/*',
      },
    });

    const url = response.data?.data?.url || response.data?.url;
    if (!url) {
      throw new Error(response.data?.message || 'File upload failed');
    }
    return url;
  }
}

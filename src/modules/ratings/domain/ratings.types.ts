export type RatingsTabType = 'movie' | 'polls' | 'cricket' | 'events' | 'games';

export interface PlatformRatingItem {
  platform_name: string;
  platform_rating: string;
}

export interface MovieReviewGalleryItem {
  Url: string;
}

export interface MovieReviewItem {
  id: number;
  title: string;
  content: string;
  type: string;
  subType: string;
  language_code: string;
  category_ids: number[];
  image_url: string;
  video_url?: string;
  gallery?: MovieReviewGalleryItem[];
  chotarating: string;
  externalRatings: PlatformRatingItem[];
  draft: boolean;
  createdAt?: string;
  updatedAt?: string;
  totalViews?: number;
  totalLikes?: number;
  totalReviews?: number;
  overallRating?: number;
}

export interface CreateMovieReviewDto {
  title: string;
  content: string;
  type: string;
  subType: string;
  language_code: string;
  category_ids: number[];
  image_url: string;
  video_url?: string;
  gallery?: MovieReviewGalleryItem[];
  chotarating: string;
  externalRatings: PlatformRatingItem[];
  draft: boolean;
}

export interface UpdateMovieReviewDto extends Partial<CreateMovieReviewDto> {
  id?: number;
}

export interface PollOptionItem {
  option: number;
  option_name: string;
  votes?: number;
  percentage?: number;
}

export interface PollItem {
  id: number;
  title: string;
  content: string;
  type: string;
  subType: string;
  language_code: string;
  category_ids: number[];
  image_url: string;
  poll_options: PollOptionItem[];
  totalVotes?: number;
  userHasVoted?: boolean;
  userVotedOption?: number;
  draft: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePollDto {
  title: string;
  content: string;
  type: string;
  subType: string;
  language_code: string;
  category_ids: number[];
  image_url: string;
  poll_options: PollOptionItem[];
  draft: boolean;
}

export interface UpdatePollDto extends Partial<CreatePollDto> {
  id?: number;
}

export interface PollVoteSubmission {
  post_id: number;
  user_id: number;
  selected_option: number;
  comment?: string;
}

export type CricketMatchStatus = 'live' | 'upcoming' | 'recent';

export interface CricketBatsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isNotOut?: boolean;
}

export interface CricketBowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface CricketInningScore {
  teamName: string;
  shortName: string;
  logo?: string;
  runs: number;
  wickets: number;
  overs: number;
  crr?: number;
}

export interface CricketMatchItem {
  id: number;
  matchId: string;
  title: string;
  series: string;
  matchType: 'T20' | 'ODI' | 'TEST';
  venue: string;
  status: CricketMatchStatus;
  statusText: string;
  isPinned: boolean;
  startDate: string;
  team1: CricketInningScore;
  team2: CricketInningScore;
  battingTeamShortName?: string;
  target?: number;
  rrr?: number;
  tossWinner?: string;
  tossDecision?: string;
  batsmen?: CricketBatsman[];
  bowlers?: CricketBowler[];
}

export interface UpdateCricketMatchDto {
  id?: number;
  matchId?: string;
  title?: string;
  series?: string;
  matchType?: 'T20' | 'ODI' | 'TEST';
  venue?: string;
  status?: CricketMatchStatus;
  statusText?: string;
  isPinned?: boolean;
  team1?: Partial<CricketInningScore>;
  team2?: Partial<CricketInningScore>;
}

// ----------------------------------------------------
// CRICBUZZ LIVE FEED & PUBLISHING TYPES
// ----------------------------------------------------
export interface CricbuzzTeam {
  teamId: number;
  teamName: string;
  teamSName?: string;
  imageId?: number;
}

export interface CricbuzzVenue {
  id?: number;
  ground?: string;
  city?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
}

export interface CricbuzzInningsScore {
  inningsId: number;
  runs: number;
  wickets?: number;
  overs?: number;
  isDeclared?: boolean;
  isFollowOn?: boolean;
}

export interface CricbuzzTeamScore {
  inngs1?: CricbuzzInningsScore;
  inngs2?: CricbuzzInningsScore;
}

export interface CricbuzzMatchScore {
  team1Score?: CricbuzzTeamScore;
  team2Score?: CricbuzzTeamScore;
}

export interface CricbuzzMatchInfo {
  matchId: number;
  seriesId: number;
  seriesName: string;
  matchDesc: string;
  matchFormat: string;
  startDate: string;
  endDate: string;
  state: string;
  status?: string;
  team1: CricbuzzTeam;
  team2: CricbuzzTeam;
  venueInfo?: CricbuzzVenue;
  currBatTeamId?: number;
  stateTitle?: string;
}

export interface CricbuzzMatchItem {
  matchInfo: CricbuzzMatchInfo;
  matchScore?: CricbuzzMatchScore;
}

export interface CricbuzzSeriesMatch {
  seriesAdWrapper?: {
    seriesId: number;
    seriesName: string;
    matches: CricbuzzMatchItem[];
  };
  ad?: any;
}

export interface CricbuzzTypeMatch {
  matchType: 'International' | 'Domestic' | 'League' | 'Women' | string;
  seriesMatches: CricbuzzSeriesMatch[];
}

export interface CricbuzzLiveResponse {
  typeMatches: CricbuzzTypeMatch[];
  filters?: {
    matchType: string[];
  };
  responseLastUpdated?: string;
}

export interface PublishedCricketMatch {
  id: string;
  matchId: string;
  seriesName: string;
  matchDesc?: string;
  matchFormat?: string;
  state: string;
  status?: string;
  team1Name: string;
  team1ShortName?: string;
  team1Score?: string;
  team1Overs?: string;
  team2Name: string;
  team2ShortName?: string;
  team2Score?: string;
  team2Overs?: string;
  venue?: string;
  city?: string;
  isPublished: boolean;
  publishedAt?: string;
  updatedAt: string;
}

export interface RecentMatchesApiResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    matches: PublishedCricketMatch[];
  };
}

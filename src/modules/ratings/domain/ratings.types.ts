export type RatingsTabType = 'movie' | 'polls' | 'cricket';

export interface PlatformRatingItem {
  platform_name: string;
  platform_rating: string;
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

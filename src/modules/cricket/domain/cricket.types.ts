export type CricketMatchState = 'live' | 'recent' | 'upcoming';
export type CricketMatchFormat = 'T20' | 'ODI' | 'TEST';
export type PravasaMatchStatus = 'published' | 'unpublished';

export interface CricketMiniscorePlayer {
  id?: number | string;
  name?: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number | string;
  strkrate?: number | string;
  overs?: number | string;
  maidens?: number;
  wickets?: number;
  economy?: number | string;
}

export interface CricketMiniscore {
  runs?: number;
  overs?: number | string;
  target?: number;
  wickets?: number;
  inningsId?: number;
  inningsid?: number;
  currentRunRate?: number;
  requiredRunRate?: number;
  crr?: number;
  rrr?: number;
  lastUpdated?: string;
  responselastupdated?: number;
  inningsnbr?: string;
  custstatus?: string;
  batTeam?: {
    teamId: number | string;
    teamName: string;
    teamSName: string;
  };
  partnerShip?: {
    runs: number;
    balls: number;
  };
  partnership?: string | { runs: number; balls: number };
  batsmanStriker?: CricketMiniscorePlayer;
  batsmanNonStriker?: CricketMiniscorePlayer;
  batsmanstriker?: CricketMiniscorePlayer;
  batsmannonstriker?: CricketMiniscorePlayer;
  bowlerStriker?: CricketMiniscorePlayer;
  bowlerNonStriker?: CricketMiniscorePlayer;
  bowlerstriker?: CricketMiniscorePlayer;
  bowlernonstriker?: CricketMiniscorePlayer;
  recentOversStats?: string;
  curovsstats?: string;
  inningsscores?: {
    inningsscore?: Array<{
      inningsid?: number;
      batteamshortname?: string;
      runs?: number;
      wickets?: number;
      overs?: number | string;
    }>;
  };
}

export interface CricketLiveScorePayload {
  state?: string;
  status?: string;
  matchId?: string | number;
  miniscore?: CricketMiniscore;
  [key: string]: unknown;
}

export interface CricketMatch {
  id: string; // UUID or matchId
  matchId: string; // Cricbuzz matchId e.g. "161245"
  seriesId?: string | null;
  seriesName?: string | null;
  matchDesc?: string | null;
  matchFormat?: CricketMatchFormat | string | null;
  state: CricketMatchState | string;
  status?: string | null;
  team1Id?: string | null;
  team1Name: string;
  team1ShortName?: string | null;
  team1Score?: string | null;
  team1Overs?: string | null;
  team2Id?: string | null;
  team2Name: string;
  team2ShortName?: string | null;
  team2Score?: string | null;
  team2Overs?: string | null;
  currentInnings?: number | null;
  currentBattingTeam?: string | null;
  venue?: string | null;
  city?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  pravasaStatus?: PravasaMatchStatus;
  isPublished: boolean;
  publishedAt?: string | null;
  liveUrl?: string | null;
  liveCrickBuzzUrl?: string | null;
  accessKey?: string | null;
  liveScorePayload?: CricketLiveScorePayload | null;
  miniScorecardPayload?: unknown | null;
  lastSyncedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CricketAdminMatchesData {
  items: CricketMatch[];
  total: number;
  publishedCount: number;
  unpublishedCount: number;
  liveCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CricketAdminMatchesResponse {
  success: boolean;
  data: CricketAdminMatchesData;
  timestamp?: string;
}

export interface CricketStatusDto {
  matchId: string;
  pravasaStatus?: PravasaMatchStatus;
  status?: string;
  isPublished?: boolean;
}

export interface CricketStatusResponse {
  success: boolean;
  matchId: string;
  pravasaStatus: PravasaMatchStatus;
  isPublished: boolean;
  message: string;
}

export interface CricketPublishedMatchesResponse {
  count: number;
  liveUrl: string | null;
  liveCrickBuzzUrl: string | null;
  accessKey: string | null;
  matches: CricketMatch[];
}

export interface CricketPublishResponse {
  success: boolean;
  message: string;
  data: {
    matchId: string;
    seriesName?: string;
    isPublished: boolean;
    publishedAt?: string | null;
  };
}

export interface CricketBulkPublishResponse {
  success: boolean;
  message: string;
  data: {
    updatedCount: number;
    isPublished: boolean;
    matchIds: string[];
  };
}

export interface CricketSyncResponse {
  success: boolean;
  data?: {
    message?: string;
    result?: {
      liveCount: number;
      recentCount: number;
      upcomingCount: number;
      syncedAt: string;
    };
  };
  timestamp?: string;
}

export interface CricbuzzLiveFeedResponse {
  typeMatches?: Array<{
    matchType?: string;
    seriesMatches?: Array<{
      seriesAdWrapper?: {
        seriesId?: number | string;
        seriesName?: string;
        matches?: any[];
      };
      matches?: any[];
    }>;
  }>;
  matches?: any[];
  [key: string]: unknown;
}

export interface CricketFilterParams {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  state?: 'live' | 'recent' | 'upcoming';
  search?: string;
}


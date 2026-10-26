export interface GameItem {
  id: string;
  slug: string;
  name: string;
  gameType: 'sudoku' | 'patch' | 'zip' | string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  dailyPublishEnabled: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameDto {
  slug: string;
  name: string;
  gameType: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  dailyPublishEnabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateGameDto {
  name?: string;
  description?: string;
  dailyPublishEnabled?: boolean;
  isActive?: boolean;
  slug?: string;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface GameListResponse {
  items: GameItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
}

export interface LevelEngagementStats {
  membersPlayed: number;
  completed: number;
  failed: number;
  notCompleted: number;
  totalAttempts?: number;
  completionRate?: number;
  failureRate?: number;
}

export const DEFAULT_LEVEL_ICON_URL =
  'https://api.pravasamedia.com/api/v1/files/6b77d169-78ef-4c57-98ce-73b7a4ce6740';

export interface LevelItem {
  id: string;
  gameId: string;
  gameType?: string;
  levelId: string;
  levelNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | string;
  status: 'draft' | 'published' | 'archived' | string;
  iconUrl?: string | null;
  sortOrder?: number;
  content: Record<string, unknown>;
  publishedAt?: string | null;
  puzzleDate?: string | null;
  assignedDate?: string | null;
  isToday?: boolean;
  stats?: LevelEngagementStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface LevelListResponse {
  gameId: string;
  gameType?: string;
  items: LevelItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore?: boolean;
}

export interface GenerateLevelsDto {
  rows?: number;
  columns?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  count?: number;
  publish?: boolean;
  checkpointCount?: number;
  iconUrl?: string;
}

export interface CreateLevelDto {
  levelId: string;
  levelNumber: number;
  title: string;
  difficulty: string;
  status: string;
  iconUrl?: string;
  content: Record<string, unknown>;
}

export interface UpdateLevelDto {
  title?: string;
  difficulty?: string;
  levelNumber?: number;
  status?: string;
  iconUrl?: string;
  content?: Record<string, unknown>;
}

export interface ValidateLevelDto {
  content: Record<string, unknown>;
}

export interface ValidateLevelResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary?: unknown;
}

export interface AssignDailyLevelDto {
  levelIds: string[];
}

export interface AssignDailyLevelResponse {
  gameId: string;
  puzzleDate: string;
  timezone?: string;
  assignedLevelIds: string[];
}

export interface ImportLevelsDto {
  dryRun?: boolean;
  publishValid?: boolean;
  levels: Array<{
    levelId: string;
    levelNumber: number;
    title: string;
    difficulty: string;
    content: Record<string, unknown>;
  }>;
}

export interface StreakRecoveryItem {
  id: string;
  playerId: string;
  gameId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  reason: string;
  gapDays: number;
  requestedAt: string;
  adminNote?: string;
}

export interface StreakRecoveryListResponse {
  items: StreakRecoveryItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
}

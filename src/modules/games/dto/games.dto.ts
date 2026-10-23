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

export interface LevelItem {
  id: string;
  gameId: string;
  gameType?: string;
  levelId: string;
  levelNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | string;
  status: 'draft' | 'published' | 'archived' | string;
  sortOrder?: number;
  content: Record<string, unknown>;
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
}

export interface CreateLevelDto {
  levelId: string;
  levelNumber: number;
  title: string;
  difficulty: string;
  status: string;
  content: Record<string, unknown>;
}

export interface UpdateLevelDto {
  title?: string;
  difficulty?: string;
  levelNumber?: number;
  status?: string;
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

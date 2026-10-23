import { gamesApiClient } from '@/core/api/api-client';
import {
  GameItem,
  CreateGameDto,
  UpdateGameDto,
  GameListResponse,
  LevelListResponse,
  GenerateLevelsDto,
  CreateLevelDto,
  UpdateLevelDto,
  ValidateLevelDto,
  ValidateLevelResponse,
  AssignDailyLevelResponse,
  ImportLevelsDto,
  StreakRecoveryListResponse,
} from '../dto/games.dto';

export class GamesRepository {
  // === GAME CATALOGUE ===
  static async listGames(page = 1, pageSize = 50): Promise<GameListResponse> {
    return gamesApiClient.get<GameListResponse>('/admin/games', {
      page,
      pageSize,
    });
  }

  static async getGame(idOrSlug: string): Promise<GameItem> {
    const res = await gamesApiClient.get<{ data?: GameItem } | GameItem>(`/admin/games/${idOrSlug}`);
    if (res && typeof res === 'object' && 'data' in res && (res as any).data) {
      return (res as any).data;
    }
    return res as GameItem;
  }

  static async createGame(dto: CreateGameDto): Promise<{ message: string; data: GameItem }> {
    return gamesApiClient.post<{ message: string; data: GameItem }>('/admin/games', dto);
  }

  static async updateGame(idOrSlug: string, dto: UpdateGameDto): Promise<{ message: string; data: GameItem }> {
    return gamesApiClient.patch<{ message: string; data: GameItem }>(`/admin/games/${idOrSlug}`, dto);
  }

  static async toggleGameActive(idOrSlug: string, isActive: boolean): Promise<{ message: string; data: GameItem }> {
    return gamesApiClient.patch<{ message: string; data: GameItem }>(`/admin/games/${idOrSlug}`, { isActive });
  }

  static async deleteGame(idOrSlug: string): Promise<{ message: string; data?: unknown }> {
    return gamesApiClient.delete<{ message: string; data?: unknown }>(`/admin/games/${idOrSlug}`);
  }

  // === LEVEL MANAGEMENT ===
  static async listLevels(gameId: string, page = 1, pageSize = 50): Promise<LevelListResponse> {
    return gamesApiClient.get<LevelListResponse>(`/admin/games/${gameId}/levels`, {
      page,
      pageSize,
    });
  }

  static async generateLevels(gameId: string, params: GenerateLevelsDto): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels/generate`, params);
  }

  static async validateLevel(gameId: string, payload: ValidateLevelDto): Promise<ValidateLevelResponse> {
    return gamesApiClient.post<ValidateLevelResponse>(`/admin/games/${gameId}/levels/validate`, payload);
  }

  static async createLevel(gameId: string, dto: CreateLevelDto): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels`, dto);
  }

  static async updateLevel(gameId: string, levelId: string, dto: UpdateLevelDto): Promise<unknown> {
    return gamesApiClient.patch<unknown>(`/admin/games/${gameId}/levels/${levelId}`, dto);
  }

  static async deleteLevel(gameId: string, levelId: string): Promise<{ message: string; deletedLevelId?: string }> {
    return gamesApiClient.delete<{ message: string; deletedLevelId?: string }>(`/admin/games/${gameId}/levels/${levelId}`);
  }

  static async publishLevel(gameId: string, levelId: string): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels/${levelId}/publish`, {});
  }

  static async unpublishLevel(gameId: string, levelId: string): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels/${levelId}/unpublish`, {});
  }

  static async archiveLevel(gameId: string, levelId: string): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels/${levelId}/archive`, {});
  }

  static async assignDailyLevel(gameId: string, date: string, levelIds: string[]): Promise<AssignDailyLevelResponse> {
    return gamesApiClient.put<AssignDailyLevelResponse>(`/admin/games/${gameId}/daily-levels/${date}`, {
      levelIds,
    });
  }

  static async importLevels(gameId: string, data: ImportLevelsDto): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/games/${gameId}/levels/import`, data);
  }

  // === STREAK RECOVERY REVIEW ===
  static async listStreakRequests(page = 1, pageSize = 50): Promise<StreakRecoveryListResponse> {
    return gamesApiClient.get<StreakRecoveryListResponse>('/admin/streak-recovery-requests', {
      page,
      pageSize,
    });
  }

  static async approveStreakRequest(requestId: string, adminNote?: string): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/streak-recovery-requests/${requestId}/approve`, {
      adminNote,
    });
  }

  static async rejectStreakRequest(requestId: string, adminNote?: string): Promise<unknown> {
    return gamesApiClient.post<unknown>(`/admin/streak-recovery-requests/${requestId}/reject`, {
      adminNote,
    });
  }
}

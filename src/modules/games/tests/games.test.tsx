import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { GamesRepository } from '../repositories/games.repository';
import { useGamesController } from '../hooks/useGamesController';
import { gamesApiClient } from '@/core/api/api-client';
import { GamesTable } from '../components/GamesTable';
import { LevelsTable } from '../components/LevelsTable';
import { StreakRecoveryTable } from '../components/StreakRecoveryTable';
import { GameDrawer } from '../components/GameDrawer';
import { GameViewDialog } from '../components/GameViewDialog';
import { LevelDrawer } from '../components/LevelDrawer';
import { LevelViewDialog } from '../components/LevelViewDialog';
import { GenerateLevelsModal } from '../components/GenerateLevelsModal';
import { DailyAssignModal } from '../components/DailyAssignModal';
import { StreakActionDialog } from '../components/StreakActionDialog';
import { LevelPlayModal } from '../components/LevelPlayModal';
import { gamesTranslations } from '../pages/GamesPage';
import { PatchLevelValidator } from '../validators/patch-level.validator';
import { DEFAULT_LEVEL_ICON_URL } from '../dto/games.dto';
import { UploadService } from '@/modules/media/services/upload.service';

jest.mock('@/modules/media/services/upload.service', () => ({
  UploadService: {
    uploadImage: jest.fn().mockResolvedValue('https://api.pravasamedia.com/api/v1/files/custom-icon-uploaded.webp'),
  },
}));

jest.mock('@/core/api/api-client', () => ({
  gamesApiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  eventsApiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockGamesData = [
  {
    id: '3f2f8b50-9383-4db6-abfa-4ddb5a39b4a7',
    slug: 'sudoku',
    name: 'Sudoku',
    gameType: 'sudoku',
    isActive: true,
    dailyPublishEnabled: true,
    description: 'Classic number puzzle',
  },
  {
    id: '9d54983b-1478-4323-ac9a-4edb64c37a8c',
    slug: 'patch',
    name: 'Patch',
    gameType: 'patch',
    isActive: false,
    dailyPublishEnabled: false,
  },
];

const mockLevelsData = [
  {
    id: 'lvl_1',
    gameId: 'sudoku',
    levelId: 'sudoku_001',
    levelNumber: 1,
    title: 'Level 1',
    difficulty: 'easy',
    status: 'published',
    content: { grid: { rows: 6, columns: 6 } },
    publishedAt: '2026-10-22T10:30:00Z',
    createdAt: '2026-10-22T10:00:00Z',
    stats: {
      membersPlayed: 142,
      completed: 110,
      failed: 12,
      notCompleted: 20,
      totalAttempts: 160,
      completionRate: 77,
      failureRate: 8,
    },
  },
  {
    id: 'lvl_2',
    gameId: 'sudoku',
    levelId: 'sudoku_002',
    levelNumber: 2,
    title: 'Level 2',
    difficulty: 'hard',
    status: 'draft',
    content: { grid: { rows: 9, columns: 9 } },
    publishedAt: null,
    createdAt: '2026-10-22T11:00:00Z',
    stats: {
      membersPlayed: 0,
      completed: 0,
      failed: 0,
      notCompleted: 0,
      totalAttempts: 0,
      completionRate: 0,
      failureRate: 0,
    },
  },
];

const mockStreakData = [
  {
    id: 'req_123',
    playerId: 'player_456',
    gameId: 'sudoku',
    status: 'PENDING',
    reason: 'Sick with no internet',
    gapDays: 2,
    requestedAt: '2026-10-22T12:00:00Z',
  },
  {
    id: 'req_124',
    playerId: 'player_789',
    gameId: 'patch',
    status: 'APPROVED',
    reason: 'Power outage',
    gapDays: 1,
    requestedAt: '2026-10-21T12:00:00Z',
  },
];

const t = gamesTranslations.en;

describe('Games Module - Comprehensive Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (gamesApiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/admin/games') && url.includes('/levels')) {
        return Promise.resolve({ items: mockLevelsData, total: 2 });
      }
      if (url.includes('/admin/games/')) {
        return Promise.resolve({ data: mockGamesData[0] });
      }
      if (url.includes('/admin/games')) {
        return Promise.resolve({ items: mockGamesData, meta: { total: 2, page: 1, limit: 50, totalPages: 1 } });
      }
      if (url.includes('/admin/streak-recovery-requests')) {
        return Promise.resolve({ items: mockStreakData });
      }
      return Promise.resolve([]);
    });

    (gamesApiClient.post as jest.Mock).mockResolvedValue({ message: 'Success', valid: true });
    (gamesApiClient.patch as jest.Mock).mockResolvedValue({ message: 'Updated' });
    (gamesApiClient.put as jest.Mock).mockResolvedValue({ message: 'Assigned' });
    (gamesApiClient.delete as jest.Mock).mockResolvedValue({ message: 'Deleted' });
  });

  // ==========================================
  // REPOSITORY TESTS
  // ==========================================
  describe('GamesRepository', () => {
    it('calls listGames, getGame, createGame, updateGame, toggleGameActive, deleteGame', async () => {
      await GamesRepository.listGames(1, 20);
      expect(gamesApiClient.get).toHaveBeenCalledWith('/admin/games', { page: 1, pageSize: 20 });

      await GamesRepository.getGame('sudoku');
      expect(gamesApiClient.get).toHaveBeenCalledWith('/admin/games/sudoku');

      await GamesRepository.createGame({ slug: 'zip', name: 'Zip', gameType: 'zip' });
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games', { slug: 'zip', name: 'Zip', gameType: 'zip' });

      await GamesRepository.updateGame('sudoku', { name: 'Sudoku Pro' });
      expect(gamesApiClient.patch).toHaveBeenCalledWith('/admin/games/sudoku', { name: 'Sudoku Pro' });

      await GamesRepository.toggleGameActive('sudoku', false);
      expect(gamesApiClient.patch).toHaveBeenCalledWith('/admin/games/sudoku', { isActive: false });

      await GamesRepository.deleteGame('sudoku');
      expect(gamesApiClient.delete).toHaveBeenCalledWith('/admin/games/sudoku');
    });

    it('calls level management endpoints in GamesRepository', async () => {
      await GamesRepository.listLevels('sudoku', 1, 10);
      expect(gamesApiClient.get).toHaveBeenCalledWith('/admin/games/sudoku/levels', { page: 1, pageSize: 10 });

      await GamesRepository.generateLevels('sudoku', { rows: 6, columns: 6, count: 2, publish: true });
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/generate', {
        rows: 6,
        columns: 6,
        count: 2,
        publish: true,
      });

      await GamesRepository.validateLevel('sudoku', { content: {} });
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/validate', { content: {} });

      await GamesRepository.createLevel('sudoku', {
        levelId: 'sudoku_003',
        levelNumber: 3,
        title: 'Level 3',
        difficulty: 'medium',
        status: 'draft',
        content: {},
      });
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels', expect.any(Object));

      await GamesRepository.updateLevel('sudoku', 'sudoku_003', { title: 'Updated' });
      expect(gamesApiClient.patch).toHaveBeenCalledWith('/admin/games/sudoku/levels/sudoku_003', { title: 'Updated' });

      await GamesRepository.deleteLevel('sudoku', 'sudoku_003');
      expect(gamesApiClient.delete).toHaveBeenCalledWith('/admin/games/sudoku/levels/sudoku_003');

      await GamesRepository.publishLevel('sudoku', 'sudoku_001');
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/sudoku_001/publish', {});

      await GamesRepository.unpublishLevel('sudoku', 'sudoku_001');
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/sudoku_001/unpublish', {});

      await GamesRepository.archiveLevel('sudoku', 'sudoku_001');
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/sudoku_001/archive', {});

      await GamesRepository.assignDailyLevel('sudoku', '2026-10-23', ['sudoku_001']);
      expect(gamesApiClient.put).toHaveBeenCalledWith('/admin/games/sudoku/daily-levels/2026-10-23', {
        levelIds: ['sudoku_001'],
      });

      await GamesRepository.importLevels('sudoku', { dryRun: false, levels: [] });
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/import', {
        dryRun: false,
        levels: [],
      });
    });

    it('calls streak recovery review endpoints in GamesRepository', async () => {
      await GamesRepository.listStreakRequests(1, 10);
      expect(gamesApiClient.get).toHaveBeenCalledWith('/admin/streak-recovery-requests', { page: 1, pageSize: 10 });

      await GamesRepository.approveStreakRequest('req_123', 'Verified');
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/streak-recovery-requests/req_123/approve', {
        adminNote: 'Verified',
      });

      await GamesRepository.rejectStreakRequest('req_123', 'Limit exceeded');
      expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/streak-recovery-requests/req_123/reject', {
        adminNote: 'Limit exceeded',
      });
    });
  });

  // ==========================================
  // CONTROLLER HOOK TESTS
  // ==========================================
  describe('useGamesController', () => {
    const TestComponent = () => {
      const ctrl = useGamesController();
      return (
        <div>
          <div data-testid="active-tab">{ctrl.activeTab}</div>
          <button data-testid="switch-tab-1" onClick={() => ctrl.setActiveTab(1)}>Tab 1</button>
          <button data-testid="switch-tab-2" onClick={() => ctrl.setActiveTab(2)}>Tab 2</button>
          <div data-testid="games-count">{ctrl.games.length}</div>
          <button data-testid="filter-game" onClick={() => ctrl.setGamesFilter('sudoku')}>Filter</button>
          <button data-testid="clear-game-filter" onClick={ctrl.handleClearGamesFilter}>Clear</button>
          <button data-testid="add-game" onClick={ctrl.handleAddGameClick}>Add Game</button>
          <button data-testid="edit-game" onClick={() => ctrl.handleEditGameClick(mockGamesData[0])}>Edit Game</button>
          <button data-testid="view-game" onClick={() => ctrl.handleViewGameClick(mockGamesData[0])}>View Game</button>
          <button data-testid="toggle-active" onClick={() => ctrl.handleToggleGameActive(mockGamesData[0])}>Toggle Active</button>
          <button data-testid="view-levels-for-game" onClick={() => ctrl.handleViewLevelsForGame(mockGamesData[0])}>View Levels</button>
          <button data-testid="add-level" onClick={ctrl.handleAddLevelClick}>Add Level</button>
          <button data-testid="edit-level" onClick={() => ctrl.handleEditLevelClick(mockLevelsData[0])}>Edit Level</button>
          <button data-testid="view-level" onClick={() => ctrl.handleViewLevelClick(mockLevelsData[0])}>View Level</button>
          <button data-testid="publish-level" onClick={() => ctrl.handlePublishLevel(mockLevelsData[0])}>Publish</button>
          <button data-testid="unpublish-level" onClick={() => ctrl.handleUnpublishLevel(mockLevelsData[0])}>Unpublish</button>
          <button data-testid="archive-level" onClick={() => ctrl.handleArchiveLevel(mockLevelsData[0])}>Archive</button>
          <button data-testid="open-generate" onClick={() => ctrl.setGenerateModalOpen(true)}>Generate</button>
          <button data-testid="open-assign" onClick={() => ctrl.setDailyAssignModalOpen(true)}>Assign</button>
          <button data-testid="approve-streak" onClick={() => ctrl.handleOpenApproveStreak(mockStreakData[0])}>Approve Streak</button>
          <button data-testid="reject-streak" onClick={() => ctrl.handleOpenRejectStreak(mockStreakData[0])}>Reject Streak</button>
          <button data-testid="submit-streak-action" onClick={() => ctrl.handleSubmitStreakAction('Verified note')}>Submit Streak</button>
          <button data-testid="clear-levels-filter" onClick={ctrl.handleClearLevelsFilter}>Clear Levels Filter</button>
          <button data-testid="clear-streaks-filter" onClick={ctrl.handleClearStreaksFilter}>Clear Streaks Filter</button>
          <button data-testid="delete-game" onClick={() => ctrl.handleDeleteGame(mockGamesData[0])}>Delete Game</button>
          <button data-testid="delete-level" onClick={() => ctrl.handleDeleteLevel(mockLevelsData[0])}>Delete Level</button>
          <button data-testid="close-game-drawer" onClick={ctrl.handleCloseGameDrawer}>Close Game Drawer</button>
          <button data-testid="close-game-view" onClick={ctrl.handleCloseGameViewDialog}>Close Game View</button>
          <button data-testid="close-level-drawer" onClick={ctrl.handleCloseLevelDrawer}>Close Level Drawer</button>
          <button data-testid="close-level-view" onClick={ctrl.handleCloseLevelViewDialog}>Close Level View</button>
          <button data-testid="close-streak-dialog" onClick={ctrl.handleCloseStreakActionDialog}>Close Streak Dialog</button>
        </div>
      );
    };

    it('manages tabs, games fetching, filtering, drawer toggles, and level actions', async () => {
      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('games-count').textContent).toBe('2');
      });

      // Filter games
      fireEvent.click(screen.getByTestId('filter-game'));
      fireEvent.click(screen.getByTestId('clear-game-filter'));

      // Drawers and actions
      fireEvent.click(screen.getByTestId('add-game'));
      fireEvent.click(screen.getByTestId('edit-game'));
      fireEvent.click(screen.getByTestId('view-game'));
      fireEvent.click(screen.getByTestId('toggle-active'));

      // Switch to Levels tab
      fireEvent.click(screen.getByTestId('switch-tab-1'));
      expect(screen.getByTestId('active-tab').textContent).toBe('1');

      fireEvent.click(screen.getByTestId('add-level'));
      fireEvent.click(screen.getByTestId('edit-level'));
      fireEvent.click(screen.getByTestId('view-level'));
      fireEvent.click(screen.getByTestId('publish-level'));
      fireEvent.click(screen.getByTestId('unpublish-level'));
      fireEvent.click(screen.getByTestId('archive-level'));
      fireEvent.click(screen.getByTestId('clear-levels-filter'));

      // Switch to Streaks tab
      fireEvent.click(screen.getByTestId('switch-tab-2'));
      expect(screen.getByTestId('active-tab').textContent).toBe('2');

      fireEvent.click(screen.getByTestId('approve-streak'));
      fireEvent.click(screen.getByTestId('submit-streak-action'));
      fireEvent.click(screen.getByTestId('reject-streak'));
      fireEvent.click(screen.getByTestId('clear-streaks-filter'));

      // Delete game and level with confirm true and false
      jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
      fireEvent.click(screen.getByTestId('delete-game'));

      jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
      fireEvent.click(screen.getByTestId('delete-game'));

      jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
      fireEvent.click(screen.getByTestId('delete-level'));

      jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
      fireEvent.click(screen.getByTestId('delete-level'));

      // Close handlers
      fireEvent.click(screen.getByTestId('close-game-drawer'));
      fireEvent.click(screen.getByTestId('close-game-view'));
      fireEvent.click(screen.getByTestId('close-level-drawer'));
      fireEvent.click(screen.getByTestId('close-level-view'));
      fireEvent.click(screen.getByTestId('close-streak-dialog'));
    });
  });

  // ==========================================
  // PRESENTATION COMPONENT TESTS
  // ==========================================
  describe('GamesTable component', () => {
    it('renders games and triggers callbacks', () => {
      const onStatusToggle = jest.fn();
      const onView = jest.fn();
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      const onViewLevels = jest.fn();

      render(
        <GamesTable
          data={mockGamesData}
          isDark={false}
          t={t}
          onStatusToggle={onStatusToggle}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewLevels={onViewLevels}
        />
      );

      expect(screen.getByText('Sudoku')).toBeInTheDocument();
      expect(screen.getByText('Patch')).toBeInTheDocument();

      // Click status toggle
      const activeChips = screen.getAllByText(t.active);
      fireEvent.click(activeChips[0]);
      expect(onStatusToggle).toHaveBeenCalledWith(mockGamesData[0]);

      // Click Edit
      const editBtns = screen.getAllByText(t.btnEdit);
      fireEvent.click(editBtns[0]);
      expect(onEdit).toHaveBeenCalledWith(mockGamesData[0]);

      // Click Levels
      const levelBtns = screen.getAllByText(t.viewLevels);
      fireEvent.click(levelBtns[0]);
      expect(onViewLevels).toHaveBeenCalledWith(mockGamesData[0]);
    });
  });

  describe('LevelsTable component', () => {
    it('renders levels and handles publish/unpublish/archive', () => {
      const onView = jest.fn();
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      const onPublish = jest.fn();
      const onUnpublish = jest.fn();
      const onArchive = jest.fn();
      const onPlay = jest.fn();

      render(
        <LevelsTable
          data={mockLevelsData}
          isDark={true}
          t={t}
          onView={onView}
          onPlay={onPlay}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onArchive={onArchive}
        />
      );

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.getByText('Published At')).toBeInTheDocument();
      expect(screen.getByText('Not Published')).toBeInTheDocument();

      // Engagement columns and values
      expect(screen.getByText('Played')).toBeInTheDocument();
      expect(screen.getByText('Middle Drop')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('142')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();

      // Publish / Unpublish icon clicks
      const unpublishBtns = screen.getAllByTitle('Unpublish (Revert to Draft)');
      fireEvent.click(unpublishBtns[0]);
      expect(onUnpublish).toHaveBeenCalledWith(mockLevelsData[0]);

      const publishBtns = screen.getAllByTitle('Publish Level');
      fireEvent.click(publishBtns[0]);
      expect(onPublish).toHaveBeenCalledWith(mockLevelsData[1]);

      const playBtns = screen.getAllByLabelText('Play Level');
      fireEvent.click(playBtns[0]);
      expect(onPlay).toHaveBeenCalledWith(mockLevelsData[0]);

      const viewBtns = screen.getAllByLabelText('View Level');
      fireEvent.click(viewBtns[0]);
      expect(onView).toHaveBeenCalledWith(mockLevelsData[0]);

      const archiveBtns = screen.getAllByLabelText('Archive Level');
      fireEvent.click(archiveBtns[0]);
      expect(onArchive).toHaveBeenCalledWith(mockLevelsData[0]);

      const editBtns = screen.getAllByText(t.btnEdit);
      fireEvent.click(editBtns[0]);
      expect(onEdit).toHaveBeenCalledWith(mockLevelsData[0]);

      const deleteBtns = screen.getAllByText(t.btnDelete);
      fireEvent.click(deleteBtns[0]);
      expect(onDelete).toHaveBeenCalledWith(mockLevelsData[0]);
    });
  });

  describe('StreakRecoveryTable component', () => {
    it('renders streak requests and triggers approve/reject', () => {
      const onApprove = jest.fn();
      const onReject = jest.fn();

      render(
        <StreakRecoveryTable
          data={mockStreakData}
          isDark={false}
          t={t}
          onApprove={onApprove}
          onReject={onReject}
        />
      );

      expect(screen.getByText('player_456')).toBeInTheDocument();
      expect(screen.getByText('player_789')).toBeInTheDocument();

      const approveBtn = screen.getByText('Approve');
      fireEvent.click(approveBtn);
      expect(onApprove).toHaveBeenCalledWith(mockStreakData[0]);

      const rejectBtn = screen.getByText('Reject');
      fireEvent.click(rejectBtn);
      expect(onReject).toHaveBeenCalledWith(mockStreakData[0]);
    });
  });

  describe('GameDrawer component', () => {
    it('renders form inputs and saves new game', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <GameDrawer
          open={true}
          isEditMode={false}
          selectedGame={null}
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={false}
          t={t}
        />
      );

      expect(screen.getByText(t.drawerAddGame)).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/Game Name/i), { target: { value: 'Zip' } });
      fireEvent.change(screen.getByLabelText(/Slug/i), { target: { value: 'zip' } });

      fireEvent.click(screen.getByText(t.btnSave));

      await waitFor(() => {
        expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games', expect.any(Object));
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('uploads game icon and supports resetting to default', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <GameDrawer
          open={true}
          isEditMode={true}
          selectedGame={mockGamesData[0]}
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={false}
          t={t}
        />
      );

      // Verify file upload
      const fileInput = screen.getByTestId('game-icon-file-input') as HTMLInputElement;
      const fakeFile = new File(['fake game icon'], 'game_icon.png', { type: 'image/png' });
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [fakeFile] } });
      });

      await waitFor(() => {
        expect(UploadService.uploadImage).toHaveBeenCalledWith(fakeFile);
      });

      // Reset to default
      const resetBtn = screen.getByText(t.useDefaultIcon);
      fireEvent.click(resetBtn);
      const urlInput = screen.getByPlaceholderText(DEFAULT_LEVEL_ICON_URL) as HTMLInputElement;
      expect(urlInput.value).toBe(DEFAULT_LEVEL_ICON_URL);
    });
  });

  describe('GameViewDialog component', () => {
    it('renders game attributes', () => {
      const onClose = jest.fn();
      render(
        <GameViewDialog
          open={true}
          onClose={onClose}
          game={mockGamesData[0]}
          isDark={true}
          t={t}
        />
      );

      expect(screen.getByText('Sudoku')).toBeInTheDocument();
      expect(screen.getByText(/3f2f8b50-9383-4db6-abfa-4ddb5a39b4a7/i)).toBeInTheDocument();
    });
  });

  describe('LevelDrawer component', () => {
    it('validates and submits level content', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <LevelDrawer
          open={true}
          isEditMode={false}
          gameId="sudoku"
          selectedLevel={null}
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={false}
          t={t}
        />
      );

      fireEvent.change(screen.getByLabelText(/Level ID/i), { target: { value: 'sudoku_100' } });
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Special 100' } });

      // Click Validate Payload
      fireEvent.click(screen.getByText('Validate Payload'));

      await waitFor(() => {
        expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/validate', expect.any(Object));
      });

      // Submit
      fireEvent.click(screen.getByText(t.btnSave));
      await waitFor(() => {
        expect(gamesApiClient.post).toHaveBeenCalledWith(
          '/admin/games/sudoku/levels',
          expect.objectContaining({
            levelId: 'sudoku_100',
            title: 'Special 100',
            iconUrl: DEFAULT_LEVEL_ICON_URL,
          })
        );
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('uploads custom level icon file and supports resetting to default', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <LevelDrawer
          open={true}
          isEditMode={false}
          gameId="sudoku"
          selectedLevel={null}
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={false}
          t={t}
        />
      );

      // Verify default icon is initially set
      const iconInput = screen.getByPlaceholderText(DEFAULT_LEVEL_ICON_URL) as HTMLInputElement;
      expect(iconInput.value).toBe(DEFAULT_LEVEL_ICON_URL);

      // Upload custom icon file
      const fileInput = screen.getByTestId('level-icon-file-input') as HTMLInputElement;
      const fakeFile = new File(['fake image data'], 'custom_icon.png', { type: 'image/png' });
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [fakeFile] } });
      });

      await waitFor(() => {
        expect(UploadService.uploadImage).toHaveBeenCalledWith(fakeFile);
      });

      await waitFor(() => {
        expect(iconInput.value).toBe('https://api.pravasamedia.com/api/v1/files/custom-icon-uploaded.webp');
      });

      // Reset to default
      const resetBtn = screen.getByText(t.useDefaultIcon);
      fireEvent.click(resetBtn);
      expect(iconInput.value).toBe(DEFAULT_LEVEL_ICON_URL);
    });
  });

  describe('LevelViewDialog component', () => {
    it('renders level payload and details', () => {
      const onClose = jest.fn();
      render(
        <LevelViewDialog
          open={true}
          onClose={onClose}
          level={mockLevelsData[0]}
          isDark={true}
          t={t}
        />
      );

      expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Published At/i)).toBeInTheDocument();
      expect(screen.getByText(/Level Content & Solutions/i)).toBeInTheDocument();
      expect(screen.getByText(/Player Engagement & Dropout Stats/i)).toBeInTheDocument();
      expect(screen.getByText('142')).toBeInTheDocument();
      expect(screen.getByText('110')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  describe('GenerateLevelsModal component', () => {
    it('triggers procedural generation with params', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <GenerateLevelsModal
          open={true}
          gameId="sudoku"
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={true}
          t={t}
        />
      );

      fireEvent.click(screen.getByText('Generate Now'));

      await waitFor(() => {
        expect(gamesApiClient.post).toHaveBeenCalledWith('/admin/games/sudoku/levels/generate', expect.objectContaining({
          rows: 6,
          columns: 6,
          difficulty: 'medium',
          count: 3,
          publish: true,
          iconUrl: DEFAULT_LEVEL_ICON_URL,
        }));
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('DailyAssignModal component', () => {
    it('assigns daily level date', async () => {
      const onClose = jest.fn();
      const onSuccess = jest.fn();

      render(
        <DailyAssignModal
          open={true}
          gameId="sudoku"
          onClose={onClose}
          onSuccess={onSuccess}
          isDark={false}
          t={t}
        />
      );

      fireEvent.change(screen.getByLabelText(/Level IDs/i), { target: { value: 'sudoku_001, sudoku_002' } });
      fireEvent.click(screen.getByText('Assign Date'));

      await waitFor(() => {
        expect(gamesApiClient.put).toHaveBeenCalledWith(
          expect.stringContaining('/admin/games/sudoku/daily-levels/'),
          { levelIds: ['sudoku_001', 'sudoku_002'] }
        );
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('StreakActionDialog component', () => {
    it('submits admin note on approve', async () => {
      const onClose = jest.fn();
      const onSubmit = jest.fn().mockResolvedValue(undefined);

      render(
        <StreakActionDialog
          open={true}
          request={mockStreakData[0]}
          actionType="approve"
          onClose={onClose}
          onSubmit={onSubmit}
          isDark={false}
          t={t}
        />
      );

      expect(screen.getByText(/Approve Streak Recovery/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Confirm Approval'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.any(String));
      });
    });
  });

  describe('LevelPlayModal component', () => {
    it('renders Sudoku player and interacts with number pad', () => {
      const onClose = jest.fn();
      render(
        <LevelPlayModal
          open={true}
          onClose={onClose}
          level={mockLevelsData[0]}
          gameType="sudoku"
          isDark={true}
        />
      );

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('SUDOKU')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders Zip puzzle player with interactive checkpoints, undo and solution', () => {
      const onClose = jest.fn();
      const zipLevel = {
        id: 'zip-1',
        levelId: 'zip_001',
        gameId: 'zip',
        gameType: 'zip',
        levelNumber: 1,
        title: 'Zip Level 1',
        difficulty: 'easy',
        status: 'published',
        content: {
          rows: 3,
          columns: 3,
          checkpoints: [
            { order: 1, row: 0, col: 0 },
            { order: 2, row: 0, col: 2 },
            { order: 3, row: 2, col: 2 },
          ],
          solution: [
            [0, 0], [0, 1], [0, 2], [1, 2], [2, 2]
          ],
        },
      };

      render(
        <LevelPlayModal
          open={true}
          onClose={onClose}
          level={zipLevel}
          gameType="zip"
          isDark={false}
        />
      );

      expect(screen.getByText('Zip Level 1')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
      expect(screen.getByText('Show Solution')).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();

      // Click show solution
      fireEvent.click(screen.getByText('Show Solution'));
      expect(screen.getByText('Hide Solution')).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByText('Close Preview'));
      expect(onClose).toHaveBeenCalled();
    });

    it('renders Patch puzzle player without crashing on object-based or array-based piece cells', () => {
      const onClose = jest.fn();
      const patchLevel = {
        id: 'patch-1',
        levelId: 'patch_001',
        gameId: 'patch',
        gameType: 'patch',
        levelNumber: 1,
        title: 'Patch Level 1',
        difficulty: 'medium',
        status: 'draft',
        content: {
          rows: 4,
          columns: 4,
          pieces: [
            {
              id: 'p1',
              cells: [
                { row: 0, col: 0 },
                { row: 0, col: 1 },
                { row: 1, col: 0 },
              ],
            },
            {
              id: 'p2',
              cells: [
                [0, 0],
                [1, 0],
              ],
            },
          ],
        },
      };

      render(
        <LevelPlayModal
          open={true}
          onClose={onClose}
          level={patchLevel}
          gameType="patch"
          isDark={true}
        />
      );

      expect(screen.getByText('Patch Level 1')).toBeInTheDocument();
      expect(screen.getByText('PATCH')).toBeInTheDocument();
      expect(screen.getByText('Sq')).toBeInTheDocument();
      expect(screen.getByText('Wide')).toBeInTheDocument();
      expect(screen.getByText('Tall')).toBeInTheDocument();
      expect(screen.getByText(/Drag/)).toBeInTheDocument();
      expect(screen.getByLabelText('Reset')).toBeInTheDocument();
    });

    it('displays BigTV watermark upon solving puzzle', () => {
      const onClose = jest.fn();
      const patchLevel = {
        id: 'patch-1',
        levelId: 'patch_001',
        gameId: 'patch',
        gameType: 'patch',
        levelNumber: 1,
        title: 'Patch Level 1',
        difficulty: 'medium',
        status: 'draft',
        content: {
          rows: 6,
          columns: 6,
        },
      };

      render(
        <LevelPlayModal
          open={true}
          onClose={onClose}
          level={patchLevel}
          gameType="patch"
          isDark={true}
        />
      );

      const hintBtn = screen.getByLabelText('Hint / Solution');
      fireEvent.click(hintBtn);

      expect(screen.getByText('Board Complete! 🎉')).toBeInTheDocument();
      expect(screen.getByTestId('bigtv-board-watermark')).toBeInTheDocument();
      expect(screen.getByTestId('bigtv-bg-watermark')).toBeInTheDocument();
    });
  });

  describe('PatchLevelValidator', () => {
    it('passes valid 5x5 Level 1 payload from specification', () => {
      const validPayload = {
        grid: { rows: 5, columns: 5 },
        clues: [
          { row: 0, col: 0, value: 2, shape: 'wide' },
          { row: 0, col: 2, value: 3, shape: 'wide' },
          { row: 1, col: 0, value: 2, shape: 'wide' },
          { row: 1, col: 2, value: 3, shape: 'wide' },
          { row: 2, col: 0, value: 3, shape: 'wide' },
          { row: 3, col: 0, value: 2, shape: 'tall' },
          { row: 3, col: 1, value: 2, shape: 'tall' },
          { row: 3, col: 2, value: 2, shape: 'tall' },
          { row: 2, col: 3, value: 3, shape: 'tall' },
          { row: 2, col: 4, value: 3, shape: 'tall' },
        ],
        pieces: [
          { id: 'p_1', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
          { id: 'p_2', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
          { id: 'p_3', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }] },
          { id: 'p_4', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
          { id: 'p_5', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }] },
          { id: 'p_6', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
          { id: 'p_7', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
          { id: 'p_8', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }] },
          { id: 'p_9', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }] },
          { id: 'p_10', cells: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }] },
        ],
      };

      const result = PatchLevelValidator.validate(validPayload);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('rejects non-rectangular pieces (Rule 1: Pure Rectangles Only)', () => {
      const payload = {
        grid: { rows: 5, columns: 5 },
        pieces: [
          {
            id: 'l_shape',
            cells: [
              { row: 0, col: 0 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
        ],
      };

      const result = PatchLevelValidator.validate(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('not a pure rectangle'))).toBe(true);
    });

    it('rejects oversized pieces > 6 on 5x5 board (Rule 2: No Oversized Pieces)', () => {
      const payload = {
        grid: { rows: 5, columns: 5 },
        pieces: [
          {
            id: 'big_piece',
            cells: [
              { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 },
              { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
            ],
          },
        ],
      };

      const result = PatchLevelValidator.validate(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('exceeds maximum allowed size'))).toBe(true);
    });

    it('rejects clues with shape "poly" or invalid shape', () => {
      const payload = {
        grid: { rows: 5, columns: 5 },
        clues: [
          { row: 0, col: 0, value: 5, shape: 'poly' },
        ],
      };

      const result = PatchLevelValidator.validate(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Pure rectangles only'))).toBe(true);
    });
  });
});

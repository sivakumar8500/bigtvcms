import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdsDynapixController } from '../hooks/useAdsDynapixController';
import { adsDynapixRepository } from '../repositories/ads-dynapix.repository';

const mockBanners = [
  {
    id: '10bf4d64-82e3-493a-8a23-2f71d686a619',
    productName: 'Awesome TV Package',
    bigTvBanner: { HBanner: ['img1'], VBanner: [] },
    dynapixBanner: { HBanner: [], VBanner: [] },
    createdAt: '2026-08-18T09:15:09.633Z',
    updatedAt: '2026-08-18T09:15:09.633Z',
  },
  {
    id: '058e23fc-4cce-425d-a098-87da842eacd2',
    productName: 'Siva_Kumar',
    bigTvBanner: { HBanner: [], VBanner: [] },
    dynapixBanner: { HBanner: [], VBanner: [] },
    createdAt: '2026-08-18T09:25:40.005Z',
    updatedAt: '2026-08-18T09:25:40.005Z',
  },
];

describe('useAdsDynapixController', () => {
  beforeEach(() => {
    jest.spyOn(adsDynapixRepository, 'getBanners').mockResolvedValue(mockBanners);
    jest.spyOn(adsDynapixRepository, 'deleteBanner').mockResolvedValue(true);
    jest.spyOn(adsDynapixRepository, 'createBanner').mockResolvedValue({
      id: 'new-id-123',
      productName: 'Test Banner',
      bigTvBanner: { HBanner: ['url1'], VBanner: [] },
      dynapixBanner: { HBanner: [], VBanner: [] },
      createdAt: '2026-08-18T12:00:00.000Z',
      updatedAt: '2026-08-18T12:00:00.000Z',
    });
    jest.spyOn(adsDynapixRepository, 'updateBanner').mockResolvedValue({
      id: '10bf4d64-82e3-493a-8a23-2f71d686a619',
      productName: 'Updated TV Package',
      bigTvBanner: { HBanner: ['img1'], VBanner: [] },
      dynapixBanner: { HBanner: [], VBanner: [] },
      createdAt: '2026-08-18T09:15:09.633Z',
      updatedAt: '2026-08-18T12:00:00.000Z',
    });
    jest.spyOn(adsDynapixRepository, 'uploadFile').mockResolvedValue({
      id: 'file-123',
      url: 'https://api.pravasamedia.com/api/v1/files/file-123',
      originalName: 'test.png',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads banners and handles title and id filtering', async () => {
    const { result } = renderHook(() => useAdsDynapixController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.banners.length).toBe(2);

    act(() => {
      result.current.setFilterTitle('Awesome');
    });

    expect(result.current.paginatedData.every((c) => c.productName.includes('Awesome'))).toBe(true);

    act(() => {
      result.current.setFilterTitle('');
      result.current.setFilterId('10bf4d64');
    });

    expect(result.current.paginatedData.every((c) => c.id.includes('10bf4d64'))).toBe(true);
  });

  it('handles drawer open, product name change, file upload, and banner creation', async () => {
    const { result } = renderHook(() => useAdsDynapixController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleOpenDrawer();
      result.current.handleProductNameChange('New Product Banner');
    });

    expect(result.current.drawerOpen).toBe(true);
    expect(result.current.createForm.productName).toBe('New Product Banner');

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const fileList = {
      0: file,
      length: 1,
      item: (i: number) => file,
    } as unknown as FileList;

    await act(async () => {
      await result.current.handleFileUpload('bigTvBanner', 'HBanner', fileList);
    });

    expect(result.current.createForm.bigTvBanner.HBanner.length).toBe(1);

    await act(async () => {
      await result.current.handleCreateSubmit();
    });

    expect(adsDynapixRepository.createBanner).toHaveBeenCalledWith({
      productName: 'New Product Banner',
      bigTvBanner: {
        HBanner: ['https://api.pravasamedia.com/api/v1/files/file-123'],
        VBanner: [],
      },
      dynapixBanner: {
        HBanner: [],
        VBanner: [],
      },
    });

    expect(result.current.drawerOpen).toBe(false);
  });

  it('handles edit mode pre-fill and banner update submission', async () => {
    const { result } = renderHook(() => useAdsDynapixController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const targetBanner = mockBanners[0];

    act(() => {
      result.current.handleEditBanner(targetBanner);
    });

    expect(result.current.drawerOpen).toBe(true);
    expect(result.current.editingBannerId).toBe(targetBanner.id);
    expect(result.current.createForm.productName).toBe('Awesome TV Package');

    act(() => {
      result.current.handleProductNameChange('Updated TV Package');
    });

    await act(async () => {
      await result.current.handleCreateSubmit();
    });

    expect(adsDynapixRepository.updateBanner).toHaveBeenCalledWith(
      targetBanner.id,
      expect.objectContaining({
        productName: 'Updated TV Package',
      })
    );

    expect(result.current.drawerOpen).toBe(false);
    expect(result.current.editingBannerId).toBe(null);
  });

  it('handles banner details modal and delete action', async () => {
    const { result } = renderHook(() => useAdsDynapixController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstBanner = result.current.banners[0];

    act(() => {
      result.current.handleViewBanner(firstBanner);
    });

    expect(result.current.detailsModalOpen).toBe(true);
    expect(result.current.selectedBanner?.id).toBe(firstBanner.id);

    act(() => {
      result.current.handleCloseDetailsModal();
    });

    expect(result.current.detailsModalOpen).toBe(false);

    await act(async () => {
      await result.current.deleteBanner(firstBanner.id);
    });

    expect(adsDynapixRepository.deleteBanner).toHaveBeenCalledWith(firstBanner.id);
  });
});

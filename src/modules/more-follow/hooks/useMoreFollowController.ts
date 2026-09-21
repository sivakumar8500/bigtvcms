import { useState, useEffect, useMemo } from 'react';
import { MoreFollowItem } from '../domain/more-follow.model';
import { MoreFollowRepository } from '../repositories/more-follow.repository';

export function useMoreFollowController() {
  const [data, setData] = useState<MoreFollowItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(10);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MoreFollowItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await MoreFollowRepository.getAll();
      setData(list);
    } catch (e) {
      console.error('Failed to load MoreFollow items:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter(
      (item) =>
        (item.morefollowName && item.morefollowName.toLowerCase().includes(q)) ||
        (item.morefollowNameTranslations?.en && item.morefollowNameTranslations.en.toLowerCase().includes(q)) ||
        (item.morefollowNameTranslations?.te && item.morefollowNameTranslations.te.toLowerCase().includes(q)) ||
        (item.morefollowNameTranslations?.hi && item.morefollowNameTranslations.hi.toLowerCase().includes(q)) ||
        (item.morefollowNameTranslations?.ml && item.morefollowNameTranslations.ml.toLowerCase().includes(q)) ||
        String(item.id).includes(q) ||
        String(item.morefollowId).includes(q)
    );
  }, [data, searchQuery]);

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, page, recordsPerPage]);

  const toggleActive = async (id: number) => {
    const item = data.find((i) => i.id === id || i.morefollowId === id);
    if (!item) return;
    const nextActive = !item.isActive;
    setData((prev) => prev.map((i) => (i.id === id || i.morefollowId === id ? { ...i, isActive: nextActive } : i)));
    await MoreFollowRepository.update(id, { isActive: nextActive });
  };

  const handleOpenAddDrawer = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: MoreFollowItem) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    setData((prev) => prev.filter((i) => i.id !== id && i.morefollowId !== id));
    await MoreFollowRepository.delete(id);
  };

  const handleSaveItem = async (payload: {
    morefollowName: string;
    morefollowNameTranslations: {
      en?: string;
      te?: string;
      hi?: string;
      ml?: string;
    };
    imageUrl?: string;
    isActive?: boolean;
  }) => {
    if (editingItem) {
      const updated = await MoreFollowRepository.update(editingItem.id, {
        translations: payload.morefollowNameTranslations,
        image_url: payload.imageUrl,
        isActive: payload.isActive,
      });
      setData((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
    } else {
      const created = await MoreFollowRepository.create({
        translations: payload.morefollowNameTranslations,
        image_url: payload.imageUrl || '',
        isActive: payload.isActive ?? true,
      });
      setData((prev) => [created, ...prev]);
    }
    handleCloseDrawer();
  };

  return {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    recordsPerPage,
    totalPages,
    totalRecords,
    paginatedData,
    toggleActive,
    isDrawerOpen,
    editingItem,
    handleOpenAddDrawer,
    handleOpenEditDrawer,
    handleCloseDrawer,
    handleDeleteItem,
    handleSaveItem,
    reload: loadData,
  };
}

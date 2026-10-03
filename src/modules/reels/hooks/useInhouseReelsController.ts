import { useState, useEffect, useMemo } from 'react';
import { eventsApiClient } from '@/core/api/api-client';
import { UploadedReel } from '../domain/reels.model';

export const useInhouseReelsController = () => {
  const [data, setData] = useState<UploadedReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState('');
  const recordsPerPage = 10;

  const fetchReels = async () => {
    setLoading(true);
    try {
      const response = await eventsApiClient.get<any>('/reels');
      let reelsArray: UploadedReel[] = [];
      if (Array.isArray(response)) {
        reelsArray = response;
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        reelsArray = response.data;
      }
      setData(reelsArray);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];
    if (filterTitle) {
      const lowerFilter = filterTitle.toLowerCase();
      result = result.filter(r => (r?.title || '').toLowerCase().includes(lowerFilter));
    }
    return result;
  }, [data, filterTitle]);

  const totalPages = Math.ceil((filteredData?.length || 0) / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, page, recordsPerPage]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReel, setSelectedReel] = useState<UploadedReel | null>(null);

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedReel(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (reel: UploadedReel) => {
    setIsEditMode(true);
    setSelectedReel(reel);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedReel(null);
      setIsEditMode(false);
    }, 300);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reel?')) return;
    try {
      await eventsApiClient.delete(`/reels/${id}`);
      fetchReels();
    } catch (err: any) {
      console.error('Failed to delete:', err);
      alert(err.message || 'Failed to delete reel');
    }
  };

  const handleStatusToggle = async (reel: UploadedReel) => {
    try {
      const currentStatus = reel.publishing?.isActive ?? false;
      const nextIsActive = !currentStatus;
      await eventsApiClient.patch(`/reels/${reel.id}`, { 
        publishing: { 
          isActive: nextIsActive,
          status: nextIsActive ? 'published' : 'draft'
        } 
      });
      fetchReels();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err.message || 'Failed to update status');
    }
  };

  return {
    data,
    paginatedData,
    loading,
    error,
    page,
    totalPages,
    setPage,
    filterTitle,
    setFilterTitle,
    fetchReels,
    drawerOpen,
    isEditMode,
    selectedReel,
    handleAddClick,
    handleEditClick,
    handleCloseDrawer,
    handleDelete,
    handleStatusToggle,
  };
};

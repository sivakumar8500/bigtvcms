import { useState, useEffect, useMemo } from 'react';
import { eventsApiClient } from '@/core/api/api-client';

export interface Reporter {
  id: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  languages?: string[];
  specializations?: string[];
  isActive: boolean;
  isVerified: boolean;
  employment?: {
    designation?: string;
    department?: string;
    role?: string;
  };
  location?: {
    city?: string;
    state?: string;
  };
  createdAt?: string;
}

export const useReporterController = () => {
  const [data, setData] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const recordsPerPage = 10;

  const fetchReporters = async () => {
    setLoading(true);
    try {
      const response = await eventsApiClient.get<any>('/reporters');
      let reportersArray: Reporter[] = [];
      if (Array.isArray(response)) {
        reportersArray = response;
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        reportersArray = response.data;
      } else if (response && typeof response === 'object' && Array.isArray(response.items)) {
        reportersArray = response.items;
      } else {
        console.warn('Unexpected response format from /reporters:', response);
      }
      setData(reportersArray);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load reporters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporters();
  }, []);

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];
    if (filterName) {
      const lowerFilter = filterName.toLowerCase();
      result = result.filter(r => (r?.name || '').toLowerCase().includes(lowerFilter));
    }
    return result;
  }, [data, filterName]);

  const totalPages = Math.ceil((filteredData?.length || 0) / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, page, recordsPerPage]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<Reporter | null>(null);

  const handleClearFilters = () => {
    setFilterName('');
    setPage(1);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedReporter(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (reporter: Reporter) => {
    setIsEditMode(true);
    setSelectedReporter(reporter);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedReporter(null);
      setIsEditMode(false);
    }, 300);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reporter?')) return;
    try {
      await eventsApiClient.delete(`/reporters/${id}`);
      fetchReporters();
    } catch (err: any) {
      console.error('Failed to delete:', err);
      alert(err.message || 'Failed to delete reporter');
    }
  };

  const handleStatusToggle = async (reporter: Reporter) => {
    try {
      await eventsApiClient.patch(`/reporters/${reporter.id}`, { isActive: !reporter.isActive });
      fetchReporters();
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
    filterName,
    setFilterName,
    handleClearFilters,
    fetchReporters,
    drawerOpen,
    isEditMode,
    selectedReporter,
    handleAddClick,
    handleEditClick,
    handleCloseDrawer,
    handleDelete,
    handleStatusToggle,
  };
};

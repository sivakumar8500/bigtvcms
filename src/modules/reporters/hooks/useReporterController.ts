'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Reporter,
  ReporterLanguage,
  ReporterLanguageCode,
  SegregatedReporters,
} from '../domain/Reporter';
import { reportersRepository } from '../repositories/reporters.repository';

export type { Reporter, ReporterLanguage, ReporterLanguageCode, SegregatedReporters };

export const useReporterController = (initialLanguage?: ReporterLanguageCode) => {
  const [selectedLanguage, setSelectedLanguage] = useState<ReporterLanguageCode>(initialLanguage || 'te');
  const [data, setData] = useState<Reporter[]>([]);
  const [segregatedData, setSegregatedData] = useState<SegregatedReporters>({
    te: [],
    en: [],
    ml: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const recordsPerPage = 10;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<Reporter | null>(null);

  const fetchReporters = useCallback(async (lang: ReporterLanguageCode = selectedLanguage) => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedList, segregated] = await Promise.all([
        reportersRepository.getReporters(lang),
        reportersRepository.getSegregatedReporters().catch(() => ({ te: [], en: [], ml: [] })),
      ]);

      setData(fetchedList || []);
      setSegregatedData(segregated || { te: [], en: [], ml: [] });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load reporters');
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    fetchReporters(selectedLanguage);
  }, [selectedLanguage, fetchReporters]);

  const handleLanguageChange = (lang: ReporterLanguageCode) => {
    setSelectedLanguage(lang);
    setPage(1);
  };

  const languageCounts = useMemo(() => {
    const teCount = segregatedData.te?.length || 0;
    const enCount = segregatedData.en?.length || 0;
    const mlCount = segregatedData.ml?.length || 0;
    const allCount = teCount + enCount + mlCount;
    return {
      te: teCount,
      en: enCount,
      ml: mlCount,
      all: allCount,
    };
  }, [segregatedData]);

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];
    if (filterName) {
      const lowerFilter = filterName.toLowerCase();
      result = result.filter((r) => (r?.name || '').toLowerCase().includes(lowerFilter));
    }
    return result;
  }, [data, filterName]);

  const totalPages = Math.ceil((filteredData?.length || 0) / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, page, recordsPerPage]);

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

  const handleViewClick = (reporter: Reporter) => {
    setSelectedReporter(reporter);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setTimeout(() => {
      setSelectedReporter(null);
    }, 300);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedReporter(null);
      setIsEditMode(false);
    }, 300);
  };

  const handleDelete = async (id: string) => {
    try {
      await reportersRepository.deleteReporter(id);
      fetchReporters(selectedLanguage);
    } catch (err: any) {
      console.error('Failed to delete:', err);
      alert(err.message || 'Failed to delete reporter');
    }
  };

  const handleStatusToggle = async (reporter: Reporter) => {
    try {
      await reportersRepository.updateReporter(reporter.id, { isActive: !reporter.isActive });
      fetchReporters(selectedLanguage);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      alert(err.message || 'Failed to update status');
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    languageCounts,
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
    viewDialogOpen,
    isEditMode,
    selectedReporter,
    handleAddClick,
    handleEditClick,
    handleViewClick,
    handleCloseDrawer,
    handleCloseViewDialog,
    handleDelete,
    handleStatusToggle,
  };
};

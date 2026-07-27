import { useState, useEffect, useCallback } from 'react';
import { LocationState } from '../domain/location.model';
import { createLocationSchema, LocationFormData } from '../validators/location.validator';
import { useLanguageStore } from '@/core/storage/language-store';
import { LocationRepository } from '../repositories/location.repository';
import { LocationMapper } from '../mapper/location.mapper';
import { CreateStateDto, UpdateStateDto } from '../dto/location.dto';

export function useLocationController() {
  const { activeLanguages, setLocations } = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const effectiveActiveLangs = activeLanguages && activeLanguages.length > 0 ? activeLanguages : ['en', 'te', 'hi', 'ml'];
  const schema = createLocationSchema(effectiveActiveLangs);

  const [rows, setRows] = useState<LocationState[]>([]);

  // Fetch states/locations from backend API (/admin/states)
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const dtos = await LocationRepository.getAll(0, 100);
      const domainList = LocationMapper.toDomainList(dtos);
      setRows(domainList);
      if (domainList.length > 0) {
        setLocations(domainList);
      }
    } catch (error) {
      console.error('Failed to fetch states from /admin/states:', error);
    } finally {
      setLoading(false);
    }
  }, [setLocations]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form states
  const emptyForm: LocationFormData = {
    stateEn: '',
    stateTe: '',
    stateHi: '',
    stateMl: '',
    status: true,
  };
  const [form, setForm] = useState<LocationFormData>(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter & Pagination logic
  const filtered = rows.filter((r) => {
    const matchName =
      r.stateEn.toLowerCase().includes(filterName.toLowerCase()) ||
      r.stateTe.toLowerCase().includes(filterName.toLowerCase()) ||
      r.stateHi.toLowerCase().includes(filterName.toLowerCase()) ||
      r.stateMl.toLowerCase().includes(filterName.toLowerCase());
    const matchId = filterId.trim() === '' || String(r.stateId).includes(filterId.trim());
    return matchName && matchId;
  });

  useEffect(() => {
    setPage(1);
  }, [filterName, filterId]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const toggleFollow = async (id: number) => {
    const target = rows.find((l) => l.stateId === id);
    if (!target) return;

    const newFollow = !target.isFollowed;
    // Optimistic update
    setRows((prev) =>
      prev.map((l) => (l.stateId === id ? { ...l, isFollowed: newFollow } : l))
    );

    try {
      const updatePayload: UpdateStateDto = {
        translations: {
          en: target.stateEn || '',
          te: target.stateTe || '',
          ml: target.stateMl || '',
        },
        is_active: newFollow,
      };
      await LocationRepository.update(id, updatePayload);
    } catch (error) {
      console.error('Failed to update state status:', error);
      // Revert on failure
      setRows((prev) =>
        prev.map((l) => (l.stateId === id ? { ...l, isFollowed: !newFollow } : l))
      );
    }
  };

  const handleEditClick = (loc: LocationState) => {
    setEditingId(loc.stateId);
    setForm({
      stateEn: loc.stateEn || '',
      stateTe: loc.stateTe || '',
      stateHi: loc.stateHi || '',
      stateMl: loc.stateMl || '',
      status: loc.isFollowed,
    });
    setUploadedImage(loc.imageUrl || null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: string, val: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (submitted) {
        const res = schema.safeParse(updated);
        if (res.success) {
          setErrors({});
        } else {
          const errMap: Record<string, string> = {};
          res.error.issues.forEach((issue) => {
            if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
          });
          setErrors(errMap);
        }
      }
      return updated;
    });
  };

  const handleImageUploaded = (dataUrl: string | null) => {
    setUploadedImage(dataUrl);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setUploadedImage(null);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const validationResult = schema.safeParse(form);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return false;
    }

    try {
      if (isEditMode && editingId !== null) {
        const updatePayload: UpdateStateDto = {
          translations: {
            en: form.stateEn || '',
            te: form.stateTe || '',
            ml: form.stateMl || '',
          },
          is_active: form.status !== false,
        };
        const dto = await LocationRepository.update(editingId, updatePayload);
        const updatedItem = LocationMapper.toDomain(dto);
        setRows((prev) => prev.map((l) => (l.stateId === editingId ? updatedItem : l)));
      } else {
        const createPayload: CreateStateDto = {
          translations: {
            en: form.stateEn || '',
            te: form.stateTe || '',
            ml: form.stateMl || '',
          },
          is_active: form.status !== false,
        };
        const dto = await LocationRepository.create(createPayload);
        const newItem = LocationMapper.toDomain(dto);
        setRows((prev) => [newItem, ...prev]);
      }
      handleCloseDrawer();
      return true;
    } catch (error: any) {
      console.error('Failed to save state:', error);
      setErrors({ submit: error?.message || 'Failed to save state' });
      return false;
    }
  };

  const deleteLocation = async (id: number) => {
    const prevRows = [...rows];
    setRows((prev) => prev.filter((l) => l.stateId !== id));

    try {
      await LocationRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete state:', error);
      setRows(prevRows);
    }
  };

  return {
    rows,
    loading,
    filtered,
    paginatedData,
    page,
    totalPages,
    setPage,
    filterName,
    setFilterName,
    filterId,
    setFilterId,
    toggleFollow,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    errors,
    activeLanguages: effectiveActiveLangs,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteLocation,
    fetchLocations,
  };
}

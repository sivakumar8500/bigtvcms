import { useState, useEffect, useCallback } from 'react';
import { Language } from '../domain/language.model';
import { languageSchema, LanguageFormData } from '../validators/language.validator';
import { useLanguageStore, SupportedLanguage } from '@/core/storage/language-store';
import { LanguageRepository } from '../repositories/language.repository';
import { LanguageMapper } from '../mapper/language.mapper';

export function useLanguageController() {
  const { activeLanguages, toggleLanguageActive, setSystemLanguages } = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Language[]>([]);

  // Fetch languages from backend API on mount
  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const dtos = await LanguageRepository.getAll(0, 100);
      const domainList = LanguageMapper.toDomainList(dtos);
      setRows(domainList);
      if (domainList.length > 0) {
        setSystemLanguages(domainList);
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    } finally {
      setLoading(false);
    }
  }, [setSystemLanguages]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form states
  const emptyForm: LanguageFormData = {
    code: '',
    nameEn: '',
    nameTe: '',
    nameHi: '',
    nameMl: '',
    symbol: '',
    slogan: '',
    isSystemActive: true,
  };
  const [form, setForm] = useState<LanguageFormData>(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter & Pagination logic
  const filtered = rows.filter((r) => {
    const matchName =
      r.languageName.toLowerCase().includes(filterName.toLowerCase()) ||
      r.nameEn.toLowerCase().includes(filterName.toLowerCase()) ||
      r.code.toLowerCase().includes(filterName.toLowerCase());
    const matchId = filterId.trim() === '' || String(r.languageId).includes(filterId.trim());
    return matchName && matchId;
  });

  useEffect(() => {
    setPage(1);
  }, [filterName, filterId]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const toggleActive = async (id: number) => {
    const target = rows.find((r) => r.languageId === id);
    if (!target) return;

    const newStatus = !target.isSystemActive;
    // Optimistic update
    setRows((prev) =>
      prev.map((r) => (r.languageId === id ? { ...r, isSystemActive: newStatus } : r))
    );

    try {
      await LanguageRepository.update(id, { status: newStatus });
      toggleLanguageActive(target.code as SupportedLanguage);
    } catch (error) {
      console.error('Failed to update language status:', error);
      // Revert on failure
      setRows((prev) =>
        prev.map((r) => (r.languageId === id ? { ...r, isSystemActive: !newStatus } : r))
      );
    }
  };

  const handleEditClick = (lang: Language) => {
    setEditingId(lang.languageId);
    setForm({
      code: lang.code,
      nameEn: lang.nameEn || lang.nameMap?.en || '',
      nameTe: lang.nameTe || lang.nameMap?.te || '',
      nameHi: lang.nameHi || lang.nameMap?.hi || '',
      nameMl: lang.nameMl || lang.nameMap?.ml || '',
      symbol: lang.symbol || '',
      slogan: lang.slogan || '',
      isSystemActive: lang.isSystemActive,
    });
    setUploadedImage(lang.imageUrl || null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: keyof LanguageFormData, val: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (submitted) {
        const res = languageSchema.safeParse(updated);
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
    const validationResult = languageSchema.safeParse(form);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return false;
    }

    const payload = {
      code: form.code,
      name: {
        en: form.nameEn,
        te: form.nameTe,
        hi: form.nameHi || '',
        ml: form.nameMl,
      },
      status: form.isSystemActive,
      symbol: form.symbol || form.code.substring(0, 1).toUpperCase(),
    };

    try {
      if (isEditMode && editingId !== null) {
        const dto = await LanguageRepository.update(editingId, payload);
        const updatedItem = LanguageMapper.toDomain(dto);
        setRows((prev) => prev.map((r) => (r.languageId === editingId ? updatedItem : r)));
      } else {
        const dto = await LanguageRepository.create(payload);
        const newItem = LanguageMapper.toDomain(dto);
        setRows((prev) => [newItem, ...prev]);
      }
      handleCloseDrawer();
      return true;
    } catch (error: any) {
      console.error('Failed to save language:', error);
      setErrors({ submit: error?.message || 'Failed to save language' });
      return false;
    }
  };

  const deleteLanguage = async (id: number) => {
    const prevRows = [...rows];
    setRows((prev) => prev.filter((l) => l.languageId !== id));

    try {
      await LanguageRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete language:', error);
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
    toggleActive,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    uploadedImage,
    errors,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteLanguage,
    fetchLanguages,
  };
}

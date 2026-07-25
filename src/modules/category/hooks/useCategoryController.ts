import { useState, useEffect } from 'react';
import { Category } from '../domain/category.model';
import { categorySchema } from '../validators/category.validator';
import { useLanguageStore } from '@/core/storage/language-store';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryMapper } from '../mapper/category.mapper';
import { showToast } from '@/shared/utils/toast';

export function useCategoryController() {
  const { language } = useLanguageStore();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form states
  const emptyForm = {
    nameEn: '',
    nameTe: '',
    nameHi: '',
    nameMl: '',
    icon: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const dtos = await CategoryRepository.getAll(language);
      const domainCategories = CategoryMapper.toDomainList(dtos);
      setRows(domainCategories);
      setError(null);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to fetch categories';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [language]);

  useEffect(() => {
    if (typeof useLanguageStore.getState === 'function') {
      const { setCategories } = useLanguageStore.getState();
      if (typeof setCategories === 'function') {
        setCategories(rows);
      }
    }
  }, [rows]);

  // Filter & Pagination logic
  const filtered = rows.filter((r) => {
    return (
      r.nameEn.toLowerCase().includes(filterText.toLowerCase()) ||
      r.nameTe.toLowerCase().includes(filterText.toLowerCase()) ||
      r.nameHi.toLowerCase().includes(filterText.toLowerCase()) ||
      r.nameMl.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  useEffect(() => {
    setPage(1);
  }, [filterText]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const toggleFollow = async (id: number) => {
    const category = rows.find((c) => c.categoryId === id);
    if (!category) return;
    const originalFollow = category.isFollowed;
    setRows((prev) =>
      prev.map((c) =>
        c.categoryId === id ? { ...c, isFollowed: !c.isFollowed } : c
      )
    );
    try {
      const updateDto = CategoryMapper.toUpdateDto(
        {
          nameEn: category.nameEn,
          nameTe: category.nameTe,
          nameHi: category.nameHi,
          nameMl: category.nameMl,
          icon: category.icon,
        },
        !originalFollow
      );
      await CategoryRepository.update(id, updateDto);
      showToast(`Category ${!originalFollow ? 'followed' : 'unfollowed'} successfully!`, 'info');
    } catch (err) {
      setRows((prev) =>
        prev.map((c) =>
          c.categoryId === id ? { ...c, isFollowed: originalFollow } : c
        )
      );
      showToast('Failed to update category follow status', 'error');
    }
  };

  const toggleActive = async (id: number) => {
    const category = rows.find((c) => c.categoryId === id);
    if (!category) return;
    const originalActive = category.isActive;
    setRows((prev) =>
      prev.map((c) =>
        c.categoryId === id ? { ...c, isActive: !c.isActive } : c
      )
    );
    try {
      const updateDto = CategoryMapper.toUpdateDto(
        {
          nameEn: category.nameEn,
          nameTe: category.nameTe,
          nameHi: category.nameHi,
          nameMl: category.nameMl,
          icon: category.icon,
        },
        !originalActive
      );
      await CategoryRepository.update(id, updateDto);
      showToast(`Category ${!originalActive ? 'activated' : 'deactivated'} successfully!`, 'info');
    } catch (err) {
      setRows((prev) =>
        prev.map((c) =>
          c.categoryId === id ? { ...c, isActive: originalActive } : c
        )
      );
      showToast('Failed to update category status', 'error');
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.categoryId);
    setForm({
      nameEn: cat.nameEn,
      nameTe: cat.nameTe,
      nameHi: cat.nameHi,
      nameMl: cat.nameMl,
      icon: cat.icon || '',
    });
    setUploadedImage(cat.imageUrl || null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: string, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };

      // Mutual exclusivity between Emoji and Image Uploader
      if (field === 'icon' && val) {
        setUploadedImage(null);
      }

      if (submitted) {
        const res = categorySchema.safeParse(updated);
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
    if (dataUrl) {
      setForm((prev) => ({ ...prev, icon: '' }));
    }
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
    const submitForm = {
      ...form,
      nameHi: form.nameHi || form.nameEn,
    };
    const validationResult = categorySchema.safeParse(submitForm);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
    }

    // Custom check: At least emoji or uploaded image is required
    if (!submitForm.icon && !uploadedImage) {
      errMap.icon = 'Either an emoji icon or cover image is required';
    }

    if (Object.keys(errMap).length > 0) {
      setErrors(errMap);
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editingId !== null) {
        const updateDto = CategoryMapper.toUpdateDto(submitForm);
        const response = await CategoryRepository.update(editingId, updateDto);
        const updatedDomain = CategoryMapper.toDomain(response.data);
        // keep local properties like isFollowed
        const originalCategory = rows.find((c) => c.categoryId === editingId);
        setRows((prev) =>
          prev.map((c) =>
            c.categoryId === editingId
              ? {
                  ...updatedDomain,
                  isFollowed: originalCategory ? originalCategory.isFollowed : false,
                  icon: submitForm.icon,
                  imageUrl: uploadedImage || undefined,
                }
              : c
          )
        );
        showToast('Category updated successfully!', 'success');
      } else {
        const createDto = CategoryMapper.toCreateDto(submitForm);
        const response = await CategoryRepository.create(createDto);
        const newDomain = CategoryMapper.toDomain(response.data);
        setRows((prev) => [
          {
            ...newDomain,
            icon: submitForm.icon,
            imageUrl: uploadedImage || undefined,
          },
          ...prev,
        ]);
        showToast('Category created successfully!', 'success');
      }
      handleCloseDrawer();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to save category';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      await CategoryRepository.delete(id);
      setRows((prev) => prev.filter((c) => c.categoryId !== id));
      setError(null);
      showToast('Category deleted successfully!', 'info');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to delete category';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    rows,
    loading,
    error,
    filtered,
    paginatedData,
    page,
    totalPages,
    setPage,
    filterText,
    setFilterText,
    toggleFollow,
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
    deleteCategory,
  };
}

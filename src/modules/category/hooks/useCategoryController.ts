import { useState, useEffect } from 'react';
import { Category } from '../domain/category.model';
import { categorySchema } from '../validators/category.validator';
import { useLanguageStore } from '@/core/storage/language-store';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryMapper } from '../mapper/category.mapper';
import { showToast } from '@/shared/utils/toast';
import { UploadService } from '@/modules/media/services/upload.service';

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
  };
  const [form, setForm] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const dtos = await CategoryRepository.getAll();
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
  }, []);

  useEffect(() => {
    if (typeof useLanguageStore.getState === 'function') {
      const { setCategories } = useLanguageStore.getState();
      if (typeof setCategories === 'function') {
        setCategories(rows.map((r) => ({ ...r, icon: r.icon || '' })));
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
        },
        !originalFollow,
        category.imageUrl
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
        },
        !originalActive,
        category.imageUrl
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
    const catName = cat.categoryName || '';
    setForm({
      nameEn: cat.nameEn || (/^[a-zA-Z0-9\s\-_&]+$/.test(catName.trim()) ? catName.trim() : ''),
      nameTe: cat.nameTe || (/[\u0C00-\u0C7F]/.test(catName) ? catName.trim() : ''),
      nameHi: cat.nameHi || (/[\u0900-\u097F]/.test(catName) ? catName.trim() : ''),
      nameMl: cat.nameMl || (/[\u0D00-\u0D7F]/.test(catName) ? catName.trim() : ''),
    });
    setUploadedImage(cat.imageUrl || null);
    setSelectedFile(null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: string, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };

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

  const handleImageUploaded = (dataUrl: string | null, file?: File | null) => {
    setUploadedImage(dataUrl);
    if (file !== undefined) {
      setSelectedFile(file);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setUploadedImage(null);
    setSelectedFile(null);
    setErrors({});
    setSubmitted(false);
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const submitForm = {
      ...form,
    };
    const validationResult = categorySchema.safeParse(submitForm);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
    }

    if (Object.keys(errMap).length > 0) {
      setErrors(errMap);
      return;
    }

    setErrors({});
    setIsUploading(true);
    let finalCategoryImageUrl = uploadedImage || '';

    try {
      if (selectedFile) {
        finalCategoryImageUrl = await UploadService.uploadImage(selectedFile);
      } else if (uploadedImage && uploadedImage.startsWith('data:')) {
        try {
          const arr = uploadedImage.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
          const ext = mime.split('/')[1] || 'png';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const generatedFile = new File([u8arr], `category_img.${ext}`, { type: mime });
          finalCategoryImageUrl = await UploadService.uploadImage(generatedFile);
        } catch (e) {
          console.error('Failed to convert base64 to file, fallback to base64 URL', e);
        }
      }

      if (isEditMode && editingId !== null) {
        const originalCategory = rows.find((c) => c.categoryId === editingId);
        const isActive = originalCategory ? originalCategory.isActive : true;
        const updateDto = CategoryMapper.toUpdateDto(submitForm, isActive, finalCategoryImageUrl || undefined);
        const response = await CategoryRepository.update(editingId, updateDto);
        const updatedDomain = response.data ? CategoryMapper.toDomain(response.data) : null;
        setRows((prev) =>
          prev.map((c) =>
            c.categoryId === editingId
              ? {
                  ...(updatedDomain || c),
                  isFollowed: originalCategory ? originalCategory.isFollowed : false,
                  imageUrl: finalCategoryImageUrl || updatedDomain?.imageUrl || c.imageUrl,
                }
              : c
          )
        );
        showToast('Category updated successfully!', 'success');
      } else {
        const createDto = CategoryMapper.toCreateDto(submitForm, finalCategoryImageUrl || undefined);
        const response = await CategoryRepository.create(createDto);
        const newDomain = response.data ? CategoryMapper.toDomain(response.data) : null;
        const newCat: Category = {
          categoryId: newDomain?.categoryId || Date.now(),
          categoryName: newDomain?.categoryName || submitForm.nameEn,
          isFollowed: false,
          isActive: true,
          nameEn: submitForm.nameEn,
          nameTe: submitForm.nameTe,
          nameHi: submitForm.nameHi,
          nameMl: submitForm.nameMl,
          imageUrl: finalCategoryImageUrl || newDomain?.imageUrl,
        };
        setRows((prev) => [newCat, ...prev]);
        showToast('Category created successfully!', 'success');
      }
      handleCloseDrawer();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to save category';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsUploading(false);
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
    isUploading,
    errors,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteCategory,
  };
}

import { useState, useEffect } from 'react';
import { Tag } from '../domain/tags.model';
import { tagSchema } from '../validators/tags.validator';
import { useLanguageStore } from '@/core/storage/language-store';
import { TagsRepository } from '../repositories/tags.repository';
import { TagMapper } from '../mapper/tags.mapper';
import { UploadService } from '@/modules/media/services/upload.service';
import { showToast } from '@/shared/utils/toast';

export function useTagsController() {
  const { language } = useLanguageStore();
  const [rows, setRows] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  const fetchTags = async () => {
    setLoading(true);
    try {
      const dtos = await TagsRepository.getAll(language);
      const domainTags = TagMapper.toDomainList(dtos);
      setRows(domainTags);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [language]);

  useEffect(() => {
    if (typeof useLanguageStore.getState === 'function') {
      const { setTags } = useLanguageStore.getState();
      if (typeof setTags === 'function') {
        setTags(rows);
      }
    }
  }, [rows]);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form states
  const emptyForm = {
    tagEn: '',
    tagTe: '',
    tagMl: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter & Pagination logic
  const filtered = rows.filter((r) => {
    const matchName =
      r.tagEn.toLowerCase().includes(filterName.toLowerCase()) ||
      r.tagTe.toLowerCase().includes(filterName.toLowerCase()) ||
      r.tagHi.toLowerCase().includes(filterName.toLowerCase()) ||
      r.tagMl.toLowerCase().includes(filterName.toLowerCase());
    const matchId = String(r.aitagid).includes(filterId.trim());
    return matchName && matchId;
  });

  useEffect(() => {
    setPage(1);
  }, [filterName, filterId]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  const handleEditClick = (tag: Tag) => {
    setEditingId(tag.aitagid);
    setForm({
      tagEn: tag.tagEn,
      tagTe: tag.tagTe,
      tagMl: tag.tagMl,
    });
    setUploadedImage(tag.imageUrl || null);
    setSelectedFile(null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: string, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (submitted) {
        const res = tagSchema.safeParse(updated);
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
    if (submitted) {
      if (!dataUrl) {
        setErrors((prev) => ({ ...prev, image: 'Tag image is required' }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.image;
          return updated;
        });
      }
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
    const validationResult = tagSchema.safeParse(form);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      if (isEditMode && editingId !== null) {
        const currentTag = rows.find((t) => t.aitagid === editingId);
        const updateDto = TagMapper.toUpdateDto(form, undefined, currentTag?.isActive);
        const response = await TagsRepository.update(editingId, updateDto);
        const updatedDomainTag = TagMapper.toDomain(response.data);
        setRows((prev) =>
          prev.map((t) => (t.aitagid === editingId ? updatedDomainTag : t))
        );
        showToast('AI Tag updated successfully!', 'success');
        handleCloseDrawer();
      } else {
        const createDto = TagMapper.toCreateDto(form, uploadedImage || undefined);
        const response = await TagsRepository.create(createDto);
        const newDomainTag = TagMapper.toDomain(response.data);
        setRows((prev) => [newDomainTag, ...prev]);
        showToast('AI Tag created successfully!', 'success');
        handleCloseDrawer();
      }
    } catch (err: any) {
      const errMsg = err.message || 'Failed to save AI tag';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number) => {
    const tag = rows.find((t) => t.aitagid === id);
    if (!tag) return;

    setLoading(true);
    try {
      const nextActiveState = !(tag.isActive ?? true);
      const updateDto = TagMapper.toUpdateDto(
        {
          tagEn: tag.tagEn,
          tagTe: tag.tagTe,
          tagHi: tag.tagHi,
          tagMl: tag.tagMl,
        },
        tag.imageUrl,
        nextActiveState
      );
      const response = await TagsRepository.update(id, updateDto);
      const updatedDomainTag = TagMapper.toDomain(response.data);
      setRows((prev) =>
        prev.map((t) => (t.aitagid === id ? updatedDomainTag : t))
      );
      setError(null);
      showToast(`AI Tag ${nextActiveState ? 'activated' : 'deactivated'} successfully!`, 'info');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to toggle AI tag status';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id: number) => {
    setLoading(true);
    try {
      await TagsRepository.delete(id);
      setRows((prev) => prev.filter((t) => t.aitagid !== id));
      setError(null);
      showToast('AI Tag deleted successfully!', 'info');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to delete AI tag';
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
    filterName,
    setFilterName,
    filterId,
    setFilterId,
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
    deleteTag,
    toggleActive,
  };
}


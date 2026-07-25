import { useState, useEffect, useMemo } from 'react';
import { PostType } from '../domain/post-type.model';
import { postTypeSchema, PostTypeFormData } from '../validators/post-type.validator';
import { PostTypeRepository } from '../repositories/post-type.repository';
import { PostTypeMapper } from '../mapper/post-type.mapper';

export function usePostTypeController() {
  const [rows, setRows] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPostTypes = async () => {
    setLoading(true);
    try {
      const dtos = await PostTypeRepository.getAll(0, 100);
      const domainList = PostTypeMapper.toDomainList(dtos);
      setRows(domainList);
    } catch (error) {
      console.error('Failed to fetch post types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostTypes();
  }, []);

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form state
  const emptyForm: PostTypeFormData = {
    typename: '',
    typeStatus: true,
  };
  const [form, setForm] = useState<PostTypeFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter & Pagination logic
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchName = r.typename.toLowerCase().includes(filterName.toLowerCase());
      const matchStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'active'
          ? r.typeStatus
          : !r.typeStatus;
      return matchName && matchStatus;
    });
  }, [rows, filterName, filterStatus]);

  useEffect(() => {
    setPage(1);
  }, [filterName, filterStatus]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    return filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);
  }, [filtered, page, recordsPerPage]);

  const toggleActive = async (id: number) => {
    const item = rows.find((r) => r.typeId === id);
    if (!item) return;

    const newStatus = !item.typeStatus;
    // Optimistically update status
    setRows((prev) =>
      prev.map((r) => (r.typeId === id ? { ...r, typeStatus: newStatus } : r))
    );

    try {
      await PostTypeRepository.update(id, {
        typename: item.typename,
        typeStatus: newStatus,
      });
    } catch (error) {
      console.error('Failed to toggle post type status:', error);
      // Revert on failure
      setRows((prev) =>
        prev.map((r) => (r.typeId === id ? { ...r, typeStatus: !newStatus } : r))
      );
    }
  };

  const deletePostType = async (id: number) => {
    const originalRows = [...rows];
    // Optimistically remove
    setRows((prev) => prev.filter((r) => r.typeId !== id));

    try {
      await PostTypeRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete post type:', error);
      setRows(originalRows);
    }
  };

  const handleEditClick = (item: PostType) => {
    setEditingId(item.typeId);
    setForm({
      typename: item.typename,
      typeStatus: item.typeStatus,
    });
    setErrors({});
    setDrawerOpen(true);
  };

  const handleOpenAddDrawer = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleFieldChange = (field: keyof PostTypeFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const parseResult = postTypeSchema.safeParse(form);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) {
          fieldErrors[path.toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    try {
      if (isEditMode && editingId !== null) {
        const responseDto = await PostTypeRepository.update(editingId, {
          typename: form.typename,
          typeStatus: form.typeStatus,
        });
        const updatedItem = PostTypeMapper.toDomain(responseDto);
        setRows((prev) =>
          prev.map((r) => (r.typeId === editingId ? updatedItem : r))
        );
      } else {
        const responseDto = await PostTypeRepository.create({
          typename: form.typename,
          typeStatus: form.typeStatus,
        });
        const newItem = PostTypeMapper.toDomain(responseDto);
        setRows((prev) => [newItem, ...prev]);
      }
      handleCloseDrawer();
      return true;
    } catch (error: any) {
      console.error('Failed to save post type:', error);
      setErrors({ typename: error.message || 'Failed to save post type' });
      return false;
    }
  };

  return {
    rows,
    loading,
    filterName,
    setFilterName,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    recordsPerPage,
    totalPages,
    paginatedData,
    filteredCount: filtered.length,
    toggleActive,
    deletePostType,
    drawerOpen,
    isEditMode,
    form,
    errors,
    handleOpenAddDrawer,
    handleEditClick,
    handleCloseDrawer,
    handleFieldChange,
    handleSubmit,
    fetchPostTypes,
  };
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BannerItem,
  BannerSectionType,
  BannerOrientationType,
  UploadedFileItem,
  CreateBannerFormState,
} from '../domain/ads-dynapix.model';
import { adsDynapixRepository } from '../repositories/ads-dynapix.repository';

const initialCreateForm: CreateBannerFormState = {
  productName: '',
  bigTvBanner: {
    HBanner: [],
    VBanner: [],
  },
  dynapixBanner: {
    HBanner: [],
    VBanner: [],
  },
};

export const useAdsDynapixController = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterId, setFilterId] = useState<string>('');

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  const [createForm, setCreateForm] = useState<CreateBannerFormState>(initialCreateForm);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adsDynapixRepository.getBanners();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const filteredBanners = useMemo(() => {
    return banners.filter((item) => {
      const matchTitle =
        !filterTitle ||
        (item.productName && item.productName.toLowerCase().includes(filterTitle.toLowerCase()));

      const matchId =
        !filterId || (item.id && item.id.toLowerCase().includes(filterId.toLowerCase()));

      return matchTitle && matchId;
    });
  }, [banners, filterTitle, filterId]);

  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredBanners.length / recordsPerPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * recordsPerPage;
    return filteredBanners.slice(start, start + recordsPerPage);
  }, [filteredBanners, page]);

  const handleProductNameChange = (name: string) => {
    setCreateForm((prev) => ({ ...prev, productName: name }));
    if (errors.productName) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.productName;
        return copy;
      });
    }
  };

  const handleFileUpload = async (
    section: BannerSectionType,
    orientation: BannerOrientationType,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const currentList = createForm[section][orientation];
    if (currentList.length >= 3) {
      setErrors((prev) => ({
        ...prev,
        [`${section}_${orientation}`]: 'Maximum 3 images allowed per banner type',
      }));
      return;
    }

    const availableSlots = 3 - currentList.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    const slotKey = `${section}_${orientation}`;

    setUploadingSlot(slotKey);
    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const previewUrl =
          typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
            ? URL.createObjectURL(file)
            : '';
        const res = await adsDynapixRepository.uploadFile(file);
        return {
          id: res.id,
          url: res.url,
          previewUrl,
          name: res.originalName || file.name,
        };
      });
      const uploadedResults = await Promise.all(uploadPromises);

      setCreateForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [orientation]: [...prev[section][orientation], ...uploadedResults],
        },
      }));

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      setFeedbackMessage(err.message || 'File upload failed');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveImage = (
    section: BannerSectionType,
    orientation: BannerOrientationType,
    index: number
  ) => {
    setCreateForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [orientation]: prev[section][orientation].filter((_, i) => i !== index),
      },
    }));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!createForm.productName.trim()) {
      errs.productName = 'Product name is required';
    }

    const bigTvHCount = createForm.bigTvBanner.HBanner.length;
    const bigTvVCount = createForm.bigTvBanner.VBanner.length;
    const dynapixHCount = createForm.dynapixBanner.HBanner.length;
    const dynapixVCount = createForm.dynapixBanner.VBanner.length;

    if (bigTvHCount > 3) errs.bigTvBanner_HBanner = 'Max 3 images allowed';
    if (bigTvVCount > 3) errs.bigTvBanner_VBanner = 'Max 3 images allowed';
    if (dynapixHCount > 3) errs.dynapixBanner_HBanner = 'Max 3 images allowed';
    if (dynapixVCount > 3) errs.dynapixBanner_VBanner = 'Max 3 images allowed';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = {
        productName: createForm.productName.trim(),
        bigTvBanner: {
          HBanner: createForm.bigTvBanner.HBanner.map((item) => item.url),
          VBanner: createForm.bigTvBanner.VBanner.map((item) => item.url),
        },
        dynapixBanner: {
          HBanner: createForm.dynapixBanner.HBanner.map((item) => item.url),
          VBanner: createForm.dynapixBanner.VBanner.map((item) => item.url),
        },
      };

      if (editingBannerId) {
        await adsDynapixRepository.updateBanner(editingBannerId, payload);
        setFeedbackMessage('Banner record updated successfully');
      } else {
        await adsDynapixRepository.createBanner(payload);
        setFeedbackMessage('Banner record created successfully');
      }

      handleCloseDrawer();
      await loadBanners();
    } catch (err: any) {
      console.error('Failed to save banner record:', err);
      setFeedbackMessage(err.message || 'Failed to save banner record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDrawer = () => {
    setEditingBannerId(null);
    setCreateForm(initialCreateForm);
    setErrors({});
    setDrawerOpen(true);
  };

  const handleEditBanner = (banner: BannerItem) => {
    setEditingBannerId(banner.id);
    setCreateForm({
      productName: banner.productName || '',
      bigTvBanner: {
        HBanner: (banner.bigTvBanner?.HBanner || []).map((url) => ({
          url,
          name: url.split('/').pop() || 'HBanner',
        })),
        VBanner: (banner.bigTvBanner?.VBanner || []).map((url) => ({
          url,
          name: url.split('/').pop() || 'VBanner',
        })),
      },
      dynapixBanner: {
        HBanner: (banner.dynapixBanner?.HBanner || []).map((url) => ({
          url,
          name: url.split('/').pop() || 'HBanner',
        })),
        VBanner: (banner.dynapixBanner?.VBanner || []).map((url) => ({
          url,
          name: url.split('/').pop() || 'VBanner',
        })),
      },
    });
    setErrors({});
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingBannerId(null);
    setCreateForm(initialCreateForm);
    setErrors({});
  };

  const handleViewBanner = (banner: BannerItem) => {
    setSelectedBanner(banner);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedBanner(null);
  };

  const deleteBanner = async (id: string) => {
    setDeletingId(id);
    try {
      await adsDynapixRepository.deleteBanner(id);
      setFeedbackMessage('Banner deleted successfully');
      await loadBanners();
    } catch (err) {
      console.error('Failed to delete banner', err);
      setFeedbackMessage('Failed to delete banner');
    } finally {
      setDeletingId(null);
    }
  };

  return {
    banners,
    paginatedData,
    loading,
    page,
    totalPages,
    setPage,
    filterTitle,
    setFilterTitle,
    filterId,
    setFilterId,
    drawerOpen,
    editingBannerId,
    handleOpenDrawer,
    handleEditBanner,
    handleCloseDrawer,
    createForm,
    handleProductNameChange,
    handleFileUpload,
    handleRemoveImage,
    handleCreateSubmit,
    uploadingSlot,
    submitting,
    errors,
    selectedBanner,
    detailsModalOpen,
    handleViewBanner,
    handleCloseDetailsModal,
    deleteBanner,
    deletingId,
    feedbackMessage,
    setFeedbackMessage,
    loadBanners,
  };
};

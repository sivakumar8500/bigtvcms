import { useState, useEffect, useMemo } from 'react';
import { User } from '../domain/user.model';
import { userSchema, UserFormData } from '../validators/user.validator';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../mapper/user.mapper';
import { useLanguageStore } from '@/core/storage/language-store';
import { UploadService } from '@/modules/media/services/upload.service';

const initialUsers: User[] = [
  {
    userId: 1,
    name: 'Sivakumar Ramakrishnan',
    username: 'sivakumar8500',
    password: 'password123',
    location: 'Andhra Pradesh',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 2,
    name: 'Darren Shen',
    username: 'darren.shen',
    password: 'secretPassword',
    location: 'Telangana',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 3,
    name: 'Arjun Nair',
    username: 'arjun_nair',
    password: 'arjunSecure!',
    location: 'Kerala',
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 4,
    name: 'Pranitha Reddy',
    username: 'pranitha.r',
    password: 'pranithaPswd',
    location: 'Telangana',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 5,
    name: 'Rahul Sharma',
    username: 'rahul_sharma',
    password: 'rahulPass99',
    location: 'Delhi',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 6,
    name: 'Ananya Rao',
    username: 'ananya.rao',
    password: 'ananyaSecure',
    location: 'Andhra Pradesh',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 7,
    name: 'Suresh Kumar',
    username: 'suresh_k',
    password: 'sureshPswd1',
    location: 'Tamil Nadu',
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 8,
    name: 'Meera Krishnan',
    username: 'meera.k',
    password: 'meeraPassword',
    location: 'Kerala',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 9,
    name: 'Venkatesh Prasad',
    username: 'venky_prasad',
    password: 'venkyPswd20',
    location: 'Karnataka',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 10,
    name: 'Deepika Sen',
    username: 'deepika_sen',
    password: 'deepikaPassWord',
    location: 'West Bengal',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 11,
    name: 'Vijay Deverakonda',
    username: 'rowdy_vijay',
    password: 'rowdyPassword',
    location: 'Telangana',
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    userId: 12,
    name: 'Samantha Ruth',
    username: 'samantha_r',
    password: 'samPassword99',
    location: 'Andhra Pradesh',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
  },
];

export function useUserController() {
  const [rows, setRows] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const dtos = await UserRepository.getAll(0, 100);
        const domainUsers = UserMapper.toDomainList(dtos);
        setRows(domainUsers);
      } catch (error) {
        console.error('Failed to fetch creators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'superadmin' | 'admin' | 'creator'>('all');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  const { locations } = useLanguageStore();

  const locationsOptions = useMemo(() => {
    if (locations && locations.length > 0) {
      return locations.map((loc) => loc.stateEn || loc.stateName);
    }
    return [
      'Telangana',
      'Andhra Pradesh',
      'Kerala',
      'Karnataka',
      'Tamil Nadu',
      'Delhi',
      'West Bengal',
      'Maharashtra',
    ];
  }, [locations]);

  const defaultLocation = locationsOptions[0] || 'Telangana';

  // Form states
  const emptyForm: UserFormData = useMemo(
    () => ({
      name: '',
      username: '',
      password: '',
      location: defaultLocation,
      role: 'creator',
      languageCode: '',
    }),
    [defaultLocation]
  );
  const [form, setForm] = useState<UserFormData>(emptyForm);

  useEffect(() => {
    if (!form.location && defaultLocation) {
      setForm((prev) => ({ ...prev, location: defaultLocation }));
    }
  }, [defaultLocation, form.location]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter & Pagination logic
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchName =
        r.name.toLowerCase().includes(filterName.toLowerCase()) ||
        r.username.toLowerCase().includes(filterName.toLowerCase());

      const matchStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'active'
          ? r.isActive
          : !r.isActive;

      const matchRole =
        filterRole === 'all' ? true : (r.role || 'creator') === filterRole;

      return matchName && matchStatus && matchRole;
    });
  }, [rows, filterName, filterStatus, filterRole]);

  useEffect(() => {
    setPage(1);
  }, [filterName, filterStatus, filterRole]);

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginatedData = useMemo(() => {
    return filtered.slice((page - 1) * recordsPerPage, page * recordsPerPage);
  }, [filtered, page, recordsPerPage]);

  const toggleActive = async (id: number) => {
    const user = rows.find((u) => u.userId === id);
    if (!user) return;
    const newActiveState = !user.isActive;

    // Optimistically update status in UI
    setRows((prev) =>
      prev.map((u) => (u.userId === id ? { ...u, isActive: newActiveState } : u))
    );

    try {
      await UserRepository.update(id, { active: newActiveState });
    } catch (error) {
      console.error('Failed to toggle active status:', error);
      // Revert status on failure
      setRows((prev) =>
        prev.map((u) => (u.userId === id ? { ...u, isActive: !newActiveState } : u))
      );
    }
  };

  const deleteUser = async (id: number) => {
    const originalRows = [...rows];
    // Optimistically remove from UI
    setRows((prev) => prev.filter((u) => u.userId !== id));

    try {
      await UserRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete creator:', error);
      // Revert removal on failure
      setRows(originalRows);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.userId);
    setForm({
      name: user.name,
      username: user.username,
      password: user.password || '123456',
      location: user.location,
      role: (user.role as any) || 'creator',
      languageCode: user.languageCode || '',
    });
    setUploadedImage(user.imageUrl || null);
    setSelectedFile(null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: keyof UserFormData, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (submitted) {
        const res = userSchema.safeParse(updated);
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
        setErrors((prev) => ({ ...prev, image: 'Profile image is required' }));
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
    const validationResult = userSchema.safeParse(form);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
    }

    if (!uploadedImage) {
      errMap.image = 'Profile image is required';
    }

    if (Object.keys(errMap).length > 0) {
      setErrors(errMap);
      return;
    }

    setErrors({});
    setIsUploading(true);

    let finalProfilePicUrl = uploadedImage || '';

    try {
      // Step 1: If a new File was selected or if uploadedImage is a Data URL, upload via UploadService
      if (selectedFile) {
        finalProfilePicUrl = await UploadService.uploadImage(selectedFile);
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
          const generatedFile = new File([u8arr], `creator_pic.${ext}`, { type: mime });
          finalProfilePicUrl = await UploadService.uploadImage(generatedFile);
        } catch (e) {
          console.error('Failed to convert base64 to file, fallback to base64 URL', e);
        }
      }

      // Step 2: Call Create / Update Creator API
      if (isEditMode && editingId !== null) {
        const currentUser = rows.find((u) => u.userId === editingId);
        const active = currentUser ? currentUser.isActive : true;
        const updateDto = UserMapper.toCreateDto(form, finalProfilePicUrl, active);
        const updatedCreator = await UserRepository.update(editingId, updateDto);
        const domainUser = UserMapper.toDomain(updatedCreator);
        setRows((prev) =>
          prev.map((u) => (u.userId === editingId ? domainUser : u))
        );
      } else {
        const createDto = UserMapper.toCreateDto(form, finalProfilePicUrl, true);
        const newCreator = await UserRepository.create(createDto);
        const domainUser = UserMapper.toDomain(newCreator);
        setRows((prev) => [domainUser, ...prev]);
      }

      handleCloseDrawer();
    } catch (error) {
      console.error('Failed to save creator:', error);
      setErrors({ form: 'Failed to save creator profile. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterRole('all');
    setPage(1);
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
    filterStatus,
    setFilterStatus,
    filterRole,
    setFilterRole,
    handleClearFilters,
    toggleActive,
    deleteUser,
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
    locationsOptions,
  };
}

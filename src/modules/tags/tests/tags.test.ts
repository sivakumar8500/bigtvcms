import { renderHook, act } from '@testing-library/react';
import { useTagsController } from '../hooks/useTagsController';
import { tagSchema } from '../validators/tags.validator';
import { TagMapper } from '../mapper/tags.mapper';
import { TagsRepository } from '../repositories/tags.repository';
import { UploadService } from '@/modules/media/services/upload.service';

// Mock the TagsRepository and UploadService
jest.mock('../repositories/tags.repository', () => ({
  TagsRepository: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/modules/media/services/upload.service', () => ({
  UploadService: {
    uploadImage: jest.fn().mockResolvedValue('https://images.unsplash.com/uploaded_tag.jpg'),
  },
}));

const mockTagsDto = [
  {
    aitagid: 91,
    aitagname: 'ట్రెండింగ్',
    aitagnameTranslations: { en: 'Trending', te: 'ట్రెండింగ్', hi: 'ट्रेंडिंग', ml: 'ട്രെൻഡിംഗ്' },
    imageUrl: 'https://example.com/trending.jpg',
  },
  {
    aitagid: 360,
    aitagname: 'హైదరాబాద్',
    aitagnameTranslations: { en: 'Hyderabad', te: 'హైదరాబాద్', hi: 'हैदराबाद', ml: 'ഹൈദരാബാദ്' },
    imageUrl: 'https://example.com/hyderabad.jpg',
  },
];

describe('Tag Mapper', () => {
  it('should map DTO to Domain model correctly', () => {
    const dto = {
      aitagid: 2,
      aitagname: 'ఫ్యాషన్',
      aitagnameTranslations: {
        en: 'Fashion',
        te: 'ఫ్యాషన్',
        ml: 'ഫാഷൻ',
      },
      imageUrl: 'https://example.com/fashion.jpg',
    };
    const domain = TagMapper.toDomain(dto);
    expect(domain.aitagid).toBe(2);
    expect(domain.aitagname).toBe('ఫ్యాషన్');
    expect(domain.tagEn).toBe('Fashion');
    expect(domain.tagTe).toBe('ఫ్యాషన్');
    expect(domain.tagMl).toBe('ഫാഷൻ');
    expect(domain.imageUrl).toBe('https://example.com/fashion.jpg');
  });

  it('should handle undefined translations gracefully', () => {
    const dto = {
      aitagid: 3,
      aitagname: 'టెస్ట్',
    };
    const domain = TagMapper.toDomain(dto);
    expect(domain.tagEn).toBe('');
    expect(domain.tagTe).toBe('');
    expect(domain.tagMl).toBe('');
  });

  it('should map list of DTOs correctly', () => {
    const list = TagMapper.toDomainList(mockTagsDto);
    expect(list.length).toBe(2);
    expect(list[0].tagEn).toBe('Trending');
  });

  it('should map form to Create DTO correctly', () => {
    const form = {
      tagEn: 'Sports',
      tagTe: 'క్రీడలు',
      tagMl: 'കായിക വിനോദം',
    };
    const createDto = TagMapper.toCreateDto(form, 'https://example.com/tag.jpg');
    expect(createDto.name_en).toBe('Sports');
    expect(createDto.image_url).toBe('https://example.com/tag.jpg');
  });

  it('should map form to Create/Update DTO correctly', () => {
    const form = {
      tagEn: 'Sports',
      tagTe: 'క్రీడలు',
      tagMl: 'കായിക വിനോദം',
    };
    const updateDto = TagMapper.toUpdateDto(form, 'https://example.com/tag.jpg');
    expect(updateDto.name_en).toBe('Sports');
    expect(updateDto.image_url).toBe('https://example.com/tag.jpg');
    expect(updateDto.is_active).toBe(true);
  });
});

describe('Tag Validator Schema', () => {
  it('should validate a valid tag object', () => {
    const validData = {
      tagEn: 'Trending',
      tagTe: 'ట్రెండింగ్',
      tagMl: 'ട്രെൻഡിംഗ്',
    };
    const result = tagSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if a multilingual name is empty', () => {
    const invalidData = {
      tagEn: '',
      tagTe: 'ట్రెండింగ్',
      tagMl: 'ട്രെൻഡിംഗ്',
    };
    const result = tagSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('useTagsController hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (TagsRepository.getAll as jest.Mock).mockResolvedValue(mockTagsDto);
    (TagsRepository.create as jest.Mock).mockResolvedValue({
      message: 'AITag created successfully',
      data: {
        aitagid: 4,
        aitagname: 'Sports',
        aitagnameTranslations: {
          en: 'Sports',
          te: 'క్రీడలు',
          hi: 'खेल',
          ml: 'കായിക വിനോദം',
        },
        imageUrl: 'https://example.com/sports.jpg',
      },
    });
    (TagsRepository.delete as jest.Mock).mockResolvedValue({
      message: 'AITag deleted successfully',
    });
    (TagsRepository.update as jest.Mock).mockResolvedValue({
      message: 'AITag updated successfully',
      data: {
        aitagid: 91,
        aitagname: 'Trending Updated',
        aitagnameTranslations: {
          en: 'Trending Updated',
          te: 'ట్రెండింగ్',
          hi: 'ट्रेंडिंग',
          ml: 'ട്രെൻഡിംഗ്',
        },
        imageUrl: 'https://example.com/trending.jpg',
      },
    });
  });

  it('should initialize and fetch tags from repository', async () => {
    const { result } = renderHook(() => useTagsController());
    
    // Wait for the async useEffect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(TagsRepository.getAll).toHaveBeenCalled();
    expect(result.current.rows.length).toBe(2);
    expect(result.current.filterName).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should update filter text and reset page to 1', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setFilterName('Trending');
    });
    expect(result.current.filterName).toBe('Trending');
    expect(result.current.page).toBe(1);
  });

  it('should open and close drawer properly', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should handle edit click and fill form', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    const firstTag = result.current.rows[0];
    act(() => {
      result.current.handleEditClick(firstTag);
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.form.tagEn).toBe(firstTag.tagEn);
    expect(result.current.uploadedImage).toBe(firstTag.imageUrl);
  });

  it('should handle form field change', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleFieldChange('tagEn', 'New Tag Name');
    });
    expect(result.current.form.tagEn).toBe('New Tag Name');
  });

  it('should validation fail on submit if required text fields are empty', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    expect(result.current.errors.tagEn).toBe('English tag name is required');
  });

  it('should add a tag on successful submit and auto-fill tagHi with tagEn', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleFieldChange('tagEn', 'Sports');
    });
    act(() => {
      result.current.handleFieldChange('tagTe', 'క్రీడలు');
    });
    act(() => {
      result.current.handleFieldChange('tagMl', 'കായിക വിനോദം');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.rows.some((r) => r.tagEn === 'Sports')).toBe(true);
  });

  it('should delete a tag on deleteTag', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    const initialLen = result.current.rows.length;
    const targetId = result.current.rows[0].aitagid;
    await act(async () => {
      await result.current.deleteTag(targetId);
    });
    expect(result.current.rows.length).toBe(initialLen - 1);
    expect(result.current.rows.some((r) => r.aitagid === targetId)).toBe(false);
  });

  it('should toggle status on toggleActive', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    const targetId = result.current.rows[0].aitagid;
    const initialStatus = result.current.rows[0].isActive ?? true;

    // mock updated response
    (TagsRepository.update as jest.Mock).mockResolvedValueOnce({
      message: 'AITag updated successfully',
      data: {
        aitagid: targetId,
        aitagname: 'Trending',
        aitagnameTranslations: { en: 'Trending', te: 'ట్రెండింగ్', hi: 'ట్రెండింగ్', ml: 'ട്രെൻഡിംഗ്' },
        is_active: !initialStatus,
      },
    });

    await act(async () => {
      await result.current.toggleActive(targetId);
    });

    expect(TagsRepository.update).toHaveBeenCalled();
    expect(result.current.rows[0].isActive).toBe(!initialStatus);
  });

  it('should update a tag on successful submit in edit mode', async () => {
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    const firstTag = result.current.rows[0]; // Trending (id: 91)
    act(() => {
      result.current.handleEditClick(firstTag);
    });

    act(() => {
      result.current.handleFieldChange('tagEn', 'Trending Updated');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(TagsRepository.update).toHaveBeenCalledWith(91, {
      name_en: 'Trending Updated',
      name_te: 'ట్రెండింగ్',
      name_ml: 'ട്രെൻഡിംഗ്',
      image_url: undefined,
      is_active: true,
    });
    expect(result.current.rows.some((r) => r.tagEn === 'Trending Updated')).toBe(true);
  });

  it('should set error message on handleSubmit failure', async () => {
    (TagsRepository.create as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.handleFieldChange('tagEn', 'Error Tag');
      result.current.handleFieldChange('tagTe', 'ట్యాగ్');
      result.current.handleFieldChange('tagMl', 'ടാഗ്');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.error).toBe('Network error');
  });

  it('should handle toggleActive failure gracefully', async () => {
    (TagsRepository.update as jest.Mock).mockRejectedValueOnce(new Error('Toggle failed'));
    const { result } = renderHook(() => useTagsController());
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.toggleActive(91);
    });

    expect(result.current.error).toBe('Toggle failed');
  });
});

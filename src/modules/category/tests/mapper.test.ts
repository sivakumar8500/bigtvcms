import { CategoryMapper } from '../mapper/category.mapper';
import { CategoryDto } from '../dto/category.dto';

describe('CategoryMapper', () => {
  const mockDto: CategoryDto = {
    categoryId: 296,
    categoryName: 'అందం ',
    categoryNameTranslations: {
      en: 'Beauty',
      te: 'అందం ',
      hi: 'सुंदरता',
      ml: 'സൗന്ദര്യം',
    },
    imageUrl: 'https://example.com/image.png',
  };

  it('should map DTO to domain model', () => {
    const domain = CategoryMapper.toDomain(mockDto);
    expect(domain.categoryId).toBe(296);
    expect(domain.categoryName).toBe('అందం ');
    expect(domain.nameEn).toBe('Beauty');
    expect(domain.nameTe).toBe('అందం ');
    expect(domain.nameHi).toBe('सुंदरता');
    expect(domain.nameMl).toBe('സൗന്ദര്യം');
    expect(domain.imageUrl).toBe('https://example.com/image.png');
    expect(domain.isFollowed).toBe(false);
    expect(domain.isActive).toBe(true);
  });

  it('should map is_active false from DTO to domain', () => {
    const dtoWithInactive: CategoryDto = { ...mockDto, is_active: false };
    const domain = CategoryMapper.toDomain(dtoWithInactive);
    expect(domain.isActive).toBe(false);
  });

  it('should handle undefined translations gracefully', () => {
    const minDto: CategoryDto = {
      categoryId: 1,
      categoryName: 'Min',
    };
    const domain = CategoryMapper.toDomain(minDto);
    expect(domain.nameEn).toBe('');
    expect(domain.nameTe).toBe('');
    expect(domain.nameHi).toBe('');
    expect(domain.nameMl).toBe('');
  });

  it('should map a list of DTOs to domain models', () => {
    const list = CategoryMapper.toDomainList([mockDto]);
    expect(list).toHaveLength(1);
    expect(list[0].categoryId).toBe(296);
  });

  it('should convert form to Create DTO with image_url', () => {
    const form = {
      nameEn: 'Beauty',
      nameTe: 'అందం ',
      nameMl: 'സൗന്ദര്യം',
    };
    const createDto = CategoryMapper.toCreateDto(form, 'https://example.com/cat.png');
    expect(createDto).toEqual({
      translations: {
        en: 'Beauty',
        te: 'అందం ',
        ml: 'സൗന്ദര്യം',
      },
      image_url: 'https://example.com/cat.png',
    });
  });

  it('should convert form to Update DTO with image_url', () => {
    const form = {
      nameEn: 'Beauty',
      nameTe: 'అందం ',
      nameMl: 'സൗന്ദര്യം',
    };
    const updateDto = CategoryMapper.toUpdateDto(form, false, 'https://example.com/cat.png');
    expect(updateDto).toEqual({
      translations: {
        en: 'Beauty',
        te: 'అందం ',
        ml: 'സൗന്ദര്യം',
      },
      is_active: false,
      image_url: 'https://example.com/cat.png',
    });
  });
});

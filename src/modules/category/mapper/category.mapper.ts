import { Category } from '../domain/category.model';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export class CategoryMapper {
  static toDomain(dto: CategoryDto): Category {
    const tr = dto.translations || dto.categoryNameTranslations;
    return {
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      isFollowed: false,
      isActive: dto.is_active ?? true,
      nameEn: tr?.en || '',
      nameTe: tr?.te || '',
      nameHi: tr?.hi || '',
      nameMl: tr?.ml || '',
      icon: '',
      imageUrl: dto.imageUrl || dto.image_url,
    };
  }

  static toDomainList(dtos: CategoryDto[]): Category[] {
    return (dtos || []).map((dto) => this.toDomain(dto));
  }

  static toCreateDto(form: { nameEn: string; nameTe: string; nameMl: string }, imageUrl?: string): CreateCategoryDto {
    return {
      translations: {
        en: form.nameEn,
        te: form.nameTe,
        ml: form.nameMl,
      },
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };
  }

  static toUpdateDto(form: { nameEn: string; nameTe: string; nameMl: string }, isActive: boolean = true, imageUrl?: string): UpdateCategoryDto {
    return {
      translations: {
        en: form.nameEn,
        te: form.nameTe,
        ml: form.nameMl,
      },
      is_active: isActive,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };
  }
}

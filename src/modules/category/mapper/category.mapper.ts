import { Category } from '../domain/category.model';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export class CategoryMapper {
  static toDomain(dto: CategoryDto): Category {
    return {
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      isFollowed: false,
      isActive: dto.is_active ?? true,
      nameEn: dto.categoryNameTranslations?.en || '',
      nameTe: dto.categoryNameTranslations?.te || '',
      nameHi: dto.categoryNameTranslations?.hi || '',
      nameMl: dto.categoryNameTranslations?.ml || '',
      icon: '',
      imageUrl: dto.imageUrl,
    };
  }

  static toDomainList(dtos: CategoryDto[]): Category[] {
    return (dtos || []).map((dto) => this.toDomain(dto));
  }

  static toCreateDto(form: { nameEn: string; nameTe: string; nameHi: string; nameMl: string; icon: string; }): CreateCategoryDto {
    return {
      name_en: form.nameEn,
      name_te: form.nameTe,
      name_ml: form.nameMl,
    };
  }

  static toUpdateDto(form: { nameEn: string; nameTe: string; nameHi: string; nameMl: string; icon: string; }, isActive: boolean = true): UpdateCategoryDto {
    return {
      name_en: form.nameEn,
      name_te: form.nameTe,
      name_ml: form.nameMl,
      is_active: isActive,
    };
  }
}

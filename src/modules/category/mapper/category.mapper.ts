import { Category } from '../domain/category.model';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export class CategoryMapper {
  static toDomain(dto: CategoryDto): Category {
    const raw = (dto as any) || {};
    const tr = dto.categoryNameTranslations || dto.translations || raw.category_name_translations || raw.translations || raw.name_translations || {};

    const nameEn = (tr.en || tr.english || tr.en_name || raw.nameEn || raw.name_en || raw.en || '').trim();
    const nameTe = (tr.te || tr.telugu || tr.te_name || raw.nameTe || raw.name_te || raw.te || '').trim();
    const nameHi = (tr.hi || tr.hindi || tr.hi_name || raw.nameHi || raw.name_hi || raw.hi || '').trim();
    const nameMl = (tr.ml || tr.malayalam || tr.ml_name || raw.nameMl || raw.name_ml || raw.ml || '').trim();

    const isActive = dto.isActive !== undefined ? dto.isActive : (dto.is_active !== undefined ? dto.is_active : (raw.isActive !== undefined ? raw.isActive : true));

    return {
      categoryId: dto.categoryId || raw.category_id || raw.id || 0,
      categoryName: (dto.categoryName || nameTe || nameEn || nameMl || '').trim(),
      isFollowed: false,
      isActive,
      nameEn,
      nameTe,
      nameHi,
      nameMl,
      icon: '',
      imageUrl: dto.imageUrl || dto.image_url || raw.image_url || raw.imageUrl || '',
    };
  }

  static toDomainList(dtos: CategoryDto[]): Category[] {
    return (dtos || []).map((dto) => this.toDomain(dto));
  }

  static toCreateDto(form: { nameEn: string; nameTe: string; nameMl: string; nameHi?: string }, imageUrl?: string): CreateCategoryDto {
    return {
      translations: {
        en: form.nameEn,
        te: form.nameTe,
        ml: form.nameMl,
        ...(form.nameHi ? { hi: form.nameHi } : {}),
      },
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };
  }

  static toUpdateDto(form: { nameEn: string; nameTe: string; nameMl: string; nameHi?: string }, isActive: boolean = true, imageUrl?: string): UpdateCategoryDto {
    return {
      translations: {
        en: form.nameEn,
        te: form.nameTe,
        ml: form.nameMl,
        ...(form.nameHi ? { hi: form.nameHi } : {}),
      },
      is_active: isActive,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };
  }
}

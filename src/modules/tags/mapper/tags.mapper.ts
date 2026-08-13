import { Tag } from '../domain/tags.model';
import { AiTagDto, CreateAiTagDto, UpdateAiTagDto } from '../dto/tags.dto';

export class TagMapper {
  static toDomain(dto: AiTagDto): Tag {
    return {
      aitagid: dto.aitagid,
      aitagname: dto.aitagname,
      tagEn: dto.aitagnameTranslations?.en || '',
      tagTe: dto.aitagnameTranslations?.te || '',
      tagHi: dto.aitagnameTranslations?.hi || '',
      tagMl: dto.aitagnameTranslations?.ml || '',
      imageUrl: dto.imageUrl || (dto as any).image_url,
      isActive: dto.is_active ?? true,
    };
  }

  static toDomainList(dtos: AiTagDto[]): Tag[] {
    return (dtos || []).map((dto) => this.toDomain(dto));
  }

  static toCreateDto(
    form: { tagEn: string; tagTe: string; tagHi?: string; tagMl: string },
    imageUrl?: string
  ): CreateAiTagDto {
    return {
      translations: {
        en: form.tagEn,
        te: form.tagTe,
        hi: form.tagHi,
        ml: form.tagMl,
      },
      image_url: imageUrl || undefined,
    };
  }

  static toUpdateDto(
    form: { tagEn: string; tagTe: string; tagHi?: string; tagMl: string },
    imageUrl?: string,
    isActive?: boolean
  ): UpdateAiTagDto {
    return {
      translations: {
        en: form.tagEn,
        te: form.tagTe,
        hi: form.tagHi,
        ml: form.tagMl,
      },
      image_url: imageUrl || undefined,
      is_active: isActive !== undefined ? isActive : true,
    };
  }
}


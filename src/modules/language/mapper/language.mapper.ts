import { Language } from '../domain/language.model';
import { LanguageResponseDto } from '../dto/language.dto';

export class LanguageMapper {
  static toDomain(dto: LanguageResponseDto): Language {
    const nameMap = dto.name || { en: '', te: '', hi: '', ml: '' };
    return {
      languageId: dto.id,
      languageName: nameMap.en || nameMap.te || nameMap.hi || nameMap.ml || dto.code,
      code: dto.code,
      slogan: '',
      isSystemActive: dto.status ?? true,
      nameEn: nameMap.en || '',
      nameTe: nameMap.te || '',
      nameHi: nameMap.hi || '',
      nameMl: nameMap.ml || '',
      symbol: dto.symbol || '',
      nameMap: nameMap,
    };
  }

  static toDomainList(dtos: LanguageResponseDto[]): Language[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map((dto) => this.toDomain(dto));
  }
}

import { LocationState } from '../domain/location.model';
import { StateResponseDto } from '../dto/location.dto';

export class LocationMapper {
  static toDomain(dto: StateResponseDto): LocationState {
    const translations = dto.stateNameTranslations || (dto as any).statenameTranslations || {};
    return {
      stateId: dto.stateId,
      stateName: dto.stateName || translations.te || translations.en || 'State',
      isFollowed: !(dto.isActive === false || dto.status === false),
      stateEn: translations.en || (dto as any).state_name_en || dto.stateName || '',
      stateTe: translations.te || (dto as any).state_name_te || dto.stateName || '',
      stateHi: translations.hi || (dto as any).state_name_hi || dto.stateName || '',
      stateMl: translations.ml || (dto as any).state_name_ml || dto.stateName || '',
    };
  }

  static toDomainList(dtos: StateResponseDto[]): LocationState[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map((dto) => this.toDomain(dto));
  }
}

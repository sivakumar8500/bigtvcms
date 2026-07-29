import { LocationState } from '../domain/location.model';
import { StateResponseDto } from '../dto/location.dto';

export class LocationMapper {
  static toDomain(dto: StateResponseDto): LocationState {
    const translations = dto.locationNameTranslations || dto.stateNameTranslations || dto.translations || (dto as any).statenameTranslations || {};
    const stateId = dto.locationId ?? dto.location_id ?? dto.state_id ?? dto.stateId ?? 0;
    const stateName = dto.locationName || dto.location_name || dto.state_name || dto.stateName || translations.te || translations.en || 'State';
    const isFollowed =
      dto.isFollowed !== undefined
        ? dto.isFollowed
        : dto.is_followed !== undefined
        ? dto.is_followed
        : !(dto.isActive === false || dto.is_active === false || dto.status === false);

    return {
      stateId,
      stateName,
      isFollowed,
      stateEn: translations.en || (dto as any).state_name_en || stateName || '',
      stateTe: translations.te || (dto as any).state_name_te || stateName || '',
      stateHi: translations.hi || (dto as any).state_name_hi || '',
      stateMl: translations.ml || (dto as any).state_name_ml || '',
      imageUrl: dto.imageUrl || dto.image_url,
    };
  }

  static toDomainList(dtos: StateResponseDto[]): LocationState[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map((dto) => this.toDomain(dto));
  }
}

import { PostType } from '../domain/post-type.model';
import { PostTypeResponseDto } from '../dto/post-type.dto';

export class PostTypeMapper {
  static toDomain(dto: PostTypeResponseDto): PostType {
    return {
      typeId: dto.typeId,
      typename: dto.typename,
      typeStatus: dto.typeStatus ?? true,
      language_code: dto.language_code ?? null,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
    };
  }

  static toDomainList(dtos: PostTypeResponseDto[]): PostType[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map((dto) => this.toDomain(dto));
  }
}

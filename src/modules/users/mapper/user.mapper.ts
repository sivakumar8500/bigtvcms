import { User } from '../domain/user.model';
import { CreateCreatorRequestDto, CreatorResponseDto } from '../dto/user.dto';

export class UserMapper {
  static toDomain(dto: CreatorResponseDto): User {
    const roleValue = dto.user_type || dto.role || 'creator';
    return {
      userId: dto.id,
      name: dto.UserName,
      username: dto.UserName,
      location: dto.location,
      role: roleValue,
      userType: roleValue,
      languageCode: dto.language_code ?? null,
      isActive: dto.active,
      imageUrl: dto.profile_pic || undefined,
      password: '', // API does not return passwords
    };
  }

  static toDomainList(dtos: CreatorResponseDto[]): User[] {
    return (dtos || []).map((dto) => this.toDomain(dto));
  }

  static toCreateDto(
    form: { name: string; username: string; password?: string; location: string; role?: string; languageCode?: string | null },
    profilePicUrl: string,
    active: boolean = true
  ): CreateCreatorRequestDto {
    const selectedRole = form.role || 'creator';
    return {
      UserName: form.name || form.username,
      location: form.location,
      profile_pic: profilePicUrl,
      active,
      password: form.password || '123456',
      role: selectedRole,
      user_type: selectedRole,
      language_code: form.languageCode ?? null,
    };
  }
}


import { apiClient } from '@/core/api/api-client';
import { LoginRequestDto, LoginResponseDto } from '../dto/auth.dto';

export class AuthRepository {
  static async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    return apiClient.post<LoginResponseDto, LoginRequestDto>('/creators/login', dto);
  }
}

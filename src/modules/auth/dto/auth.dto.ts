export interface LoginRequestDto {
  UserName: string;
  password?: string;
}

export interface LoginResponseDto {
  access_token?: string;
  accessToken?: string;
  token?: string;
  token_type?: string;
  message?: string;
  detail?: string;
  creator?: {
    active?: boolean;
  };
}

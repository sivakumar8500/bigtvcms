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
  role?: string;
  creator?: {
    active?: boolean;
    role?: string;
    name?: string;
    UserName?: string;
  };
}

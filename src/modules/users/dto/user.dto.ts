export interface CreateCreatorRequestDto {
  UserName: string;
  location: string;
  profile_pic: string;
  active: boolean;
  password?: string;
  role?: string;
  user_type?: string;
  language_code?: string | null;
}

export interface CreatorResponseDto {
  id: number;
  UserName: string;
  location: string;
  profile_pic: string;
  active: boolean;
  role?: string;
  user_type?: string;
  language_code?: string | null;
}


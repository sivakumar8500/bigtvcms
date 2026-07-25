export interface CreatePostTypeDto {
  typename: string;
  typeStatus: boolean;
  language_code?: string | null;
}

export interface UpdatePostTypeDto {
  typename?: string;
  typeStatus?: boolean;
  language_code?: string | null;
}

export interface PostTypeResponseDto {
  typeId: number;
  typename: string;
  typeStatus: boolean;
  language_code?: string | null;
  created_at?: string;
  updated_at?: string;
}

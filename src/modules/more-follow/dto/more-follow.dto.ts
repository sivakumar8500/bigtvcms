export interface MoreFollowDto {
  id: number;
  morefollowId: number;
  morefollowName: string;
  morefollowNameTranslations: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  imageUrl: string;
  isActive: boolean;
  isFollowed?: boolean;
}

export interface CreateMoreFollowDto {
  translations: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  image_url: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface UpdateMoreFollowDto {
  translations?: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  image_url?: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface CreateMoreFollowResponse {
  message?: string;
  data?: MoreFollowDto;
}

export interface UpdateMoreFollowResponse {
  message?: string;
  data?: MoreFollowDto;
}

export interface MoreFollowNameTranslations {
  en?: string;
  te?: string;
  hi?: string;
  ml?: string;
}

export interface MoreFollowItem {
  id: number;
  morefollowId: number;
  morefollowName: string;
  morefollowNameTranslations: MoreFollowNameTranslations;
  imageUrl: string;
  isActive: boolean;
  isFollowed?: boolean;
}

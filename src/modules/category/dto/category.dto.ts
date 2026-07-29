export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  categoryNameTranslations?: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  translations?: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  imageUrl?: string;
  image_url?: string;
  isActive?: boolean;
  is_active?: boolean;
}

export interface CreateCategoryDto {
  translations: {
    en: string;
    te: string;
    ml: string;
    hi?: string;
  };
  image_url?: string;
}

export interface CreateCategoryResponse {
  message: string;
  data: CategoryDto;
}

export interface UpdateCategoryDto {
  translations?: {
    en?: string;
    te?: string;
    ml?: string;
    hi?: string;
  };
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateCategoryResponse {
  message: string;
  data: CategoryDto;
}

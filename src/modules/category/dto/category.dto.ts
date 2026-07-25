export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  categoryNameTranslations?: {
    en?: string;
    te?: string;
    hi?: string;
    ml?: string;
  };
  imageUrl?: string;
  is_active?: boolean;
}

export interface CreateCategoryDto {
  name_en: string;
  name_te: string;
  name_hi?: string;
  name_ml: string;
}

export interface CreateCategoryResponse {
  message: string;
  data: CategoryDto;
}

export interface UpdateCategoryDto {
  name_en: string;
  name_te: string;
  name_hi?: string;
  name_ml: string;
  is_active?: boolean;
}

export interface UpdateCategoryResponse {
  message: string;
  data: CategoryDto;
}

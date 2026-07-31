export interface EpaperDto {
  id: string;
  name: string;
  logo?: string;
  editionName: string;
  language: string;
  publishDate: string;
  status: string;
  paperImages: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEpaperDto {
  name: string;
  logo?: string;
  editionName: string;
  language: string;
  publishDate: string;
  status?: string;
  paperImages?: string[];
}

export interface UpdateEpaperDto {
  name?: string;
  logo?: string;
  editionName?: string;
  language?: string;
  publishDate?: string;
  status?: string;
  paperImages?: string[];
}

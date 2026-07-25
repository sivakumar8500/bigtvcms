export interface PostType {
  typeId: number;
  typename: string;
  typeStatus: boolean;
  language_code?: string | null;
  created_at?: string;
  updated_at?: string;
}

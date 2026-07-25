import { PaginatedResponse } from './response-models';

export interface IRepository<T, CreateDto = unknown, UpdateDto = unknown> {
  getById(id: string): Promise<T>;
  getAll(params?: Record<string, unknown>): Promise<PaginatedResponse<T>>;
  create(dto: CreateDto): Promise<T>;
  update(id: string, dto: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

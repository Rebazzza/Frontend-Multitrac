import httpService from './http.service';
import type { PagedResponse } from '../../models/paged-response.model';
import type { PagedParams } from '../../models/paged-params.model';

const DEFAULT_PAGE_SIZE = 25;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCatalogService<T>(resource: string) {
  const basePath = `/${resource}`;

  return {
    async getAll(): Promise<T[]> {
      const { data } = await httpService.get<T[]>(basePath);
      return data;
    },

    async getPaged(params: PagedParams = {}): Promise<PagedResponse<T>> {
      const { data } = await httpService.get<PagedResponse<T>>(`${basePath}/paged`, {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
          search: params.search ?? '',
          sortBy: params.sortBy ?? '',
          sortDirection: params.sortDirection ?? 'asc',
        },
      });
      return data;
    },

    async getById(id: number): Promise<T> {
      const { data } = await httpService.get<T>(`${basePath}/${id}`);
      return data;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create(dto: any): Promise<T> {
      const { data } = await httpService.post<T>(basePath, dto);
      return data;
    },

    async update(id: number, dto: T): Promise<void> {
      await httpService.put(`${basePath}/${id}`, dto);
    },

    async remove(id: number): Promise<void> {
      await httpService.delete(`${basePath}/${id}`);
    },
  };
}

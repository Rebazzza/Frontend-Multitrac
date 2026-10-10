import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { OperacionFlete } from '../../models/operacion-flete.model';
import httpService from './http.service';

const BASE_PATH = '/OperacionFlete';

export const operacionFleteService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<OperacionFlete>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<OperacionFlete>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },
  async getAll(): Promise<OperacionFlete[]> {
    const response = await httpService.get<OperacionFlete[]>(BASE_PATH);
    return response.data;
  },
  async getById(id: number): Promise<OperacionFlete> {
    const response = await httpService.get<OperacionFlete>(BASE_PATH + '/' + id);
    return response.data;
  },
  async create(dto: Partial<OperacionFlete>): Promise<OperacionFlete> {
    const response = await httpService.post<OperacionFlete>(BASE_PATH, dto);
    return response.data;
  },
  async update(id: number, dto: Partial<OperacionFlete>): Promise<OperacionFlete> {
    const response = await httpService.put<OperacionFlete>(BASE_PATH + '/' + id, dto);
    return response.data;
  },
  async remove(id: number): Promise<void> {
    await httpService.delete(BASE_PATH + '/' + id);
  },
};


import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal, PersonalVencimientoDto } from '../../models/personal.model';
import httpService from './http.service';

const BASE_PATH = '/Personal';

export const personalService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<Personal>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<Personal>>('/Personal/paged', { params: query });
    return response.data;
  },

  async getVencimientos(params?: PagedParams): Promise<PersonalVencimientoDto[]> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PersonalVencimientoDto[]>('/PersonalData/vencimientos', { params: query });
    return response.data;
  },

  async getById(id: number): Promise<Personal> {
    const response = await httpService.get<Personal>('/Personal/' + id);
    return response.data;
  },

  async create(dto: Partial<Personal>): Promise<Personal> {
    const response = await httpService.post<Personal>(BASE_PATH, dto);
    return response.data;
  },

  async update(id: number, dto: Partial<Personal>): Promise<Personal> {
    const response = await httpService.put<Personal>(BASE_PATH + '/' + id, dto);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(BASE_PATH + '/' + id);
  },
};

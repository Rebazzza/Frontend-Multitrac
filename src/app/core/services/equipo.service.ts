import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Equipo } from '../../models/equipo.model';
import httpService from './http.service';

const BASE_PATH = '/Equipo';

export const equipoService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<Equipo>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<Equipo>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },
  async getAll(): Promise<Equipo[]> {
    const response = await httpService.get<Equipo[]>(BASE_PATH);
    return response.data;
  },
  async getById(id: number): Promise<Equipo> {
    const response = await httpService.get<Equipo>(BASE_PATH + '/' + id);
    return response.data;
  },
};


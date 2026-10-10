import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { OperacionGeneralEquipo } from '../../models/operacion.model';
import httpService from './http.service';

const BASE_PATH = '/OperacionGeneralEquipo';

export const operacionGeneralEquipoService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<OperacionGeneralEquipo>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<OperacionGeneralEquipo>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },

  async getAll(): Promise<OperacionGeneralEquipo[]> {
    const response = await httpService.get<OperacionGeneralEquipo[]>(BASE_PATH);
    return response.data;
  },

  async create(dto: Partial<OperacionGeneralEquipo>): Promise<OperacionGeneralEquipo> {
    const response = await httpService.post<OperacionGeneralEquipo>(BASE_PATH, dto);
    return response.data;
  },

  async update(id: number, dto: Partial<OperacionGeneralEquipo>): Promise<OperacionGeneralEquipo> {
    const response = await httpService.put<OperacionGeneralEquipo>(BASE_PATH + '/' + id, dto);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(BASE_PATH + '/' + id);
  },
};


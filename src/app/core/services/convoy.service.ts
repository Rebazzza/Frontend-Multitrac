import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Convoy } from '../../models/operacion.model';
import httpService from './http.service';

const BASE_PATH = '/Convoy';

export const convoyService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<Convoy>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<Convoy>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },
  async getAll(): Promise<Convoy[]> {
    const response = await httpService.get<Convoy[]>(BASE_PATH);
    return response.data;
  },
};


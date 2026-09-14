import httpService from './http.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { PersonalSueno } from '../../models/personal-sueno.model';

const BASE_PATH = '/PersonalSueno';

export const suenoService = {
  async getPaged(params: PagedParams = {}): Promise<PagedResponse<PersonalSueno>> {
    const { data } = await httpService.get<PagedResponse<PersonalSueno>>(`${BASE_PATH}/paged`, {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 25,
        search: params.search ?? '',
        sortBy: params.sortBy ?? '',
        sortDirection: params.sortDirection ?? 'asc',
      },
    });
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(dto: any): Promise<PersonalSueno> {
    const { data } = await httpService.post<PersonalSueno>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: unknown): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${BASE_PATH}/${id}`);
  },
};
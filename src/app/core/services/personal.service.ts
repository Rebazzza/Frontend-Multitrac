import httpService from './http.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal } from '../../models/personal.model';
import type { PersonalCargo } from '../../models/personal-cargo.model';

export const personalService = {
  async getPaged(params: PagedParams = {}): Promise<PagedResponse<Personal>> {
    const { data } = await httpService.get<PagedResponse<Personal>>('/Personal/paged', {
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

  async getAll(): Promise<Personal[]> {
    const { data } = await httpService.get<Personal[]>('/Personal');
    return data;
  },

  async getCargosPersonal(): Promise<PersonalCargo[]> {
    const { data } = await httpService.get<PersonalCargo[]>('/PersonalCargo');
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCargos(): Promise<any[]> {
    const { data } = await httpService.get<any[]>('/Cargo');
    return data;
  },
};
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { PersonalSueno, PersonalSuenoCreateDto, PersonalSuenoUpdateDto } from '../../models/personal-sueno.model';
import httpService from './http.service';

const BASE_PATH = '/PersonalSueno';

export const suenoService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<PersonalSueno>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<PersonalSueno>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },

  async getAll(): Promise<PersonalSueno[]> {
    const response = await httpService.get<PersonalSueno[]>(BASE_PATH);
    return response.data;
  },

  async getById(id: number): Promise<PersonalSueno> {
    const response = await httpService.get<PersonalSueno>(BASE_PATH + '/' + id);
    return response.data;
  },

  async create(dto: PersonalSuenoCreateDto): Promise<PersonalSueno> {
    const response = await httpService.post<PersonalSueno>(BASE_PATH, dto);
    return response.data;
  },

  async update(id: number, dto: PersonalSuenoUpdateDto): Promise<PersonalSueno> {
    const response = await httpService.put<PersonalSueno>(BASE_PATH + '/' + id, dto);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(BASE_PATH + '/' + id);
  },
};


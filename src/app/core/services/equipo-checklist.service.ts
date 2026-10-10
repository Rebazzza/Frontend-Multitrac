import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { EquipoChecklist, EquipoChecklistCreateDto, EquipoChecklistUpdateDto } from '../../models/equipo-checklist.model';
import httpService from './http.service';

const BASE_PATH = '/EquipoChecklist';

export const equipoChecklistService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<EquipoChecklist>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<EquipoChecklist>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },
  async getById(id: number): Promise<EquipoChecklist> {
    const response = await httpService.get<EquipoChecklist>(BASE_PATH + '/' + id);
    return response.data;
  },
  async create(dto: EquipoChecklistCreateDto): Promise<EquipoChecklist> {
    const response = await httpService.post<EquipoChecklist>(BASE_PATH, dto);
    return response.data;
  },
  async update(id: number, dto: EquipoChecklistUpdateDto): Promise<EquipoChecklist> {
    const response = await httpService.put<EquipoChecklist>(BASE_PATH + '/' + id, dto);
    return response.data;
  },
  async uploadFoto(itemId: number, file: File): Promise<{ fotoUrl?: string | null }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpService.post<{ fotoUrl?: string | null }>(BASE_PATH + '/item/' + itemId + '/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};


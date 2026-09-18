import httpService from './http.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal } from '../../models/personal.model';
import type { PersonalCargo } from '../../models/personal-cargo.model';
import type { PersonalEquipo } from '../../models/personal-equipo.model';
import type { Contratista } from '../../models/contratista.model';
import type { Afp } from '../../models/afp.model';
import type { NivelEducativo } from '../../models/nivel-educativo.model';

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

  async getById(id: number): Promise<Personal> {
    const { data } = await httpService.get<Personal>(`/Personal/${id}`);
    return data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(dto: any): Promise<Personal> {
    const { data } = await httpService.post<Personal>('/Personal', dto);
    return data;
  },

  async update(id: number, dto: Personal): Promise<void> {
    await httpService.put(`/Personal/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`/Personal/${id}`);
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

  async getContratistas(): Promise<Contratista[]> {
    const { data } = await httpService.get<Contratista[]>('/Contratista');
    return data;
  },

  async getAfps(): Promise<Afp[]> {
    const { data } = await httpService.get<Afp[]>('/Afp');
    return data;
  },

  async getNivelesEducativos(): Promise<NivelEducativo[]> {
    const { data } = await httpService.get<NivelEducativo[]>('/NivelEducativo');
    return data;
  },

  async getPersonalEquipos(): Promise<PersonalEquipo[]> {
    const { data } = await httpService.get<PersonalEquipo[]>('/PersonalEquipo');
    return data;
  },

async createPersonalCargo(dto: Partial<PersonalCargo>): Promise<PersonalCargo> {
    const { data } = await httpService.post<PersonalCargo>('/PersonalCargo', dto);
    return data;
  },

  async updatePersonalCargo(id: number, dto: Partial<PersonalCargo>): Promise<void> {
    await httpService.put(`/PersonalCargo/${id}`, dto);
  },

  async removePersonalCargo(id: number): Promise<void> {
    await httpService.delete(`/PersonalCargo/${id}`);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createPersonalEquipo(dto: any): Promise<PersonalEquipo> {
    const { data } = await httpService.post<PersonalEquipo>('/PersonalEquipo', dto);
    return data;
  },

  async updatePersonalEquipo(id: number, dto: Partial<PersonalEquipo>): Promise<void> {
    await httpService.put(`/PersonalEquipo/${id}`, dto);
  },

  async removePersonalEquipo(id: number): Promise<void> {
    await httpService.delete(`/PersonalEquipo/${id}`);
  },
};
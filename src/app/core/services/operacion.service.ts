import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Convoy, CrearOperacionRequest, Operacion, OperacionCreateDto, OperacionGeneralEquipo, OperacionUpdateDto } from '../../models/operacion.model';
import httpService from './http.service';

const BASE_PATH = '/Operacion';

export interface AsignarUnidadesConductoresRequest {
  idOperacionGeneral?: number | null;
  convoy?: number | null;
  codEquipoTracto?: string | null;
  codEquipoCarreta?: string | null;
  idPersonalConductor?: number | null;
  idPersonalCopiloto?: number | null;
  carretaTercero?: boolean | null;
  tipo?: string | null;
  posicion?: number | null;
}

export const operacionService = {
  async getPaged(params?: PagedParams): Promise<PagedResponse<Operacion>> {
    const { page = 1, pageSize = 25, search, sortBy, sortDirection } = params ?? {};
    const query: Record<string, unknown> = { page, pageSize };
    if (search && search.trim()) query['search'] = search.trim();
    if (sortBy) query['sortBy'] = sortBy;
    if (sortDirection) query['sortDirection'] = sortDirection;
    const response = await httpService.get<PagedResponse<Operacion>>(BASE_PATH + '/paged', { params: query });
    return response.data;
  },

  async getAll(): Promise<Operacion[]> {
    const response = await httpService.get<Operacion[]>(BASE_PATH);
    return response.data;
  },

  async getById(id: number): Promise<Operacion> {
    const response = await httpService.get<Operacion>(BASE_PATH + '/' + id);
    return response.data;
  },

  async create(dto: OperacionCreateDto | CrearOperacionRequest): Promise<Operacion> {
    const response = await httpService.post<Operacion>(BASE_PATH, dto);
    return response.data;
  },

  async update(id: number, dto: OperacionUpdateDto): Promise<Operacion> {
    const response = await httpService.put<Operacion>(BASE_PATH + '/' + id, dto);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(BASE_PATH + '/' + id);
  },

  async asignarUnidadesConductores(dto: AsignarUnidadesConductoresRequest): Promise<OperacionGeneralEquipo | Convoy> {
    const response = await httpService.post<OperacionGeneralEquipo | Convoy>(BASE_PATH + '/asignar-unidades-conductores', dto);
    return response.data;
  },
};


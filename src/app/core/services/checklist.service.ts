import httpService from './http.service';
import type { PagedResponse } from '../../models/paged-response.model';
import type {
  ChecklistDto,
  ChecklistPagedParams,
  CrearChecklistDto,
  ExtintoresInfoDto,
  OperacionChecklistHistorialDto,
} from '../../models/checklist.model';

const BASE_PATH = '/Checklist';
const OPERACION_PATH = '/OperacionChecklist';

export const checklistService = {
  async getPaged(params: ChecklistPagedParams = {}): Promise<PagedResponse<ChecklistDto>> {
    const { data } = await httpService.get<PagedResponse<ChecklistDto>>(`${BASE_PATH}/paged`, {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 25,
        search: params.search ?? '',
        sortBy: params.sortBy ?? '',
        sortDirection: params.sortDirection ?? 'asc',
        idTipo: params.idTipo || undefined,
        idArea: params.idArea || undefined,
        idEstado: params.idEstado || undefined,
        codEquipo: params.codEquipo || undefined,
      },
    });
    return data;
  },

  async getById(id: number): Promise<ChecklistDto> {
    const { data } = await httpService.get<ChecklistDto>(`${BASE_PATH}/${id}`);
    return data;
  },

  /** idTipo es IdCheckListTipo (1..10), no el area. */
  async getSiguienteCodigo(idTipo: number): Promise<string> {
    const { data } = await httpService.get<string>(`${BASE_PATH}/siguiente-codigo/${idTipo}`);
    return data;
  },

  /** Ultimo extintor del equipo, para autocompletar el bloque en area Seguridad y PdP. */
  async getUltimoExtintor(codEquipo: string): Promise<ExtintoresInfoDto | null> {
    const { data } = await httpService.get<ExtintoresInfoDto | null>(
      `${BASE_PATH}/ultimo-extintor/${encodeURIComponent(codEquipo)}`,
    );
    return data;
  },

  async crear(dto: CrearChecklistDto): Promise<ChecklistDto> {
    const { data } = await httpService.post<ChecklistDto>(BASE_PATH, dto);
    return data;
  },

  async actualizar(id: number, dto: CrearChecklistDto): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  /** tipoArea: 1 = ManTTO, 2 = PdP. */
  async getHistorialOperacion(
    idOGE: number,
    tipoArea: number,
  ): Promise<OperacionChecklistHistorialDto[]> {
    const { data } = await httpService.get<OperacionChecklistHistorialDto[]>(
      `${OPERACION_PATH}/operacion/${idOGE}`,
      { params: { tipoArea } },
    );
    return data;
  },

  /**
   * Guarda el lote. idCheckList = 0 inserta, distinto de 0 actualiza esa fila,
   * que es como el backend distingue altas de Updates en GuardarHistorialMasivoAsync.
   */
  async guardarHistorialOperacion(
    lista: OperacionChecklistHistorialDto[],
  ): Promise<void> {
    await httpService.put(`${OPERACION_PATH}/operacion/batch`, lista);
  },
};

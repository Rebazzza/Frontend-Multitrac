import httpService from './http.service';
import { documentoMocks } from './documento.mocks';
import type {
  DocumentoDto,
  DocumentoListadoDto,
  DocumentoPagedParams,
  DocumentoPendienteDto,
  DocumentoPendientesParams,
} from '../../models/documento.model';
import type { PagedResponse } from '../../models/paged-response.model';

/**
 * Servicio del Módulo de Registro Documental y Bandeja de Validación.
 *
 * CONTRATO REST PROPUESTO (el backend todavía no lo implementa):
 *   GET    /api/Documento/paged?page&pageSize&search&tipoSujeto&idTipoDocumento&estado
 *   GET    /api/Documento/{id}
 *   POST   /api/Documento
 *   PUT    /api/Documento/{id}
 *   DELETE /api/Documento/{id}
 *   GET    /api/Documento/{id}/archivo            -> bytes del archivo (visor seguro)
 *   GET    /api/Documento/pendientes?page&pageSize&search&tipoSujeto&estado
 *   POST   /api/Documento/pendientes/validar      -> ResolucionLoteDto
 *   POST   /api/Documento/pendientes/rechazar     -> ResolucionLoteDto
 *
 * Mientras el backend no exista, USAR_MOCKS=true devuelve datos de
 * `documento.mocks.ts`. Al implementarse los endpoints, cambiar a false.
 */
const USAR_MOCKS = true;
const BASE_PATH = '/Documento';

export const documentoService = {
  async getPaged(params: DocumentoPagedParams = {}): Promise<PagedResponse<DocumentoListadoDto>> {
    if (USAR_MOCKS) return documentoMocks.getPaged(params);
    const { data } = await httpService.get<PagedResponse<DocumentoListadoDto>>(`${BASE_PATH}/paged`, {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 25,
        search: params.search ?? '',
        tipoSujeto: params.tipoSujeto ?? undefined,
        idTipoDocumento: params.idTipoDocumento ?? undefined,
        estado: params.estado || undefined,
      },
    });
    return data;
  },

  async getById(id: number): Promise<DocumentoDto> {
    if (USAR_MOCKS) return documentoMocks.getById(id);
    const { data } = await httpService.get<DocumentoDto>(`${BASE_PATH}/${id}`);
    return data;
  },

  async create(dto: DocumentoDto): Promise<DocumentoDto> {
    if (USAR_MOCKS) return documentoMocks.create(dto);
    const { data } = await httpService.post<DocumentoDto>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: DocumentoDto): Promise<void> {
    if (USAR_MOCKS) return documentoMocks.update(id, dto);
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    if (USAR_MOCKS) return documentoMocks.remove(id);
    await httpService.delete(`${BASE_PATH}/${id}`);
  },

  async getPendientes(
    params: DocumentoPendientesParams = {},
  ): Promise<PagedResponse<DocumentoPendienteDto>> {
    if (USAR_MOCKS) return documentoMocks.getPendientes(params);
    const { data } = await httpService.get<PagedResponse<DocumentoPendienteDto>>(
      `${BASE_PATH}/pendientes`,
      {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 25,
          search: params.search ?? '',
          tipoSujeto: params.tipoSujeto ?? undefined,
          estado: params.estado || undefined,
        },
      },
    );
    return data;
  },

  /** Valida o rechaza en lote las solicitudes de la bandeja. */
  async resolverPendientes(
    ids: number[],
    aprobar: boolean,
    observacion?: string | null,
  ): Promise<void> {
    if (USAR_MOCKS) return documentoMocks.resolver(ids, aprobar, observacion);
    const accion = aprobar ? 'validar' : 'rechazar';
    await httpService.post(`${BASE_PATH}/pendientes/${accion}`, { ids, observacion: observacion ?? null });
  },

  /**
   * Descarga el archivo como blob desde el backend. El visor usa un object URL
   * a partir de este blob, de modo que nunca se expone la ruta física del
   * servidor en el DOM ni se navega directamente a ella.
   */
  async getArchivo(id: number): Promise<{ blob: Blob; contentType: string }> {
    if (USAR_MOCKS) return documentoMocks.getArchivo(id);
    const response = await httpService.get<Blob>(`${BASE_PATH}/${id}/archivo`, {
      responseType: 'blob',
    });
    const contentType = (response.headers['content-type'] as string | undefined) ?? 'application/octet-stream';
    return { blob: response.data, contentType };
  },
};
